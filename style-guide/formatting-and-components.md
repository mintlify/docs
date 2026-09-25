# Formatting and components

Google's defaults apply: [headings](https://developers.google.com/style/headings), [lists](https://developers.google.com/style/lists), [procedures](https://developers.google.com/style/procedures), [code in text](https://developers.google.com/style/code-in-text), [UI elements](https://developers.google.com/style/ui-elements), [link text](https://developers.google.com/style/link-text), [images](https://developers.google.com/style/images). This file covers MDX and Mintlify specifics. For component syntax, see the public [components docs](../components/).

## Frontmatter

- Every page needs `title`, `description`, and `keywords`.
  - Titles use sentence case
  - Descriptions populate search results, so they must help readers determine if a page will solve the task they're working on.
  - Keywords are used to improve search. Any words in the title are already keywords.
- Optional: `sidebarTitle` when the title is too long for the sidebar.
- Icons come only from [Lucide](https://lucide.dev).

## Headings

- Sentence case, no ending punctuation.
- Start at H2. H1 is the page title.

## Text formatting

- Use bold for UI elements the reader interacts with: "Click **Save**."
- Only use bold or italics for emphasis when it helps with comprehension. Never use emoji.
- Use code format for filenames, commands, config keys, and values.
- Use `<kbd>` for keyboard shortcuts: <kbd>Cmd</kbd> + <kbd>K</kbd>.
- Property descriptions end with a period.
- Scope qualifiers go at the start of a description: "For Font Awesome icons only: ..."

## Links

- Internal links use root-relative paths, like `/components/accordions`. Never use absolute mintlify.com URLs for internal links.
- Link text describes where the link goes. Never use "click here" or other vague link text.
- Each link is a chance to distract people from the content they're reading. Include links thoughtfully and only when it adds value to the task a user is working on.
- Don't put code formatting inside link text.
- Plan links go to pricing with a `?ref=<feature>` parameter.

## Code blocks

- Every code block must have a language tag.
- Code block headings use sentence case.
- Add a filename title when the reader needs to know which file the code goes in, such as ` ```json docs.json `.
- Examples are runnable and minimal, with realistic values, and include error handling only when relevant.
- Never put real API keys in examples.

## Images

- Every image needs descriptive alt text.
- Filenames use kebab-case and go under `images/<feature>/*`.
- Frame screenshots, not diagrams or logos.
- Screenshots are PNG. Use colored rectangles for emphasis, never blur or overlays.
  - For screenshots of the Mintlify UI, include light and dark variants.

## Callouts

Use callouts sparingly. Never put multiple callouts back-to-back.

| Component | Use for |
| --- | --- |
| `<Info>` | Plan and availability requirements: "X requires a Pro or Enterprise plan." One sentence, with a pricing link. |
| `<Note>` | Useful information the reader can skip without failing |
| `<Tip>` | A best practice or optional way to do something |
| `<Warning>` | Risk of data loss, security issues, or irreversible actions |
| `<Check>` | Use to signal a procedure or task is done with a confirmation message |

## Other components

- `<Steps>` for sequential procedures.
- `<Tabs>` for parallel alternatives the reader picks one of, such as web editor vs CLI or package managers.
- `<Card>` and `<CardGroup>` for emphasizing links to other pages with context.
- `<Accordion>` for content most readers skip, such as troubleshooting or edge cases. Never for required steps.
