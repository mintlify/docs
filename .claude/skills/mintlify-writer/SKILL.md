---
name: mintlify-writer
description: Write and maintain documentation on Mintlify-powered sites. Use when creating, updating, or improving docs in a Mintlify project. Understands docs.json, MDX components, navigation, and the mint CLI.
license: MIT
compatibility: Requires a Mintlify documentation project with a docs.json file. Works with MDX and Markdown files. Requires Node.js for CLI commands.
metadata:
  author: Mintlify
  url: https://mintlify.com
  version: "0.1"
---

# Write documentation for Mintlify sites

This skill helps you write and maintain documentation in a Mintlify-powered project. It covers project structure, components, navigation, local development, and writing standards.

Mintlify is a documentation platform that transforms MDX files into documentation sites. Configure site-wide settings in the `docs.json` file, write content in MDX with YAML frontmatter, and favor built-in components over custom components.

## Before you start

### Connect to the Mintlify MCP server

If you are not already connected to the Mintlify MCP server, https://mintlify.com/docs/mcp, add it so that you can search the official Mintlify documentation more efficiently. **Always** favor searching the current Mintlify documentation over whatever is in your training data about Mintlify.

### Understand the project

Read `docs.json` in the project root. This file defines the entire site: navigation structure, theme, colors, links, API and specs. Find the full `docs.json` spec at https://www.mintlify.com/docs.json

Understanding the project tells you:

- What pages exist and how they're organized
- What navigation groups are used (and their naming conventions)
- How the site navigation is structured
- What theme and configuration the site uses

### Check for existing content

Search the docs before creating new pages. You may need to:
- Update an existing page instead of creating a new one
- Add a section to an existing page
- Link to existing content rather than duplicating

### Read surrounding content

Before writing, read 2-3 similar pages to understand the site's voice, structure, formatting conventions, and level of detail.

### Understand Mintlify components

