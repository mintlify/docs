# Site building and migration

## Building out a site's content

When you generate or rebuild a site or a section:

- Size research to what you were given. With no sources, write a short starter set (6 to 8 pages of 150 to 300 words) with visible placeholders for product-specific facts instead of researching the web. With a named product, URL, repository or spec, read enough of it to get the real facts; do not crawl everything.
- Write `docs.json` first with the full planned `navigation`, then write every listed page once, with its final content, at exactly the listed path. A listed page with no content shows as a placeholder.
- Reuse `index` as the introduction and rewrite `quickstart`; remove starter pages you don't keep.
- When there is an OpenAPI or AsyncAPI spec, reference it in navigation (see `reference/api-docs.md`) instead of hand-writing endpoint pages.
- Build the landing page from components (`<Card>`, `<Columns>`, `<Steps>`), not `"mode": "custom"`, raw HTML or Tailwind.
- Do not publish as part of generation. End with what you created, the assumptions you made, and what the user should review.

Match the structure to the kind of site:

- **Developer docs**: get started (introduction, a quickstart to a first successful call, authentication), core concepts, task guides, SDK and CLI pages, and reference (errors, rate limits, webhooks, changelog). The API reference goes in its own tab, generated from the spec. Every guide shows a complete request and response.
- **Help center**: organized around customer problems, not features: get started, account and billing, one group per product area named as the UI names it, integrations, troubleshooting with symptom titles, FAQ, contact. One question per article, titled in the customer's words and answered in the first paragraph.
- **Knowledge base** (internal team wiki): tabs per department or audience, each starting with an overview page that names its owner, then onboarding, policies, runbooks and how-tos. Name real systems, channels and owners, or placeholders for them.
- **Product guide** (end-user docs): one group per product area in the order users meet them, each with an overview and task pages ("Create a project") that go from goal to result with `<Steps>` and bold UI labels.

## Porting existing docs

When porting existing docs from any source, including uploads and exports, and after following the platform guide in SKILL.md:

- Preserve the source wording and structure. Change only what the format requires: frontmatter, MDX and components, links, image paths and file layout. Rewrite or restructure only when the user asks.
- Mirror the source's sections and page granularity.
- Port every file in the requested scope, in batches if needed. If you stop, name the blocker and the files not ported.
