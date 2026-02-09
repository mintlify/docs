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

This skill guides writing and maintaining documentation in a Mintlify-powered project. It covers writing standards, workflow, and verification. For Mintlify product reference (navigation patterns, components, CLI commands, API docs, deployment), load the product skill described below.

Mintlify is a documentation platform that transforms MDX files into documentation sites. Configure site-wide settings in the `docs.json` file, write content in MDX with YAML frontmatter, and favor built-in components over custom components.

## Before you start

### Load the Mintlify product reference

Fetch https://mintlify.com/docs/skill.md for comprehensive Mintlify product reference including navigation patterns, component decision tables, API documentation setup, deployment, and configuration. This supplements the writing-focused guidance in this skill with full product knowledge.

### Connect to the Mintlify MCP server

If you are not already connected to the Mintlify MCP server, add it so that you can search the official Mintlify documentation more efficiently: https://mintlify.com/docs/mcp

**Always** favor searching the current Mintlify documentation over whatever is in your training data about Mintlify.

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

## Page frontmatter

Every page requires `title` in its frontmatter. Include `description` for SEO and navigation.

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

## File conventions

- Match existing naming patterns in the directory
- If there are no existing files or inconsistent file naming patterns, use kebab-case: `getting-started.mdx`, `api-reference.mdx`
- Use root-relative paths without file extensions for internal links: `/getting-started/quickstart`
- Do not use relative paths (`../`) or absolute URLs for internal pages
- When you create a new page, add it to `docs.json` navigation or it won't appear in the sidebar

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
