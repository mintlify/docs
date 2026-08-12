import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildAll, buildTarget, copyTargetToRepository, loadTargets } from '../scripts/lib.mjs';

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
    const kiro = await readFile(
      path.join(outputRoot, 'kiro', 'skills', 'mintlify', 'SKILL.md'),
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
    const kiroMcp = JSON.parse(
      await readFile(path.join(outputRoot, 'kiro', 'mcp.json'), 'utf8'),
    );
    const kiroManifest = JSON.parse(
      await readFile(path.join(outputRoot, 'kiro', 'plugin.json'), 'utf8'),
    );

    assert.equal(cursor, codex);
    assert.equal(claude, codex);
    assert.equal(kiro.replaceAll('references/', 'reference/'), codex);
    assert.match(kiro, /`references\/components\.md`/);
    assert.doesNotMatch(kiro, /`reference\//);
    for (const skill of [codex, cursor, claude, kiro]) {
      assert.match(skill, /Generated from mintlify\/docs\/agent-context/);
      assert.match(skill, /### Mintlify Search/);
      assert.match(skill, /### Mintlify Admin/);
      assert.match(skill, /Complete authentication in the browser when prompted/);
      assert.match(skill, /mint automations/);
      assert.doesNotMatch(skill, /mint analytics|mint workflow|\{\{/);
    }
    assert.deepEqual(codexMcp.mcp_servers, cursorMcp.mcpServers);
    assert.deepEqual(claudeMcp.mcpServers, cursorMcp.mcpServers);
    assert.deepEqual(
      Object.fromEntries(
        Object.entries(kiroMcp.mcpServers).map(([name, server]) => [
          name,
          { ...server, type: 'http' },
        ]),
      ),
      cursorMcp.mcpServers,
    );
    assert.ok(
      Object.values(kiroMcp.mcpServers).every((server) => server.type === 'streamable-http'),
    );
    assert.equal(
      kiroMcp.$schema,
      'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
    );
    assert.equal(
      kiroManifest.$schema,
      'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
    );
    assert.equal(kiroManifest.name, 'mintlify');
    assert.ok(kiroManifest.keywords.includes('mintlify'));
    assert.deepEqual(Object.keys(cursorMcp.mcpServers), [
      'Mintlify Search',
      'Mintlify Admin',
    ]);
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test('sync writes the complete Kiro power without changing target-owned files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-kiro-sync-test-'));
  const outputRoot = path.join(root, 'dist');
  const destination = path.join(root, 'kiro-power');

  try {
    await mkdir(destination, { recursive: true });
    await writeFile(path.join(destination, 'README.md'), 'target-owned\n');

    await buildAll({ outputRoot, selectedIds: ['kiro'] });
    await copyTargetToRepository('kiro', destination, outputRoot);

    assert.equal(await readFile(path.join(destination, 'README.md'), 'utf8'), 'target-owned\n');
    const manifest = JSON.parse(await readFile(path.join(destination, 'plugin.json'), 'utf8'));
    const mcpConfig = JSON.parse(await readFile(path.join(destination, 'mcp.json'), 'utf8'));
    assert.equal(manifest.name, 'mintlify');
    assert.deepEqual(Object.keys(mcpConfig.mcpServers), [
      'Mintlify Search',
      'Mintlify Admin',
    ]);
    assert.match(
      await readFile(path.join(destination, 'skills', 'mintlify', 'SKILL.md'), 'utf8'),
      /### Mintlify Search/,
    );
    assert.match(
      await readFile(
        path.join(destination, 'skills', 'mintlify', 'references', 'components.md'),
        'utf8',
      ),
      /# Components/,
    );
    await assert.rejects(
      readFile(path.join(destination, 'skills', 'mintlify', 'reference', 'components.md')),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rejects unknown Agent Plugins manifest properties', async () => {
  const outputRoot = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-invalid-plugin-'));

  try {
    const [kiro] = await loadTargets(['kiro']);
    const target = {
      ...kiro,
      pluginManifest: { ...kiro.pluginManifest, unknownProperty: true },
    };
    await assert.rejects(
      buildTarget(target, outputRoot),
      /invalid Agent Plugins plugin artifact.*additional properties/,
    );
    await assert.rejects(readFile(path.join(outputRoot, 'kiro', 'mcp.json')));
    await assert.rejects(readFile(path.join(outputRoot, 'kiro', 'plugin.json')));
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});

test('rejects unsupported Agent Plugins MCP transports', async () => {
  const outputRoot = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-invalid-mcp-'));

  try {
    const [kiro] = await loadTargets(['kiro']);
    const target = {
      ...kiro,
      mcpTypeOverrides: { ...kiro.mcpTypeOverrides, http: 'websocket' },
    };
    await assert.rejects(
      buildTarget(target, outputRoot),
      /invalid Agent Plugins mcp artifact/,
    );
    await assert.rejects(readFile(path.join(outputRoot, 'kiro', 'mcp.json')));
    await assert.rejects(readFile(path.join(outputRoot, 'kiro', 'plugin.json')));
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
