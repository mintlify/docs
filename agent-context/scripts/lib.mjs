import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
export const repositoryRoot = path.resolve(scriptsDirectory, '..');

const contextDirectory = path.join(repositoryRoot, 'context', 'skills', 'mintlify');
const mcpServersPath = path.join(repositoryRoot, 'context', 'mcp-servers.json');
const targetsDirectory = path.join(repositoryRoot, 'targets');

export async function loadTargets(selectedIds = []) {
  const entries = (await readdir(targetsDirectory))
    .filter((entry) => entry.endsWith('.json'))
    .sort();
  const targets = await Promise.all(
    entries.map(async (entry) =>
      JSON.parse(await readFile(path.join(targetsDirectory, entry), 'utf8')),
    ),
  );

  for (const target of targets) {
    if (
      typeof target.id !== 'string' ||
      typeof target.repository !== 'string' ||
      !['.mcp.json', 'mcp.json'].includes(target.mcpConfigFile) ||
      !['mcp_servers', 'mcpServers'].includes(target.mcpConfigKey)
    ) {
      throw new Error(`Invalid target configuration: ${JSON.stringify(target)}`);
    }
  }

  const ids = new Set(targets.map((target) => target.id));
  for (const id of selectedIds) {
    if (!ids.has(id)) {
      throw new Error(`Unknown target: ${id}`);
    }
  }

  return selectedIds.length === 0
    ? targets
    : targets.filter((target) => selectedIds.includes(target.id));
}

function markGenerated(skill) {
  const frontmatterEnd = skill.indexOf('\n---\n', 4);
  if (frontmatterEnd === -1) {
    throw new Error('SKILL.md frontmatter is not closed');
  }

  const insertionPoint = frontmatterEnd + '\n---\n'.length;
  return `${skill.slice(0, insertionPoint)}\n<!-- Generated from mintlify/docs/agent-context. Edit the canonical source, not this copy. -->\n${skill.slice(insertionPoint)}`;
}

export function sourceCommit() {
  if (process.env.GITHUB_SHA) {
    return process.env.GITHUB_SHA;
  }

  try {
    const changes = execFileSync('git', ['status', '--porcelain', '--', '.'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (changes) {
      return 'working-tree';
    }

    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'working-tree';
  }
}

function validateSkill(skill, target) {
  if (!skill.startsWith('---\n')) {
    throw new Error(`${target.id}: SKILL.md must start with YAML frontmatter`);
  }
  if (!/^name: mintlify$/m.test(skill) || !/^description: .+$/m.test(skill)) {
    throw new Error(`${target.id}: SKILL.md requires name and description fields`);
  }
  if (/mint analytics/.test(skill)) {
    throw new Error(`${target.id}: SKILL.md contains retired CLI commands`);
  }
}

export async function buildTarget(target, outputRoot) {
  const targetRoot = path.join(outputRoot, target.id);
  const skillOutput = path.join(targetRoot, 'skills', 'mintlify');
  await rm(targetRoot, { recursive: true, force: true });
  await mkdir(skillOutput, { recursive: true });

  const skillTemplate = await readFile(path.join(contextDirectory, 'SKILL.md'), 'utf8');
  const skill = markGenerated(skillTemplate);
  validateSkill(skill, target);
  await writeFile(path.join(skillOutput, 'SKILL.md'), skill);
  await cp(path.join(contextDirectory, 'reference'), path.join(skillOutput, 'reference'), {
    recursive: true,
  });

  const mcpServers = JSON.parse(await readFile(mcpServersPath, 'utf8'));
  const mcpConfig = { [target.mcpConfigKey]: mcpServers };
  await writeFile(
    path.join(targetRoot, target.mcpConfigFile),
    `${JSON.stringify(mcpConfig, null, 2)}\n`,
  );

  const provenance = {
    schemaVersion: 1,
    sourceRepository: 'mintlify/docs',
    sourcePath: 'agent-context',
    sourceCommit: sourceCommit(),
    target: target.id,
  };
  await writeFile(
    path.join(targetRoot, '.mintlify-agent-context.json'),
    `${JSON.stringify(provenance, null, 2)}\n`,
  );

  return { targetRoot, provenance };
}

export async function buildAll({ outputRoot, selectedIds = [] } = {}) {
  const resolvedOutput = outputRoot ?? path.join(repositoryRoot, 'dist');
  await mkdir(resolvedOutput, { recursive: true });
  const targets = await loadTargets(selectedIds);
  return Promise.all(targets.map((target) => buildTarget(target, resolvedOutput)));
}

export async function copyTargetToRepository(targetId, destination, outputRoot) {
  const [target] = await loadTargets([targetId]);
  const sourceRoot = path.join(outputRoot, targetId);
  const sourceSkill = path.join(sourceRoot, 'skills', 'mintlify');
  const destinationSkill = path.join(destination, 'skills', 'mintlify');

  await stat(sourceSkill);
  await rm(destinationSkill, { recursive: true, force: true });
  await mkdir(path.dirname(destinationSkill), { recursive: true });
  await cp(sourceSkill, destinationSkill, { recursive: true });
  await cp(
    path.join(sourceRoot, target.mcpConfigFile),
    path.join(destination, target.mcpConfigFile),
  );
  await cp(
    path.join(sourceRoot, '.mintlify-agent-context.json'),
    path.join(destination, '.mintlify-agent-context.json'),
  );
}
