import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { bundleTopics, checkTopics, commandsReferencePath, loadTopics } from '../scripts/lib.mjs';

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
  assert.match(problems, /old default domain/);
  assert.match(problems, /no docs page/);
  assert.match(problems, /JSON example does not parse/);
});

test('allows wrong commands on lines that say they are wrong', () => {
  const topic = '---\nname: mintlify-example\ndescription: Example.\n---\n\nThere is no `mint publish`: a Git push deploys.\n';
  assert.deepEqual(checkTopics({ example: topic }, reference), []);
});

test('rejects topics over the size limit', () => {
  const big = `---\nname: mintlify-big\ndescription: Big.\n---\n${'x'.repeat(9000)}`;
  assert.match(bundleTopics({ root: big }).errors.join('\n'), /limit 7000/);
});
