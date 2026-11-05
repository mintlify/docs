# Voice and tone

Google's defaults apply: [voice](https://developers.google.com/style/voice), [tone](https://developers.google.com/style/tone), [second person](https://developers.google.com/style/person), [active voice](https://developers.google.com/style/voice), [present tense](https://developers.google.com/style/tense).

## Who we're writing for

- Mixed technical ability. Some readers work locally in the CLI and Git with their preferred coding agents, while others only use the editor in their browser or the desktop app and never see Git.
- Readers and agents both consume every page, so write for scanning and literal parsing.
- Goal: just enough information for the reader to succeed and get back to their task.

## How we sound

- Like a helpful coworker explaining something: clear and direct. Friendly and supportive, but not robotic.
- Meaning over grammar. You can break a rule, such as active voice, when following it makes the sentence worse.

## Tense and "will"

- Use present tense by default. Use "will" rarely for events that only occur later.

## Referring to Mintlify

- Only rarely use "we" to refer to Mintlify after already naming the company earlier in the page.
- Don't put "Mintlify" in a feature name when the context is clear: "the assistant," not "the Mintlify assistant."
- Use "Mintlify" in a feature name when readers need to tell it apart from similar tools, such as "the Mintlify agent" on a page that also covers coding agents.
- Make the reader or their site the subject rather than Mintlify. Write "After you push changes, your site deploys," not "Mintlify deploys your site."

## Clear sentences

Agent drafts often break these rules, and Vale can't catch them, so check every sentence for them when you review a page.

### Don't give human verbs to things that aren't human

A file, setting, field, or path can't say, know, decide, or want anything. Name what actually happens instead.

- Instead of: "Each project's own setting decides what happens to it."
- Write: "When the shared balance runs out, projects with overages on keep running. Projects with overages off lose their credit-powered features."

This rule doesn't apply to AI features that really do act, such as "the agent opens a pull request." Conventional technical verbs are fine too, such as "the API returns" or "the command accepts."

### Write conditions as "if" clauses

When a sentence applies only in some cases, put the case in an "if" clause. Don't hide the condition in a long subject.

- Instead of: "A page that isn't in the navigation is still public."
- Write: "If a page isn't in the navigation, anyone with its URL can still open it."

A "that" clause is fine when it identifies which thing you mean rather than stating a condition: "Select the group that contains the page."

### Make sentences unambiguous

Many words can be a noun or a verb, such as group, link, change, update, or list. When one of these words could be interpreted in multiple ways, readers may pick the wrong one and misunderstand or reread. The fix is usually a small word, such as "the," "that," or "to," that shorter drafts drop.

| Instead of | Write |
| --- | --- |
| Navigation groups pages into sections. ("Navigation groups" reads as the subject, and "pages" as the verb) | In the navigation, groups organize pages into sections. |
| Select the page redirects apply to. (Reads as "select the page redirects") | Select the page that the redirects apply to. |

### Lead with the behavior, not a label for it

Words like "exception," "special case," and "caveat" warn the reader that something is different without saying what's different. Describe the behavior.

- Instead of: "Hidden pages are the exception."
- Write: "Hidden pages don't appear in the navigation, but anyone with the URL can open them."

### Name what actually happens

Say which tool or person does what, and what the result is. An abstract phrase can hide that the writer didn't know how the feature works.

- Instead of: "Your docs are validated before deployment."
- Write: "`mint validate` checks your pages, navigation, and OpenAPI specs, then runs a strict build."

### Say what a qualifier refers to

"Default," "built-in," "standard," and "underlying" need the thing they refer to: a default for what? Name it or describe it directly.

- Instead of: "If you don't set `appearance.default`, the default applies."
- Write: "If you don't set `appearance.default`, your site matches the reader's operating system setting."

### Keep pronouns close to what they refer to

If the reader has to look back to work out what "it" or "they" means, repeat the noun.

- Instead of: "Add the snippet to the page, then check the preview to confirm it renders."
- Write: "Add the snippet to the page, then check the preview to confirm the snippet renders."

### Give every transitive verb its object

Verbs like create, send, return, sync, and apply need an object that says what's created, sent, returned, synced, or applied. Objects often go missing when someone trims the end of a long sentence, so read the second half of long sentences on their own.

- Instead of: "`mint broken-links` checks every page and reports."
- Write: "`mint broken-links` checks every page and reports each broken link it finds."

## Phrases to cut

Vale flags these as suggestions with `.vale/styles/Mintlify/CutPhrases.yml`. Keep the two lists in sync.

- Promotional: "rich," "breathtaking," "seamless," "powerful," "stands as a testament," "plays a vital role."
- Editorializing: "it's important to note," "this article will," "in conclusion."
- Filler transitions: "moreover," "furthermore," "additionally."
- Vague attribution: "experts say," "industry reports suggest." Cite a source or cut it.
- Undue emphasis on routine things.
- Exclamation points and slang.

## AI-writing tells

A lot of our first drafts come from agents, so reviewers should look for these specifically:

- Grouping things in threes when the content doesn't need it
- Negative parallelisms: "It's not X, it's Y."
- Trailing "-ing" clauses that add no meaning: "..., ensuring a smooth experience."
- Summarizing sentences at the end of a section that restate what the reader just read
- Bolded lead-ins on every bullet

## Em dashes

- You can use em dashes. They are helpful punctuation. Prefer commas or two sentences though.
- Do not put spaces around em dashes.
