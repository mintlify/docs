# Word list

This list covers how to write Mintlify terms. For what they mean, see the public [glossary](../reference/glossary.mdx). For general terms, follow [Google's word list](https://developers.google.com/style/word-list). Vale enforces Google's swaps in `.vale/styles/Mintlify/WordList.yml`.

When you add a term here, also add it to `.vale/styles/config/vocabularies/Mintlify/accept.txt` if Vale flags it as a misspelling.

## Mintlify product terms

In general, Mintlify product names are lowercase if they are terms commonly used in other contexts like editor, assistant, or agent. Only proper nouns are capitalized.

| Use | Don't use | Notes |
| --- | --- | --- |
| Mintlify | mintlify | Company and product. |
| dashboard | Dashboard |  |
| editor | Web Editor | the editor can be accessed in a web browser or the desktop app, so make sure it is clear what you're referring to |
| CLI | cli, command-line tool | |
| `mint` | mint (unformatted) | The CLI command, in code format. |
| `docs.json` | docs.json (unformatted), mint.json | Always in code format. mint.json is the legacy name; mention it only in migration content. |
| MDX | mdx, Mdx | |
| frontmatter | front matter, front-matter | |
| API playground | API Playground | Can refer to it as the playground when the context is clear |
| assistant | Assistant, AI assistant, chatbot | |
| agent | Agent, Mintlify agent, AI agent | |
| automations | workflows | Automations were previously called workflows |
| project | deployment | Projects were previously called deployments |
| preview deployment | preview, preview link | |
| Starter, Pro, Enterprise | Growth, Hobby, free plan | Current plan names. |
| sign in, sign in to | log in, login (as a verb), sign into | |

## Technical terms

| Use | Don't use | Notes |
| --- | --- | --- |
| boolean | bool | In prose and property descriptions. |
| OpenAPI | Open API, openapi | |
| llms.txt | LLMs.txt, llms-txt | |
| MCP server | MCP Server | |
| AI | A.I. | |

## Miscellaneous

- "users" means the reader's audience interacting with their site, not the reader. Use "you" for the reader.
