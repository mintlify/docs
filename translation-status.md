# Translation status report

Generated: 2026-03-25

## Summary

All 180 English MDX pages have corresponding translations in `es/`, `fr/`, and `zh/`. No missing translation files were found.

18 English files were updated more recently than their translations. After inspecting every diff, **all changes are English-only style fixes** that do not require translator action. No pages need translation work at this time.

## Candidates reviewed and excluded

The following files were flagged as stale by git history but excluded after diff inspection. Every change came from automated Vale style-fix PRs (future tense to present tense, capitalization, wordiness reduction) that do not alter translatable meaning.

### Spanish (`es/`)

| Page | English updated | Translation updated | Reason excluded |
|------|----------------|-------------------|-----------------|
| `advanced-support.mdx` | 2026-03-19 | 2026-03-12 | Heading capitalization fix: "Add-on" to "add-on" |
| `components/view.mdx` | 2026-02-24 | 2025-12-08 | Tense fix: "will only see" to "only see" |
| `guides/accessibility.mdx` | 2026-02-24 | 2026-01-23 | Tense fix: "will already know" to "already know" |
| `integrations/analytics/hotjar.mdx` | 2026-03-05 | 2026-03-04 | Brand casing fix: "HotJar" to "Hotjar" (translations already correct) |

### French (`fr/`)

| Page | English updated | Translation updated | Reason excluded |
|------|----------------|-------------------|-----------------|
| `advanced-support.mdx` | 2026-03-19 | 2026-03-12 | Heading capitalization fix: "Add-on" to "add-on" |
| `api-playground/complex-data-types.mdx` | 2026-03-19 | 2026-03-16 | Voice fix: "are displayed" to "display" |
| `guides/accessibility.mdx` | 2026-02-24 | 2026-01-23 | Tense fix: "will already know" to "already know" |
| `guides/content-types.mdx` | 2026-02-25 | 2026-02-24 | Word swap: "functionality" to "features" (French "fonctionnalités" covers both) |
| `guides/migrating-from-mdx.mdx` | 2026-02-24 | 2026-02-18 | Tense fixes: "will overwrite" to "overwrites", "will use" to "uses" |
| `guides/understand-your-audience.mdx` | 2026-02-26 | 2025-11-14 | Sentence restructure for active voice (meaning unchanged) |
| `migration-services/pro.mdx` | 2026-02-24 | 2026-02-20 | Simplification: "search functionality" to "search" (French already matches) |

### Chinese (`zh/`)

| Page | English updated | Translation updated | Reason excluded |
|------|----------------|-------------------|-----------------|
| `advanced-support.mdx` | 2026-03-19 | 2026-03-12 | Heading capitalization fix: "Add-on" to "add-on" |
| `ai/discord.mdx` | 2026-02-24 | 2026-01-30 | Tense fix: "will reply" to "replies" |
| `ai/markdown-export.mdx` | 2026-03-19 | 2026-03-18 | Wordiness fix: "pages that are optimized" to "pages optimized" |
| `components/banner.mdx` | 2026-03-19 | 2026-03-17 | Word swap: "dismisses" to "closes" (Chinese already uses "关闭"/close) |
| `components/view.mdx` | 2026-02-24 | 2025-12-08 | Tense fix: "will only see" to "only see" |
| `guides/accessibility.mdx` | 2026-02-24 | 2026-01-23 | Tense fix: "will already know" to "already know" |
| `guides/auth0.mdx` | 2026-02-24 | 2025-11-14 | Tense fixes: "will be able to" to "can", "will generate" to "generates" |

## Methodology

1. Compared last-commit timestamps for all 180 English MDX files against their `es/`, `fr/`, and `zh/` counterparts
2. Identified 18 file-language pairs where the English file was updated more recently
3. Inspected the full git diff for each candidate between the translation's last commit and the English file's last commit
4. Verified the source commits were all automated Vale style-fix PRs (#3693, #3717, #3770, #3823, #4036, #4697)
5. Cross-checked translated content to confirm translations already convey the correct meaning
