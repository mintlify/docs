# Word list

> **Outline for review.** Tags work the same as in [voice-and-tone.md](voice-and-tone.md).

This list covers how to write Mintlify terms. For what they mean, see the public [glossary](../reference/glossary.mdx). For general terms, follow [Google's word list](https://developers.google.com/style/word-list). Vale already enforces Google's swaps in `.vale/styles/Mintlify/WordList.yml`.

When you add a term here, also add it to `.vale/styles/config/vocabularies/Mintlify/accept.txt` if Vale flags it as a misspelling.

## Mintlify product terms

| Use | Don't use | Notes |
| --- | --- | --- |
| Mintlify | mintlify, MintLify | Company and product. `[existing: Cursor rules]` |
| dashboard | Dashboard | Lowercase in running text. `[existing: Cursor rules]` |
| web editor | Web Editor, editor (alone, on first mention) | `[existing: Cursor rules]`; "editor" alone after first mention `[needs Ethan]` |
| CLI | cli, command-line tool | `[existing: Cursor rules]` |
| `mint` | mint (unformatted) | The CLI command, in code format. `[new, needs Ethan]` |
| `docs.json` | docs.json (unformatted), mint.json | Always in code format. mint.json is the legacy name; mention it only in migration content. `[existing: Cursor rules, Assistant.md]` |
| MDX | mdx, Mdx | `[existing: Cursor rules]` |
| frontmatter | front matter, front-matter | `[existing: Cursor rules]` |
| API playground | API Playground | `[existing: Cursor rules]` |
| assistant | Assistant, AI assistant, chatbot | `[needs Ethan]` |
| agent | Agent, Mintlify agent, AI agent | `[needs Ethan]` |
| automations | workflows | The docs directory is `automations/`, but the server calls them workflows. `[needs Ethan]` |
| project / deployment | | Definitions are changing on the unmerged `docs/projects-terminology` branch. Settle this after it merges. `[needs Ethan]` |
| preview deployment | preview, preview link | `[needs Ethan]` |
| Starter, Pro, Enterprise | Growth, Hobby, free plan | Current plan names. `[existing: memory, July 2026]` |
| sign in, sign in to | log in, login (as a verb), sign into | `[Google word list]`; "sign into" is `[existing: Vale]` |

## Technical terms

| Use | Don't use | Notes |
| --- | --- | --- |
| boolean | bool | In prose and property descriptions. `[existing: CLAUDE.md]` |
| OpenAPI | Open API, openapi | `[new, needs Ethan]` |
| llms.txt | LLMs.txt, llms-txt | `[new, needs Ethan]` |
| MCP server | MCP Server | `[new, needs Ethan]` |
| AI | A.I. | `[Google]` |

## Terms for readers' own things

- "your docs," "your site," "your documentation site": pick one. `[needs Ethan]`
- "users" means the reader's audience, not the reader. Use "you" for the reader. `[new, needs Ethan]`
