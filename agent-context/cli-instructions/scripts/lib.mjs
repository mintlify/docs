import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
export const instructionsRoot = path.resolve(scriptsDirectory, '..');
export const repositoryRoot = path.resolve(instructionsRoot, '..', '..');
export const topicsDirectory = path.join(instructionsRoot, 'topics');
export const commandsReferencePath = path.join(repositoryRoot, 'cli', 'commands.mdx');

// Byte budgets keep each topic cheap for an agent to read in full.
export const sizeLimits = { root: 7000, topic: 8000 };

// Commands the topics may name that `cli/commands.mdx` does not document yet.
// `instructions` ships with this bundle; `automations` is documented on its own page.
export const extraCommands = new Set(['instructions', 'automations']);

// Flags the topics may use that `cli/commands.mdx` does not list, by command.
export const extraFlags = new Map([
  ['instructions', new Set(['--list'])],
  [
    'automations',
    new Set(['--name', '--prompt', '--type', '--cron', '--push-repo', '--context-repo', '--automerge', '--file']),
  ],
]);

// Commands the topics name on purpose to say they are wrong: they do not exist, are deprecated, or do not work yet.
// They pass only on a line that says so; anywhere else they fail like any unknown command.
export const namedNonCommands = new Set(['publish', 'init', 'index', 'mcp', 'openapi-check']);

// Strings that must not appear, except on lines that say they are wrong or do not exist.
export const bannedStrings = new Map([
  ['.mintlify.app', 'old default domain; sites live at <subdomain>.mintlify.site'],
  ['mint init', 'no such command; use mint new'],
  ['mint publish', 'no such command'],
  ['mint index', 'no such command'],
  ['—', 'em dash'],
  ['theme={null}', 'docs render artifact'],
]);

