---
name: "Translation lag tracker"
on:
  cron: "3 15 * * 3"
---

Compare the English MDX files in the the repo against their counterparts in the `es/`, `fr/`, and `zh/` subdirectories. Use git history to identify English files that have been updated more recently than their translations.

Open a GitHub issue listing the pages that are out of sync, organized by language. For each page, include the date of the last English update and a brief summary of what changed so translators have context.

## Important

- If a translated file does not exist at all, flag it as missing rather than out of sync
- Group findings by language, then by how far out of date they are (most stale first)
