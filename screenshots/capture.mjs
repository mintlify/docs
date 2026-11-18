// Regenerates docs screenshots from manifest.yaml.
// Starts `mint dev` on the fixture site, captures each shot in each theme, and
// writes the images in place so changes show up in the git diff.

import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { parse } from 'yaml';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const port = Number(process.env.SCREENSHOT_PORT ?? 3333);
const baseUrl = `http://localhost:${port}`;

const manifest = parse(readFileSync(join(here, 'manifest.yaml'), 'utf8'));
const only = process.argv.slice(2);
const shots = manifest.shots
  .map((shot) => ({ ...manifest.defaults, ...shot, hide: [...(manifest.defaults.hide ?? []), ...(shot.hide ?? [])] }))
  .filter((shot) => only.length === 0 || only.some((o) => shot.output.includes(o)));

if (shots.length === 0) {
  console.error(`No shots match: ${only.join(', ')}`);
  process.exit(1);
}

async function serverIsUp() {
  try {
    return (await fetch(baseUrl)).ok;
  } catch {
    return false;
  }
}

async function startServer() {
  if (await serverIsUp()) return null; // Reuse a server that's already running.
  const server = spawn('mint', ['dev', '--port', String(port), '--no-open'], {
    cwd: join(here, 'fixture'),
    stdio: 'ignore',
  });
  for (let i = 0; i < 60; i++) {
    if (await serverIsUp()) return server;
    await new Promise((r) => setTimeout(r, 1000));
  }
  server.kill();
  throw new Error(`mint dev didn't start on port ${port}`);
}

async function runStep(page, step) {
  const [action, arg] = Object.entries(step)[0];
  if (action === 'click') await page.click(arg);
  else if (action === 'hover') await page.hover(arg);
  else if (action === 'type') await page.fill(arg.selector, arg.text);
  else if (action === 'press') await page.keyboard.press(arg);
  else if (action === 'wait') await (typeof arg === 'number' ? page.waitForTimeout(arg) : page.waitForSelector(arg));
  else throw new Error(`Unknown step: ${action}`);
}

async function cropBox(page, { selectors, padding = 0 }) {
  const boxes = [];
  for (const selector of selectors) {
    const box = await page.locator(selector).first().boundingBox();
    if (!box) throw new Error(`Crop selector not visible: ${selector}`);
    boxes.push(box);
  }
  const viewport = page.viewportSize();
  const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - padding);
  const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - padding);
  const right = Math.min(viewport.width, Math.max(...boxes.map((b) => b.x + b.width)) + padding);
  const bottom = Math.min(viewport.height, Math.max(...boxes.map((b) => b.y + b.height)) + padding);
  return { x, y, width: right - x, height: bottom - y };
}

const server = await startServer();
const browser = await chromium.launch();
let failures = 0;

try {
  for (const shot of shots) {
    for (const theme of shot.themes) {
      const output = shot.output.replace('{theme}', theme);
      const context = await browser.newContext({
        viewport: shot.viewport,
        deviceScaleFactor: 2,
        colorScheme: theme,
        reducedMotion: 'reduce',
      });
      // Mintlify sites store the theme choice in localStorage; set it so the
      // site doesn't fall back to a saved preference.
      await context.addInitScript((t) => localStorage.setItem('theme', t), theme);
      const page = await context.newPage();
      try {
        await page.goto(baseUrl + shot.url, { waitUntil: 'networkidle' });
        if (shot.hide.length) {
          await page.addStyleTag({ content: `${shot.hide.join(', ')} { visibility: hidden !important; }` });
        }
        for (const step of shot.steps ?? []) await runStep(page, step);
        await page.evaluate(() => document.fonts.ready);
        await page.mouse.move(0, 0); // Clear hover states.
        const clip = shot.crop ? await cropBox(page, shot.crop) : undefined;
        await page.screenshot({ path: join(repoRoot, output), clip, animations: 'disabled' });
        console.log(`✓ ${output}`);
      } catch (error) {
        failures++;
        console.error(`✗ ${output}: ${error.message}`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  server?.kill();
}

process.exit(failures ? 1 : 0);
