# Site kinds

Patterns for the four common kinds of docs site. When you build or substantially restructure a site, classify it as one of these and follow its information architecture, `docs.json` shape, page types and article structure. For a few pages inside an existing site, follow the site's own conventions first and use these only to fill gaps.

## Developer docs and API reference

Readers are developers integrating a product: they want a working call in minutes, then a trustworthy reference. Every claim must be grounded in the source (repo, spec, or the product's real docs); never invent endpoints, parameters, flags, or payloads.

### Information architecture

Two tabs when there is an API: **Documentation** and **API Reference** (add **SDKs** or **CLI** tabs only for large surfaces). Single-tab groups for libraries and CLIs.

Documentation tab, in this order:
1. **Get started** — introduction (what it is, who it's for), quickstart to the first successful call or run (install → auth → first request → what you get back), authentication.
2. **Core concepts** — the 3 to 6 nouns a developer must understand (resources, environments, webhooks, rate limits, errors), one page each.
3. **Guides** — task-oriented walkthroughs by use case ("Accept a payment", "Sync users"), each ending in a working result.
4. **SDKs / CLI** — install, initialize, idiomatic example per language; command reference for CLIs.
5. **Reference** — errors and status codes, rate limits, webhooks/event catalog, changelog, migration guides.

API Reference tab: generated from the OpenAPI/AsyncAPI spec whenever one exists (`"openapi": "<path or url>"` on the group), grouped by resource; hand-write only an "Overview" (base URL, auth, versioning, pagination, idempotency, errors) when no spec exists, and mark it as needing a spec.

### docs.json shape

```json
{
  "theme": "sequoia",
  "navigation": {
    "tabs": [
      {
        "tab": "Documentation",
        "groups": [
          { "group": "Get started", "pages": ["index", "quickstart", "authentication"] },
          { "group": "Core concepts", "pages": ["concepts/resources", "concepts/webhooks", "concepts/errors"] },
          { "group": "Guides", "pages": ["guides/first-integration", "guides/webhooks"] },
          { "group": "SDKs", "pages": ["sdks/node", "sdks/python"] }
        ]
      },
      {
        "tab": "API Reference",
        "groups": [
          { "group": "Overview", "pages": ["api-reference/introduction"] },
          { "group": "Endpoints", "openapi": "openapi.json" }
        ]
      }
    ]
  }
}
```

- Themes: `sequoia` or `luma` for API-heavy products, `palm` or `aspen` for infra/dev tools.
- When a spec is available in uploads or the repo, reference it with `openapi` instead of hand-writing endpoint pages.

### Page types

- **Quickstart**: prerequisites, install, get credentials, one complete request with real headers and a real response, then "next steps". Copy-pasteable, tested against the source.
- **Authentication**: how to get a key, where it goes (header/query), scopes, rotation, environment differences.
- **Concept page**: definition, why it exists, how it behaves (limits, lifecycle), one minimal example, links to the endpoints/guides that use it.
- **Guide**: goal, prerequisites, `<Steps>` with a code block per step (`<CodeGroup>` for multiple languages), the expected result, troubleshooting notes.
- **SDK page**: install, init/config, 3 to 5 idiomatic examples for the most common tasks, error handling, links to reference.
- **Errors reference**: table of codes → meaning → what to do; retry guidance.
- **Changelog**: dated entries, newest first, breaking changes flagged.

### Article shape

- Code first: every guide and quickstart shows a complete request and response; language tags on all blocks; `<CodeGroup>` for multi-language.
- Parameters and fields in tables or `<ParamField>` / `<ResponseField>` when writing reference by hand.
- Second person, sentence case; state exact mechanics (status codes, header names, defaults, limits) instead of vague claims.
- Cross-link concepts ↔ guides ↔ reference.

### Sizing

Fast path (no sources): index, quickstart, authentication, one concept page, one guide, errors reference, plus an API Reference overview marked "add your OpenAPI spec". Full build with sources: 20 to 60 pages, endpoints from the spec.

### Anti-patterns

Endpoints written by hand when a spec exists; quickstarts without a runnable request; concept pages with no example; marketing tone; documenting internal architecture, CI, or infra that integrators never touch.

## Help center

A help center exists to deflect support tickets: a customer arrives with a problem, in their own words, and needs the answer in under a minute. Two readers consume every page: the customer skimming, and the AI assistant retrieving a self-contained chunk. Write for both.

### Information architecture

Organize around customer problems and tasks, never around your feature list or org chart. Start from the questions people actually ask (tickets, chats, search terms) and group them.

Top-level categories (4 to 8, in roughly this order; drop what does not apply):
1. **Get started** — account creation, first setup, "your first X in 5 minutes".
2. **Account & billing** — plans and pricing, upgrade/downgrade, invoices and receipts, payment methods, team members and roles, security (password, 2FA, SSO), cancel or delete account.
3. **Using <product>** — one group per major feature area, named the way the UI names it. Split into sub-groups only when a group would exceed ~8 articles.
4. **Integrations** — one article per connector: connect, what syncs, common problems.
5. **Troubleshooting** — symptom-titled articles ("Can't sign in", "Sync stopped working", "Why was my payment declined?").
6. **FAQ** — 8 to 15 short questions with standalone answers, linking to full articles.
7. **Contact & policies** — contact support, status page, data export/deletion, terms and privacy links.

Use tabs only for genuinely separate audiences or products ("For owners" / "For cleaners", "Mobile app" / "Web app") or to add a "What's new" changelog tab. Never a tab per category.

### docs.json shape

```json
{
  "theme": "mint",
  "styling": { "eyebrows": "breadcrumbs" },
  "navigation": {
    "directory": "card",
    "groups": [
      {
        "group": "Get started",
        "icon": "rocket",
        "expanded": true,
        "root": "getting-started/index",
        "pages": ["getting-started/quickstart", "getting-started/create-account"]
      },
      {
        "group": "Account & billing",
        "icon": "credit-card",
        "root": "account/index",
        "pages": ["account/plans", "account/invoices", "account/team", "account/security"]
      },
      {
        "group": "Troubleshooting",
        "icon": "wrench",
        "root": "troubleshooting/index",
        "pages": ["troubleshooting/cant-sign-in", "troubleshooting/sync-issues"]
      }
    ]
  },
  "navbar": {
    "primary": { "type": "button", "label": "Contact support", "href": "mailto:support@example.com" }
  }
}
```

- `styling.eyebrows: "breadcrumbs"` and `navigation.directory: "card"` turn every category root into a browsable directory page with cards; `root` is the category landing page (`<dir>/index`), `icon` and `expanded` make categories scannable in the sidebar.
- Themes that suit help centers: `mint`, `almond`, `maple`, `linden`. Keep the brand colors.
- Add the "Contact support" navbar button whenever a support email or URL is known (a placeholder mailto is fine and should be called out in the summary).
- Every group listed in docs.json must have its `root` page written.

### Landing page (index.mdx)

A hub, not an article. Search is built in (⌘K), so do not build a search UI or use `mode: custom` or raw HTML.
1. Frontmatter title "Help Center" (or "<Product> Help Center"), description one sentence.
2. One-line greeting: what this help center covers.
3. `<CardGroup cols={3}>` with one `<Card>` per category: `icon`, title = category name, one-line description, `href` to the category root (`/getting-started`).
4. "Popular articles": 5 to 8 links to the highest-intent articles (setup, billing, the top troubleshooting page).
5. "Still need help?": how to reach support, response time if known, status page link.

### Category root pages (<dir>/index.mdx)

Frontmatter: title = category name, `sidebarTitle: "Overview"`, description one sentence. Body: one or two sentences on what the category covers and where to start; the directory cards render automatically below. Do not duplicate the article list by hand.

### Article shape (the unit that deflects tickets)

- **Title** in the customer's words, as a task or question: "Reset your password", "Why is my charge showing twice?", "Invite a teammate". Not "Password policy" or "Duplicate transaction handling". Unique across the site.
- **sidebarTitle** short (1 to 3 words) when the title is long.
- **description** 130 to 160 characters, plain language, containing the phrases customers actually type. This is the single highest-leverage line for search and the assistant.
- **First paragraph answers the question in one or two sentences**, standing alone. Everything after it is why, edge cases, and related actions.
- Procedures use `<Steps>` with one action per step and bold UI labels ("Click **Settings**").
- Variants use `<Accordion>` / `<AccordionGroup>` ("If you are on the Free plan…", "On iOS…").
- Gotchas use `<Note>`, `<Warning>`, or `<Tip>`; a screenshot placeholder is fine where a UI location matters.
- End with 2 to 3 "Related articles" links.
- 150 to 400 words. One question per article; if a page needs two H2s that answer different questions, split it.
- Second person, sentence case headings, no marketing voice, no internal jargon; use the product's own UI names consistently.

### Page types

- **Troubleshooting article**: symptom title; first paragraph names the most likely cause and fix; then "Other causes" as cause → fix pairs; end with "If that didn't work" pointing to contact support with what to include (account email, error text, screenshot).
- **FAQ page**: `<AccordionGroup>` of questions; each answer standalone in 2 to 4 sentences; link to the full article when one exists.
- **Contact support page**: channels, hours and expected response time, what to include, status page, community links.
- **Plans / billing article**: table of plans and limits with placeholders where prices are unknown; upgrade and downgrade behavior; proration; where to find invoices.
- **Integration article**: what it does, connect steps, what syncs and how often, disconnect, common problems.

### Sizing

- Fast path (generic ask, no sources): 6 to 8 pages: `index`, `getting-started/index` + `getting-started/quickstart`, `account/index` + `account/plans-and-billing`, `troubleshooting/index` + `troubleshooting/common-issues`, `support/faq` (or `support/contact`). Short pages, obvious placeholders for product-specific facts.
- Full build with sources: 15 to 30 articles across 5 to 7 categories, every article grounded in the source or clearly marked as a placeholder to verify.

### Anti-patterns

Feature-list IA; one giant page; category or article titles like "Overview" everywhere; a tab per category; marketing copy; invented prices, policies, limits, or support hours (use placeholders and list them in the summary); FAQ walls without accordions; procedures written as prose instead of `<Steps>`.

## Knowledge base (internal team wiki)

The audience is the user's own team, not their customers. Customer-facing exclusions do not apply: document processes, policies, runbooks, architecture, and tooling. The goal is that a new teammate can find "how do we do X here" in one search.

### Information architecture

Organize by audience or department first, then by task. Tabs are appropriate here (one per department or audience) because readers self-select; within a tab use 3 to 6 groups.

Typical shape:
- **Onboarding** — welcome, your first days, tools and access, who to ask.
- **HR & People** — overview, benefits and time off, growth and pay, policies that affect everyone.
- **IT & Security** — access and devices, security training, incident reporting.
- **Policies** — conduct, spend, remote work, data handling.
- **Engineering / Operations** (one tab per function that has its own processes) — overview, setup and deployment, on-call and incident response, architecture, decision records.

Every tab starts with an "Overview" page that says what lives here and who owns it.

### docs.json shape

```json
{
  "theme": "sequoia",
  "navigation": {
    "tabs": [
      {
        "tab": "Onboarding",
        "groups": [
          { "group": "Welcome", "pages": ["onboarding/index"] },
          { "group": "Your first days", "pages": ["onboarding/day-one", "onboarding/first-week", "onboarding/first-month"] },
          { "group": "Tools & access", "pages": ["onboarding/tools", "onboarding/accounts", "onboarding/who-to-ask"] }
        ]
      },
      {
        "tab": "Policies",
        "groups": [
          { "group": "Overview", "pages": ["policies/index"] },
          { "group": "Conduct & spend", "pages": ["policies/code-of-conduct", "policies/expenses"] }
        ]
      }
    ]
  }
}
```

- Themes: `sequoia` or `maple` (dense, sidebar-focused) suit large internal KBs.
- Do not use tabs when there is only one audience; use groups.

### Page types

- **Policy**: what the policy is, who it applies to, what to do, exceptions and who approves them, owner and last-reviewed date in the frontmatter description or a closing note.
- **Runbook**: when to run it, prerequisites, `<Steps>` with exact commands or UI paths, verification, rollback, escalation contact.
- **How-to**: goal in one sentence, prerequisites, `<Steps>`, expected result.
- **Reference / architecture**: what exists, how the pieces connect (a short list or table), where the source of truth lives, decision records as dated entries.
- **Overview page** per tab: scope, owner, "start here" links.

### Article shape

- Title = the task or question a teammate would search ("Request a laptop", "How on-call works", "Expense a conference").
- First paragraph gives the answer or the rule in one or two sentences.
- Name real systems, channels, and roles (placeholders like "<#it-help channel>" when unknown), and link to the tool rather than describing it at length.
- `<Steps>` for procedures, tables for matrices (roles × permissions, plan × limit), `<Accordion>` for role-specific variants, `<Warning>` for anything irreversible.
- Keep pages short and single-purpose; split when a page answers two questions.

### Sizing

Fast path: 6 to 8 pages (index, onboarding overview + first days + tools, one policy, one runbook, who to ask). Full build: 15 to 40 pages across 3 to 6 tabs.

### Anti-patterns

Mirroring the org chart at every level; giant "Everything about X" pages; policies without an owner or an approval path; customer-facing tone; documenting tools nobody uses.

## Product guide (end-user product documentation)

Product guides teach people how to accomplish outcomes with the product's UI. Readers are end users and admins, not developers. Every page should get someone from a goal to a result.

### Information architecture

Group by product area, in the order a new user meets them; each area gets an overview page and 3 to 6 task pages.

Typical shape:
- **Get started** — what the product is (one page), quickstart to the first meaningful result, setup and account basics.
- **One group per product area** ("Projects", "Editor", "Automation", "Analytics", "Integrations") named exactly as the UI names it, each with an overview page plus task pages ("Create a project", "Share a report", "Set up a rule").
- **Administration** — team, roles and permissions, security, billing (only if the product has admins).
- **Reference** — keyboard shortcuts, glossary, limits and quotas, release notes.
- **Troubleshooting / FAQ** when there is real material for it.

Use tabs only when there are multiple distinct products or surfaces (web vs mobile).

### docs.json shape

```json
{
  "theme": "almond",
  "styling": { "eyebrows": "breadcrumbs" },
  "navigation": {
    "directory": "card",
    "groups": [
      { "group": "Get started", "icon": "rocket", "root": "getting-started/index", "pages": ["getting-started/quickstart", "getting-started/setup"] },
      { "group": "Projects", "icon": "folder-kanban", "root": "projects/index", "pages": ["projects/create", "projects/share", "projects/archive"] },
      { "group": "Analytics", "icon": "chart-bar", "root": "analytics/index", "pages": ["analytics/dashboards", "analytics/reports", "analytics/exports"] },
      { "group": "Integrations", "icon": "plug", "root": "integrations/index", "pages": ["integrations/slack", "integrations/zapier"] }
    ]
  }
}
```

- `directory: "card"` plus `root` gives every area a browsable landing page; `icon` per group; themes `almond`, `mint`, `willow`, or `palm`.

### Page types

- **Area overview** (`<dir>/index`): what the area is for, key concepts in one short list, "start with" links; the directory cards render automatically.
- **Task page**: title is the task ("Create a project"), first paragraph states the outcome and when you'd do it, then Prerequisites (if any), `<Steps>` with bold UI labels, "Result" (what you see), "Next steps" links. Add a screenshot placeholder where the UI location is non-obvious.
- **Concept page**: what a thing is, why it exists, how it relates to other things, a small example. Keep it under 300 words.
- **Reference page**: tables (shortcuts, limits, roles × permissions), no prose padding.

### Article shape

- Second person, imperative headings for tasks, sentence case, plain language, the product's own terms.
- One task per page; if a task has 10+ steps, split into a sequence of pages ("Set up X" then "Configure X").
- `<Tip>` for shortcuts, `<Note>` for plan or role requirements, `<Warning>` for destructive actions.
- End task pages with 2 to 3 related links.

### Sizing

Fast path: 6 to 8 pages (index, quickstart, one overview + two task pages for the main area, one admin/billing page, FAQ). Full build: 15 to 40 pages across 4 to 7 areas.

### Anti-patterns

Feature marketing instead of tasks; documenting every button rather than every job to be done; step lists written as paragraphs; concept pages that never say when to use the thing; developer-only detail (APIs, config files) in a product guide.
