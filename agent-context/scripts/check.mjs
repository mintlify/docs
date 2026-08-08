import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildAll, loadTargets } from './lib.mjs';

const outputRoot = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-'));

try {
  const results = await buildAll({ outputRoot });
  const targets = await loadTargets();
  const targetsById = new Map(targets.map((target) => [target.id, target]));
  assert.equal(results.length, 4);

  const sharedFiles = [
    'api-docs.md',
    'cli.md',
    'components.md',
    'configuration.md',
    'navigation.md',
    'product-context.md',
  ];
  for (const file of sharedFiles) {
    const contents = await Promise.all(
      results.map(({ provenance }) =>
        readFile(
          path.join(
            outputRoot,
            provenance.target,
            'skills',
            'mintlify',
            targetsById.get(provenance.target).skillReferenceDirectory ?? 'reference',
            file,
          ),
          'utf8',
        ),
      ),
    );
    assert.ok(contents.every((content) => content === contents[0]), `${file} drifted`);
  }

  console.log('All generated targets are valid and shared references are identical.');
} finally {
  await rm(outputRoot, { recursive: true, force: true });
}
