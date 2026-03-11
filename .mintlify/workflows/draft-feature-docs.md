---
name: "Draft docs for new features"
on:
  push:
    - repo: "mintlify/server"
      branch: main
    - repo: "mintlify/mint"
      branch: main
context:
  - repo: "mintlify/docs"
notify:
  slack:
    channel_ids:
      - C0AKYE83VV4
automerge: false
---

Review the diff from the last merged PR in the triggering repository. Identify any new features, APIs, or other changes that require documentation.

For each new addition, draft documentation updates that explain what it does, when to use it, and how to configure it. Include a code example where relevant.

Success criteria: After reading any new or updated documentation, users understand what the feature is, if it applies to tasks they do, and how to use it.

## Important

- Only document changes that affect end users. Skip internal refactors or dependency updates.
- Match the style and structure of existing docs pages.
- If no user-facing changes were introduced, do nothing.
- Include a brief summary of the PR that triggered the workflow.
- Do not include private repository file paths, directory structures, code snippets, or any other internal implementation details in PR titles, descriptions, or commit messages.
- Write a quick summary of the feature that shipped in the PR description.
