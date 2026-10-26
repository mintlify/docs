# Navigation reference

All navigation patterns for the `navigation` property in `docs.json`.

## Pages

Flat list of pages with no grouping.

```json
{
  "navigation": {
    "pages": ["index", "quickstart", "guides/example"]
  }
}
```

## Groups

```json
{
  "navigation": {
    "groups": [
      {
        "group": "Getting started",
        "icon": "rocket",
        "pages": ["index", "quickstart"]
      },
      {
        "group": "Guides",
        "icon": "book-open",
        "tag": "NEW",
        "pages": [
          "guides/overview",
          {
            "group": "Advanced",
            "expanded": false,
            "pages": ["guides/advanced/config", "guides/advanced/deploy"]
          }
        ]
      }
    ]
  }
}
```

Group properties:
- `group` (required): Section title.
- `pages` (required): Array of page paths or nested groups.
- `icon`: Icon name.
- `tag`: Label displayed next to group name.
- `root`: Page that opens when clicking the group title.
- `expanded`: Default open state for nested groups (`true`/`false`). Top-level groups are always expanded.
- `directory`: When the group has a `root` page, render a listing of child pages below the root page content. Values: `"none"` (default), `"accordion"` (collapsible list), `"card"` (horizontal cards). Inherits recursively; descendants can override.
- `boost`: Numeric multiplier for in-product search ranking of every page in the group. Use values `> 1` to prioritize, `0–1` to de-prioritize.

## Tabs

```json
{
  "navigation": {
    "tabs": [
      {
        "tab": "Documentation",
        "icon": "book-open",
        "groups": [
          {
            "group": "Getting started",
            "pages": ["index", "quickstart"]
          }
        ]
      },
      {
        "tab": "API reference",
        "icon": "square-terminal",
        "pages": ["api/overview", "api/endpoints"]
      },
      {
        "tab": "Blog",
        "icon": "newspaper",
        "href": "https://example.com/blog"
      }
    ]
  }
}
```

A tab, anchor, dropdown, or menu `item` with no `pages`, `groups`, or nested divisions links to its `href`. Use an absolute URL to open an external site in a new browser tab, or a root-relative path (for example, `"/platform/analytics"`) to open a page from another section in the same browser tab. If the entry has child navigation, it links to its first page instead.

### Menus (within tabs)

```json
{
  "tab": "Developer tools",
  "menu": [
    {
      "item": "API reference",
      "icon": "rocket",
      "groups": [
        {
          "group": "Endpoints",
          "pages": ["api/get", "api/post"]
        }
      ]
    },
    {
      "item": "SDKs",
      "icon": "code",
      "description": "Client libraries",
      "pages": ["sdk/javascript", "sdk/python"]
    }
  ]
}
```

## Anchors

```json
{
  "navigation": {
    "anchors": [
      {
        "anchor": "Documentation",
        "icon": "book-open",
        "groups": [
          {
            "group": "Getting started",
            "pages": ["quickstart", "tutorial"]
          }
        ]
      },
      {
        "anchor": "Blog",
        "href": "https://example.com/blog"
      }
    ]
  }
}
```

### Global anchors

Appear on all pages regardless of active section:

```json
{
  "navigation": {
    "global": {
      "anchors": [
        {
          "anchor": "Changelog",
          "icon": "list",
          "href": "/changelog"
        }
      ]
    },
    "tabs": [...]
  }
}
```

## Global navigation

`navigation.global` supports tabs, anchors, dropdowns, languages, versions, and products that appear on all pages regardless of active section. Useful for persistent switchers and cross-cutting links.

```json
{
  "navigation": {
    "global": {
      "tabs": [
        { "tab": "API", "href": "/api-reference", "icon": "square-terminal" }
      ],
      "anchors": [
        { "anchor": "Changelog", "icon": "list", "href": "/changelog" }
      ],
      "languages": [
        { "language": "en", "default": true, "href": "https://example.com/docs" },
        { "language": "es", "href": "https://example.com/es/docs" }
      ],
      "versions": [
        { "version": "v2", "default": true, "href": "https://example.com/docs" },
        { "version": "v1", "href": "https://v1.example.com/docs" }
      ],
      "products": [
        { "product": "Core API", "icon": "server" },
        { "product": "Mobile SDK", "icon": "smartphone" }
      ]
    }
  }
}
```

