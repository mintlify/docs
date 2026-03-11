---
name: "Translation lag tracker"
on:
  cron: "3 15 * * 3"
---

Compare the English MDX files in the repo against their counterparts in the `es/`, `fr/`, and `zh/` subdirectories. Use git history to find English files updated more recently than their translations.

For each candidate file, inspect the actual diff between the English file's last commit and the translation's last commit. Classify each change:

- **Needs translation**: New or changed prose, headings, UI labels, or structured content (tables, steps) that translators must update. Flag these.
- **No action needed**: English-only style fixes that don't apply to translated text — punctuation rules (period placement inside quotes), tense corrections, Vale style warnings, whitespace, or code-only changes. Do not flag these.

Open a pull request listing only the pages that genuinely need translation work, organized by language and sorted by staleness (most stale first). For each flagged page, include the date of the last English update and a brief description of what content needs to be translated.

Success criteria: Every flagged page has a content change that a translator actually needs to act on. Pages where only English style fixes were applied are excluded.

## Important

- If a translated file does not exist at all, flag it as missing rather than out of sync
- If all changes to an English file since the translation's last update are style-only, skip it entirely
- When in doubt about whether a change requires translation, err on the side of flagging it
