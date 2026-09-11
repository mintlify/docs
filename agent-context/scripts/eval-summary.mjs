// Render a `claude plugin eval --json` result as a Markdown table for the
// GitHub Actions step summary. Prints a note instead when there is no result.
import { readFile } from 'node:fs/promises';

const [resultPath] = process.argv.slice(2);
if (!resultPath) {
  throw new Error('Usage: node scripts/eval-summary.mjs <eval-results.json>');
}

let result;
try {
  result = JSON.parse(await readFile(resultPath, 'utf8'));
} catch {
  console.log('## Claude plugin eval\n');
  console.log(
    'No eval result was produced. Either `ANTHROPIC_API_KEY` is not set for this repository, or the run failed before writing results.',
  );
  process.exit(0);
}

const twoArm = result.cases.some((c) => c.aggregates?.delta !== undefined);
const fmt = (n) => (typeof n === 'number' ? n.toFixed(2) : '-');
const signed = (n) => (typeof n === 'number' ? `${n >= 0 ? '+' : ''}${n.toFixed(2)}` : '-');

console.log('## Claude plugin eval\n');
if (result.partial) {
  console.log(`> **Partial run** (${result.partialReason}). Do not trust these scores.\n`);
}
console.log(
  `**${result.aggregates.casesPassed}/${result.aggregates.casesTotal}** cases at threshold` +
    ` · suite score **${fmt(result.aggregates.overallScore)}**` +
    (twoArm ? ` · mean Δ **${signed(result.aggregates.meanDelta)}**` : '') +
    ` · $${result.costUsd.toFixed(2)} · ${Math.round(result.durationSeconds)}s` +
    ` · Claude Code ${result.claudeVersion}\n`,
);

console.log(twoArm ? '| Case | With | Without | Δ | Notes |' : '| Case | Score | Notes |');
console.log(twoArm ? '|---|---:|---:|---:|---|' : '|---|---:|---|');
for (const c of result.cases) {
  const failing = [];
  for (const run of c.arms.with) {
    if (run.error) failing.push(`run error: ${run.error}`);
    for (const g of run.graders) {
      if (!g.passed && g.scored !== false) failing.push(g.name);
    }
  }
  const notes = [...new Set(failing)].slice(0, 3).join(', ');
  const cols = twoArm
    ? [fmt(c.aggregates.score), fmt(c.aggregates.scoreWithout), signed(c.aggregates.delta)]
    : [fmt(c.aggregates.score)];
  console.log(`| \`${c.name}\` | ${cols.join(' | ')} | ${notes} |`);
}
if (twoArm) {
  console.log(
    '\nΔ is only meaningful for cases that need no MCP tools; the without-plugin arm loads no MCP servers, so `admin-*` cases score 0 there by construction.',
  );
}
