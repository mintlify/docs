import { readFile } from 'node:fs/promises';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  buildAll,
  generatedArtifactDigest,
  loadTargets,
  repositoryRoot,
} from './lib.mjs';

const workspaceRoot = path.resolve(process.argv[2] ?? path.join(repositoryRoot, '..', '..'));
const outputRoot = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-status-'));
const targets = await loadTargets();
const rows = [];

try {
  const builds = await buildAll({ outputRoot });
  const expectedByTarget = new Map(
    builds.map(({ provenance }) => [provenance.target, provenance.artifactDigest]),
  );

  for (const target of targets) {
    const repositoryName = target.repository.split('/').at(-1);
    const pluginRoot = path.join(workspaceRoot, repositoryName);
    const expectedDigest = expectedByTarget.get(target.id);

    try {
      const actualDigest = await generatedArtifactDigest(pluginRoot, target);
      const lock = JSON.parse(
        await readFile(path.join(pluginRoot, '.mintlify-agent-context.json'), 'utf8'),
      );
      const current = actualDigest === expectedDigest && lock.artifactDigest === expectedDigest;
      rows.push({
        target: target.id,
        repository: target.repository,
        state: current ? 'current' : 'behind',
        source: lock.sourceCommit,
      });
    } catch {
      rows.push({
        target: target.id,
        repository: target.repository,
        state: 'unavailable',
        source: '-',
      });
    }
  }
} finally {
  await rm(outputRoot, { recursive: true, force: true });
}

console.table(rows);
if (rows.some((row) => row.state !== 'current')) {
  process.exitCode = 1;
}
