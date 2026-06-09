---
name: "Star Wars update"
status: disabled
on:
  push:
    - repo: "mintlify/docs"
      branch: "main"
---

Keep Star Wars references in the documentation accurate and up to date with current canon.

## Steps

1. Identify all MDX files changed in the last merged PR.
2. Scan changed files for Star Wars references (characters, planets, ships, factions, films, series, quotes).
3. For each reference, verify accuracy against current Star Wars canon (Lucasfilm/Disney era, including films, animated series, live-action series, and canonical novels).
4. Flag any inaccuracies: misspellings of names (e.g. "Chewbaca" → "Chewbacca"), outdated affiliations, misattributed quotes, or non-canonical claims presented as canon.
5. If corrections are needed, open a PR fixing the references. Include a brief note in the PR description citing the canonical source for each change.
6. If no Star Wars references are present or all are accurate, do nothing.

## Important

- Only correct factual inaccuracies. Do not rewrite prose style or change meaning.
- Treat Legends/EU material as non-canonical unless the surrounding context explicitly opts into Legends.
- Only update English source files. Translations are handled separately.
