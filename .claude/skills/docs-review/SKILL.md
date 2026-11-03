---
name: docs-review
description: Review and edit Mintlify documentation against the house style guide in style-guide/. Use when reviewing a docs diff or pull request, before handing back a draft you wrote, or when asked to check a page for style. Covers the order to review in, the checks Vale can't do, and how to report changes.
---

# Docs review

`style-guide/` holds the rules for this repo's docs. This skill doesn't repeat them. It describes the order to apply them in.

Before you review anything, read `style-guide/README.md` and every file it lists. Don't work from memory of the guide or a summary of it.

## Check facts against the product

Check every fact against the product, not against other docs pages, because other pages can be out of date:

- **UI steps:** Take button, tab, and field names and the order of screens from the product or its frontend source.
- **Behavior claims:** Read the code path before you describe what the product does. If another docs page contradicts the code, find out why before you edit either page.

If you can't verify a fact, list it under areas of uncertainty in your report. Never guess.

## Review order

Review your own drafts the same way you review anyone else's. Cut first, then check the structure, then the sentences. Rewriting a sentence is wasted work if the sentence shouldn't be on the page.

1. **Lint.** Run `vale` on the changed files, `mint broken-links`, and `mint a11y`. A clean Vale run doesn't mean the page follows the guide.
2. **Cut what the reader won't act on.** Read the page one paragraph at a time and apply "Leave out what the reader won't act on" in `style-guide/content-strategy.md`. Apply it to existing content, other people's content, and your own draft. No other step catches this, and restructuring a sentence that should be cut makes the page longer.
3. **Check the structure** against `style-guide/content-strategy.md`: page structure, prerequisites, where content goes, and duplication.
4. **Check every sentence** against `style-guide/voice-and-tone.md`. Take the "Clear sentences" rules one heading at a time, and check every sentence on the page against that rule before you move to the next one. Then check "Phrases to cut" and "AI-writing tells."
5. **Check formatting and components** against `style-guide/formatting-and-components.md` and terms against `style-guide/word-list.md`.
6. **Apply the findings.** If the person you're working with wrote or edited prose in this conversation, don't change their sentences. Report those findings and ask once whether to apply them.
7. **Review the edited page again** from the top, steps 1 to 5. Your edits create new problems. For example, turning a paragraph into a list can leave several short paragraphs in a row.

Before you hand the page back, check it for every mistake you've already been corrected on, including corrections earlier in the conversation.

## Report

List one change per line, grouped by file:

- The location as `path/to/file.mdx:12`.
- The rule the change fixes.
- The text before and after the change, or "cut" for a step 2 finding.

Include the fixes from step 7, then list areas of uncertainty.

## When Vale is wrong

Narrow or fix the Vale rule in `.vale/styles/Mintlify/` rather than rewriting correct prose to satisfy it. To turn off a rule for one line, wrap the line in `{/* vale Mintlify.RuleName = NO */}` and `{/* vale Mintlify.RuleName = YES */}`. Never turn off a rule for a whole page to hide problems.
