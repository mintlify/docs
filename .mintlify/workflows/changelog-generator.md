---
name: "changelog generator"
on:
  cron: "2 9 * * 5"
context:
  - repo: "mintlify/mint"
---

review all PRs and write a changelog post based on what has shipped to users.

the changelog must be skimmable with relevant links to docs.
