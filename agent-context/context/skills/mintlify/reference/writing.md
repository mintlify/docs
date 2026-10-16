# Writing pages

Read this before you create a page or write or rewrite more than a sentence or two. For a small fix (a typo, one sentence, a heading), make the fix in the page's existing style.

## Hard rule: no invented details

Every command, flag, field, parameter, default, limit, price, response, error and example on a page must trace to the user's message, the project, its source code, or a fetched source. Check that before each write. When a detail is not covered, leave it out or mark it in the page as a visible placeholder to confirm (for example a `<Note>` that says the request body is still to be documented), never as a plausible-looking fact. A minimal CLI page with only the given syntax, or an API page whose undefined body is marked "to be documented", is correct. Listing guesses in your reply does not make it acceptable to write them into the page. Keep writing what the sources support; do not stop to ask about details you can leave out or mark.

- Do not leave starter boilerplate or "Welcome to Mintlify" placeholder text.
- Do not create empty pages or pages with only a title.
- Do not reference features that do not exist in the source material.
- When you have no source for a product, say what you assumed and keep the site small. The most common complaint is a confidently wrong description of the user's company or product.
- Do not guess the company from an unrelated website. If a fetched page clearly describes a different business, do not use it.
- Do not build bespoke cards from raw HTML; use `<Card>` inside `<Columns>`.

## Creating a page

1. Decide the path from the site's existing directory conventions (`guides/<slug>`, `api-reference/<slug>`, ...).
2. Write the page with complete frontmatter (`title`, `description`, and `sidebarTitle` when the sidebar label should be shorter) and its full body.
3. Place it in navigation where it belongs (see "Placing pages" in `reference/navigation.md`).
4. Link to every page you created in your final message.

In a local repository, that is a new `.mdx` file plus its path in `docs.json` navigation. Through the Mintlify Admin MCP server, `create_node` with `data.type: "page"`, the `path`, the full `content` and a `parentId` from `list_nodes` creates the page and places it in one call. `write_page` only replaces a page that already exists, `edit_page` replaces exact text in a page body, and frontmatter changes go through `update_node`.

## Editing an existing page

- Read the page first. If the target page is known, read it directly instead of searching broadly.
- Make targeted replacements for changes inside a page, and rewrite the whole page only when most of it changes. A full rewrite always includes the complete frontmatter.
- Change only what was asked. A terse request ("this is outdated", "fix this") gets the smallest change that does it; mention related problems in your reply instead of editing them.
- Preserve existing wording when moving or converting content, unless asked to rewrite it.

## Ground rules

- Match the page and site you are in: voice, heading style, terminology and components.
- Write in the language the user writes to you in, unless they ask for another. Code stays as it is.
- Do not use em dashes or en dashes as punctuation in content you write or rewrite. Rewrite the sentence, split it, or use a comma, colon or parentheses. Leave existing dashes in text you are not otherwise changing, verbatim ports, quotes and code.

## Quality bar

- Every page has meaningful, specific content; no placeholder text that reads as fact.
- A quickstart gets the reader to a working state quickly: a working code example for libraries and APIs, or account setup through the first meaningful action for a SaaS product.
- API reference pages document actual parameters and return types grounded in real sources.
- Include real-world usage examples, not toy examples.
- Code blocks have correct language tags.

## Style

- Use SEO-friendly titles (see the title rules below), and use short `sidebarTitle` labels (1-3 words) for long titles when needed
- Navigation group names should also be concise: 1–3 words (e.g., "Guides", "API Reference", "Get Started")
- Write in second person ("you") addressing the customer
- Use active voice and imperative mood for instructions
- Lead with the user's goal, not the implementation
- Show working code examples that customers can copy-paste
- Include expected responses/output where helpful

The default audience is the product's end users and integrators. When the user asks for internal documentation (team wiki, runbooks, SOPs, architecture docs), the audience is their own team: document what they asked for and skip the customer-facing exclusions below.

## What customer-facing docs cover

### Include
- How to get started as a customer (signup, first API call)
- Authentication from the customer's perspective ONLY: how to get an API key or token, how to pass it in requests, and what errors mean. Do NOT document auth system internals.
- Public API reference with request/response examples
- SDK usage guides with real code from source
- Feature guides written for end-users
- Configuration options customers can control through the product's UI or public config files
- Webhooks, integrations, and extension points that customers set up themselves
- Error handling and troubleshooting from a user perspective

