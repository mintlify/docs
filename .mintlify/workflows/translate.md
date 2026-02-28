---
name: "Translate changed files"
on:
  push:
    - repo: "mintlify/docs"
      branch: "main"
---

Translate any MDX files changed by the last merged PR into all supported languages, and mirror any structural changes to `docs.json`.

## Steps

1. Identify all files changed in the last merged PR using git, including added, modified, and deleted files.
2. For each **deleted** English MDX file, delete the corresponding translated files in all language subdirectories (`es/`, `fr/`, `zh/`).
3. For each **added or modified** English MDX file, translate the changed content into each supported language. Only change content changed in the git diff and any surrounding content required to maintain coherency. Write translated files to the appropriate language subdirectories, mirroring the source file path.
4. If `docs.json` was changed, apply the equivalent structural changes to `docs.json` for all translated language sections. See [Updating docs.json](#updating-docsjson) for details.
5. Open a pull request with the translated files and any `docs.json` changes.

## Important

- Only translate English source files. Skip any files already in a language subdirectory.
- Preserve all MDX structure, frontmatter, and component syntax exactly—only translate prose content.
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

## Updating docs.json

When the merged PR modifies `docs.json`, you must apply the equivalent changes to each translated language section (`"language": "es"`, `"language": "fr"`, `"language": "zh"`). Never change the English navigation or any other section of `docs.json`.

### Navigation changes

The English navigation and each translated language section mirror each other, except page paths are prefixed with the language code. Apply the same additions and removals to each translated section.

For example, if the English navigation removes `"agent/quickstart"` and `"agent/suggestions"`, also remove `"es/agent/quickstart"`, `"es/agent/suggestions"`, `"fr/agent/quickstart"`, `"fr/agent/suggestions"`, `"zh/agent/quickstart"`, and `"zh/agent/suggestions"` from their respective language sections.

### Redirects

If the merged PR adds redirects to the `redirects` array, add equivalent redirects for each translated path. Prefix both `source` and `destination` with `/{lang}`.

For example, if the English PR adds:

```json
{ "source": "/agent/suggestions", "destination": "/agent/workflows" }
```

Also add the following redirects to the `redirects` array:

```json
{ "source": "/es/agent/suggestions", "destination": "/es/agent/workflows" },
{ "source": "/fr/agent/suggestions", "destination": "/fr/agent/workflows" },
{ "source": "/zh/agent/suggestions", "destination": "/zh/agent/workflows" }
```
