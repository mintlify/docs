---
name: mintlify-docs
description: Skill for building and maintaining documentation sites with Mintlify.
license: MIT
metadata:
  author: mintlify
  version: "1.0"
---

# Mintlify documentation guide

**Always consult [mintlify.com/docs](https://mintlify.com/docs) for components, configuration, and latest features.**

Mintlify is a documentation platform that transforms MDX files into documentation sites. Configure with `docs.json`, write content in MDX with YAML frontmatter, and use built-in components.

## Quick reference

### CLI commands
- `npm i - g mint` - Install the Mintlify CLI tool
- `mint dev` - Local preview at localhost:3000
- `mint broken-links` - Check internal links
- `mint a11y` - Check for accessibility issues in content
- `mint rename` - Rename/move files and update references
- `mint validate` - Validate documentation builds

### Required files
- `docs.json` - Site configuration (navigation, theme, settings)
- `*.mdx` files - Documentation pages with YAML frontmatter

### Frontmatter template
```yaml
---
title: "Page title"
description: "SEO description"
---
```

## docs.json Configuration

| Option | Purpose |
|--------|---------|
| `name` | Site name |
| `logo` | Logo paths (`light`, `dark`) |
| `favicon` | Favicon path |
| `colors.primary` | Brand color (hex) |
| `navigation` | Sidebar structure |
| `tabs` | Top-level navigation tabs |
| `anchors` | Persistent links below logo |
| `topbarCtaButton` | CTA button in header |
| `api` | API reference settings |
| `openapi` | OpenAPI spec path(s) |
| `seo` | SEO metadata |
| `redirects` | URL redirects |

**Schema reference:** [mintlify.com/docs.json](https://mintlify.com/docs.json)

## Navigation structure

This is an example of a tabbed navigation structure.

```json
{
  "navigation": {
    "tabs": [
      {
        "tab": "Documentation",
        "groups": [
          {
            "group": "Getting Started",
            "pages": ["introduction", "quickstart"]
          }
        ]
      }
    ]
  }
}
```

- Pages are file paths without `.mdx` extension
- Groups organize pages in sidebar
- Tabs create top-level sections
- Nested groups supported for hierarchy

## Components

Use built-in MDX components. Common components include:

**Content organization:**
- `<Accordion>` / `<AccordionGroup>` - Collapsible sections
- `<Tabs>` - Tabbed content
- `<Card>` / `<Columns>` - Linked cards
- `<Steps>` - Numbered procedures

**Callouts:**
- `<Note>` - General information
- `<Warning>` - Caution messages
- `<Info>` - Contextual tips
- `<Tip>` - Best practices
- `<Check>` - Success states

**Code:**
- `<CodeGroup>` - Multiple code examples with tabs
- `<ResponseField>` - API response documentation
- `<ParamField>` - Parameter documentation
- `<Expandable>` - Show/hide detailed content

**Media:**
- `<Frame>` - Image container with optional caption
- `<video>` - Embedded video with the HTML `<video>` element

See [Components](https://www.mintlify.com/docs/components) for all components grouped by use case.

## API documentation

**OpenAPI integration:**
```json
{
  "openapi": ["openapi.yaml"],
  "api": {
    "baseUrl": "https://api.example.com",
    "auth": { "method": "bearer" }
  }
}
```

**Auto-generated pages:** Add OpenAPI spec and reference endpoints in navigation as `GET /endpoint` or `POST /endpoint`.

**Manual endpoints:** Use `api` frontmatter field for method and endpoint.

## Code blocks

Always include language identifier:
```javascript
const example = "code";
```

## Links and references

- **Internal links:** Use root-relative paths without extension: `/getting-started/quickstart`
- **Images:** Store in `/images` folder, reference as `/images/example.png`
- **Snippets:** Create reusable content in `/snippets`, import with `import { Component } from "/snippets/file.jsx"`

## Common patterns

**Page with API endpoint:**
```yaml
---
title: "Create User"
api: "POST /users"
---
```

**Expandable code example:**
```mdx
<Expandable title="Full example">
  ```python
  # detailed code here
  ```
</Expandable>
```

**Grouped cards:**
```mdx
<CardGroup cols={2}>
  <Card title="Option A" href="/option-a">
    Description here
  </Card>
  <Card title="Option B" href="/option-b">
    Description here
  </Card>
</CardGroup>
```

## Common gotchas

1. **Navigation paths** - Use file paths without `.mdx` extension
2. **Component imports** - JSX components need explicit import, MDX components don't
3. **Frontmatter required** - Every MDX file needs `title` at minimum
4. **Image paths** - Must start with `/` for root-relative paths
5. **Code block language** - Always specify language identifier
6. **OpenAPI endpoints** - Format as `METHOD /path` in navigation

## File structure
Example file structure.

```
project/
├── docs.json           # Site configuration
├── introduction.mdx
├── quickstart.mdx
├── guides/
│   └── example.mdx
├── openapi.yml         # API specification
├── images/             # Static assets
│   └── example.png
└── snippets/           # Reusable components
    └── component.jsx
```

## Resources

- [Documentation](https://mintlify.com/docs)
- [Configuration Schema](https://mintlify.com/docs.json)