const negation =
  /(not exist|do not|Do not|don't|Never|never|deprecated|discontinued|not functional|There is no|Commands that|, not `|not `)/;

export async function loadTopics(directory = topicsDirectory) {
  const files = (await readdir(directory)).filter((file) => file.endsWith('.md')).sort();
  const topics = {};
  for (const file of files) {
    topics[file.slice(0, -3)] = await readFile(path.join(directory, file), 'utf8');
  }
  return topics;
}

export function bundleTopics(topics) {
  const errors = [];
  if (!topics.root) errors.push('root.md is missing');
  for (const [key, markdown] of Object.entries(topics)) {
    const limit = key === 'root' ? sizeLimits.root : sizeLimits.topic;
    const bytes = Buffer.byteLength(markdown);
    if (bytes > limit) errors.push(`${key}.md: ${bytes} bytes, limit ${limit}`);
    if (!/^---\nname: mintlify[\w-]*\n/.test(markdown)) errors.push(`${key}.md: frontmatter must start with name: mintlify...`);
    if (!/\ndescription: .+\n/.test(markdown)) errors.push(`${key}.md: frontmatter needs a description`);
    if (key !== 'root' && !/\nwhen: .+\n/.test(markdown)) errors.push(`${key}.md: frontmatter needs a when line (shown by --list)`);
  }
  return { bundle: { version: 1, topics }, errors };
}

// Splits `cli/commands.mdx` into the flags of each `## \`mint <command>\`` section plus the global flags.
function documentedFlags(reference) {
  const global = new Set();
  const byCommand = new Map([...extraCommands].map((command) => [command, new Set()]));
  for (const section of reference.split(/^(?=## )/m)) {
    const flags = [...section.matchAll(/`(--[a-zA-Z-]+)/g)].map((match) => match[1]);
    const command = section.match(/^## `mint ([a-z0-9-]+)`/)?.[1];
    if (command) byCommand.set(command, new Set(flags));
    else if (section.startsWith('## Global flags')) flags.forEach((flag) => global.add(flag));
  }
  for (const [command, flags] of extraFlags) flags.forEach((flag) => byCommand.get(command)?.add(flag));
  return { global, byCommand };
}

function docsPageExists(url) {
  const pagePath = new URL(url).pathname.replace(/^\/docs\/?/, '').replace(/\.md$/, '').replace(/\/$/, '');
  if (!pagePath) return existsSync(path.join(repositoryRoot, 'index.mdx'));
  return [`${pagePath}.mdx`, `${pagePath}.md`, `${pagePath}/index.mdx`].some((candidate) =>
    existsSync(path.join(repositoryRoot, candidate)),
  );
}

// A command written in code: optional `npx`/`npx -y`, then `mint <command>` and its arguments.
const commandInCode = /^(?:npx (?:-y )?)?mint ([a-z][a-z0-9-]*)(.*)$/;

// Splits code into commands at `&&` and `;`. A `|` is not split on: topics use it for alternatives like `[--type page|code]`.
function commandsIn(code) {
  return code
    .replace(/\s#.*$/, '')
    .split(/\s*(?:&&|;)\s*/)
    .map((part) => part.trim().match(commandInCode))
    .filter(Boolean)
    .map(([, command, rest]) => [command, rest]);
}

// Commands on one line: inline code spans that start with `mint` or `npx mint`, and, on code-block lines,
// shell commands, including ones after a `$ ` prompt or a YAML `- run: ` key.
function commandsOnLine(line, inCodeBlock) {
  const spans = [...line.matchAll(/`((?:npx (?:-y )?)?mint [^`]*)`/g)].flatMap(([, code]) => commandsIn(code));
  const code = line.trim().replace(/^(?:- )?run: /, '').replace(/^\$ /, '');
  const isShell = (inCodeBlock || /^\s*mint /.test(line)) && commandInCode.test(code.split(/\s*(?:&&|;)\s*/)[0]);
  return isShell ? [...spans, ...commandsIn(code)] : spans;
}

// Every line is checked, including lines that say "never" or "do not": those only allow naming a known non-command.
function commandProblems(file, lines, { global, byCommand }) {
  const problems = [];
  let inCodeBlock = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    const negated = negation.test(line);
    for (const [command, rest] of commandsOnLine(line, inCodeBlock)) {
      const flags = byCommand.get(command);
      if (!flags) {
        if (!(negated && namedNonCommands.has(command))) problems.push(`${file}: mint ${command} is not in cli/commands.mdx`);
        continue;
      }
      for (const [flag] of rest.matchAll(/--[a-zA-Z-]+/g)) {
        if (!flags.has(flag) && !global.has(flag)) problems.push(`${file}: ${flag} is not a mint ${command} flag in cli/commands.mdx`);
      }
    }
  }
  return problems;
}

// The Mintlify skill has its own writing style, so only its `mint` commands and flags are checked.
export const skillDirectory = path.join(repositoryRoot, 'agent-context', 'context', 'skills', 'mintlify');

export async function loadSkillFiles(directory = skillDirectory) {
  const files = {};
  for (const entry of await readdir(directory, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const absolute = path.join(entry.parentPath ?? entry.path, entry.name);
    files[path.relative(directory, absolute)] = await readFile(absolute, 'utf8');
  }
  return files;
}

export function checkSkillCommands(files, reference) {
  const flags = documentedFlags(reference);
  return Object.entries(files).flatMap(([file, markdown]) => commandProblems(`skill ${file}`, markdown.split('\n'), flags));
}

export function checkTopics(topics, reference) {
  const flags = documentedFlags(reference);
  const problems = [];

  for (const [key, markdown] of Object.entries(topics)) {
    const file = `${key}.md`;
    const lines = markdown.split('\n');

    for (const [needle, reason] of bannedStrings) {
      for (const line of lines) {
        if (line.includes(needle) && !negation.test(line)) problems.push(`${file}: ${reason}: ${line.trim().slice(0, 120)}`);
      }
    }

    problems.push(...commandProblems(file, lines, flags));

    for (const [, block] of markdown.matchAll(/```json\n([\s\S]*?)```/g)) {
      try {
        JSON.parse(block);
      } catch {
        try {
          JSON.parse(`{${block}}`);
        } catch (error) {
          problems.push(`${file}: JSON example does not parse (${error.message}): ${block.trim().slice(0, 60)}`);
        }
      }
    }

    for (const [url] of markdown.matchAll(/https:\/\/www\.mintlify\.com\/docs[^\s`)>"<]*/g)) {
      const clean = url.replace(/[.,)]+$/, '');
      const isGeneratedFile = /\.(txt|json|xml)$/.test(new URL(clean).pathname);
      if (!clean.includes('<') && !isGeneratedFile && !docsPageExists(clean)) problems.push(`${file}: no docs page for ${clean}`);
    }
  }
  return problems;
}
