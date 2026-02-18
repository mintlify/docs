---
name: "Vale style audit"
on:
  cron: "2 14 * * 3"
---

Run a Vale style audit on all MDX files in the repo using the Vale configuration in `.vale/`. Flag any errors or warnings.

Open a pull request with any issues that can be fixed automatically. For issues that require human judgment, open a GitHub issue summarizing the findings grouped by file, with the specific lines and rule violations called out.

## Important

- Prioritize errors over warnings
- Do not change content meaning when making fixes, only style corrections
- Skip any files in language subdirectories (`es/`, `fr/`, `zh/`)