Global element properties:
- `global.tabs`: Each entry requires `tab` (string) and `href`. Optional: `icon`, `iconType`, `hidden`.
- `global.anchors`: Each entry requires `anchor` (string) and `href`. Optional: `icon`, `iconType`, `color.light`, `color.dark`, `hidden`.
- `global.dropdowns`: Each entry requires `dropdown` (string) and `href`. Optional: `icon`, `iconType`, `hidden`.
- `global.languages`: Each entry requires `language` (code string) and `href`. Optional: `default`, `hidden`.
- `global.versions`: Each entry requires `version` (string) and `href`. Optional: `default`, `hidden`.
- `global.products`: Each entry requires `product` (string). Optional: `description`, `icon`, `iconType`.

## Dropdowns

```json
{
  "navigation": {
    "dropdowns": [
      {
        "dropdown": "Documentation",
        "icon": "book-open",
        "groups": [
          {
            "group": "Getting started",
            "pages": ["index", "quickstart"]
          }
        ]
      },
      {
        "dropdown": "API reference",
        "icon": "square-terminal",
        "pages": ["api/overview"]
      }
    ]
  }
}
```

## Products

```json
{
  "navigation": {
    "products": [
      {
        "product": "Core API",
        "description": "Core API documentation",
        "icon": "server",
        "tabs": [
          {
            "tab": "Documentation",
            "groups": [
              { "group": "Getting started", "pages": ["core/quickstart"] }
            ]
          }
        ]
      },
      {
        "product": "Mobile SDK",
        "icon": "smartphone",
        "pages": ["mobile/overview"]
      }
    ]
  }
}
```

## Versions

```json
{
  "navigation": {
    "versions": [
      {
        "version": "2.0.0",
        "default": true,
        "tag": "Latest",
        "groups": [
          { "group": "Getting started", "pages": ["v2/overview", "v2/quickstart"] }
        ]
      },
      {
        "version": "1.0.0",
        "tag": "Deprecated",
        "groups": [
          { "group": "Getting started", "pages": ["v1/overview", "v1/quickstart"] }
        ]
      }
    ]
  }
}
```

Version properties:
- `version` (required): Version label shown in the selector.
- `default`: Set `true` to make this the default version (otherwise the first entry is the default).
- `tag`: Badge label displayed in the version selector dropdown (e.g., `"Latest"`, `"Recommended"`, `"Beta"`).
- `hidden`: Set `true` to remove this version from the selector and exclude every page beneath it from site search, sitemaps, search engine indexing, and AI context. `navigation.tabs`, `navigation.anchors`, `navigation.dropdowns`, `navigation.languages`, and `navigation.products` accept the same `hidden` flag with the same effect. Versions do not support `searchable: true`; to keep hidden versions discoverable, set `seo.indexing: "all"` in `docs.json`.

## Languages

```json
{
  "navigation": {
    "languages": [
      {
        "language": "en",
        "groups": [
          { "group": "Getting started", "pages": ["en/overview", "en/quickstart"] }
        ]
      },
      {
        "language": "es",
        "groups": [
          { "group": "Comenzando", "pages": ["es/overview", "es/quickstart"] }
        ]
      }
    ]
  }
}
```

Each language entry can include its own `banner`, `footer`, and `navbar` configuration overrides.

For regional variants, add an ISO 3166-1 alpha-2 region to a two-letter supported language code (not `cn` or `jp`), such as `en-GB`, `es-MX`, or `de-CH`. Use `es-419` for Latin American Spanish. Region codes are not case-sensitive. Name the content directory after the regional code, such as `en-gb/`. Interface text uses the base language, so `es-MX` pages show the Spanish interface.

