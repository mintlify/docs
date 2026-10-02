import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { publishedCustomization } from '../scripts/publish-customization.mjs';
import {
  buildAll,
  buildTarget,
  copyTargetToRepository,
  loadTargets,
  readTree,
  resolveManifestVersion,
} from '../scripts/lib.mjs';

test('hosted publication keeps one installable canonical customization skill', async () => {
  const canonical = await readFile(
    new URL('../context/skills/mintlify-customization/SKILL.md', import.meta.url),
    'utf8',
  );
  const hosted = await publishedCustomization();
  assert.match(hosted, /^metadata:\n  internal: true$/m);
  assert.match(hosted, /^name: mintlify-customization$/m);
  assert.doesNotMatch(canonical, /^metadata:\n  internal: true$/m);
  assert.match(canonical, /\]\(reference\/selectors\.md\)/);
  assert.match(
    hosted,
    /\]\(https:\/\/raw\.githubusercontent\.com\/mintlify\/docs\/main\/agent-context\/context\/skills\/mintlify-customization\/reference\/selectors\.md\)/,
  );
});

test('builds all client variants from the canonical skills', async () => {
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
      assert.doesNotMatch(skill, /\{\{/);
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
      Object.values(kiroMcp.mcpServers).every(
        (server) => server.type === 'streamable-http',
      ),
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
  const root = await mkdtemp(
    path.join(tmpdir(), 'mintlify-agent-context-kiro-sync-test-'),
  );
  const outputRoot = path.join(root, 'dist');
  const destination = path.join(root, 'kiro-power');

  try {
    await mkdir(destination, { recursive: true });
    await writeFile(path.join(destination, 'README.md'), 'target-owned\n');

    await buildAll({ outputRoot, selectedIds: ['kiro'] });
    await copyTargetToRepository('kiro', destination, outputRoot);

    assert.equal(
      await readFile(path.join(destination, 'README.md'), 'utf8'),
      'target-owned\n',
    );
    const manifest = JSON.parse(
      await readFile(path.join(destination, 'plugin.json'), 'utf8'),
    );
    const mcpConfig = JSON.parse(
      await readFile(path.join(destination, 'mcp.json'), 'utf8'),
    );
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
      readFile(
        path.join(destination, 'skills', 'mintlify', 'reference', 'components.md'),
      ),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rejects unknown Agent Plugins manifest properties', async () => {
  const outputRoot = await mkdtemp(
    path.join(tmpdir(), 'mintlify-agent-context-invalid-plugin-'),
  );

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
  const outputRoot = await mkdtemp(
    path.join(tmpdir(), 'mintlify-agent-context-invalid-mcp-'),
  );

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
    await writeFile(
      path.join(destination, 'skills', 'mintlify', 'stale.md'),
      'remove me\n',
    );
    await writeFile(path.join(destination, '.mcp.json'), '{"stale":true}\n');
    await mkdir(path.join(destination, '.codex-plugin'), { recursive: true });
    await writeFile(
      path.join(destination, '.codex-plugin', 'plugin.json'),
      JSON.stringify({
        name: 'mintlify',
        version: '0.1.0',
        assets: './assets',
        interface: { displayName: 'Mintlify' },
      }),
    );

    await buildAll({ outputRoot, selectedIds: ['codex'] });
    await copyTargetToRepository('codex', destination, outputRoot);

    assert.equal(
      await readFile(path.join(destination, 'README.md'), 'utf8'),
      'target-owned\n',
    );
    await assert.rejects(
      readFile(path.join(destination, 'skills', 'mintlify', 'stale.md')),
    );
    assert.match(
      await readFile(path.join(destination, 'skills', 'mintlify', 'SKILL.md'), 'utf8'),
      /### Mintlify Search/,
    );
    const mcpConfig = JSON.parse(
      await readFile(path.join(destination, '.mcp.json'), 'utf8'),
    );
    assert.deepEqual(Object.keys(mcpConfig.mcp_servers), [
      'Mintlify Search',
      'Mintlify Admin',
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('all target bundles contain customization references and preserve binary assets', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-bundles-'));
  try {
    await buildAll({ outputRoot: root });
    for (const target of await loadTargets()) {
      const files = await readTree(
        path.join(root, target.id, 'skills', 'mintlify-customization'),
      );
      const directory = target.skillReferenceDirectory ?? 'reference';
      assert.ok(files.has(`${directory}/inventory.json`));
      assert.ok(files.has(`${directory}/installation-and-updates.md`));
      assert.match(files.get('SKILL.md'), new RegExp(`${directory}/recipes\\.md`));
      assert.match(
        files.get(`${directory}/recipes.md`),
        /compatibility-and-verification\.md/,
      );
    }
    const bytes = Buffer.from([0, 255, 128, 42]);
    await writeFile(
      path.join(root, 'codex', 'skills', 'mintlify-customization', 'asset.png'),
      bytes,
    );
    const [target] = await loadTargets(['codex']);
    const destination = path.join(root, 'destination');
    await mkdir(path.join(destination, '.codex-plugin'), { recursive: true });
    await writeFile(
      path.join(destination, '.codex-plugin', 'plugin.json'),
      JSON.stringify({ name: 'mintlify', version: '1.0.0' }),
    );
    await copyTargetToRepository(target.id, destination, root);
    assert.deepEqual(
      await readFile(
        path.join(destination, 'skills', 'mintlify-customization', 'asset.png'),
      ),
      bytes,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reference-only changes bump owned manifest versions and preserve unrelated target metadata', async () => {
  const root = await mkdtemp(
    path.join(tmpdir(), 'mintlify-agent-context-reference-upgrade-'),
  );
  try {
    const outputRoot = path.join(root, 'dist');
    await buildAll({ outputRoot });
    for (const target of await loadTargets(['codex', 'cursor', 'kiro'])) {
      const destination = path.join(root, target.id);
      const manifestPath = path.join(
        destination,
        target.pluginManifestFile ?? 'plugin.json',
      );
      if (target.pluginManifest === undefined) {
        await mkdir(path.dirname(manifestPath), { recursive: true });
        await writeFile(
          manifestPath,
          JSON.stringify({
            name: 'example-plugin',
            version: '1.2.3',
            skills: './skills',
            interface: { displayName: 'Example' },
            assets: './assets',
          }),
        );
      }
      await mkdir(path.join(destination, 'skills', 'example-owned'), { recursive: true });
      await writeFile(
        path.join(destination, 'skills', 'example-owned', 'SKILL.md'),
        'owned\n',
      );
      await copyTargetToRepository(target.id, destination, outputRoot);
      const before = JSON.parse(await readFile(manifestPath, 'utf8'));
      const referenceDirectory = target.skillReferenceDirectory ?? 'reference';
      const reference = path.join(
        outputRoot,
        target.id,
        'skills',
        'mintlify-customization',
        referenceDirectory,
        'recipes.md',
      );
      const original = await readFile(reference, 'utf8');
      await writeFile(reference, `${original}\nA synthetic reference-only update.\n`);
      await copyTargetToRepository(target.id, destination, outputRoot);
      const after = JSON.parse(await readFile(manifestPath, 'utf8'));
      const [major, minor, patch] = before.version.split('.').map(Number);
      assert.equal(after.version, `${major}.${minor}.${patch + 1}`);
      assert.deepEqual({ ...after, version: before.version }, before);
      assert.equal(
        await readFile(
          path.join(destination, 'skills', 'example-owned', 'SKILL.md'),
          'utf8',
        ),
        'owned\n',
      );
      await copyTargetToRepository(target.id, destination, outputRoot);
      assert.equal(
        JSON.parse(await readFile(manifestPath, 'utf8')).version,
        after.version,
      );
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('Claude reference sync preserves its versionless marketplace and changes released content', async () => {
  const root = await mkdtemp(
    path.join(tmpdir(), 'mintlify-agent-context-claude-upgrade-'),
  );
  try {
    const outputRoot = path.join(root, 'dist');
    const destination = path.join(root, 'plugin');
    const marketplace = JSON.stringify({
      name: 'example-marketplace',
      owner: { name: 'Example' },
      plugins: [{ name: 'mintlify', source: './' }],
    });
    await mkdir(path.join(destination, '.claude-plugin'), { recursive: true });
    await writeFile(
      path.join(destination, '.claude-plugin', 'marketplace.json'),
      marketplace,
    );
    await buildAll({ outputRoot, selectedIds: ['claude'] });
    await copyTargetToRepository('claude', destination, outputRoot);
    const reference = path.join(
      outputRoot,
      'claude',
      'skills',
      'mintlify-customization',
      'reference',
      'recipes.md',
    );
    const before = await readFile(reference, 'utf8');
    await writeFile(reference, `${before}\nA synthetic reference update.\n`);
    await copyTargetToRepository('claude', destination, outputRoot);
    assert.equal(
      await readFile(
        path.join(destination, '.claude-plugin', 'marketplace.json'),
        'utf8',
      ),
      marketplace,
    );
    assert.equal(
      await readFile(
        path.join(
          destination,
          'skills',
          'mintlify-customization',
          'reference',
          'recipes.md',
        ),
        'utf8',
      ),
      `${before}\nA synthetic reference update.\n`,
    );
    await assert.rejects(
      readFile(path.join(destination, '.claude-plugin', 'plugin.json')),
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('sync bumps the Kiro manifest patch version only when released content changes', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-version-test-'));
  const outputRoot = path.join(root, 'dist');
  const destination = path.join(root, 'kiro-power');
  const readVersion = async () =>
    JSON.parse(await readFile(path.join(destination, 'plugin.json'), 'utf8')).version;

  try {
    const [kiro] = await loadTargets(['kiro']);
    await buildAll({ outputRoot, selectedIds: ['kiro'] });

    await copyTargetToRepository('kiro', destination, outputRoot);
    assert.equal(await readVersion(), kiro.pluginManifest.version);

    await copyTargetToRepository('kiro', destination, outputRoot);
    assert.equal(await readVersion(), kiro.pluginManifest.version);

    const manifestPath = path.join(destination, 'plugin.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    await writeFile(manifestPath, JSON.stringify({ ...manifest, version: '1.4.2' }));
    await writeFile(
      path.join(destination, 'skills', 'mintlify', 'SKILL.md'),
      'outdated\n',
    );
    await copyTargetToRepository('kiro', destination, outputRoot);
    assert.equal(await readVersion(), '1.4.3');

    await copyTargetToRepository('kiro', destination, outputRoot);
    assert.equal(await readVersion(), '1.4.3');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('manifest version bump reads a manifest outside the plugin root', async () => {
  const root = await mkdtemp(
    path.join(tmpdir(), 'mintlify-agent-context-manifest-path-test-'),
  );
  const [kiro] = await loadTargets(['kiro']);
  const target = {
    ...kiro,
    id: 'nested',
    pluginManifestFile: '.claude-plugin/plugin.json',
  };
  const destination = path.join(root, 'plugin');

  try {
    const { targetRoot } = await buildTarget(target, path.join(root, 'dist'));
    const built = JSON.parse(
      await readFile(path.join(targetRoot, '.claude-plugin', 'plugin.json'), 'utf8'),
    );
    assert.equal(built.name, 'mintlify');

    await mkdir(path.join(destination, '.claude-plugin'), { recursive: true });
    await writeFile(
      path.join(destination, '.claude-plugin', 'plugin.json'),
      JSON.stringify({ ...built, version: '2.3.4' }),
    );
    assert.equal(await resolveManifestVersion(target, targetRoot, destination), '2.3.5');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
