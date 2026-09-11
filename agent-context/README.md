# Mintlify agent context

Single source of truth, maintained in the Mintlify documentation repository, for the Mintlify skill distributed through the Codex, Cursor, and Claude plugins and the Kiro power.

## Repository structure

- `context/skills/mintlify/` contains canonical, client-neutral context.
- `context/mcp-servers.json` contains canonical MCP names, URLs, and transport settings.
- `schemas/agent-plugins/` contains vendored schemas used to validate generated Agent Plugins artifacts.
- `targets/*.json` contains only client packaging differences such as MCP config and skill directory conventions. The Kiro and Claude targets also contain their plugin manifests.
- `evals/` contains the behavioral eval suite for the generated Claude Code plugin. See `evals/README.md`.
- `scripts/build.mjs` renders self-contained plugin artifacts into `dist/`.
- `scripts/sync-target.mjs` replaces only `skills/mintlify/` in a target repository.
- `scripts/eval-summary.mjs` renders an eval result as a Markdown table for the CI job summary.
- `../.github/workflows/agent-context-ci.yml` validates the source on every pull request and runs the Claude plugin eval suite as a soft gate.
- `../.github/workflows/sync-agent-context.yml` opens generated sync pull requests in all four target repositories.

Assets, READMEs, and Cursor rules remain owned by their target repositories. The Kiro and Claude `plugin.json` manifests are generated from their target configurations; Codex and Cursor manifests stay in their repositories. This project generates the shared skill and each client's MCP configuration file.

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
npm test
npm run check
npm run build
npm run status
```

Build one target by passing its ID:

```bash
node scripts/build.mjs codex
node scripts/build.mjs kiro
```

Preview a sync into a local checkout:

```bash
node scripts/sync-target.mjs codex ../../codex-plugin
git -C ../../codex-plugin diff
```

The sync command replaces `skills/mintlify/`, writes the client-specific MCP configuration file, and writes `.mintlify-agent-context.json` with the source commit. For Kiro it also writes `plugin.json`; for Claude, `.claude-plugin/plugin.json`, the only location Claude Code reads a manifest from. It does not change any other plugin files.

Treat the Kiro and Claude manifest versions as release versions. Whenever a change modifies a generated skill, MCP configuration, or manifest, increment `pluginManifest.version` in `targets/kiro.json` and `targets/claude.json` according to Semantic Versioning before merging. Do not use a Git SHA or SemVer build metadata as the update version because build metadata does not affect version precedence.

`npm run status` compares locally checked-out sibling plugin repositories with fresh builds and reports whether each one is current. Pass a workspace root as the final argument if the repositories do not share this repository's parent directory.

## Evals

`evals/` holds the eval suite for the generated Claude Code plugin, run with `claude plugin eval`. Only the Claude target has an eval harness; because all four targets are generated from the same `context/`, it measures the shared content, not the other clients' agents.

On every pull request that touches `agent-context/`, the `eval-shared-content-via-claude` job generates the Claude plugin, copies `evals/` into it, and runs the suite with pinned models. The name is deliberate: it evaluates the shared content, through the one client that has an eval harness. It does not exercise the Codex, Cursor, or Kiro agents. It is a soft gate: results appear in the job summary and as an artifact, but a low score does not fail the check. It needs an `ANTHROPIC_API_KEY` Actions secret; without one the job reports that and skips.

Run it locally against a generated plugin:

```bash
node scripts/sync-target.mjs claude ../../mintlify-claude-plugin
cp -R evals ../../mintlify-claude-plugin/evals
claude plugin eval ../../mintlify-claude-plugin --allow-tools Write
```

Never pass `--mocks off` or `--allow-real-servers`: the Mintlify Admin MCP server writes to live deployments, and eval runs never stop to ask permission.

## Publishing setup

Create a GitHub App installed on these repositories:

- `mintlify/codex-plugin`
- `mintlify/cursor-plugin`
- `mintlify/mintlify-claude-plugin`
- `mintlify/kiro-power`

Grant the app repository **Contents: read and write** and **Pull requests: read and write** permissions. Add its client ID as the `CONTEXT_SYNC_APP_CLIENT_ID` Actions variable and its private key as the `CONTEXT_SYNC_APP_PRIVATE_KEY` Actions secret in the `mintlify/docs` repository.

Every qualifying push to `main` validates the source and opens or updates the `automation/sync-agent-context` pull request in each repository. The workflow never pushes directly to a target's default branch.

## Editing rules

Edit shared knowledge and MCP definitions in `context/`, not in generated plugin copies. Put a value in `targets/` only when a client requires a different packaging format.

The build rejects retired CLI commands. Tests verify that the skill, detailed references, and MCP definitions remain semantically identical across targets.
