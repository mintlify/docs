import { readFile } from 'node:fs/promises';
import { bundleTopics, checkSkillCommands, checkTopics, commandsReferencePath, loadSkillFiles, loadTopics } from './lib.mjs';

const reference = await readFile(commandsReferencePath, 'utf8');
const topics = await loadTopics();
const skill = await loadSkillFiles();
const { errors } = bundleTopics(topics);
const problems = [...errors, ...checkTopics(topics, reference), ...checkSkillCommands(skill, reference)];

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(
  `${Object.keys(topics).length} CLI instruction topics and ${Object.keys(skill).length} skill files match cli/commands.mdx; topics are within size limits.`,
);
