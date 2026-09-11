# Eval suite for the Mintlify Claude Code plugin

Behavioral tests for the `mintlify` skill, run with `claude plugin eval`. Each case
is a prompt a user might type plus graders that check the result and how Claude
got there. The suite lives here, next to the canonical skill source in
`context/`, and is copied into a generated plugin at run time. Only the Claude
target has an eval harness; since every target is generated from the same
`context/`, this measures the shared content, not the other clients' agents.

## Run it

From `agent-context/`, against a sibling checkout of `mintlify/mintlify-claude-plugin`:

```bash
node scripts/sync-target.mjs claude ../../mintlify-claude-plugin
cp -R evals ../../mintlify-claude-plugin/evals

# cheapest single-case check (~$0.10)
claude plugin eval ../../mintlify-claude-plugin --case page-mode-values --runs 1 --ablation none

# what CI runs (~$3)
claude plugin eval ../../mintlify-claude-plugin --runs 3 --ablation none --threshold 0.8 \
  --model claude-sonnet-5 --judge-model claude-haiku-4-5 --allow-tools Write -j 4

# with the no-plugin baseline, to see what the skill contributes (~$5)
claude plugin eval ../../mintlify-claude-plugin --allow-tools Write -j 4
```

`--allow-tools Write` is required: three cases write files and grade their
contents. Without the grant those cases score 0.

## Never run this suite against the real servers

No `--mocks off`, no `--allow-real-servers`. The Mintlify Admin MCP server has write
access to live deployments, and eval runs never stop to ask permission.

## Cases

| Case | Tests | Needs |
|---|---|---|
| `docs-json-not-mint-json` | Creates `docs.json`, never `mint.json`; required fields; `tabs[].groups[].pages[]` | Write |
| `columns-not-cardgroup` | `<Columns cols={2}>`, not the retired `<CardGroup>` | Write |
| `frontmatter-and-links` | `title`/`description`/`keywords`; root-relative links, no `../` or `.mdx`; tagged code fences | Write |
| `page-mode-values` | Knows all `mode` values, including `frame` and `center` | - |
| `negative-unrelated-request` | Skill does not fire on an unrelated request; answer still correct | - |
| `admin-checkout-before-edit` | Admin MCP workflow: `checkout` first, `save` last, reports the PR | mocks |
| `admin-confirms-live-writes` | Treats code-mode deployment writes as immediate; asks before running one | mocks |

Every positive case has a `skill-fired` grader. In a two-arm run it is excluded
from the score and shown as a plugin-fired indicator; that is what keeps Δ honest.

## Reading Δ

The without-plugin arm loads no plugin, so it loads no MCP servers. Any grader on
an MCP tool is 0 there by construction, and a `max: 0` grader passes for free. Δ
is only meaningful for the knowledge cases; for `admin-*` read the with-arm score.

## How things are named

- **Plugin name comes from `.claude-plugin/plugin.json`**, generated from
  `targets/claude.json`. Claude Code ignores a `plugin.json` at the repository
  root for this. With the manifest the plugin resolves as `mintlify`; without it,
  as the directory name.
- **MCP tool names are `mcp__plugin_mintlify_<Server>__<tool>`**, for example
  `mcp__plugin_mintlify_Mintlify_Admin__checkout`. Three graders under `admin-*`
  hardcode these.
- **Mock directories use the sanitized server name** (`Mintlify_Admin`,
  `Mintlify_Search`) even though `.mcp.json` keys contain spaces. A directory
  with a space aborts the case at score 0 before it runs.
- Each case carries `plugins: ["../.."]` so the plugin resolves from the case
  directory. Keep it.

## Mocks

`mocks/Mintlify_Admin/` and `mocks/Mintlify_Search/` stand in for the two MCP
servers. Tools whose answers don't depend on input are `fixed` files. `_server.md`
is a single agent mock for the content tools (`read`, `search`, `list_nodes`, ...)
and carries the deployment's pages verbatim; `execute_code.md` is an agent mock
that plays the code-mode runtime. Agent mocks cost a small model call per tool
call and can vary; after a clean run, adopt the recordings listed in
`results/<ts>/mock-recordings/ADOPT.txt` into `mocks/.replay/` to make them free
and deterministic.

Known gaps:

- No `expect:` input guards. Mocked tools get a permissive placeholder schema, so
  Claude guesses parameter names; a strict guard would abort on a wrong guess and
  measure the mock rather than the skill. Add guards once a real `_tools.json` is
  recorded from each server.
- Agent mocks have been seen inventing docs pages and config fields. The
  instructions now say the file tree is closed-world; if a transcript cites a page
  that isn't in the mock, tighten the mock, don't chase the skill.
- `admin-confirms-live-writes` requires asking before acting, in a headless run
  with nobody to ask. Answering with a proposal satisfies it, and runs do, but it
  is a stricter bar than an interactive session imposes.

## Iterating

Run one case, one arm, one run while fixing a grader; confirm at the default three
runs before trusting a number. A single run flipped `docs-json-not-mint-json`
between fail and pass on navigation-shape variance alone. Pass `--keep-temp` to
preserve each run's workspace and `trace.jsonl`.
