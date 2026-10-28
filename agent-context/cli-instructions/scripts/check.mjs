import { readFile } from 'node:fs/promises';
import { bundleTopics, checkTopics, commandsReferencePath, loadTopics } from './lib.mjs';

const topics = await loadTopics();
const { errors } = bundleTopics(topics);
const problems = [...errors, ...checkTopics(topics, await readFile(commandsReferencePath, 'utf8'))];

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`${Object.keys(topics).length} CLI instruction topics are within size limits and match cli/commands.mdx.`);
