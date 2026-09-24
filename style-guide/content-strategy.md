# Content strategy

> **Outline for review.** Tags work the same as in [voice-and-tone.md](voice-and-tone.md).

Google's guide mostly covers sentences, not strategy, so most of this file is Mintlify-specific.

## Just enough docs

- Document what readers need to succeed, and nothing more. Too much content hides what people are looking for. `[existing: CLAUDE.md]`
- Don't accept edits made purely for tone, readability, or efficiency, and don't cover niche preference topics. `[existing: CONTRIBUTING.md]` `[needs Ethan: does this apply to internal authors too, or only outside contributors?]`

## Before you write

- Search for existing content first. Extend an existing page rather than create a new one, unless the new page serves a distinct task. `[existing: CLAUDE.md]`
- Duplicate content only for a deliberate reason. When the same fact is needed in more than one place, put it in a snippet. `[existing: CLAUDE.md; snippet part is new, needs Ethan]`
- Make the smallest change that solves the problem. `[existing: CLAUDE.md]`

## Where content goes

- Put new pages in the nav group that matches the user journey, such as Customize or Deploy. `[existing: CLAUDE.md]`
- Order content by how often readers need it, most common first. `[existing: CLAUDE.md, Cursor rules]`
- Help center vs guides vs feature pages: when does something become a help center article? `[needs Ethan]`

## Page structure

- Lead with context: what something is and why you'd use it, then how. `[existing: CLAUDE.md]`
- Prerequisites go at the start of procedural pages. `[existing: CLAUDE.md]`
- Offer one opinionated path. Only show alternatives when readers genuinely choose between them. `[existing: Cursor rules]`
- Include a verification step or expected result for major procedures. `[existing: Cursor rules]`

## Two audiences: web editor and CLI

- When a task can be done both ways, cover both. Use tabs, or separate sections if the steps diverge a lot. `[needs Ethan: which is the default or first tab?]`
- Don't assume Git knowledge in web editor paths. `[existing: CLAUDE.md]`

## Plan gating

- If a feature requires a paid plan, add a one-sentence `<Info>` at the top of the page: "X requires a [Pro or Enterprise plan](https://mintlify.com/pricing?ref=x)." `[existing: practice, memory]`
- Verify gating against the pricing page and the code before you add or remove a callout. The pricing table is the public source of truth. `[existing: memory]`

## Changes, moves, and deprecations

- When you move or rename a page, add a redirect in `redirects.json`, which `docs.json` pulls in through `$ref`. `[existing: Cursor rules, corrected path]`
- Recent redirect PRs, such as fb5b7608b, also add `/es/`, `/fr/`, and `/zh/` entries by hand. Should authors add locale redirects, or does the translation workflow handle them? `[needs Ethan]`
- The Cursor rules say "for 18 months." Do we ever remove redirects? `[needs Ethan]`
- The Cursor rules say "'New' tags for two weeks." Is this still practiced? `[needs Ethan]`
- Remove deprecated features rather than keeping "deprecated" callouts, except during an announced migration window. `[new, needs Ethan]`
- Update screenshots when the UI changes. `[existing: Cursor rules]`

## Changelog

- Is the changelog in scope for this guide, and does it have its own conventions (entry format, tense, linking to docs)? `[needs Ethan]`

## Translations

- Only edit English. `es/`, `fr/`, and `zh/` are generated after merge. `[existing: AGENTS.md, CLAUDE.md]`
