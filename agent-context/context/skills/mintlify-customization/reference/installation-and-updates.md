# Installation and updates

Install the complete canonical folder from the Mintlify docs repository. It includes the named skill, its references, and the reviewed inventory:

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

Use `/tree/main/` in a GitHub folder URL. In the inspected CLI, a URL with a repository path but without `/tree/<ref>/` is parsed as the repository root and loses its folder scope. The installer also accepts `mintlify/docs/agent-context/context/skills/mintlify-customization` as a scoped shorthand.

## Maintain the source

Edit `SKILL.md` and its references directly in the docs repository. A dashboard automation can propose updates to these files when customization behavior changes. Review the owning source, documentation, and affected browser behavior before merging an update; preserve exact selector syntax, stability labels, provenance, and synthetic examples.

Updating the source does not refresh users' installed copies. Users run the update command above, then reload their agent's skills or start a new session. This standalone skill does not require a custom installer, generated plugin package, or new sync pipeline.

Consult [compatibility and verification](compatibility-and-verification.md) for the audit's source revisions and actual verification coverage.
