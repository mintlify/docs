---
name: "Vale style audit"
on:
  cron: "0 15 * * 4"
notify:
  slack:
    channel_ids:
      - C0AKYE83VV4
---

# Steps

1. Find all PRs merged to the mintlify/docs repository in the last week and list the English MDX files they changed.
2. Run `vale` against those files. If the `vale` binary is unavailable, evaluate the files against the rule definitions in `.vale/styles/Mintlify/` directly.
3. Deduplicate the resulting alerts.
4. For each alert, quote the rule that fired and the exact text it matched, then classify it before changing anything:
   - **Prose is wrong**: the rule caught a real style problem. Fix the prose.
   - **Rule is wrong**: the prose is correct English and the rule is over-matching. Fix the rule, not the prose.
   - **Unclear**: do not guess and do not edit either one. List it in the PR body for human review.
5. Open one pull request containing all prose fixes and rule changes.

## Fixing a rule instead of the prose

Vale exists to catch mistakes, not to force correct English into worse English. If a fix would make a sentence less accurate, less natural, or harder to read, the rule is at fault.

- **Over-matching pattern**: narrow the regex in the relevant `.vale/styles/Mintlify/*.yml` file. Add the missing exception rather than rewording the docs.
- **Valid term flagged as a misspelling**: add it to `.vale/styles/config/vocabularies/Mintlify/accept.txt`, alphabetized.
- **Rule is noisy enough to be net-negative**: say so in the PR body and propose lowering its `level` or removing it. Do not remove a rule unilaterally.

Apply the narrowest change that resolves the false positive. Verify it by running `vale` on a test file containing both the text that was wrongly flagged and the text the rule should still catch, so a fix does not silently disable the rule. Explain every rule change in the PR body: which rule, what it was matching, and why the original text was correct.

## Important

- Fix only what the rule actually flags. `Mintlify.EmDash` bans spaces around a dash, not the dash itself. Remove the spaces, do not replace the punctuation.
- Do not change meaning when fixing prose. Style corrections only.
- Only update English language files. Vale is already disabled for `es/`, `fr/`, and `zh/` in `.vale.ini`.

Success criteria: every real style problem is fixed, every false positive is fixed at the rule level, and anything uncertain is escalated rather than guessed. A run that changes no prose and narrows two rules is a good run.