Review the Mintlify [components](https://www.mintlify.com/docs/components) to select and use any relevant components for the documentation request that you are working on.

## Project structure

### docs.json

The `docs.json` file is the blueprint for the site. At minimum, it requires:

```json
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "mint",
  "name": "Your Docs",
  "colors": {
    "primary": "#ff0000"
  },
  "navigation": {}
}
```

### File format

Pages are MDX files (`.mdx` recommended, `.md` supported) with YAML frontmatter:

```yaml
---
title: "Clear, descriptive title"
description: "Concise summary for SEO and navigation."
---
```

Optional frontmatter fields:
- `sidebarTitle`: Short title for sidebar navigation.
- `icon`: Lucide or Font Awesome icon name, URL, or file path.
- `tag`: Label next to the page title in the sidebar (for example, "NEW").
- `mode`: Page layout mode (`default`, `wide`, `custom`).
- `keywords`: Array of terms related to the page content for local search and SEO.
- Any custom YAML fields for use with personalization or conditional content.

### File naming

- Match existing naming patterns in the directory
- If there are no existing files or inconsistent file naming patterns, use kebab-case: `getting-started.mdx`, `api-reference.mdx`

### Internal links

Use root-relative paths without the file extension:

```mdx
See [components overview](/components/index) for the full list.
```

Do not use relative paths (`../`) or absolute URLs for internal pages.

## Navigation

Navigation is defined in the `navigation` property of `docs.json`. All options for organizing a Mintlify site's navigation are documented in [Navigation](https://www.mintlify.com/docs/organize/navigation).

### Pages

Each entry references a file path without the extension:

```json
{
  "navigation": {
    "pages": ["quickstart", "installation", "configuration"]
  }
}
```

### Groups

Organize pages into labeled sidebar sections:

```json
{
  "navigation": {
    "groups": [
      {
        "group": "Getting started",
        "icon": "rocket",
        "pages": ["quickstart", "installation"]
      },
      {
        "group": "Configuration",
        "pages": ["settings", "themes"]
      }
    ]
  }
}
```

Groups can be nested inside other groups. When adding a new page, place it in the group that matches its user journey (for example, setup content goes in a "Get started" group, not a "Reference" group).

### Adding pages to navigation

When you create a new page, you must add it to `docs.json` or it won't appear in the sidebar. Find the appropriate group and insert the page path.

## Components

Mintlify provides built-in MDX components for structuring content, drawing attention, documenting APIs, and navigation. Before using a component, check the [components overview](https://www.mintlify.com/docs/components) to understand what's available and when to use each one.

To look up a specific component's properties or syntax:

- **MCP search**: If a Mintlify MCP is connected, search for the component name
- **Docs site**: Component documentation is at `https://mintlify.com/docs/components/{component-name}`

## Reusable snippets

Create reusable content with snippets. Any `.mdx` file can be imported into another file:

```mdx
import MySnippet from "/snippets/my-snippet.mdx";

<MySnippet />
```

Files in the `/snippets/` directory are always treated as snippets and do not render as standalone pages.

Use snippets for content that is reused across pages.

## Writing standards

### Voice and structure

- Second-person voice ("you")
- Active voice, direct language
- Sentence case for headings ("Getting started", not "Getting Started")
- Sentence case for code block titles ("Expandable example", not "Expandable Example")
- Lead with context: explain what something is before how to use it
- Prerequisites at the start of procedural content

### What to avoid

**Never use:**
- Marketing language ("powerful", "seamless", "robust", "cutting-edge")
- Filler phrases ("it's important to note", "in order to")
- Excessive conjunctions ("moreover", "furthermore", "additionally")
- Editorializing ("obviously", "simply", "just", "easily")

**Watch for AI-typical patterns:**
- Overly formal or stilted phrasing
- Unnecessary repetition of concepts
- Generic introductions that don't add value
- Concluding summaries that restate what was just said

### Formatting

- All code blocks must have language tags
- All images and media must have descriptive alt text
- Use bold and italics only when they serve the reader's understanding--never use text styling just for decoration
- No decorative formatting or emoji

### Code examples

- Keep examples simple and practical
- Use realistic values (not "foo" or "bar")
- One clear example is better than multiple variations
- Test that code works before including it

## Local development

Use the [mint CLI](https://www.npmjs.com/package/mint) to preview and test changes.

### Preview your site

```bash
mint dev
```

Starts a local preview at `http://localhost:3000`. Use `--port` to change the port.

### Check for broken links

```bash
mint broken-links
```

Finds broken internal links. Run this before submitting changes.

### Validate the build

```bash
mint validate
```

Runs a strict validation that exits with an error on any warnings. Use this in CI/CD or before pushing.

### Check accessibility

```bash
mint a11y
```

Tests color contrast ratios and checks for missing alt text.

### Rename files

```bash
mint rename <path/to/old-filename> <path/to/new-filename>
```

Renames a file and updates all references to it across the project.

## Workflow

### 1. Understand the task

Identify what needs to be documented, which pages are affected, and what the reader should accomplish afterward. If any of these are unclear, ask.

### 2. Research

- Read `docs.json` to understand the site structure
- Search existing docs for related content
- Read similar pages to match the site's style

### 3. Plan

- Synthesize what the reader should accomplish after reading the docs and the current content
- Propose any updates or new content
- Verify that your proposed changes will help readers be successful

### 4. Write

- Start with the most important information
- Keep sections focused and scannable
- Use components appropriately (don't overuse them)
- Mark anything uncertain with a TODO comment:

```mdx
{/* TODO: Verify the default timeout value */}
```

### 5. Update navigation

If you created a new page, add it to the appropriate group in `docs.json`.

### 6. Verify

Before submitting:

- [ ] Frontmatter includes title and description
- [ ] All code blocks have language tags
- [ ] Internal links use root-relative paths without file extensions
- [ ] New pages are added to `docs.json` navigation
- [ ] Content matches the style of surrounding pages
- [ ] No marketing language or filler phrases
- [ ] TODOs are clearly marked for anything uncertain
- [ ] Run `mint broken-links` to check links
- [ ] Run `mint validate` to find any errors