To redirect visitors from the site root to the language matching their browser's `Accept-Language` header, enable **Auto-route by language** in the **Language routing** section of the dashboard General settings page (`https://app.mintlify.com/settings/project/general`). Mintlify only redirects visits to the site root. If a visitor picks a language with the language switcher, Mintlify remembers their choice and stops auto-routing them. If no published language matches the visitor's browser preferences, Mintlify serves the default language.

## OpenAPI in navigation

```json
{
  "navigation": {
    "groups": [
      {
        "group": "API reference",
        "openapi": "/path/to/openapi.json",
        "pages": [
          "overview",
          "GET /users",
          "POST /users",
          {
            "group": "Products",
            "openapi": "/path/to/openapi-v2.json",
            "pages": ["GET /products", "POST /products"]
          }
        ]
      }
    ]
  }
}
```

When you add `openapi` to a navigation element without specifying pages, Mintlify auto-generates pages for all endpoints.

## SDK references

Generate SDK reference pages from documentation-tool build artifacts by adding an `sdk` property to a tab or group. Set `format` to `typedoc`, `docfx`, `javadoc`, `sphinx`, `phpdoc`, or `go` (generate Go artifacts with `go run github.com/mintlify/mintlify-go-extractor@latest -o go.json` from inside the module); set `source` to an artifact path or HTTPS URL; and optionally set `directory` to control the generated pages' URL prefix (defaults to `sdk-reference`). Groups and pages inherit the nearest ancestor's `sdk` settings; a nested group with its own `sdk` overrides that inheritance. Javadoc pages are grouped by package; a package with several kinds nests them under Interfaces, Classes, Enums, Records, Exceptions, Errors, and Annotations.

```json
{
  "navigation": {
    "tabs": [
      {
        "tab": "TypeScript SDK",
        "sdk": {
          "format": "typedoc",
          "source": "sdk-artifacts/typedoc.json",
          "directory": "sdk/typescript"
        }
      }
    ]
  }
}
```

A tab with `sdk` can include `groups` but not `pages`, `versions`, `languages`, `openapi`, `asyncapi`, or `graphql`. A group with `sdk` can include `pages` and nested groups but not `graphql`. Author-written `pages` render first, followed by the generated reference groups. For TypeDoc, `@category` and `@group` tags define the generated groups, and nested categories and namespaces become nested groups. Without those tags, Mintlify groups pages by symbol type. Use multiple tabs or groups with unique `directory` values to document multiple libraries (for example, stable and beta versions in the same tab).

```json
{
  "group": "TypeScript SDK",
  "sdk": {
    "format": "typedoc",
    "source": "sdk-artifacts/typedoc.json",
    "directory": "sdk/typescript"
  },
  "pages": ["sdk/typescript/overview"]
}
```

### Customize a single symbol page

Add `sdk` frontmatter to an MDX page (listed in navigation) to target one symbol. Mintlify renders the body, then appends the generated reference for that symbol. Once any page under a tab or group uses `sdk` frontmatter, Mintlify stops auto-populating that tab or group and shows only the pages you wrote.

String form (`[source] kind name`) inherits `source` and always inherits `format`, so it only works under a tab or group with `sdk`. Use the object form elsewhere. For `method` and `property`, include the parent.

````mdx
---
title: "Client"
sdk: "class Client"
---
````

````mdx
---
title: "getUser"
sdk:
  kind: method
  name: getUser
  parent: Client
---
````

Object-form fields: `kind` (required: `class`, `interface`, `enum`, `function`, `type`, `variable`, `method`, `property`), `name` (required), `parent` (required for `method` and `property`), `format` (overrides inherited; required outside a tab or group with `sdk`; object form only), `source` (overrides inherited; required outside a tab or group with `sdk`). If `title` or `description` is omitted, Mintlify uses the generated symbol values.

## Choosing a navigation pattern

