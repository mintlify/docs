# Translation audit — March 2026

Pages where the English source has content changes that require translation updates.
Organized by language, sorted by staleness (most stale first).

Pages with English-only style fixes (Vale tense corrections, word simplifications) are excluded.

---

## Spanish (`es/`)

| Page | English updated | What changed |
|------|----------------|--------------|
| `customize/custom-scripts.mdx` | 2026-03-17 | New "Data attributes" section documenting `data-active` attribute on sidebar, TOC items |
| `changelog.mdx` | 2026-03-13 | Internal links updated from `organize/settings#param-*` to new settings subpages (`settings-api`, `settings-seo`) |
| `create/code.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `customize/fonts.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#fonts` |
| `create/text.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `customize/themes.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#theme` |
| `components/code-groups.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `api-playground/mdx-setup.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-api` |
| `api-playground/troubleshooting.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-api` |
| `organize/navigation.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-structure#navigation` |

## French (`fr/`)

| Page | English updated | What changed |
|------|----------------|--------------|
| `customize/custom-scripts.mdx` | 2026-03-17 | New "Data attributes" section documenting `data-active` attribute on sidebar, TOC items |
| `changelog.mdx` | 2026-03-13 | Internal links updated from `organize/settings#param-*` to new settings subpages (`settings-api`, `settings-seo`) |
| `create/code.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `customize/fonts.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#fonts` |
| `create/text.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `customize/themes.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#theme` |
| `components/code-groups.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `api-playground/mdx-setup.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-api` |
| `api-playground/troubleshooting.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-api` |
| `organize/navigation.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-structure#navigation` |

## Chinese (`zh/`)

| Page | English updated | What changed |
|------|----------------|--------------|
| `customize/custom-scripts.mdx` | 2026-03-17 | New "Data attributes" section documenting `data-active` attribute on sidebar, TOC items |
| `organize/settings-reference.mdx` | 2026-03-17 | Supported language codes updated: added `fr-CA`, added `hu`, changed `ua` to `uk` |
| `changelog.mdx` | 2026-03-13 | Internal links updated from `organize/settings#param-*` to new settings subpages (`settings-api`, `settings-seo`) |
| `create/code.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `customize/fonts.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#fonts` |
| `create/text.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `customize/themes.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#theme` |
| `components/code-groups.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-appearance#styling` |
| `api-playground/mdx-setup.mdx` | 2026-03-13 | Internal link updated to `/organize/settings-api` |

---

## Excluded (style-only changes — no translation needed)

The following files had English updates since their last translation, but all changes were
Vale style fixes (future tense → present tense, "functionality" → simpler words) that
don't apply to translated prose:

- `migration-services/enterprise.mdx` (fr) — "will" → present tense, "functionality" → "search"
- `migration-services/pro.mdx` (fr) — "functionality" → "search"
- `guides/understand-your-audience.mdx` (fr) — "There will always be" → "always exist"
- `guides/content-types.mdx` (fr) — "functionality" → "features"
- `guides/migrating-from-mdx.mdx` (fr) — "will overwrite/use" → "overwrites/uses"
- `ai/discord.mdx` (zh) — "will reply" → "replies"
- `guides/accessibility.mdx` (es, fr, zh) — "will already know" → "already know"
- `components/view.mdx` (es, zh) — "will only see" → "only see"
- `guides/auth0.mdx` (zh) — "will be able/generate" → "can/generates"
- `integrations/analytics/hotjar.mdx` (es) — "HotJar" → "Hotjar" (already correct in translation)
- `integrations/analytics/overview.mdx` (es, fr) — "HotJar" → "Hotjar" card title (already correct in translations); table row rephrasing (translations already have natural phrasing)

## Additional note: broken links in recently translated files

These translation files were updated *after* their English counterparts but still contain
broken `organize/settings#param-*` links that should be fixed:

- `es/organize/pages.mdx` — link to `settings#param-metadata` should be `settings-seo#metadata`
- `fr/organize/pages.mdx` — link to `settings#param-metadata` should be `settings-seo#metadata`
- `zh/organize/pages.mdx` — link to `settings#param-metadata` should be `settings-seo#metadata`
