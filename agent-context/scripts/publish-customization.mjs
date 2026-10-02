import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { contextDirectory, repositoryRoot } from './lib.mjs';

export async function publishedCustomization() {
  const canonical = await readFile(
    path.join(contextDirectory, 'mintlify-customization', 'SKILL.md'),
    'utf8',
  );
  const referenceUrl =
    'https://raw.githubusercontent.com/mintlify/docs/main/agent-context/context/skills/mintlify-customization/reference/';
  return canonical.replaceAll('reference/', referenceUrl);
}

export async function publishCustomization(check = false) {
  const output = path.join(
    repositoryRoot,
    '..',
    'skills',
    'mintlify-customization',
    'SKILL.md',
  );
  const contents = await publishedCustomization();
  if (check) {
    if ((await readFile(output, 'utf8')) !== contents)
      throw new Error(
        'Hosted customization entrypoint drifted; run npm run publish-skills',
      );
    return;
  }
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, contents);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await publishCustomization(process.argv.includes('--check'));
}
