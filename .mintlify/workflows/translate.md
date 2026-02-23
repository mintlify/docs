---
name: "Translate changed files"
on:
  push:
    - repo: "mintlify/docs"
      branch: "main"
---

Translate any MDX files changed by the last merged PR into all supported languages.

## Steps

1. Identify the MDX files changed in the last merged PR using git.
2. For each changed file, translate the changed content into each supported language. Only change content changed in the git diff and any surrounding content required to maintain coherency.
3. Write translated files to the appropriate language subdirectories (`es/`, `fr/`, `zh/`), mirroring the source file path.
4. Open a pull request with the translated files.

## Important

- Only translate English source files. Do not translate files already in a language subdirectory.
- Preserve all MDX structure and component syntax exactly — only translate prose content.
- Do not change anything in code samples or angle brackets (don't change the names of components)
