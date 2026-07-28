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
    const codexMcp = JSON.parse(
      await readFile(path.join(outputRoot, 'codex', '.mcp.json'), 'utf8'),
    );
    const cursorMcp = JSON.parse(
      await readFile(path.join(outputRoot, 'cursor', 'mcp.json'), 'utf8'),
    );
    const claudeMcp = JSON.parse(
      await readFile(path.join(outputRoot, 'claude', '.mcp.json'), 'utf8'),
    );

    assert.equal(cursor, codex);
    assert.equal(claude, codex);
    for (const skill of [codex, cursor, claude]) {
      assert.match(skill, /Generated from mintlify\/docs\/agent-context/);
      assert.match(skill, /### Mintlify Search/);
      assert.match(skill, /### Mintlify Admin/);
      assert.match(skill, /Complete authentication in the browser when prompted/);
      assert.match(skill, /mint automations/);
      assert.doesNotMatch(skill, /mint analytics|mint workflow|\{\{/);
    }
    assert.deepEqual(codexMcp.mcp_servers, cursorMcp.mcpServers);
    assert.deepEqual(claudeMcp.mcpServers, cursorMcp.mcpServers);
    assert.deepEqual(Object.keys(cursorMcp.mcpServers), [
      'Mintlify Search',
      'Mintlify Admin',
    ]);
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
    await writeFile(path.join(destination, '.mcp.json'), '{"stale":true}\n');

    await buildAll({ outputRoot, selectedIds: ['codex'] });
    await copyTargetToRepository('codex', destination, outputRoot);

    assert.equal(await readFile(path.join(destination, 'README.md'), 'utf8'), 'target-owned\n');
    await assert.rejects(readFile(path.join(destination, 'skills', 'mintlify', 'stale.md')));
    assert.match(
      await readFile(path.join(destination, 'skills', 'mintlify', 'SKILL.md'), 'utf8'),
      /### Mintlify Search/,
    );
    const mcpConfig = JSON.parse(await readFile(path.join(destination, '.mcp.json'), 'utf8'));
    assert.deepEqual(Object.keys(mcpConfig.mcp_servers), [
      'Mintlify Search',
      'Mintlify Admin',
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
