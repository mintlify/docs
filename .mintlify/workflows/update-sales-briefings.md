---
name: "Update sales briefings"
on:
  push:
    - repo: "mintlify/server"
      branch: main
    - repo: "mintlify/mint"
      branch: main
context:
  - repo: "mintlify/docs"
automerge: false
---

Review the diff from the last merged PR in the triggering repository. Check if any changes affect features covered in the sales briefing pages under `sales-briefings/`.

For each affected briefing, update:

- **What it is** - If functionality changed, update the description
- **What's included / what's NOT included** - If capabilities were added or removed
- **Typical use cases** - If new use cases are now possible
- **How it works** - If the setup process, configuration, or behavior changed
- **Objection handling** - If new limitations were removed or new ones introduced

Do not change:
- Video links or embeds (flag in the PR body if the demo video may be outdated due to UI changes)
- Customer examples section
- Positioning and talk track (unless a fundamental change in the product warrants it)

Success criteria: A sales rep reading the briefing gets an accurate picture of the current state of the feature. No outdated capabilities, no missing new functionality.

## Important

- Only update briefings where the product actually changed. If no relevant changes were made, do nothing.
- If changes would invalidate a demo video (UI redesign, removed screens, renamed features), flag it clearly in the PR body so the team knows to re-record.
- Keep language simple and non-technical. The audience is account executives, not engineers.
- Do not include private repository file paths, directory structures, code snippets, or any other internal implementation details in PR titles, descriptions, or commit messages.
- Write a brief summary of what changed and why the briefing was updated in the PR description.
