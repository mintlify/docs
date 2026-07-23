import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildAll, copyTargetToRepository } from '../scripts/lib.mjs';

test('builds all client variants from one canonical skill', async () => {
  const outputRoot = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-test-'));

  try {
    await buildAll({ outputRoot });
    const codex = await readFile(
      path.join(outputRoot, 'codex', 'skills', 'mintlify', 'SKILL.md'),
      'utf8',
    );
    const cursor = await readFile(
      path.join(outputRoot, 'cursor', 'skills', 'mintlify', 'SKILL.md'),
      'utf8',
    );
    const claude = await readFile(
      path.join(outputRoot, 'claude', 'skills', 'mintlify', 'SKILL.md'),
      'utf8',
    );

    assert.match(codex, /### Search MCP/);
    assert.match(cursor, /### Mintlify \(docs MCP\)/);
    assert.match(claude, /Claude Code will open a browser window/);
    for (const skill of [codex, cursor, claude]) {
      assert.match(skill, /Generated from mintlify\/docs\/agent-context/);
      assert.match(skill, /mint automations/);
      assert.doesNotMatch(skill, /mint analytics|mint workflow|\{\{/);
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test('sync replaces only generated context paths', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-sync-test-'));
  const outputRoot = path.join(root, 'dist');
  const destination = path.join(root, 'plugin');

  try {
    await mkdir(path.join(destination, 'skills', 'mintlify'), { recursive: true });
    await writeFile(path.join(destination, 'README.md'), 'target-owned\n');
    await writeFile(path.join(destination, 'skills', 'mintlify', 'stale.md'), 'remove me\n');

    await buildAll({ outputRoot, selectedIds: ['codex'] });
    await copyTargetToRepository('codex', destination, outputRoot);

    assert.equal(await readFile(path.join(destination, 'README.md'), 'utf8'), 'target-owned\n');
    await assert.rejects(readFile(path.join(destination, 'skills', 'mintlify', 'stale.md')));
    assert.match(
      await readFile(path.join(destination, 'skills', 'mintlify', 'SKILL.md'), 'utf8'),
      /### Search MCP/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
