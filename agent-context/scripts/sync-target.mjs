import path from 'node:path';
import { buildAll, copyTargetToRepository, repositoryRoot } from './lib.mjs';

const [targetId, destinationArgument] = process.argv.slice(2);
if (!targetId || !destinationArgument) {
  throw new Error('Usage: node scripts/sync-target.mjs <target> <destination>');
}

const destination = path.resolve(process.cwd(), destinationArgument);
const outputRoot = path.join(repositoryRoot, 'dist');
await buildAll({ outputRoot, selectedIds: [targetId] });
await copyTargetToRepository(targetId, destination, outputRoot);
console.log(`Synced ${targetId} context to ${destination}`);
