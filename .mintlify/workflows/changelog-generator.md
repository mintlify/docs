---
name: "Changelog generator"
on:
  cron: "2 9 * * 5"
context:
  - repo: "mintlify/server"
  - repo: "mintlify/mint"
automerge: false
---

Review all PRs merged to the `mintlify/mint` and `mintlify/server` repositories since the last changelog update component was added.

Write a changelog post for this week based on what shipped. The changelog is about changes to the product, not changes to the docs.

Do not include any internal-only information — no private repository file paths, directory structures, code snippets, internal function names, or implementation details. Only include updates that affect end users. Include a description of the change and what it means for users. Organize the changelog with new features first, then updates, then bug fixes. If you're ever unsure about the structure, review recent changelog updates and follow that style and format.

Be polite and terse. The changelog must be skimmable and quick to read. Include relevant links to docs pages.