| Pattern | When to use |
|---------|-------------|
| Groups | Default. Single audience, straightforward hierarchy. |
| Tabs | Distinct sections with different audiences or content types. |
| Anchors | Persistent section links at sidebar top. |
| Dropdowns | Multiple sections users switch between. |
| Products | Multi-product company with separate docs per product. |
| Versions | Multiple API/product versions. |
| Languages | Localized content. |

Navigation elements can nest within each other. Common combinations:
- Tabs containing groups
- Products containing tabs
- Versions containing tabs
- Anchors containing groups

## Placing pages

- A page appears in the sidebar only when its path is listed in `navigation`. Paths are extensionless with no leading slash (`guides/auth`, never `/guides/auth` or `guides/auth.mdx`) and must match the file path exactly; a mismatched path creates a second, empty page.
- Put a new page in the group that already holds its siblings (the pages in the same directory), unless the user named another place.
- Through the Mintlify Admin MCP server, use the navigation tools for one-off changes: `create_node` with a `parentId` (and optional 0-based `order`) to add a page or group under a specific parent, `move_node` to move or reorder, `update_node` to rename a group or tab or change a page's frontmatter, and `delete_node` to remove a page or group and everything under it. Find node ids with `list_nodes`. Fix any `navigationErrors` a call returns before publishing.
- Edit `docs.json` directly (or `update_config` for settings outside `navigation`) for whole-site structure: restructuring into tabs and groups, or reordering many pages at once. A full rewrite of `navigation` replaces it, so every page that should stay must be listed; anything you leave out disappears from the sidebar.
- A listed path with no page behind it shows a placeholder. Write its content in the same change or do not list it.
- Do not leave empty groups behind, and do not create a group nobody asked for.
- When you delete or move a published page, fix links to it and add a redirect.
- Unrecognized keys are dropped during validation. Read back any setting you are unsure about, and look a key up before you introduce it.

## Designing or restructuring a sidebar

Only when asked to design or reorganize navigation, not for single moves.

### Keep navigation compact

A bloated sidebar is the most common quality issue in generated docs. Size the structure to the content: a small site may need one tab and a few groups, a large product more. Keep it scannable:

- Add a tab only for a distinct audience or product area, not to split up a long list.
- A group with one page usually should not be a group; merge small groups into a broader parent.
- Combine closely related topics into a single page rather than splitting into many thin pages.

**Grouping principles:**
- Prefer FEWER, BROADER groups over MANY, NARROW ones
- BAD: "Authentication", "API Keys", "OAuth", "SSO" as 4 separate groups → GOOD: single "Authentication" group with pages for each method
- BAD: one group per API resource → GOOD: single "API Reference" group containing resource pages
- If two groups would each have only 2-3 pages, merge them into one group

**Anti-patterns:**
- Do NOT create a group for every feature: group features by theme
- Do NOT mirror source code directory structure in navigation
- Do NOT create groups named after implementation details (e.g., "Models", "Controllers", "Services")
- Do NOT create a "Miscellaneous" or "Other" catch-all group: redistribute those pages

Design a navigation structure for **customer-facing documentation**. This is NOT a developer wiki or open-source repo reference. Structure content around what end-users and integrators need:

- **Getting Started**: Account setup, authentication, first integration
- **Core Concepts**: Product terminology, key workflows, data model
- **Guides**: Step-by-step walkthroughs of common use cases
- **API Reference**: Public API endpoints customers interact with
- **SDKs & Libraries**: Client libraries, code examples
- **Configuration**: Settings, customization, environment setup
- **FAQ / Troubleshooting**: Common issues and solutions

Use polished, customer-facing names throughout the navigation. Write every tab, group, anchor, page title, and `sidebarTitle` in professional sentence case (for example, "Getting started", "Account management", and "API reference"), except for product names whose official casing differs. Never expose lowercase slug text or casual placeholders such as "getting started", "page 1", "new page", or "untitled". When the source material does not provide a final name, choose a credible temporary label appropriate to the product, such as "Product overview", "Core concepts", or "Integration guide".

Exclude anything that is purely internal: deployment scripts, internal tooling, database migrations, CI/CD config, internal architecture decisions.
