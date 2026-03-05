---
name: "Vale style audit"
on:
  cron: "0 15 * * 4"
---

# Steps

1. Find all PRs merged to the mintlify/docs repository in the last week.
2. Identify all Vale warnings left by the CI check.
3. Deduplicate any warnings.
4. Open a pull request to fix all Vale warnings for each file that has any warnings.
5. If you are unsure of how to fix a warning, do not guess. Note it in the PR body.

Success criteria: Thoroughly identify Vale warnings. Propose accurate fixes or escalate for human review. 

## Important

- Do not change content meaning when making fixes, only style corrections
- Only update English language files
