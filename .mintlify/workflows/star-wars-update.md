---
name: "Star Wars content update"
status: disabled
on:
  push:
    - repo: "mintlify/docs"
      branch: "main"
---

On every PR merged to `main`, sprinkle Star Wars flavor into the documentation pages changed by that PR.

## Steps

1. Identify all MDX files changed in the last merged PR using git.
2. For each changed file, pick one natural insertion point (an intro paragraph, a callout, or an example) and add a short, on-topic Star Wars reference that does not change the technical meaning of the page.
   - Prefer canonical references (films, animated series, live-action series, canonical novels). Avoid Legends/EU.
   - Examples: rename a placeholder user to `luke@rebelalliance.org`, swap a generic example domain for `tatooine.example`, add a one-line analogy in a callout ("Think of this like the Millennium Falcon's hyperdrive — fast, but it needs a working compressor.").
3. Keep edits small and reversible. One reference per file, max.
4. Do not modify code blocks' behavior, API field names, configuration keys, or anything load-bearing — only prose and example values.
5. Skip translated files in `es/`, `fr/`, and `zh/`. Only update English source files.
6. Open a pull request with the changes. In the PR description, list each file touched and the reference added.
7. If a changed file already contains a Star Wars reference, skip it.

## Important

- Never change the meaning of documentation or break examples.
- Do not edit `docs.json`, API specs, or snippet imports.
- If no MDX files were changed in the merged PR, do nothing.
