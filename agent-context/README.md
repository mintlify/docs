# Mintlify agent context

Single source of truth, maintained in the Mintlify documentation repository, for the Mintlify skill distributed through the Codex, Cursor, and Claude plugins.

## Repository structure

- `context/skills/mintlify/` contains canonical, client-neutral context.
- `context/mcp-servers.json` contains canonical MCP names, URLs, and transport settings.
- `targets/*.json` contains only client packaging differences such as MCP config file and schema names.
- `scripts/build.mjs` renders self-contained plugin artifacts into `dist/`.
- `scripts/sync-target.mjs` replaces only `skills/mintlify/` in a target repository.
- `../.github/workflows/sync-agent-context.yml` opens generated sync pull requests in all three plugin repositories.

Plugin manifests, assets, READMEs, and Cursor rules remain owned by their target repositories. This project generates the shared skill and each client's MCP configuration file.

## Local development

Requires Node.js 22 or newer and has no package dependencies.

```bash
npm test
npm run check
npm run build
npm run status
```

Build one target by passing its ID:

```bash
node scripts/build.mjs codex
```

Preview a sync into a local checkout:

```bash
node scripts/sync-target.mjs codex ../../codex-plugin
git -C ../../codex-plugin diff
```

The sync command replaces `skills/mintlify/`, writes the client-specific MCP configuration file, and writes `.mintlify-agent-context.json` with the source commit. It does not change any other plugin files.

`npm run status` compares locally checked-out sibling plugin repositories with fresh builds and reports whether each one is current. Pass a workspace root as the final argument if the repositories do not share this repository's parent directory.

## Publishing setup

Create a GitHub App installed on these repositories:

- `mintlify/codex-plugin`
- `mintlify/cursor-plugin`
- `mintlify/mintlify-claude-plugin`

Grant the app repository **Contents: read and write** and **Pull requests: read and write** permissions. Add its client ID as the `CONTEXT_SYNC_APP_CLIENT_ID` Actions variable and its private key as the `CONTEXT_SYNC_APP_PRIVATE_KEY` Actions secret in the `mintlify/docs` repository.

Every qualifying push to `main` validates the source and opens or updates the `automation/sync-agent-context` pull request in each repository. The workflow never pushes directly to a target's default branch.

## Editing rules

Edit shared knowledge and MCP definitions in `context/`, not in generated plugin copies. Put a value in `targets/` only when a client requires a different packaging format.

The build rejects retired CLI commands. Tests verify that the skill, detailed references, and MCP definitions remain semantically identical across targets.
