# Document APIs: IA audit

Scope: the **Documentation > Document APIs** group (`api-playground/*`), plus the pages it leans on: `organize/settings-api`, `organize/navigation#openapi`, `guides/migrating-from-mdx`, and the two OpenAPI help-center articles.

Method, modeled on the assistant reorganization (#8412): list the jobs people bring to these docs, check them against traffic, search, assistant, and Slack evidence, then map each job to one page.

## Current state

| Page | Lines | Human views (90d) | Agent views (90d) |
| --- | --- | --- | --- |
| OpenAPI setup | 942 | 1,138 | 4,337 |
| API playground overview | 267 | 1,016 | 1,936 |
| SDK reference setup | 260 | 263 | 214 |
| AsyncAPI setup | 142 | 242 | 280 |
| API settings (`organize/settings-api`) | — | 241 | 659 |
| Complex data types | 150 | 176 | 158 |
| GraphQL setup | 156 | 169 | 132 |
| Troubleshooting | 149 | 163 | 442 |
| Add SDK examples | 121 | 145 | 255 |
| Create manual API pages (MDX) | 255 | 141 | 437 (+906 `.md`) |
| Manage page visibility | 86 | 123 | 304 |
| Migrate from MDX to OAS (`guides/`) | — | 115 | 190 (+1,033 `.md`) |
| Multiple responses | 53 | 106 | 90 |

Current navigation:

```
Document APIs
├─ API playground overview
├─ API specifications
│  ├─ OpenAPI setup
│  ├─ AsyncAPI setup
│  ├─ GraphQL setup
│  └─ SDK reference setup
│     └─ Add SDK examples
├─ Endpoint pages
│  ├─ Complex data types
│  ├─ Multiple responses
│  ├─ Manage page visibility
│  └─ Create manual API pages
└─ Troubleshooting
```

Two pages carry most of the traffic, and OpenAPI setup carries most of the content. Everything else is small.

## What's in OpenAPI setup

The page holds eight separate jobs. Rough line counts:

| Section | Lines | Job |
| --- | --- | --- |
| Add a spec, localhost, resources | ~80 | Get my spec into Mintlify |
| Base URL, file uploads, authentication, `x-default`, scopes | ~180 | Make the playground send real requests |
| Overlays | ~85 | Change a spec I don't own |
| Download your spec | ~20 | Let people and agents get the raw spec |
| `x-mint` metadata, content, href, collapse, pills, group names, nested tags | ~240 | Change how endpoint pages look and are named |
| Auto-populate, dedicated sections, slugs, selective endpoints, inheritance | ~170 | Put endpoints where I want them in the sidebar |
| MDX pages with `openapi` / `openapi-schema` frontmatter, scraper | ~105 | Hand-tune individual endpoint pages |
| Webhooks, callbacks | ~65 | Document event-driven parts of the API |

## Problems

### 1. One page, eight jobs

Someone who wants to hide an internal endpoint or rename a sidebar group has to scroll past auth, overlays, and file uploads. Agents fetch it four times as often as people do, so every agent lookup pulls ~940 lines to answer one question.

### 2. The same job is split across pages

- **Navigation and visibility.** Placing endpoints is in OpenAPI setup, hiding them is in Manage page visibility (`x-hidden`, `x-excluded`), group labels and nested tags are under "Customize your endpoint pages", and `organize/navigation#openapi` repeats the basics.
- **Playground behavior.** Server URLs and auth live in OpenAPI setup. Display modes, proxy, credentials, and example languages live in the overview. The same `docs.json` fields are also documented in `organize/settings-api`, which has fields the overview doesn't (`api.params`, `api.optional`). Two copies are already drifting.
- **Per-endpoint pages.** "Create MDX pages from your OpenAPI specification" (OpenAPI setup), "Create manual API pages" (`mdx-setup`), and "Migrate from MDX to OAS" (`guides/`) cover overlapping ground from three directions.
- **OpenAPI extensions.** `x-mint` (OpenAPI setup), `x-hidden`/`x-excluded` (visibility), `x-codeSamples` (SDK examples), `x-default` (auth), `x-group` (group names). No single place lists them.

### 3. Labels and nesting don't match the content

- **Add SDK examples** sits under **SDK reference setup**, but it's about `x-codeSamples` on OpenAPI pages. SDK reference setup is about TypeDoc/Javadoc/Sphinx output. Unrelated jobs, parent-child in the nav.
- **Endpoint pages** contains two schema-authoring pages (complex data types, multiple responses), one navigation page (visibility), and one alternative to OpenAPI entirely (manual MDX pages).
- **API playground overview** is part concept, part quickstart, part `docs.json` reference, part reader-facing behavior (JSON body editing, response rendering, streaming, anchor links). Its title frames the whole section around the playground, but many people come to generate a static reference.

### 4. Findability signals

- Searching `x-mint` lands people on `overview#custom-endpoint-pages`, which only points elsewhere. The content is in OpenAPI setup.
- "auth" variants are the most common API-adjacent search terms. Some of that is site authentication, but the playground auth content is buried in section 3 of a long page.
- Page feedback is too sparse to use (fewer than 20 votes across all pages in 180 days, no detailed feedback).

## What people come to do

### From Slack (customer channels, #support, #proj-core-site, #product-customer-requests, since May 2026)

Counts are distinct customer threads, not ticket totals.

| Job | Threads | Where the answer lives today |
| --- | --- | --- |
| Control endpoint URLs and titles, keep them stable | ~6, the most detailed | Scattered across `#metadata`, `#href`, slug section; derivation rules undocumented |
| Fix a build or validation error | ~6 | Troubleshooting + hidden help-center page; error string is a catch-all |
| Get playground auth working | ~6 | OpenAPI setup auth section; description override buried in Troubleshooting |
| Organize a large spec in navigation | ~5 | OpenAPI setup + `organize/navigation`; no comparison of grouping options |
| Use a spec owned elsewhere (overlays, remote URL, rebuilds) | ~5 | Overlays section; "remote spec doesn't trigger a build" is a tip mid-page |
| Hide endpoints but keep them reachable | ~3 | Manage page visibility |
| Show security scopes | 3 (shipped Nov 9) | OpenAPI setup auth section |
| Servers and base URL | ~3 | OpenAPI setup |
| Is my spec public? | ~10 #support requests | Download-spec warning only |

**Answer existed, people didn't find it:** the Authorization description override (in Troubleshooting), page title source (`#metadata`), overlays (3+ customers needed a link), `x-codeSamples`, download spec. Staff routinely answer with deep links to anchors inside OpenAPI setup, which is itself a sign that the page holds many separate tasks.

**No answer in the docs:**

- How generated URLs are derived: lowercasing, stripped punctuation, which tag wins, duplicate suffixes, silent overwrite when two specs share a `directory`, and that spec edits change URLs. Also when to lock a URL with `x-mint.href`.
- Ways to group a large spec (3.2 parent tags vs one spec per group vs listing operations); `x-tagGroups` unsupported; no per-group tag filter.
- Localized API references (separate `directory` per language; translated summaries change URLs).
- Migrating from MDX stub pages to generated pages without 404s.
- `servers.variables` aren't interactive in the playground.
- oneOf/anyOf layout rules.
- The full list of `x-` extensions Mintlify reads (a CS rep had to write it out in a customer channel).

<!-- ASSISTANT -->

## Proposed structure

Keep the section, rename it around the job, and give each OpenAPI job its own page.

```
API references                      (was: Document APIs)
├─ Overview                         what you can generate, pick an approach, what readers get
├─ OpenAPI
│  ├─ Set up OpenAPI                add a spec: repo, URL, localhost; keep remote specs in sync
│  │                                (trigger a build); validate; versions; is my spec public?
│  ├─ Organize endpoints            auto-populate vs. selective, multiple specs, inheritance,
│  │                                tags, x-group, nested tags, choosing a grouping strategy for
│  │                                large specs, x-hidden, x-excluded
│  ├─ Endpoint URLs and titles      how URLs and titles are derived, slug, x-mint href and
│  │                                metadata title, directory collisions, localized references,
│  │                                keeping URLs stable when the spec changes
│  ├─ Configure the playground      servers, security schemes, x-default, scopes, display modes,
│  │                                auth-gated playground, proxy/CORS, prefill, example languages
│  ├─ Customize endpoint pages      x-mint metadata/content, collapse, pills, x-codeSamples,
│  │                                MDX pages with openapi/openapi-schema frontmatter
│  ├─ Describe schemas and responses  oneOf/anyOf/allOf, conditional fields, multiple responses,
│  │                                file uploads, streaming, webhooks, callbacks
│  ├─ Transform a spec with overlays
│  └─ OpenAPI extensions reference  one table of every x- extension and frontmatter key, linking out
├─ AsyncAPI
├─ GraphQL
├─ SDK reference
├─ Write API pages manually         (mdx-setup, plus migrate-to-OpenAPI as a closing section or sibling)
└─ Troubleshooting
```

### Page-by-page mapping

| New page | Content from |
| --- | --- |
| Overview | `overview` intro, quickstart steps, reader features (JSON body, response rendering, streaming, anchor links); `docs.json` field list replaced by a link to `organize/settings-api` |
| Set up OpenAPI | `openapi-setup` add spec, localhost, describe your API, the hosted-spec redeploy tip, download spec |
| Organize endpoints | `openapi-setup` auto-populate, selective endpoints, group names, nested tags; all of `managing-page-visibility`; new: grouping strategies for large specs |
| Endpoint URLs and titles | `openapi-setup` slug, href, metadata title; new: derivation rules, `directory` collisions, localization (needs eng to confirm the rules) |
| Configure the playground | `openapi-setup` base URL, auth, `x-default`, scopes; `overview` customize playground, auth-based display; Troubleshooting's Authorization description override |
| Customize endpoint pages | `openapi-setup` metadata, content, collapse, pills, MDX pages from OpenAPI; all of `adding-sdk-examples` |
| Describe schemas and responses | all of `complex-data-types` and `multiple-responses`; `openapi-setup` file uploads, webhooks, callbacks; `overview` streaming (spec side) |
| Overlays | `openapi-setup` overlays, as is |
| Extensions reference | new; a lookup table only |
| Write API pages manually | `mdx-setup`; `guides/migrating-from-mdx` moves here or stays linked |

Page count goes from 11 to 14, but no page is over ~250 lines and every job has one home.

Troubleshooting should lead with the literal error strings people paste ("Failed to fetch OpenAPI file for anchor or tab", "No paths or webhooks defined") so search and the assistant match them, and say that `mint dev` shows the underlying error when the deploy doesn't.

### Redirects

Every retired URL needs a redirect, in en/es/fr/zh. Retired: `managing-page-visibility`, `complex-data-types`, `multiple-responses`, `adding-sdk-examples`. `openapi-setup` stays as the URL for "Set up OpenAPI". Deep links into moved `openapi-setup` anchors will break; the extensions reference page softens that.

## Alternatives considered

- **Split OpenAPI setup only, leave the rest.** Smallest change, fixes length, but leaves the visibility/navigation split, the SDK examples mis-nesting, and the duplicated settings.
- **Merge everything into settings-style reference pages.** Good for agents, bad for people who arrive with a job.
- **Keep "API playground" as the frame.** The playground is one feature of a generated reference. Most jobs here (navigation, page names, schemas) aren't about the playground.

## Open questions

- Section name: "API references", "Document APIs", or "API documentation"?
- Should `organize/settings-api` become the only home for `api.*` fields, with task pages linking to it? I recommend yes.
- Does "Migrate from MDX to OAS" stay in Guides?
- Troubleshooting says Mintlify uses "this exact validation package" as editor.swagger.io. I haven't verified that.

## Areas of uncertainty

- Traffic is from the `mintlify` deployment's own analytics, last 90 days, en paths only. Agent counts use the dashboard definition.
- Search volume on API topics is low (dozens of queries, not hundreds), so search signals are directional.
