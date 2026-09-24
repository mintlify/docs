# Voice and tone

> **Outline for review.** Tags: `[existing: X]` means the rule comes from current guidance; `[Google: link]` means we follow or deviate from Google; `[needs Ethan]` means it's an open decision.

Google's defaults apply: [voice](https://developers.google.com/style/voice), [tone](https://developers.google.com/style/tone), [second person](https://developers.google.com/style/person), [active voice](https://developers.google.com/style/voice), [present tense](https://developers.google.com/style/tense). This file covers only what's specific to Mintlify.

## Who we're writing for

- Mixed technical ability. Some readers live in the CLI and Git, while others only use the web editor and never see Git. `[existing: CLAUDE.md, Cursor rules]`
- Readers and agents both consume every page, so write for scanning and literal parsing. `[existing: CONTRIBUTING.md]`
- Goal: just enough information for the reader to succeed and get back to the product. `[existing: CLAUDE.md]`

## How we sound

- Like a helpful coworker explaining something: clear and direct, but not robotic. `[existing: Cursor rules]`
- Meaning over grammar. You can break a rule, such as active voice, when following it makes the sentence worse. `[existing: CONTRIBUTING.md]`

## Tense and "will"

- **Conflict:** the Cursor rules say "future tense for outcomes." Vale `Mintlify.Will` warns on every "will." Google allows "will" for actions that happen later ([tense](https://developers.google.com/style/tense)). Current docs have about 12 uses.
- Proposal: follow Google. Use present tense by default, and "will" only for something that actually happens later. Narrow or keep `Mintlify.Will` as a warning. `[needs Ethan]`

## First person

- Vale `Mintlify.FirstPerson` warns on "we" and "our." About 30 English pages use them.
- Proposal: follow Google ([pronouns](https://developers.google.com/style/pronouns)). Use "we" only for Mintlify-the-company after naming it, such as "Mintlify stores... We delete...". Never use "I." `[needs Ethan]`

## Referring to Mintlify

- Don't put "Mintlify" in a feature name when the context is clear: "the assistant," not "the Mintlify assistant." `[existing: Cursor rules]`
- Make the reader or their site the subject rather than Mintlify. Write "After you push changes, your site deploys," not "Mintlify deploys your site." `[existing: Cursor rules, with "will" removed]`

## Phrases to cut

- Promotional: "rich," "breathtaking," "seamless," "powerful," "stands as a testament," "plays a vital role." `[existing: CLAUDE.md, Cursor rules]`
- Editorializing: "it's important to note," "this article will," "in conclusion." `[existing: CLAUDE.md]`
- Filler transitions: "moreover," "furthermore," "additionally." `[existing: CLAUDE.md]`
- Vague attribution: "experts say," "industry reports suggest." Cite a source or cut it. `[existing: Cursor rules]`
- Undue emphasis on routine things. `[existing: CLAUDE.md]`
- Exclamation points and slang. `[existing: Vale Mintlify.Exclamation, Mintlify.Slang]`

## AI-writing tells

A lot of our first drafts come from agents, so reviewers should look for these specifically:

- Grouping things in threes when the content doesn't need it
- Negative parallelisms: "It's not X, it's Y."
- Trailing "-ing" clauses that add no meaning: "..., ensuring a smooth experience."
- Summarizing sentences at the end of a section that restate what the reader just read
- Bolded lead-ins on every bullet
- `[new, needs Ethan]`: Keep this list here, or point to the `humanizer` skill as the reference?

## Em dashes

- Vale `Mintlify.EmDash` allows em dashes without spaces, which matches [Google](https://developers.google.com/style/dashes). English pages have about 217 em dashes.
- Heavy em dash use is a common AI-writing tell. Options:
  - (a) Follow Google as-is.
  - (b) Prefer commas, parentheses, or two sentences, and allow at most one em dash per paragraph.
  - (c) Ban them in prose.
- `[needs Ethan]`
