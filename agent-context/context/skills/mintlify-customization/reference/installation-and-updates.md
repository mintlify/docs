# Installation and updates

Install the complete canonical folder from GitHub. It includes every reference and the reviewed inventory:

```bash
npx skills@latest add https://github.com/mintlify/docs/tree/main/agent-context/context/skills/mintlify-customization --skill mintlify-customization
npx skills@latest list
```

Select the intended agent and project scope when prompted. Use `--global` during installation for a personal installation across projects. For noninteractive installation, select an agent explicitly with `--agent <agent-id> --yes`; inspect [the installer documentation](https://github.com/vercel-labs/skills) for current agent IDs and paths.

Update the installed content in the same scope:

```bash
npx skills@latest update mintlify-customization --project
```

For a global installation:

```bash
npx skills@latest update mintlify-customization --global
```

`@latest` selects the installer release. The `update` command refreshes the skill content. A docs merge does not update an installed copy automatically. Confirm that the installed folder contains `SKILL.md`, every linked Markdown file, and `reference/inventory.json`. Check the inventory's source revisions and the installer's recorded source before attributing an observed change to a new release. Reopen the agent session or reload skills using that agent's current mechanism after updating.

The inspected skills CLI `1.7.0` does not replay the original agent selection or copy mode when running a global update. It can select additional detected agents and use symlinks. If you need to preserve an explicit agent set or copy mode, rerun `add` with the same source, `--skill`, `--agent`, scope, and `--copy` arguments instead. Inspect the installed paths afterward, especially when another agent already receives the skill through a plugin. See the [installer's agent-targeting issue](https://github.com/vercel-labs/skills/issues/1718).

The docs host's inspected publication mechanism discovers named `SKILL.md` files but uploads only their entrypoints. The hosted named entrypoint links its references to GitHub. Use the GitHub-folder command above when you need the references bundled locally; a docs-URL installation is not equivalent to a complete folder installation.

The generated hosted entrypoint uses the installer's `metadata.internal` discovery flag so the skills CLI sees only one installable folder named `mintlify-customization` in the repository. The canonical folder does not carry that flag. This prevents duplicate-name project updates from being skipped; it does not make the published hosting endpoint private.

## Plugin-managed installations

If the skill is provided by a Mintlify plugin or Kiro power, update that package through its own manager. Installing another copy with the skills CLI can create duplicate discovery and leave the plugin-owned copy stale.

| Target | Distributed paths                                                                      | Update detection                                                                                                                                                |
| ------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Codex  | `skills/mintlify-customization/reference/`; `.codex-plugin/plugin.json`                | Sync increments the existing manifest patch version when generated skill/reference/MCP content changes; target metadata remains owned by the target repository  |
| Cursor | `skills/mintlify-customization/reference/`; `.cursor-plugin/plugin.json`               | The same content-aware version rule, preserving target fields                                                                                                   |
| Claude | `skills/mintlify-customization/reference/`; existing `.claude-plugin/marketplace.json` | The inspected marketplace omits a plugin version and plugin manifest, so Claude resolves the version from Git commits; reference edits change the synced commit |
| Kiro   | `skills/mintlify-customization/references/`; `plugin.json`                             | Sync increments the generated manifest patch version, rewriting reference links for the target convention                                                       |

For Claude Code, refresh the marketplace with `/plugin marketplace update mintlify-marketplace`, update the installed Mintlify plugin through `/plugin`, then use `/reload-plugins` when supported by the running release. The repository is `mintlify/mintlify-claude-plugin`; its marketplace is named `mintlify-marketplace` and its plugin is named `mintlify`. See [Claude's marketplace version rules](https://code.claude.com/docs/en/plugin-marketplaces).

For Codex, Cursor, and Kiro, use the installed package's refresh/update control and confirm the resolved package version and both skills are present. Manager UI behavior depends on the installed application release; the source build cannot prove that a running manager refreshed its cache.

## Release provenance

Generated packages include `.mintlify-agent-context.json` with the docs source commit, target, and skill names. Distinguish these stages when diagnosing stale content:

1. The source PR merges into `mintlify/docs`.
2. The existing workflow opens generated sync PRs in the four target repositories.
3. Target maintainers merge/release their packages.
4. A user's manager or skills CLI refreshes the installed copy.

A draft source PR does not establish the later stages. Consult [compatibility and verification](compatibility-and-verification.md) for the audit's actual evidence.
