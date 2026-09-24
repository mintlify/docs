# Formatting and components

> **Outline for review.** Tags work the same as in [voice-and-tone.md](voice-and-tone.md).

Google's defaults apply: [headings](https://developers.google.com/style/headings), [lists](https://developers.google.com/style/lists), [procedures](https://developers.google.com/style/procedures), [code in text](https://developers.google.com/style/code-in-text), [UI elements](https://developers.google.com/style/ui-elements), [link text](https://developers.google.com/style/link-text), [images](https://developers.google.com/style/images). This file covers MDX and Mintlify specifics. For component syntax, see the public [components docs](../components/).

## Frontmatter

- Every page needs `title` and `description`. `[existing: CLAUDE.md, Cursor rules]`
- **Conflict:** CLAUDE.md requires `keywords`, while the Cursor rules call it optional. In practice, 266 of 320 English pages have it. Proposal: required. `[needs Ethan]`
- `sidebarTitle` when the title is too long for the sidebar. `[existing: Cursor rules]`
- Icons come only from [Lucide](https://lucide.dev). `[existing: CLAUDE.md]`

## Headings

- Sentence case, no ending punctuation. `[existing: Vale Mintlify.Headings, Mintlify.HeadingPunctuation]`
- Start at H2. H1 is the page title. `[existing: Cursor rules]`
- Code block titles also use sentence case. `[existing: CLAUDE.md]`

## Text formatting

- Use bold for UI elements the reader interacts with: "Select **Save**." `[existing: Cursor rules, matches Google]`
- Only use bold or italics for emphasis when it helps comprehension. Never use emoji. `[existing: CLAUDE.md]`
- Use code format for filenames, commands, config keys, and values. `[existing: Cursor rules]`
- Use `<kbd>` for keyboard shortcuts: <kbd>Cmd</kbd> + <kbd>K</kbd>. `[existing: Cursor rules]`
- Property descriptions end with a period. `[existing: CLAUDE.md]`
- Scope qualifiers go at the start of a description: "For Font Awesome icons only: ..." `[existing: CLAUDE.md]`

## Links

- Internal links use root-relative paths, like `/components/accordions`. Never use absolute mintlify.com URLs for internal links. `[existing: CLAUDE.md]`
- Link text describes where the link goes. Never use "click here." `[existing: Cursor rules, Google]`
- Don't put code formatting inside link text. `[existing: Cursor rules]`
- The Cursor rules say "Each link is an exit opportunity, use sparingly" and suggest "Further reading" sections. Google has no equivalent rule. Keep it? `[needs Ethan]`
- Plan links go to pricing with a `?ref=<feature>` parameter. `[existing: practice across 11 plan callouts]`

## Code blocks

- Every code block has a language tag. `[existing: CLAUDE.md]`
- Add a filename title when the reader needs to know which file the code goes in, such as ` ```json docs.json `. `[existing: Cursor rules]`
- **Conflict:** CLAUDE.md says "simple, one option when one will do," while the Cursor rules say "complete, runnable, with error handling and realistic data." Proposal: examples are runnable and minimal, with realistic values, and include error handling only when error handling is the topic. `[needs Ethan]`
- Never put real API keys in examples. `[existing: Cursor rules]`

## Images

- Every image needs descriptive alt text. `[existing: CLAUDE.md]`
- Filenames use kebab-case and go under `images/<feature>/`. `[existing: Cursor rules]`
- **Conflict:** the Cursor rules say "wrap all images in `<Frame>`." In practice, about 110 of 150 images are framed. Proposal: frame screenshots, not diagrams or logos. `[needs Ethan]`
- Screenshots are PNG. Use colored rectangles for emphasis, never blur or overlays. `[existing: Cursor rules]`
- `[needs Ethan]`: Do screenshots need light and dark variants?

## Callouts

Google defines Note, Caution, Warning, and Success ([notices](https://developers.google.com/style/notices)). Our components are different, so here is what each one means for us. Current English usage: Note 165, Tip 87, Info 73, Warning 68, Check 8, Danger 2.

| Component | Use for | Source |
| --- | --- | --- |
| `<Info>` | Plan and availability requirements: "X requires a Pro or Enterprise plan." One sentence, with a pricing link. | `[existing: practice, memory]` |
| `<Note>` | Useful information the reader can skip without failing | `[Google: Note]` `[needs Ethan]` |
| `<Tip>` | An optional better way to do something | `[needs Ethan]` |
| `<Warning>` | Risk of data loss, security issues, or irreversible actions | `[Google: Warning]` `[needs Ethan]` |
| `<Check>` / `<Danger>` | Rarely used. Proposal: use `<Check>` only for "you're done" confirmations; use `<Warning>` instead of `<Danger>`. | `[needs Ethan]` |

- Use callouts sparingly. Never put two callouts back to back. `[Google]`

## Other components

- `<Steps>` for procedures with three or more steps. For shorter procedures, use a numbered list. `[needs Ethan]`
- `<Tabs>` for parallel alternatives the reader picks one of, such as web editor vs CLI or package managers. Don't use tabs for sequential content. `[needs Ethan]`
- `<Card>` and `<CardGroup>` for navigation to other pages, not for body content. `[needs Ethan]`
- `<Accordion>` for content most readers skip, such as troubleshooting or edge cases. Never for required steps. `[needs Ethan]`
- `<Badge>` is used 87 times, mostly in reference content. Its purpose needs a definition. `[needs Ethan]`
- Component introductions start with "Use [component] to...," not "The [component] component...". `[existing: CLAUDE.md]`
