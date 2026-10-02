# Installation and updates

The `mintlify` skill includes authoring, configuration, and customization guidance. Install the complete canonical folder from the Mintlify docs repository to include the entrypoint, references, and reviewed inventory:

```bash
npx skills@latest add https://github.com/mintlify/docs/tree/main/agent-context/context/skills/mintlify --skill mintlify
npx skills@latest list
```

Select the intended agent and project scope when prompted. Add `--global` for a personal installation across projects. For noninteractive installation, select agents explicitly with `--agent <agent-id> --yes`. Use `--copy` if you want copies rather than the installer's default symlinks. Inspect [the installer documentation](https://github.com/vercel-labs/skills) for current agent IDs and paths.

## Refresh an installed skill

Rerun the same scoped `add` command above to refresh the installed content. Keep the same `--agent`, `--global`, and `--copy` choices you used during installation. The command replaces the selected skill with the current content from that folder; a docs merge does not update an installed copy automatically.

`@latest` selects the installer release. The content comes from the selected Mintlify docs folder. Confirm that the installed folder contains `SKILL.md`, every linked Markdown file, and `reference/customization/inventory.json`. Compare installed references with the canonical folder when content appears stale. Reopen the agent session or reload skills using that agent's current mechanism after refreshing.

The inspected skills CLI `1.7.0` also offers `update`, but it reports ambiguous names when a repository contains multiple skills with the same name. The docs repository has another existing entry named `mintlify`, so use the explicit folder command above. Global updates also do not replay the original agent selection or copy mode. See the [installer update implementation](https://github.com/vercel-labs/skills/blob/main/src/update.ts) and [agent-targeting issue](https://github.com/vercel-labs/skills/issues/1718).

Use `/tree/main/` in a GitHub folder URL. In the inspected CLI, a URL with a repository path but without `/tree/<ref>/` is parsed as the repository root and loses its folder scope. The installer also accepts `mintlify/docs/agent-context/context/skills/mintlify` as a scoped shorthand.

If you already receive `mintlify` through a plugin, refresh that plugin through its supported mechanism and check whether its release includes the customization references before adding another copy.

## Maintain the source

Edit `SKILL.md` and its references directly in the docs repository. A dashboard automation can propose updates to these files when customization behavior changes. Review public documentation and affected browser behavior before merging an update; preserve exact selector syntax, stability labels, and synthetic examples.

The existing agent-context build and sync tooling bundles the customization references with the rest of `mintlify`. Updating docs source does not establish that a plugin release has shipped or that users' installed copies have refreshed. Check the relevant distribution, refresh the installed skill, and reload the agent session.

Consult [compatibility and verification](compatibility-and-verification.md) for compatibility guidance and actual verification coverage.
