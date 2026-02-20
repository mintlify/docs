---
name: "Vale style audit"
on:
  push:
    - repo: "mintlify/docs"
      branch: "main"
---

Run a Vale style audit on all MDX files in the repo using the Vale configuration in `.vale/`.

Open a pull request to resolve any issues that can be fixed automatically. For issues that require human judgment, note them in the PR body with the specific lines, rule violations, and your ideas to solve them.

## Important

- Prioritize errors over warnings
- Do not change content meaning when making fixes, only style corrections
- Skip any files in language subdirectories (`es/`, `fr/`, `zh/`)
