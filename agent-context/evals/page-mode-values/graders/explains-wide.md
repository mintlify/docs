---
type: llm
---

The response is about the `mode` frontmatter field on a Mintlify documentation page.

PASS if the response explains that `mode: wide` gives the page a wider content area, and does so by describing a layout change such as hiding or removing the right-hand table of contents / sidebar.
PASS even if the wording differs from that description, or the explanation is brief, as long as the layout effect is correct.
FAIL if the response describes `mode: wide` as something other than a page layout or width change, for example a theme setting, a navigation setting, or a build option.
FAIL if the response does not explain what `mode: wide` does at all.

Judge only the explanation of `mode: wide`. Ignore whether the list of other values is complete, and ignore formatting.
