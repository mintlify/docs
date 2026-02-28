---
name: "Vale style audit"
on:
  push:
    - repo: "mintlify/docs"
      branch: "main"
---

Get the Git diff of the last PR merged to the mintlify/docs repository.

Run a Vale style audit on all English language MDX files modified in the last merged pull request using the Vale configuration in `.vale/`. Skip any files in language subdirectories (`es/`, `fr/`, `zh/`)

Open a pull request to resolve any issues that can be fixed automatically. For issues that require human judgment, note them in the PR body with the specific lines, rule violations, and your ideas to solve them.

Success criteria: Thoroughly identify Vale errors and warnings. Propose accurate fixes or escalate for human review. 

## Important

- Do not change content meaning when making fixes, only style corrections
- Only update English language files