### Exclude
- Internal microservice architecture
- Database schemas and migrations
- CI/CD pipelines and deployment scripts
- Internal admin tools and dashboards
- Business logic implementation details
- Internal monitoring and alerting
- Code review processes or contribution guides
- Auth system internals: OAuth provider setup, session management, middleware configuration, token storage, RBAC implementation, auth library wiring
- Server/infrastructure configuration: environment variables, port bindings, container setup, reverse proxy config, runtime flags
- Internal config files that customers never touch (e.g., ORM config, build config, linter config)
- Dependency management, package lockfiles, or internal tooling setup
- Anything a customer would never see or interact with

**The litmus test**: if a customer using the product through its public interface would never need to know something, do not document it. Write for the person calling the API or using the dashboard: not the person deploying or maintaining the service.

## Titles, sidebar titles and descriptions

These apply when you author a new page or are asked to improve metadata. Do not rewrite existing titles the user did not ask about.

Every MDX page must set `title` and `description` in its frontmatter, and must open with a strong first paragraph. `sidebarTitle` is optional for pages that have long `titles`.

### Title requirements

Up to 60 characters long. Use content-specific titles: never the generic "[Page name] - [Product]" pattern. Every title must be unique across the site.

Good titles communicate why someone would read the page.

### Sidebar title requirements (optional)

Set `sidebarTitle` on pages with long titles. This is the label shown in the navigation sidebar and tabs: keep it short so the sidebar stays scannable. The full SEO `title` is for the page header and meta tags, never for the sidebar.

- 1-3 words maximum
- Use sentence case
- Never repeat the product name: it is already shown in the logo
- Never restate the section/group name
- Should read like a TOC entry: "Introduction", "Quickstart", "Brokers", "Retry Strategy", "Fairness Queues", "Publishing", "Consuming"
- For API/CLI reference pages, use the bare symbol or command name: `BroccoliQueue`, `RetryStrategy`, `GET /users`

Bad sidebarTitle (do NOT do these):
- `"Broccoli Queue: Robust Async Jobs for Rust"`: full SEO title in the sidebar
- `"Get Started with Broccoli Queue"`: repeats product name
- `"Installing Broccoli Queue in Your Rust Project"`: sentence-length

Good sidebarTitle:
- `"Introduction"`, `"Quickstart"`, `"Installation"`, `"Brokers"`, `"Retry strategy"`

Example title patterns (use as inspiration, not as exact templates):
- **Intro / overview**: `[Product]: [one-line value prop]`
  - e.g. "OpenClaw: self-hosted AI gateway for messaging"
- **Quickstart**: `Get started with [Product]` or `Quickstart`
- **Procedural content / how-to guide**: verb-led phrase like "Authenticate with [Product]" or "Deploy [Product] on Kubernetes"
- **Conceptual information**: a phrase that describes what the page teaches, like "What is [Feature]?" or "Setup types"
- **API reference page**: Use the resource name or endpoints so it's easy for people to search out the right reference
  - e.g. "Scalars" or "GET /users" or "REST API endpoints for users"

### Description requirements

130-160 characters long. Must contain a description of the page's content, not a restatement of the title. Every description must be unique across the site.

Example description patterns (use as inspiration, not as exact templates):
- **Intro / overview**: `[Product] is [what it does]. [One key differentiator].`
- **Quickstart**: `Learn how to [specific goal] with [Product] in [timeframe or N steps].`
- **Guide**: `[What specific task is accomplished] using [Product/feature].`
- **API reference**: `[HTTP method] /[path]: [what it does]. Accepts [key param(s)], returns [key field(s)].`
- **CLI reference**: `[command] [subcommand]: [what it does]. Key flags: [top 2-3 flags].`

### Opening paragraph

Every page must open with a paragraph of plain prose immediately after the frontmatter before any component (`<Steps>`, `<Card>`, `<CodeGroup>`, etc.) or fenced code block. Requirements:

- Mention the feature or product name
- State exactly what this page covers/what the reader will learn or accomplish
- Must add information beyond the title and description. Never a verbatim restatement of either

Bad: `This page covers authentication.`
Good: `[Product] authenticates requests with API keys. Pass your key in the Authorization: Bearer header on every call.`
Good: `To [specific goal], use [feature] to [do specific task].`
Good: `[Product] supports [feature]. [One key differentiator].`

## Links

- Link to pages of this site with root-relative paths without an extension: `[Quickstart](/quickstart)`. Never hardcode the docs domain.
- Use a full URL only for external sites.
- When you rename or move a page, update the links that point to it and add a redirect if the page was published.
- Do not change links the user did not ask you to change.

## Mentions

In the Mintlify editor, a person mention is the raw token `@[<userId>]` with the member's 24-character id, and a page mention is an ordinary root-relative link. Look the person up with your members tool and write the returned token exactly; never invent an id, never write a plain `@Name` when a mention was asked for, and never write an email address as a stand-in. Leave existing `@[...]` tokens unchanged unless asked.
