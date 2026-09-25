# Style guide: open decisions and review items

Working file for building the style guide. Delete it before the PR merges.

## Where things stand (Sept 25, 2026)

- Branch: `style-guide`, forked from `fc8793926`, not pushed. Plan: `~/.claude/plans/i-want-to-add-ancient-pelican.md`.
- Commits:
  1. `4a94247b8`: scaffold `style-guide/README.md` and add `style-guide/` to `.mintignore`
  2. `7dc995488`: outline of `voice-and-tone.md`, `word-list.md`, `formatting-and-components.md`, `content-strategy.md`
  3. `fe743d81b`: pointers added to `.mintlify/AGENTS.md` and `CONTRIBUTING.md`
- Gate: the prose isn't written until you decide the items below.
- To resume: tell Claude "continue the style guide on the `style-guide` branch, see `style-guide/DECISIONS.md`," and answer by number.

## Decisions I need

Each item has my recommendation. Reply with "agree" or your call.

### Voice and tone

1. **"will."** The Cursor rules say "future tense for outcomes." Vale `Mintlify.Will` warns on every "will." Google allows it for things that genuinely happen later. English pages have about 12 uses.
   *Recommend:* follow Google, and keep the Vale rule as a warning.
2. **First person.** Vale warns on "we"/"our." About 30 pages use them.
   *Recommend:* follow Google. "We" is fine for Mintlify-the-company after naming it. Never use "I."
3. **Em dashes.** There are about 217 in English pages. Vale allows them (no spaces), but heavy use is an AI tell.
   *Options:* (a) follow Google, (b) at most one per paragraph and prefer commas or two sentences, (c) ban them in prose.
   *Recommend:* (b).
4. **AI-writing tells.** Keep a short list in `voice-and-tone.md`, or point to the `humanizer` skill?
   *Recommend:* keep a short list. The skill isn't available to every agent that reads this.

### Word list

5. **assistant**: lowercase "assistant," or "AI assistant" on first mention?
6. **agent**: "the agent," or "Mintlify agent" on first mention?
7. **automations vs workflows**: the docs directory says automations and the server says workflows.
   *Recommend:* "automations" in docs.
8. **project / deployment**: wait for the unmerged `docs/projects-terminology` branch to merge, then match it?
9. **preview deployment** vs "preview" vs "preview link"
10. **editor**: can "editor" alone replace "web editor" after first mention?
11. **"your docs" / "your site" / "your documentation site"**: pick one default.
12. **"users"** means the reader's audience, and "you" means the reader. Agree?
13. **New term entries** I added without a source. Confirm or fix each one:
    - `mint` in code format
    - OpenAPI
    - llms.txt
    - MCP server

### Formatting and components

14. **`keywords` frontmatter**: CLAUDE.md says required and the Cursor rules say optional. 266 of 320 pages have it.
    *Recommend:* required.
15. **`<Frame>`**: the Cursor rules say "all images," but about 110 of 150 images are framed.
    *Recommend:* frame screenshots only, not diagrams or logos.
16. **Light and dark screenshot variants**: required, optional, or not mentioned?
17. **Code examples**: CLAUDE.md says "simple, one option." The Cursor rules say "complete, runnable, error handling."
    *Recommend:* runnable and minimal, with realistic values. Include error handling only when it's the topic.
18. **Links as exits**: the Cursor rules say "each link is an exit, use sparingly" and suggest "Further reading" sections. Keep it?
19. **Callout meanings.** `<Info>` for plan gating is settled. Confirm or change the rest:
    - `<Note>`: skippable information
    - `<Tip>`: an optional better way
    - `<Warning>`: data loss, security, or irreversible actions
    - `<Check>`: only "you're done" confirmations
    - `<Danger>`: retire, and use `<Warning>` instead
20. **`<Badge>`**: 87 uses, mostly in reference content. What is it for?
21. **Other component rules.** Confirm:
    - `<Steps>` for procedures of three or more steps
    - `<Tabs>` only for parallel alternatives
    - `<Card>` only for navigation
    - `<Accordion>` for content most readers skip, never for required steps

### Content strategy

22. **CONTRIBUTING.md's "don't accept tone-only edits"** rule: does it apply to internal authors and agents, or only to outside contributors?
23. **Snippets**: when a fact is needed in several places, use a snippet instead of copying it. Agree?
24. **Help center vs guides vs feature pages**: when does something belong in the help center?
25. **Web editor vs CLI**: when a page covers both, which one comes first or is the default tab?
26. **Redirects**:
    - (a) Is "keep for 18 months" real, or do redirects stay forever?
    - (b) Should authors add the `/es/`, `/fr/`, and `/zh/` redirect entries by hand, like fb5b7608b did?
27. **"New" tags for two weeks** (from the Cursor rules): still practiced?
28. **Deprecations**: remove deprecated features instead of keeping callouts, except during an announced migration window?
29. **Changelog**: does it get its own conventions in this guide, or none for now?
30. **Translation exception**: the translation pass doesn't run on automation-opened PRs, so those PRs update `es/`, `fr/`, and `zh/` by hand. The guide will say "only edit English." Should it mention this exception, or leave it out because it's a temporary bug?

## Things to review

- **Outline files:** skim all four for rules you disagree with, not just the tagged ones. Anything tagged `[existing: ...]` came from current guidance but still needs your judgment.
- **`README.md` precedence rule:** this guide beats Google, and Vale is a subset. Is that the model you want?
- **File split:** four topic files plus a README. Would you rather have one long file? That's easier for agents to load in one read, but harder for people to navigate.
- **Page types:** templates are out of v1, as you decided. Confirm that's still the case.
- **Removals planned in the prose commit:** replace the writing rules in `.claude/CLAUDE.md` and `.cursor/rules/writing-standards.mdc` with pointers, keeping the context, pre-submit checklist, and "Do not" sections. Also, `.cursor/rules/component-reference.mdc` (329 lines) duplicates the public component docs. Delete it or leave it?
- **Correction to existing guidance:** the Cursor rules say redirects go in `docs.json`, but they're in `redirects.json`, which `docs.json` pulls in with `$ref`. The outline uses the correct path.

## Blocked

- **Admin MCP:** every `execute_code` call fails with "No target deployment for this request," even with `{ subdomain: 'mintlify' }`, while `list_deployments` works. Because of that, I can't yet:
  - list the automations whose prompts need the style guide line
  - confirm the `mintlify` deployment has no `contentDirectory` (if it has one, the sandbox's sparse checkout won't include root-level `style-guide/`)

  Options:
  - Fix the connection's default deployment.
  - Allow `checkout` followed by `discard_session`. That opens a throwaway branch on the docs repo.
  - Send me the list of automations yourself.

## Remaining steps after decisions

1. Write the prose, replacing the outline tags with short do/don't examples, and commit.
2. Replace the duplicated guidance in `.claude/CLAUDE.md` and the Cursor rules with pointers, and commit.
3. Delete this file. Run `mint broken-links`, run `vale` on any changed `.mdx`, and confirm `/style-guide/*` returns 404 in `mint dev`.
4. Push and open the PR.
5. After merge: show you the automation prompt diffs, and apply them only after you approve. Then archive `mintlify/styleguide` (yours to do).
