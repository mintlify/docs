// Checks the hidden mint-instructions pages that `mint instructions <topic>` fetches at run time.
// Released CLIs request these exact paths, so a renamed or deleted page breaks them.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const dir = path.join(root, 'mint-instructions');

// Must match TOPICS in packages/cli/src/instructions.ts in mintlify/mint.
const TOPICS = [
  'overview',
  'new-site',
  'write',
  'write/components',
  'configure',
  'configure/navigation',
  'configure/settings',
  'configure/customization',
  'api-docs',
  'api-docs/sdk',
  'publish',
  'publish/domain',
  'publish/repo',
  'publish/analytics',
  'publish/assistant',
  'access',
  'access/team',
  'automate',
  'migrate',
  'troubleshoot',
];

// Body size the CLI prints. Keeps topics well under agent tool-output truncation (Codex ~10KB).
const LIMITS = { overview: 7000, default: 8000 };

const errors = [];

async function listPages(current = dir) {
  const entries = await readdir(current, { withFileTypes: true });
  const pages = await Promise.all(
    entries.map((entry) => {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) return listPages(full);
      return entry.name.endsWith('.mdx') ? [path.relative(dir, full).slice(0, -4)] : [];
    }),
  );
  return pages.flat();
}

function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;
  return { frontmatter: match[1], body: source.slice(match[0].length) };
}

const pages = await listPages();
const topicNames = new Set(TOPICS.map((topic) => topic.replace('/', ' ')));

for (const topic of TOPICS) {
  if (!pages.includes(topic)) errors.push(`${topic}.mdx is missing; released CLIs fetch it`);
}
for (const page of pages) {
  if (!TOPICS.includes(page)) {
    console.log(`note: ${page}.mdx is not a CLI topic yet; add it to TOPICS here and in the CLI`);
  }
}

for (const topic of TOPICS.filter((topic) => pages.includes(topic))) {
  const file = `mint-instructions/${topic}.mdx`;
  const parsed = splitFrontmatter(await readFile(path.join(root, file), 'utf8'));
  if (!parsed) {
    errors.push(`${file}: missing frontmatter`);
    continue;
  }
  const { frontmatter, body } = parsed;

  for (const field of ['title', 'description']) {
    if (!new RegExp(`^${field}: \\S`, 'm').test(frontmatter)) errors.push(`${file}: missing ${field}`);
  }
  if (!/^related: false$/m.test(frontmatter)) {
    errors.push(`${file}: add \`related: false\` so the Related topics footer stays out of CLI output`);
  }

  const bytes = Buffer.byteLength(body);
  const limit = LIMITS[topic] ?? LIMITS.default;
  if (bytes > limit) errors.push(`${file}: body is ${bytes} bytes, limit ${limit}`);

  for (const [, args = ''] of body.matchAll(/`mint instructions((?: [a-z][a-z-]*)*)`/g)) {
    const reference = args.trim();
    if (reference && !topicNames.has(reference)) {
      errors.push(`${file}: \`mint instructions ${reference}\` is not a topic`);
    }
  }
}

// Topics are hidden pages: keep them out of navigation. Only `pages` entries and group `root`
// values count, so other config that names the folder (gt.config.json exclusions) is ignored
const isTopicPath = (value) => typeof value === 'string' && /^\/?mint-instructions\//.test(value);
const findNavTopics = (node, found = []) => {
  if (Array.isArray(node)) {
    for (const item of node) findNavTopics(item, found);
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'pages' && Array.isArray(value)) found.push(...value.filter(isTopicPath));
      if (key === 'root' && isTopicPath(value)) found.push(value);
      findNavTopics(value, found);
    }
  }
  return found;
};
const navFiles = (await readdir(root)).filter((name) => name.endsWith('.json'));
for (const name of navFiles) {
  const found = findNavTopics(JSON.parse(await readFile(path.join(root, name), 'utf8')));
  if (found.length > 0) errors.push(`${name}: mint-instructions pages must stay out of navigation (${found.join(', ')})`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `error: ${error}`).join('\n'));
  process.exit(1);
}
console.log(`${TOPICS.length} mint instructions topics OK`);
