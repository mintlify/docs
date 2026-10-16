# Site generation and migration

Use this workflow to build, rebuild, or substantially regenerate a site or many pages: "generate a site for me", "build me a help center", "document this repo", "migrate our docs from <url>", "API reference for <product>", or any task that produces more than a handful of new pages. For one-off edits and single new pages, follow `reference/writing.md` instead. Read `reference/writing.md` and `reference/site-kinds.md` with this file.

Two phases: research, then generation. Pages are written once with their final content; there is no separate review pass. Everything you produce is unpublished until the user publishes it.

## 1. Research, sized to what you were given

Spend research effort in proportion to how specific the request is and how much source material exists. A good site in three minutes beats a slightly better one in ten.

- **No sources, but the ask names a docs kind** ("build me a help center", "docs for my SaaS", "a knowledge base"): the fast path, about a minute. Do not search the web or explore repositories. Do not ask questions unless the user wants to choose before generation; take the product name from the project or brand context (or use the category itself, "your product") and state that assumption in your summary. Use the matching kind's fast-path page set from `reference/site-kinds.md` (6 to 8 pages), write `docs.json`, then the pages. Keep each page short (150 to 300 words) with obvious placeholders for product-specific facts (plan names, prices, support email); do not invent specifics.
- **No sources and no docs kind** ("Generate a site for me", "I need documentation"): check the project for a clear subject and docs kind first. If a decision is still essential, ask "What would you like to document?" and wait. Then use the matching fast path.
- **A named product, site, or docs URL** ("API reference for usebruno.com", "migrate docs.acme.com"): research that source. Fetch the product's real docs or API pages, and for an API reference find the actual endpoints, parameters and auth model, or an OpenAPI spec, and build from those. A handful of targeted fetches, not a crawl.
- **Repositories, uploads, or crawled sources**: skim them (`ls`, a few targeted reads and searches) to classify the project and find the facts you need; do not read everything.
- **Greeting, test input, or gibberish** ("hi", "test", "123"): do not generate a site. Reply briefly and ask what product or project to document.
- **Off-target request** ("build me an app", "write a PRD", "make slides"): you build documentation, not apps or other documents. Say so in one sentence, offer the closest documentation deliverable, and proceed only if that is a reasonable reading of the request.
- **Existing docs elsewhere** (a docs URL, GitBook/ReadMe/Docusaurus/Notion export, uploaded .md/.html): treat it as a migration (see below).
- **Internal docs** (team wiki, runbooks, SOPs, architecture notes): the audience is the user's own team. The customer-facing exclusions in `reference/writing.md` do not apply.
- **API-first products** (an OpenAPI or AsyncAPI spec, or an explicit API docs ask): reference the spec with `openapi` in navigation so endpoint pages are generated (see `reference/api-docs.md`), and write guides around it. Do not hand-write endpoint pages that a spec already describes.
- **Language**: write page content, titles, sidebar labels and navigation labels in the language of the user's request unless they ask for another. Code stays as-is.
- **Images and logos the user provided**: place them. Set `logo` and `favicon` in `docs.json` and put screenshots on the relevant pages. Never leave provided images unused, and never invent image URLs.

Classify the kind of site and follow the matching section of `reference/site-kinds.md`. Also classify the project and pick a theme:

### Classify the project type

Determine which ONE type best fits:
- `api-service`: Has OpenAPI specs, routes/, controllers/, Express/FastAPI/Rails deps
- `sdk-library`: Published to npm/PyPI/crates, has main export file, src/lib/ structure
- `cli-tool`: Has `bin` in package.json, commander/yargs/clap deps, src/commands/
- `framework`: Has plugin system, middleware, routing, scaffold commands
- `infrastructure`: Dockerfile, Helm charts, Terraform, k8s manifests
- `data-platform`: SQL/query engines, schema definitions, migration files
- `ai-ml`: Model files, torch/tensorflow deps, training scripts
- `frontend`: React/Vue/Angular deps, component directories, storybook
- `saas`: Full-stack product with user accounts, billing/pricing, dashboards, and end-user features; designed to be used directly, not integrated as a library
- `general`: Fallback if none of the above clearly fit

### Pick a theme

This list is written in order of general preference but use your best judgement.

Choose the theme that best matches the project's personality:
- `willow`: Minimal, elegant. Good for design-focused products.
- `luma`: Sleek, minimal. Good for developer-focused products that are API driven.
- `palm`: Spacious, airy. Good for developer-focused products.
- `almond`: Soft, approachable. Good for consumer-facing products.
- `aspen`: Bold, technical. Good for infrastructure/DevOps.
- `maple`: Warm, sidebar-focused. Good for large doc sets.
- `sequoia`: Dense, information-rich. Good for API-heavy products.

