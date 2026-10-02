# Mintlify agent context

Canonical source for the general `mintlify` skill and the `mintlify-customization` skill distributed through the Codex, Cursor, and Claude plugins and the Kiro power.

## Repository structure

- `context/skills/` contains the two canonical, client-neutral skill folders and their references.
- `context/mcp-servers.json` contains canonical MCP names, URLs, and transport settings.
- `schemas/agent-plugins/` contains vendored schemas used to validate generated Agent Plugins artifacts.
- `targets/*.json` contains only client packaging differences such as MCP config and skill directory conventions. The Kiro target also contains its required Agent Plugins manifest.
- `scripts/build.mjs` renders self-contained plugin artifacts into `dist/`.
- `scripts/sync-target.mjs` replaces the canonical skill folders in a target repository and preserves unrelated skills.
- `../.github/workflows/sync-agent-context.yml` opens generated sync pull requests in all four target repositories.

Plugin metadata, assets, READMEs, and Cursor rules remain owned by their target repositories. Sync changes only the version in existing Codex and Cursor manifests. Kiro's required `plugin.json` is generated from its target configuration. Claude's versionless marketplace remains target-owned and detects releases through Git revisions. This project generates the shared skills and each client's MCP configuration file.

## Local development

Requires Node.js 22 or newer. Ajv validates Agent Plugins artifacts; TypeScript and PostCSS parse source candidates without executing them.

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

The sync command replaces both canonical skills, writes the client-specific MCP configuration file, and writes `.mintlify-agent-context.json` with the source commit and skill names. It preserves unrelated skill folders. Kiro uses `references/`; the other targets use `reference/`. All Markdown links are rewritten consistently with that convention.

Codex, Cursor, and Kiro use manifest versions. Sync increments the patch version when either skill, any reference/asset, or generated MCP content changes. Kiro also considers its generated manifest fields. Target-owned manifest fields are preserved. For a minor or major Kiro release, set a higher `pluginManifest.version` in `targets/kiro.json`. Versions use `MAJOR.MINOR.PATCH`.

A target that sets `pluginManifestFile` reads/writes that path. Codex uses `.codex-plugin/plugin.json`; Cursor uses `.cursor-plugin/plugin.json`; Kiro uses `plugin.json`. The inspected Claude marketplace has no explicit plugin version or plugin manifest; reference-only sync changes its Git revision without introducing a new version authority.

## Customization audit and publication

Generate an internal candidate inventory from a workspace containing Mint, Components, and Server, then curate the public subset:

```bash
node scripts/extract-customization.mjs /path/to/workspace /tmp/internal-inventory.json
node scripts/curate-customization.mjs /tmp/internal-inventory.json
npm run check
```

The raw inventory is internal and unreviewed. Do not commit it or private customer evidence to this repository. Curation selects explicit hooks, preserves selector syntax, records source provenance and gaps, and labels implementation details separately from documented APIs. Update the curated policy and reference prose together when the source changes.

The customer-facing source is `https://www.mintlify.com/docs`. Native bundle publication is a release dependency: the current host uploads only `SKILL.md`, its legacy index lists only that file, and its preferred 0.2.0 index hashes only the entrypoint. The draft must remain unmerged until that path serves the complete customization skill and reference-only updates have been verified. The prior GitHub-linked entrypoint bridge has been removed; it did not provide complete docs-domain installations.

Extend the existing deployment/asset pipeline to publish the whole skill as an archive, then advertise `type: "archive"`, the artifact URL, and its raw-byte SHA-256 digest through the existing 0.2.0 discovery index. Serve the full files list through legacy discovery as well. Use the same access rules for the entrypoint, references, and archive, preserve the docs base path, and upload the artifact before advertising it. Reference-only edits must change the digest. This reuses the existing docs host and CDN without adding a separate hosting service or registry.

Build/check validate the four plugin bundles, reference links, inventory, and semantic parity. They do not establish hosted discovery or a running manager's refresh behavior. The human-facing installation page records the planned docs-domain command and its current availability explicitly.

`npm run status` compares locally checked-out sibling plugin repositories with fresh builds and reports whether each one is current. Pass a workspace root as the final argument if the repositories do not share this repository's parent directory.

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

Tests verify that the skill, detailed references, and MCP definitions remain semantically identical across targets.
