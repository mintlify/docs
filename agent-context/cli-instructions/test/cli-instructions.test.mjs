import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { bundleTopics, checkSkillCommands, checkTopics, commandsReferencePath, loadSkillFiles, loadTopics } from '../scripts/lib.mjs';

const reference = await readFile(commandsReferencePath, 'utf8');

test('bundles every topic with a root', async () => {
  const topics = await loadTopics();
  const { bundle, errors } = bundleTopics(topics);
  assert.deepEqual(errors, []);
  assert.equal(bundle.version, 1);
  assert.ok(bundle.topics.root);
  assert.ok(bundle.topics['new-site']);
});

test('current topics pass the content checks', async () => {
  assert.deepEqual(checkTopics(await loadTopics(), reference), []);
});

test('flags unknown commands, unknown flags, banned strings and broken JSON', () => {
  const topic = [
    '---',
    'name: mintlify-example',
    'description: Example.',
    '---',
    '',
    'Run `mint publish` to ship.',
    'Run `mint frobnicate` first.',
    'Run `mint dev --turbo`.',
    'Run `mint claim --basePath /docs`.',
    'Open https://example.mintlify.app.',
    'Open https://www.mintlify.com/docs/no-such-page.',
    '```json',
    '{ "name": }',
    '```',
  ].join('\n');
  const problems = checkTopics({ example: topic }, reference).join('\n');
  assert.match(problems, /no such command/);
  assert.match(problems, /mint frobnicate is not in cli\/commands\.mdx/);
  assert.match(problems, /--turbo/);
  assert.match(problems, /--basePath is not a mint claim flag/);
  assert.match(problems, /old default domain/);
  assert.match(problems, /no docs page/);
  assert.match(problems, /JSON example does not parse/);
});

test('allows wrong commands on lines that say they are wrong', () => {
  const topic = '---\nname: mintlify-example\ndescription: Example.\n---\n\nThere is no `mint publish`: a Git push deploys.\n';
  assert.deepEqual(checkTopics({ example: topic }, reference), []);
});

test('checks commands and flags on lines that say never or do not', () => {
  const topic = (line) => `---\nname: mintlify-example\ndescription: Example.\n---\n\n${line}\n`;
  const check = (line) => checkTopics({ example: topic(line) }, reference).join('\n');
  assert.match(check('Never run `mint deploy --subdomian docs` twice.'), /--subdomian is not a mint deploy flag/);
  assert.match(check('Never run `mint deplyo` twice.'), /mint deplyo is not in cli\/commands\.mdx/);
  assert.equal(check('Do not invent `mint publish`; a Git push deploys.'), '');
  assert.equal(check('`mint openapi-check` is deprecated; use `mint validate`.'), '');
  assert.match(check('Run `mint publish` to ship.'), /mint publish is not in cli\/commands\.mdx/);
});

test('the Mintlify skill names only real mint commands and flags', async () => {
  const files = await loadSkillFiles();
  assert.ok(Object.keys(files).includes('SKILL.md'));
  assert.deepEqual(checkSkillCommands(files, reference), []);
});

test('skill check flags a bad command flag but not the skill writing style', () => {
  const problems = checkSkillCommands({ 'SKILL.md': 'Run `mint claim --emial a@b.co` \u2014 then share the link.' }, reference);
  assert.deepEqual(problems, ['skill SKILL.md: --emial is not a mint claim flag in cli/commands.mdx']);
});

test('checks commands in code blocks after run:, npx and a $ prompt', () => {
  const check = (code) => checkSkillCommands({ 'x.md': `\`\`\`bash\n${code}\n\`\`\`` }, reference).join('\n');
  assert.match(check('      - run: mint validate --strct'), /--strct is not a mint validate flag/);
  assert.match(check('npx mint dev --prot 3000'), /--prot is not a mint dev flag/);
  assert.match(check('$ mint deploy --subdomian docs'), /--subdomian is not a mint deploy flag/);
  assert.equal(check('      - run: mint broken-links --check-anchors\nnpx -y mint dev --no-open\n$ mint deploy --subdomain docs'), '');
});

test('checks each command in a chain against its own flags', () => {
  const check = (code) => checkSkillCommands({ 'x.md': code }, reference);
  assert.deepEqual(check('`mint dev --no-open && mint validate --strct`'), ['skill x.md: --strct is not a mint validate flag in cli/commands.mdx']);
  assert.deepEqual(check('```bash\nmint dev --no-open; mint validate --strct\n```'), ['skill x.md: --strct is not a mint validate flag in cli/commands.mdx']);
  assert.deepEqual(check('`mint dev --no-open && mint validate`'), []);
});

test('does not split on | or read flags from comments', () => {
  const check = (code) => checkSkillCommands({ 'x.md': code }, reference);
  assert.deepEqual(check('`mint analytics feedback [--type page|code] [--page <path>]`'), []);
  assert.deepEqual(check('```bash\nmint dev --no-open   # not --a-flag\n```'), []);
});

test('requires a when line on every topic except root', () => {
  const topic = (extra) => `---\nname: mintlify-x\ndescription: X.\n${extra}---\n\nBody.\n`;
  assert.match(bundleTopics({ root: topic(''), x: topic('') }).errors.join('\n'), /x\.md: frontmatter needs a when line/);
  assert.deepEqual(bundleTopics({ root: topic(''), x: topic('when: "X"\n') }).errors, []);
});

test('rejects topics over the size limit', () => {
  const big = `---\nname: mintlify-big\ndescription: Big.\n---\n${'x'.repeat(9000)}`;
  assert.match(bundleTopics({ root: big }).errors.join('\n'), /limit 7000/);
});