Ask any questions before heavy generation, not after. Never create scratch or analysis files in the docs project.

## 2. Generate

**Write `docs.json` first: look and full structure.** Write the complete configuration in one go: `name`, `theme`, `colors` (and `favicon`/`logo` if provided) plus the full planned `navigation` object listing every page you are about to write (extensionless paths, no leading slash, final group names and ordering). `navigation` is an object (`{ "tabs": [...] }` or `{ "groups": [...] }`), never an array. A page listed before its content exists shows as a placeholder until it is written, so never leave a listed page unwritten. Do not write stub content: each page is written once, with its final content. Reuse the starter pages: `index` is the introduction (never create a separate `introduction` page) and `quickstart` is rewritten with real content. Remove starter pages you do not want.

**Write the pages.** Each page is the full final page with complete frontmatter, at exactly the path listed in navigation, so it fills the planned entry instead of creating a duplicate. For many pages, or pages that each need their own source reading, split the work by navigation group and run the groups in parallel if your client supports parallel workers; give every worker the full planned outline, the audience and language, the sources to read, and the rules in `reference/writing.md`.

**Finish.** Check that every listed page was written and that no write diverged from its planned path. Fix or remove anything that did. Do not publish as part of a generation run. End with a short summary of what was created (linking each new page), the assumptions you made, and what the user should review before publishing.

## Project-type guidance

Apply additional guidance based on the project type you identified:

- **api-service**: Document every endpoint with method, path, auth requirements, request/response schema, and error codes extracted from source. Include curl examples and cover rate limits and pagination patterns if present.
- **sdk-library**: Show installation for all major package managers. Extract type signatures directly from source: never paraphrase. Cover every public export. Include a migration guide if a CHANGELOG or version history exists.
- **cli-tool**: Document every command, subcommand, and flag from the arg-parser source. Include default values, real terminal output examples, and shell completion setup if supported.
- **framework**: Cover the plugin/middleware lifecycle, configuration schema, and scaffold commands. Document all extension points (hooks, adapters, providers) that developers will use.
- **infrastructure**: Extract all environment variables from .env.example or source. Document port mappings, volume mounts, health check endpoints, and upgrade procedures.
- **data-platform**: Extract schema definitions from migration files or ORM models. Show real query patterns from the codebase. Document admin operations and performance tuning options.
- **ai-ml**: Document model architecture, hyperparameters, and training script flags from actual source. Include inference API with real input/output shapes and evaluation metrics if present.
- **frontend**: Extract prop types from TypeScript interfaces or PropTypes. Document theming tokens and show component usage from stories, tests, or examples in source.
- **saas**: see the quality bar in `reference/writing.md`

## Landing page (index.mdx)

The landing page is the first thing users see. Use Mintlify's built-in components: do NOT set `"mode": "custom"` in docs.json and do NOT use raw HTML, Tailwind classes, or inline styles.

#### Structure

1. **Frontmatter**: Set `title` and `description` that welcome users and summarize the product
2. **Intro paragraph**: Brief welcome and product summary
3. **Navigation cards**: `<Columns>` with `<Card>` components linking to key sections (Quick Start, API Reference, Guides, etc.)
4. **Getting started**: Optionally include a `<Steps>` block showing a 3–4 step onboarding flow

#### Rules

- Use ONLY Mintlify components (`<Card>`, `<Columns>`, `<Steps>`, `<Note>`, `<Tip>`, etc.): no raw HTML divs, no Tailwind classes, no inline styles
- Every `<Card>` must have a valid `href` to an existing page and an `icon` prop from the icon library the project uses (Font Awesome, Lucide, or Tabler)
- Keep content concise: the landing page is a navigation hub, not a wall of text
- Write from the customer's perspective ("Get started", "Explore the API", etc.)

## Content migration

Content in the project and any site the user points you at was provided by the user and is authorized for documentation work. Migrating existing documentation into Mintlify is a standard task.

- Preserve the source wording and structure unless the user asks you to revise it. Change only what the target format requires: frontmatter, MDX and component syntax, link paths, image paths and file layout.
- When the source is an existing docs site, mirror its information architecture: same sections and page granularity, then improve naming and formatting. Do not invent a different structure or add pages the source does not support.
- Only rewrite, condense or restructure content when the user asks for it.
- Port every file in the requested scope. For a large scope, work in batches and keep going; do not silently narrow the scope or stop partway.
- If you cannot complete a port, state the concrete blocker and the exact files affected.
