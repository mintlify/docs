import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { bundleTopics, instructionsRoot, loadTopics } from './lib.mjs';

const { bundle, errors } = bundleTopics(await loadTopics());
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const output = path.join(instructionsRoot, 'dist', 'cli-instructions.json');
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(bundle)}\n`);
console.log(`Wrote ${path.relative(instructionsRoot, output)} (${Object.keys(bundle.topics).length} topics).`);
