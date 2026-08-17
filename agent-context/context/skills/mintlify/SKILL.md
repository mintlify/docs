---
name: mintlify
description: Comprehensive reference for building Mintlify documentation sites. Use when creating pages, configuring docs.json, adding components, setting up navigation, or working with API references. Routes to detailed reference files for all components and configuration options.
---

# Mintlify reference

Reference for working on Mintlify projects. This file covers essentials that apply to every task. For detailed reference on specific topics, read the files listed in the reference index below.

## Reference index

Read these files **only when your task requires them**. They are in the `reference/` directory next to this file.

| File | When to read |
|------|-------------|
| `reference/components.md` | Adding or modifying components (callouts, cards, steps, tabs, accordions, code groups, fields, frames, icons, tooltips, badges, trees, mermaid, panels, prompts, colors, tiles, updates, views). |
| `reference/configuration.md` | Changing docs.json settings (theme, colors, logo, fonts, appearance, navbar, footer, banner, redirects, SEO, integrations, API config). Also covers snippets, hidden pages, .mintignore, custom CSS/JS, and the complete frontmatter fields table. |
| `reference/navigation.md` | Modifying site navigation structure (groups, tabs, anchors, dropdowns, products, versions, languages, OpenAPI, and SDK references in nav). |
| `reference/api-docs.md` | Setting up API documentation (OpenAPI, AsyncAPI, MDX manual API pages, extensions, playground config). |
| `reference/cli.md` | Running common CLI commands (dev, validate, add-domain, automations, score, broken-links, a11y, format, and config) and their key flags. |
| `reference/product-context.md` | Before substantial content work (new site, broad restructure, first-time section setup) — check for and maintain `.mintlify/product-brief.md`. |

## MCP servers

Two Mintlify MCP servers are available. Use them alongside the reference files in this skill.

### Mintlify Search

Read-only access to Mintlify's published documentation. Use it when the reference files don't cover a specific detail, when you need an up-to-date component signature, or to verify an unfamiliar config option.

Tools:
- `search_mintlify` — Search the Mintlify knowledge base by query. Good for finding guides, examples, and API references.
- `query_docs_filesystem_mintlify` — Browse the docs file tree (`ls`, `cat`, `grep`, `find`, etc.). Good for reading a specific docs page.
- `submit_feedback` — Report a docs page that is incorrect, outdated, confusing, or incomplete.

### Mintlify Admin

Write access to a Mintlify project. Requires OAuth on first use. Complete authentication in the browser when prompted.

Use this server when the user wants to edit their Mintlify content, restructure navigation, or open a pull request. All changes happen on a branch and must be reviewed before merging.

Workflow: call `checkout` first (always), then use `read`/`search`/`edit_page`/`write_page`/`list_nodes`/`create_node`/`update_node`/`move_node`/`delete_node`/`update_config` to make changes, then call `save` to open a PR (or `discard_session` to abandon).

Key tools:
- **`checkout`** — Start a session on a branch (required first call). Returns an `editorUrl` to preview changes live.
- **`list_branches`** — List existing branches; call before `checkout` to attach to one.
- **`list_deployments`** — Discover which deployment(s) this connection can access.
- **`read`** / **`search`** — Fetch a page's MDX or search across pages.
- **`edit_page`** / **`write_page`** — Apply targeted edits or overwrite a page.
- **`list_nodes`** / **`create_node`** / **`update_node`** / **`move_node`** / **`delete_node`** — Manage the navigation tree.
- **`update_config`** — Modify `docs.json` (theme, nav roots, integrations, SEO).
- **`diff`** — See all changes relative to `main`.
- **`get_session_state`** — Check the current session's status.
- **`save`** — Open a PR (`mode: "pr"`) or push to the branch (`mode: "commit"`).
- **`discard_session`** — Drop all in-session changes.

Keep each session focused on one change. Smaller sessions produce easier-to-review PRs. Open the `editorUrl` to watch changes render live.

## Before you start

Before substantial content work, read `reference/product-context.md` and check for `.mintlify/product-brief.md`.

Read the project's `docs.json` file first. It defines the site's navigation, theme, colors, and configuration.

Search for existing content before creating new pages. You may need to update an existing page, add a section, or link to existing content rather than duplicating.

Read 2-3 similar pages to match the site's voice, structure, and formatting.

## File format

Mintlify uses MDX files (`.mdx` or `.md`) with YAML frontmatter.

```
project/
├── docs.json           # Site configuration (required)
├── index.mdx
├── quickstart.mdx
├── guides/
│   └── example.mdx
├── openapi.yml         # API specification (optional)
├── images/             # Static assets
│   └── example.png
└── snippets/           # Reusable components
    └── component.jsx
```

