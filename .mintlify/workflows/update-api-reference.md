---
name: "Update API reference"
on:
  push:
    - repo: "mintlify/server"
      branch: main
    - repo: "mintlify/mint"
      branch: main
context:
  - repo: "mintlify/docs"
automerge: false
---

Review the diff from the last merged PR in the triggering repository for changes to API endpoints, parameters, response shapes, or error codes.

Update the corresponding API specifications or pages in the docs to reflect the changes. Include updated parameter descriptions, type information, and examples where affected.

Success criteria: All API specifications and pages are up to date with the changes in the product repository.

## Important

- If a parameter or endpoint was removed, mark it as deprecated rather than deleting it unless the code explicitly removes it with no deprecation period.
- If no API changes were introduced, do nothing.
- Do not include private repository file paths, directory structures, code snippets, or any other internal implementation details in PR titles, descriptions, or commit messages. The PR body should only describe the user-facing change in terms of the API behavior.
