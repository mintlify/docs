# Vale style audit notes

Last audited: February 2026

## Summary

A comprehensive Vale style audit was performed on all MDX files (excluding `es/`, `fr/`, `zh/` language directories and `changelog.mdx`). The documentation is in excellent compliance with the style guide.

## Findings

### No auto-fixable errors found

All error-level rule violations identified were:
- Inside code blocks (intentionally demonstrating syntax)
- Technical references to literal string values where applying the rule would change meaning

### Items requiring human review

The following items were flagged by Vale rules but require editorial judgment:

#### Quotes.yml violations (error level)

These instances have periods outside quotation marks, but the quoted text represents literal values (not prose), so moving punctuation inside would incorrectly suggest the values include periods:

| File | Line | Context |
|------|------|---------|
| `guides/seo.mdx` | 26 | `"diagram".` - Alt text example |
| `ai/assistant.mdx` | 128-129 | `"workspace"`, `"API key"` - Terminology preferences |
| `ai/model-context-protocol.mdx` | 167, 269 | `"Open MCP settings".` - UI instruction |
| `customize/fonts.mdx` | 102 | `"Playfair Display".` - Font family name |
| `editor/configurations.mdx` | 85 | `"Search or ask...".` - Default placeholder text |
| `organize/settings.mdx` | 122 | `"Playfair Display".` - Font family name |

**Recommendation**: Leave as-is. American English style rules about punctuation inside quotes apply to prose quotations, not technical references to literal string values.

#### Exclamation.yml violations (error level)

All exclamation points found are in code block examples demonstrating banner content:

| File | Lines | Context |
|------|-------|---------|
| `components/banner.mdx` | 14, 59, 72, 85 | Banner JSON examples |
| `create/code.mdx` | 414, 424 | Code wrap examples |
| `create/reusable-snippets.mdx` | 35 | Snippet content example |
| `organize/navigation.mdx` | 617, 630 | Language banner examples |
| `organize/settings.mdx` | 631 | Banner config example |

**Recommendation**: Leave as-is. These are intentional examples showing realistic banner content.

## Rules with no violations

The following error-level rules had zero violations:
- AMPM.yml - AM/PM formatting
- DateFormat.yml - Date formats
- EmDash.yml - Dash spacing
- Latin.yml - e.g./i.e. usage
- LyHyphens.yml - Adverb hyphens
- OptionalPlurals.yml - (s) constructions
- Ordinal.yml - Ordinal numbers
- Periods.yml - Acronym periods
- Slang.yml - Internet slang
- Spacing.yml - Sentence spacing
- Units.yml - Number-unit spacing
