---
name: "Update Vale vocabulary"
on:
  push:
    - repo: "mintlify/docs"
      branch: "main"
---

Check the files added in the last merged PR for new words that should be added to the Vale vocabulary in `/.vale/styles/config/vocabularies/Mintlify/accept.txt`

Run the following script. Create a PR to add any new words to the `accept.txt` file.

```
#!/bin/bash
# Extracts words flagged by Vale.Spelling and outputs them as a sorted list.

set -e

if [ $# -eq 0 ]; then
  FILES="**/*.mdx"
else
  FILES="$@"
fi

CANDIDATES=$(vale --no-exit $FILES 2>&1 | \
  grep "Vale.Spelling" | \
  sed -n "s/.*Did you really mean '\([^']*\)'.*/\1/p" | \
  sort -u)

if [ -n "$CANDIDATES" ]; then
  echo "$CANDIDATES"
else
  echo "No vocabulary candidates found."
fi
```
