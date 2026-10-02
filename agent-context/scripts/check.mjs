import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  buildAll,
  contextDirectory,
  loadSkills,
  loadTargets,
  readTree,
  rewriteReferenceDirectory,
} from './lib.mjs';
import { validateReferenceLinks, validateInventory } from './validation.mjs';

const outputRoot = await mkdtemp(path.join(tmpdir(), 'mintlify-agent-context-'));

try {
  const skills = await loadSkills();
  for (const name of skills) {
    const files = await readTree(path.join(contextDirectory, name));
    validateReferenceLinks(files, name);
    if (name === 'mintlify-customization') {
      validateInventory(JSON.parse(files.get('reference/inventory.json')));
    }
  }
  const results = await buildAll({ outputRoot });
  const targets = await loadTargets();
  assert.equal(results.length, targets.length);
  for (const name of skills) {
    let baseline;
    for (const target of targets) {
      const files = await readTree(path.join(outputRoot, target.id, 'skills', name));
      validateReferenceLinks(files, `${target.id}/${name}`);
      const referenceDirectory = target.skillReferenceDirectory ?? 'reference';
      const normalized = [...files]
        .map(([file, contents]) => [
          file.replace(`${referenceDirectory}/`, 'reference/'),
          file.endsWith('.md')
            ? rewriteReferenceDirectory(contents, referenceDirectory, 'reference')
            : contents,
        ])
        .sort(([left], [right]) => left.localeCompare(right));
      if (baseline === undefined) baseline = normalized;
      assert.deepEqual(
        normalized,
        baseline,
        `${target.id}/${name}: bundled content drifted`,
      );
    }
  }
  console.log(
    `Validated ${skills.length} complete skills in ${targets.length} targets, including reference links, inventory, and semantic parity.`,
  );
} finally {
  await rm(outputRoot, { recursive: true, force: true });
}
