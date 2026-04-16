---
name: "Translation lag tracker"
on:
  cron: "3 15 * * 3"
notify:
  slack:
    channel_ids:
      - "C0AKYE83VV4"
---

## Step 1 - Identify potential translation lag in files

Compare the English MDX files in the repo against their counterparts in the `es/`, `fr/`, and `zh/` subdirectories. Use git history to find English files updated more recently than their translations.

## Step 2 - Note files that need translation fixes

For each candidate file, inspect the actual diff between the English file's last commit and the translation's last commit. Classify each change:

- **Needs translation**: New or changed prose, headings, UI labels, or structured content (tables, steps) that translators must update. Note these for translation in the next step.
- **No action needed**: English-only style fixes that don't apply to translated text — punctuation rules (period placement inside quotes), tense corrections, Vale style warnings, whitespace, or code-only changes. Do not note these.

## Step 3 - Fix translation lag

Open a pull request updating the localized files for any **needs translation** updates noted in the previous step.

Only update pages that genuinely need translation work. You must never update English language pages as part of this workflow.

In the pull request description, include what pages you changed organized by language and sorted by staleness (most stale first). For each updated page, include the date of the last English update and a brief description of what content was translated.

Success criteria: All translation lag is fixed and English and localized pages have parity.

## Important

- If a translated file does not exist at all, flag it as missing rather than out of sync
- When in doubt about whether a change requires translation, err on the side of caution and flag it for human review in the PR description
