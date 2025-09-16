---
allowed-tools: Bash(mint *)
description: Lint the mintlify docs and fix errors
---

Run `mint broken-links` and check the given git diff. For an openapi reference updates run `mint openai-check`.

For more details on the `mint` cli. Look at the details here.

```
mint <command>

Commands:
  mint dev                       initialize a local preview environment
  mint openapi-check <filename>  check if an OpenAPI spec is valid
  mint broken-links              check for invalid internal links
  mint rename <from> <to>        rename a file and update all internal link refe
                                 rences
  mint update                    update the CLI to the latest version
  mint upgrade                   upgrade mint.json file to docs.json (current fo
                                 rmat)
  mint migrate-mdx               migrate MDX OpenAPI endpoint pages to x-mint ex
                                 tensions and docs.json
  mint ai [prompt]               Use ai to document a page
  mint version                   display the current version of the CLI and clie
                                 nt                                 [aliases: v]

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```
