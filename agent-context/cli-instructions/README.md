# CLI instructions

Source for `mint instructions`, a planned CLI command that prints current Mintlify workflows for coding agents (Claude Code, Codex, Cursor) working on a docs project. The CLI will bundle these topics at release time, so an agent always reads guidance that matches the CLI version it runs. The command itself and the bundling step into `mintlify/mint` are separate changes.

## Layout

- `topics/root.md`: the overview printed by `mint instructions`. Lists every topic and the facts agents most often get wrong.
- `topics/<topic>.md` and `topics/<topic>.<subtopic>.md`: one workflow each, printed by `mint instructions <topic> [subtopic]`.
- `scripts/build.mjs`: writes `dist/cli-instructions.json` (`{ "version": 1, "topics": { "<key>": "<markdown>" } }`). `dist/` is not committed.
- `scripts/check.mjs`: content checks, also run by `npm test` in CI.
- `test/`: tests for the bundle and the checks.

The folder is under `agent-context/`, which `.mintignore` excludes, so topics are not published as docs pages. It is not part of the plugin skill sync.

## Checks

`npm test` (run in `agent-context/`) fails when a topic:

- names a `mint` command that has no section in `cli/commands.mdx`, other than `mint instructions` and `mint automations`
- uses a flag that is not in that command's section of `cli/commands.mdx` or its global flags, other than a short per-command allowlist in `scripts/lib.mjs`
- links to a `https://www.mintlify.com/docs/...` page that has no file in this repository
- contains `.mintlify.app`, `mint init`, `mint publish`, `mint index`, an em dash, or `theme={null}`, unless the line says it is wrong or does not exist
- has a JSON example that does not parse
- is larger than 8000 bytes (7000 for `root.md`) or lacks `name` and `description` frontmatter

These checks catch commands, flags, and pages that no longer exist. They do not catch a command that changed behavior or a flag combination the CLI rejects. When a CLI change alters how a documented command behaves, update the topics in the same pull request as the docs change.

## Writing topics

Agents read a topic in full, in a terminal, often with no other Mintlify context. Every byte costs context, so be dense and exact.

- Base every command, flag, `docs.json` key, component, URL, and plan fact on a page in this repository. Do not write from memory.
- Workflow guidance, not a page per command. For flag details, tell the agent to run `mint <command> --help`.
- Imperative voice addressed to the agent. Short bullets. No marketing language.
- Follow the topic shape: when to use it, numbered workflow steps, rules, minimal examples where syntax matters, the commands that verify the work, then subtopics and two to four docs links.
- Live sites are `https://<subdomain>.mintlify.site`.
- Code fences use plain `json`, `mdx`, or `bash`.

```bash
npm ci
npm test
node cli-instructions/scripts/check.mjs
node cli-instructions/scripts/build.mjs
```
