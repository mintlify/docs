# Mintlify docs style guide

> **Status: outline for review.** Items tagged `[needs Ethan]` are open decisions. Source tags get removed when this is written as prose.

This guide is for anyone writing or editing content in this repo, people and agents alike. It covers the docs site: pages, the changelog, and help center articles. It does not cover product UI copy or marketing.

## How to use this guide

1. Follow the [Google developer documentation style guide](https://developers.google.com/style) for anything this guide doesn't cover.
2. When this guide and Google's disagree, this guide wins. Every rule here is either a Mintlify-specific decision or a place where we deviate from Google.
3. [Vale](../.vale.ini) enforces a subset of these rules on `.mdx` files. A clean Vale run doesn't mean a page follows the guide.

## Files

| File | Covers |
| --- | --- |
| [voice-and-tone.md](voice-and-tone.md) | How Mintlify docs sound, phrases to cut, AI-writing tells |
| [word-list.md](word-list.md) | Product terms, capitalization, preferred and avoided words |
| [formatting-and-components.md](formatting-and-components.md) | Markdown conventions and when to use each Mintlify component |
| [content-strategy.md](content-strategy.md) | What to document, where it goes, and how to keep it maintainable |

## For agents

- Read this file, then the files relevant to your change.
- Only edit English content. Translations in `es/`, `fr/`, and `zh/` are generated after merge.
- Before opening a PR, run the checks in [.claude/CLAUDE.md](../.claude/CLAUDE.md#before-submitting-work).

## Changing the guide

Open a PR that edits the relevant file. If a rule should be enforced, update or add the matching Vale rule in `.vale/styles/Mintlify/` in the same PR. Narrow a Vale rule rather than rewriting correct prose to satisfy it.

Portions adapted from the Google developer documentation style guide are used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
