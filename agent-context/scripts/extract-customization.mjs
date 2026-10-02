import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inventoryRepository } from './source-inventory.mjs';

const [workspaceArgument, outputArgument] = process.argv.slice(2);
if (!workspaceArgument || !outputArgument) {
  throw new Error(
    'Usage: node scripts/extract-customization.mjs <workspace> <internal-output.json>',
  );
}
const workspace = path.resolve(workspaceArgument);
const repositories = {
  mint: [
    'apps/client/src',
    'packages/common/src/mdx',
    'packages/prebuild/src',
    'packages/api-playground/src/hooks',
    'packages/validation/src/mint-config/schemas/v2/themes',
  ],
  components: ['packages/components/src'],
  server: ['api/utils/preparse'],
};
const inventory = {
  schemaVersion: 1,
  classification: 'internal-unreviewed',
  repositories: {},
};
for (const [name, directories] of Object.entries(repositories)) {
  inventory.repositories[name] = await inventoryRepository(
    path.join(workspace, name),
    directories,
  );
}
const output = path.resolve(outputArgument);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(inventory, null, 2)}\n`);
console.log(`Wrote internal candidates to ${output}; curate before publication.`);
