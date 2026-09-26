# Mintlify docs style guide

This guide is for people and agents writing or editing content in this repo. It covers the docs site: pages, the changelog, and help center articles. It does not explicitly apply to product UI copy or marketing content, but there should be consistency between platforms.

## How to use this guide

1. Defer to the [Google developer documentation style guide](https://developers.google.com/style) for anything this guide doesn't address.
2. When this guide and Google's disagree, this guide wins. Every rule here is a Mintlify-specific decision.
3. [Vale](../.vale.ini) enforces a subset of these rules on `.mdx` files, but a clean Vale run doesn't mean a page follows the guide.

## Files

| File | Purpose |
| --- | --- |
| [voice-and-tone.md](voice-and-tone.md) | How to write in the Mintlify docs style |
| [word-list.md](word-list.md) | Product terms, capitalization, preferred and avoided words |
| [formatting-and-components.md](formatting-and-components.md) | Markdown conventions and when to use each Mintlify component |
| [content-strategy.md](content-strategy.md) | What to document, where it goes, and how to keep it maintainable |

## Changing the guide

Open a PR that edits the relevant file. If a rule should be enforced, update or add the matching Vale rule in `.vale/styles/Mintlify/` in the same PR. Narrow a Vale rule rather than rewrite correct prose to satisfy a rule.

Portions adapted from the Google developer documentation style guide are used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
