# Documentation agent instructions

When you create a PR to update docs, only update English language files. Do not update any content in the `es/`, `fr/`, or `zh/` directories. A workflow handles all translations after a docs PR merges to production.

Before you write or edit content, read `style-guide/README.md` and the style guide files relevant to your change. The style guide overrides the Google developer documentation style guide where they differ.

## Keep `mint instructions` topics in sync

`mint-instructions/*.mdx` are hidden pages that the `mint instructions <topic>` CLI command prints for coding agents. They restate the English docs as short workflows, so they go stale whenever the docs change. When you update English docs or the agent skill in `agent-context/`, check whether a topic teaches the same fact, and update it in the same pull request.

Update a topic when a change affects:

- A CLI command, flag, default, or deprecation
- Creating, deploying, claiming, or publishing a site
- Access, authentication, roles, SSO, or which plan includes a feature
- Autopilot, automations, the Slack agent, or other agent features
- docs.json fields, components, navigation, API docs, or migration paths that a topic covers

Topics are `overview` (index of all topics plus must-know rules), `new-site`, `write`, `configure`, `api-docs`, `publish`, `access`, `automate`, `migrate`, `troubleshoot`, and subtopics in the folders with the same names. Search every topic for duplicated versions of a fact, including the rules in `overview.mdx`.

Rules for topic pages:

- Keep each topic a task workflow, not a command reference. `--help` covers flags.
- Keep `related: false` in the frontmatter and keep the pages out of `docs.json` navigation.
- Keep the body under 8,000 bytes (7,000 for `overview.mdx`). `node .github/scripts/check-mint-instructions.mjs` must pass.
- Do not update a topic only because docs wording changed. Update it when behavior, commands, workflows, plans, or defaults changed.
