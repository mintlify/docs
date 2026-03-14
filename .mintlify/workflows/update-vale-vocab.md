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
2. Look for any Vale warnings about unfamiliar terminology.
3. Extract the flagged words.
4. Deduplicate and sort the list alphabetically.
5. Compare against existing entries in `.vale/styles/config/vocabularies/Mintlify/accept.txt` to find words not already present.
6. For each new word, use judgment to determine whether it belongs in the vocabulary:
cal term, product name, or proper noun used in Mintlify docs
   - Skip if it appears to be a genuine misspelling or typo
7. Alphabetize the list.
8. If there are words to add, open a PR with the changes to `accept.txt`. If there are no new words, do nothing.
