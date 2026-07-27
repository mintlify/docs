import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadTargets, repositoryRoot, sourceCommit } from './lib.mjs';

const workspaceRoot = path.resolve(process.argv[2] ?? path.join(repositoryRoot, '..', '..'));
const targets = await loadTargets();
const currentSourceCommit = sourceCommit();
const rows = [];

for (const target of targets) {
  const repositoryName = target.repository.split('/').at(-1);
  const pluginRoot = path.join(workspaceRoot, repositoryName);

  try {
    const lock = JSON.parse(
      await readFile(path.join(pluginRoot, '.mintlify-agent-context.json'), 'utf8'),
    );
    rows.push({
      target: target.id,
      repository: target.repository,
      state: lock.sourceCommit === currentSourceCommit ? 'current' : 'behind',
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

console.table(rows);
if (rows.some((row) => row.state !== 'current')) {
  process.exitCode = 1;
}
