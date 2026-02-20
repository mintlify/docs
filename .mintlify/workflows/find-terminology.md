---
name: "Update Vale vocabulary"
on:
  push:
    - repo: "mintlify/docs"
      branch: "main"
---

Find words flagged by Vale spelling errors in the files changed by the last merged PR, and add valid ones to the Vale vocabulary.

## Steps

1. Identify the files changed in the last merged PR using git.
2. Run Vale with `--no-exit` on those files. Filter output for `Vale.Spelling` errors only.
3. Extract the flagged words. Vale spelling errors follow the pattern: `Did you really mean 'word'?` — extract the word inside the single quotes.
4. Deduplicate and sort the list alphabetically.
5. Compare against existing entries in `.vale/styles/config/vocabularies/Mintlify/accept.txt` to find words not already present.
6. For each new word, use judgment to determine whether it belongs in the vocabulary:
   - Add to `accept.txt` if it's a valid technical term, product name, or proper noun used in Mintlify docs
   - Skip if it appears to be a genuine misspelling or typo
7. If there are words to add, open a PR with the changes to `accept.txt`. If there are no new words, do nothing.
