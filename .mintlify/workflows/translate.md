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

- Only translate English source files. Skip any files already in a language subdirectory.
- Preserve all MDX structure, frontmatter, and component syntax exactly — only translate prose content.
- Do not translate code samples, component names, prop names, or code block titles (e.g., ` ```mdx Card example ` — keep "Card example" as-is).

### Formatting

When writing or updating translated files:

- Maintain as similar formatting as possible to the English-language version of the file without affecting meaning
- Use real quotation marks (`"`, `'`) instead of HTML entities (`&quot;`, `&#39;`, `&amp;`)

### Headings

Wrap every heading (`##`, `###`, etc.) in a `<div id="...">` element using the English heading's kebab-case slug as the ID. This preserves anchor links when users share links to translated pages. Derive the ID by lowercasing the English heading and replacing spaces with hyphens.

```mdx
<div id="english-heading-slug">
  ## Translated heading text
</div>
```

### Internal links

Prefix all internal links with the target language code so they resolve correctly within the translated site. For example, when translating to Spanish, `/components/columns` becomes `/es/components/columns`. Use `es/`, `fr/`, or `zh/` as appropriate for each language.

### Snippet imports

Update snippet import paths to use the target language subdirectory (`es/`, `fr/`, or `zh/`). For example, when translating to Spanish:

```mdx
import IconsOptional from "/snippets/icons-optional.mdx";
```

becomes:

```mdx
import IconsOptional from "/snippets/es/icons-optional.mdx";
```
