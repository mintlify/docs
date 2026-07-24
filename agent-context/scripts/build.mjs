import path from 'node:path';
import { buildAll, repositoryRoot } from './lib.mjs';

const selectedIds = process.argv.slice(2);
const results = await buildAll({
  outputRoot: path.join(repositoryRoot, 'dist'),
  selectedIds,
});

for (const { provenance } of results) {
  console.log(`${provenance.target}: ${provenance.sourceCommit}`);
}