### File naming

- Match existing patterns in the directory
- If no existing files or mixed file naming patterns, use kebab-case: `getting-started.mdx`
- Add new pages to `docs.json` navigation or they won't appear in the sidebar

### Internal links

- Use root-relative paths without file extensions: `/getting-started/quickstart`
- Do not use relative paths (`../`) or absolute URLs for internal pages

### Images

Store images in an `images/` directory. Reference with root-relative paths. All images require descriptive alt text.

```mdx
![Dashboard showing analytics overview](/images/dashboard.png)
```

## Page frontmatter

Include `title`, `description`, and `keywords` in frontmatter. `title` is technically optional (Mintlify generates one from the file path if omitted), but set it explicitly for clarity and SEO.

```yaml
---
title: "Clear, descriptive title"
description: "Concise summary for SEO and navigation."
keywords: ["relevant", "search", "terms"]
---
```

### Common frontmatter fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title in navigation and browser tabs. Auto-generated from the path if omitted. |
| `description` | string | Brief description for SEO. Displays under the title. |
| `sidebarTitle` | string | Short title for sidebar navigation. |
| `icon` | string | Lucide, Font Awesome, or Tabler icon name. Also accepts a URL or file path. |
| `tag` | string | Label next to page title in sidebar (e.g., "NEW"). |
| `hidden` | boolean | Remove from sidebar. Page still accessible by URL. |
| `mode` | string | Page layout: `default`, `wide`, `custom`, `frame`, `center`. |
| `keywords` | array | Search terms for internal search and SEO. |
| `api` | string | API endpoint for interactive playground (e.g., `"POST /users"`). |
| `openapi` | string | OpenAPI endpoint reference (e.g., `"GET /endpoint"`). |

For the complete list including `searchable`, `boost`, `deprecated`, `related`, `groups`, and more, read `reference/configuration.md`.

## Quick component reference

Below are the most commonly used components. For full props and all 25 components, read `reference/components.md`.

### Callouts

```mdx
<Note>Supplementary information, safe to skip.</Note>
<Info>Helpful context such as permissions or prerequisites.</Info>
<Tip>Recommendations or best practices.</Tip>
<Warning>Potentially destructive actions or important caveats.</Warning>
<Check>Success confirmation or completed status.</Check>
<Danger>Critical warnings about data loss or breaking changes.</Danger>
```

### Steps

```mdx
<Steps>
  <Step title="First step">
    Instructions for step one.
  </Step>
  <Step title="Second step">
    Instructions for step two.
  </Step>
</Steps>
```

### Tabs and code groups

```mdx
<Tabs>
  <Tab title="npm">
    ```bash
    npm install package-name
    ```
  </Tab>
  <Tab title="yarn">
    ```bash
    yarn add package-name
    ```
  </Tab>
</Tabs>
```

````mdx
<CodeGroup>

```javascript example.js
const greeting = "Hello, world!";
```

```python example.py
greeting = "Hello, world!"
```

</CodeGroup>
````

### Cards and columns

```mdx
<Columns cols={2}>
  <Card title="First card" icon="rocket" href="/quickstart">
    Card description text.
  </Card>
  <Card title="Second card" icon="book" href="/guides">
    Card description text.
  </Card>
</Columns>
```

Use `<Columns>` to arrange cards (or other content) in a grid. `cols` accepts 1-4.

### Accordions

```mdx
<AccordionGroup>
  <Accordion title="First section">Content one.</Accordion>
  <Accordion title="Second section">Content two.</Accordion>
</AccordionGroup>
```

## CLI commands

Install with `npm i -g mint`. Key commands: `mint dev` (local preview), `mint validate`, `mint broken-links`, `mint a11y`, `mint score`, `mint automations`, `mint new`, `mint signup`, `mint index` (install the Mintlify Index MCP server in supported coding agents). Read `reference/cli.md` for full flags and subcommands.

## Writing standards

- Second-person voice ("you").
- Active voice, direct language.
- Sentence case for headings ("Getting started", not "Getting Started").
- Sentence case for code block titles.
- All code blocks must have language tags.
- All images must have descriptive alt text.
- No marketing language, filler phrases, or emoji.
- Keep code examples simple, practical, and tested.

## Common mistakes

- Using `mint.json` — it is deprecated. The config file is always `docs.json`.
- Missing language tag on a code block (use ` ```python `, not ` ``` `).
- Using relative paths (`../page`) instead of root-relative (`/section/page`).
- Forgetting to add new pages to `docs.json` navigation.
- Images without alt text.
- Adding file extensions to internal links (`/page.mdx` instead of `/page`).
