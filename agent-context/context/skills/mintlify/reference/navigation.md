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
        { "language": "en", "default": true },
        { "language": "es" }
      ],
      "versions": [
        { "version": "v2", "default": true },
        { "version": "v1" }
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
- `global.languages`: Each entry requires `language` (code string). Optional: `default`, `hidden`, `href`.
- `global.versions`: Each entry requires `version` (string). Optional: `default`, `hidden`, `href`.
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
