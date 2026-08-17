# Configuration reference

Full docs.json settings, snippets, hidden pages, and custom CSS/JS.

## docs.json

The `docs.json` file controls the entire site. Required fields: `theme`, `name`, `colors.primary`, and `navigation`.

### Splitting configuration with `$ref`

Use `$ref` at any level of `docs.json` to load configuration from another JSON file. Useful for splitting large configs or sharing navigation across deployments.

```json
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "mint",
  "name": "Your Docs",
  "colors": { "primary": "#3B82F6" },
  "navigation": {
    "$ref": "./navigation.json"
  }
}
```

Rules:
- `$ref` must be a relative path to a `.json` file.
- When `$ref` resolves to an object, sibling keys in the same block take precedence over matching keys in the referenced file.
- When `$ref` resolves to a non-object (e.g., an array), sibling keys are ignored.
- Referenced files can contain their own `$ref` entries, resolved relative to that file.
- Paths must stay within the project root. Circular references cause a build error.

```json
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "mint",
  "name": "Your Docs",
  "colors": {
    "primary": "#3B82F6"
  },
  "navigation": {
    "groups": [
      {
        "group": "Getting started",
        "pages": ["index", "quickstart"]
      }
    ]
  }
}
```

## Complete frontmatter fields

The SKILL.md file lists common frontmatter fields. Here is the complete set. All fields are optional; if `title` is omitted, Mintlify generates one from the file path (dashes and underscores become spaces, first letter capitalized).

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title in navigation and browser tabs. Auto-generated from the path if omitted. |
| `description` | string | Brief description for SEO. Displays under the title. |
| `sidebarTitle` | string | Short title for sidebar navigation. |
| `icon` | string | Lucide, Font Awesome, or Tabler icon name. Also accepts a URL or file path. |
| `iconType` | string | Font Awesome icon style: `regular`, `solid`, `light`, `thin`, `sharp-solid`, `duotone`, `brands`. |
| `tag` | string | Label next to page title in sidebar (e.g., "NEW"). |
| `hidden` | boolean | Remove from sidebar. Page still accessible by URL. Do not set to `false`; remove the field entirely to make a page visible again. |
| `noindex` | boolean | Exclude from site search, sitemaps, search engine indexing, and AI assistant context. Still visible in navigation. |
| `searchable` | boolean | Defaults to `true`. Set `false` to exclude the page from site search and AI assistant context while keeping it indexable externally and visible in navigation. |
| `boost` | number | Multiply the page's in-product search ranking. Values above 1 prioritize, between 0 and 1 de-prioritize. No effect when `searchable: false`. |
| `deprecated` | boolean | Show a "deprecated" label next to the page title. |
| `hideFooterPagination` | boolean | Hide the previous/next navigation links at the bottom of the page. |
| `related` | array or boolean | Related pages shown in the **Related topics** section, or `false` to hide it. Requires the Related pages add-on. |
| `hideApiMarker` | boolean | Hide the HTTP method badge next to the page title in the sidebar. |
| `contextual` | object | Override the site-wide contextual menu (`options`, `display`) for this page. `options: []` disables it. |
| `groups` | string[] | Limit the page to users in specific groups. With authentication, restricts access. With standalone personalization, only controls navigation visibility. Users can still open the page by direct URL. |
| `mode` | string | Page layout: `default`, `wide`, `custom`, `frame`, `center`. |
| `keywords` | array | Search terms for internal search and SEO. |
| `api` | string | API endpoint for interactive playground (e.g., `"POST /users"`). |
| `openapi` | string | OpenAPI endpoint reference (e.g., `"GET /endpoint"`). |
| `url` | string | External URL. Makes the nav entry link externally. |
| `timestamp` | boolean | Override global timestamp setting for this page. |
| `lastUpdatedDate` | string | Explicit "last modified" date (e.g., `"2026-08-13"`). Takes precedence over the Git commit date. |

Any other key is accepted as custom frontmatter (e.g. `product: "API"`).

## Page modes

Control page layout with the `mode` frontmatter field.

```yaml
# Default: standard layout with sidebar and table of contents
---
title: "Page title"
---

# Wide: hides table of contents for extra horizontal space
---
title: "Page title"
mode: "wide"
---

# Custom: blank canvas, only top navbar visible
---
title: "Page title"
mode: "custom"
---

# Frame: like custom but keeps sidebar (Aspen, Almond, Luma, and Sequoia themes only)
---
title: "Page title"
mode: "frame"
---

# Center: removes sidebar and TOC, centers content (Mint, Linden, Willow, and Maple themes only)
---
title: "Page title"
mode: "center"
---
```

## Theme

One of: `mint`, `maple`, `palm`, `willow`, `linden`, `almond`, `aspen`, `sequoia`, `luma`.

| Theme | Character |
|-------|-----------|
| `mint` | Classic, time-tested |
| `maple` | Modern, clean, good for AI/SaaS |
| `palm` | Sophisticated, fintech-focused |
| `willow` | Stripped-back, minimal |
| `linden` | Retro terminal, monospace |
| `almond` | Card-based, minimalist |
| `aspen` | Modern, supports complex navigation |
| `sequoia` | Minimal, elegant, large-scale content |
| `luma` | Clean, minimal design for polished documentation |

## Colors

```json
"colors": {
  "primary": "#3B82F6",
  "light": "#F8FAFC",
  "dark": "#0F172A"
}
```

- `primary` (required): Main color, generally for emphasis in light mode.
- `light`: Color for emphasis in dark mode.
- `dark`: Color for buttons and hover states.

All values must be hex codes starting with `#`.

## Logo

```json
"logo": {
  "light": "/logo/light.svg",
  "dark": "/logo/dark.svg",
  "href": "https://example.com"
}
```

## Favicon

Single file or light/dark variants:

```json
"favicon": "/favicon.ico"
```

```json
"favicon": {
  "light": "/favicon.png",
  "dark": "/favicon-dark.png"
}
```

## Icons

```json
"icons": {
  "library": "lucide"
}
```

Options: `"fontawesome"` (default), `"lucide"`, or `"tabler"`. You can only use one library per project. Individual icons can still use URLs or file paths regardless of this setting.

## Fonts

```json
"fonts": {
  "family": "Inter"
}
```

Google Fonts load automatically by family name. For custom fonts:

```json
"fonts": {
  "family": "CustomFont",
  "source": "/fonts/CustomFont.woff2",
  "format": "woff2",
  "weight": 400,
  "heading": {
    "family": "HeadingFont",
    "weight": 700
  },
  "body": {
    "family": "BodyFont",
    "weight": 400
  }
}
```

## Appearance

```json
"appearance": {
  "default": "system",
  "strict": false
}
```

- `default`: `"system"`, `"light"`, or `"dark"`.
- `strict`: Set `true` to hide the light/dark mode toggle.

## Background

```json
"background": {
  "image": {
    "light": "/bg-light.svg",
    "dark": "/bg-dark.svg"
  },
  "decoration": "gradient",
  "color": {
    "light": "#FFFFFF",
    "dark": "#000000"
  }
}
```

- `decoration`: `"gradient"`, `"grid"`, or `"windows"`.

## Styling

```json
"styling": {
  "eyebrows": "breadcrumbs",
  "latex": true,
  "codeblocks": {
    "theme": {
      "light": "github-light",
      "dark": "github-dark"
    }
  }
}
```

- `eyebrows`: `"section"` (default) or `"breadcrumbs"`.
- `latex`: Override automatic LaTeX detection.
- `codeblocks`: `"system"` (default), `"dark"`, a Shiki theme name, or an object with `light`/`dark` themes.

## Navbar

```json
"navbar": {
  "links": [
    {
      "label": "Community",
      "href": "https://example.com/community"
    },
    {
      "type": "github",
      "href": "https://github.com/example/repo"
    }
  ],
  "primary": {
    "type": "button",
    "label": "Get Started",
    "href": "https://example.com/start"
  }
}
```

Link types: omit `type` for standard text link, `"github"` for repo with star count, `"discord"` for server with online count.

Primary button types: `"button"`, `"github"`, `"discord"`.

## Footer

```json
"footer": {
  "socials": {
    "x": "https://x.com/example",
    "github": "https://github.com/example",
    "linkedin": "https://linkedin.com/company/example"
  },
  "links": [
    {
      "header": "Resources",
      "items": [
        { "label": "Blog", "href": "https://example.com/blog" }
      ]
    }
  ]
}
```

Valid social keys: `x`, `website`, `facebook`, `youtube`, `discord`, `slack`, `github`, `linkedin`, `instagram`, `hacker-news`, `medium`, `telegram`, `bluesky`, `threads`, `reddit`, `podcast`.

## Banner

```json
"banner": {
  "content": "Version 2.0 is live! [Learn more](/changelog)",
  "dismissible": true,
  "type": "info",
  "color": {
    "light": "#7C3AED",
    "dark": "#5B21B6"
  }
}
```

- `content` (required): Supports basic Markdown (links, bold, italic). Custom components are not supported.
- `dismissible`: Show a close button. Stays hidden for a user until content changes. Default: `false`.
- `type`: Background style. `"info"` (primary color, default), `"warning"` (amber), `"critical"` (red).
- `color`: Custom background hex. Overrides `type`. Object with `light` and `dark` keys, or a single hex string. Banner text is white — choose a dark enough background.

Language-specific banners can be set inside the `navigation.languages` entries.

## Variables

Global content variables substituted at build time using `{{variableName}}` syntax in MDX files.

```json
"variables": {
  "apiVersion": "v2",
  "baseUrl": "https://api.example.com"
}
```

Keys must be alphanumeric with hyphens only. Values are plain strings. Use in any `.mdx` file:

```mdx
The current API version is {{apiVersion}}.
```

## Redirects

```json
"redirects": [
  {
    "source": "/old-page",
    "destination": "/new-page",
    "permanent": true
  }
]
```

## Metadata

```json
"metadata": {
  "timestamp": true
}
```

Shows "Last modified on [date]" on all pages. Override per-page with `timestamp` frontmatter.

Date precedence: (1) the page's `lastUpdatedDate` frontmatter, (2) the date of the last Git commit that modified the page (GitHub/GitLab deployments), (3) the most recent deployment timestamp. Set `lastUpdatedDate` when Git history doesn't reflect when content changed (e.g., imported or synced content).

## Interaction

```json
"interaction": {
  "drilldown": false
}
```

Controls whether clicking a navigation group navigates to its first page (`true`) or only expands/collapses (`false`).

## SEO

```json
"seo": {
  "metatags": {
    "canonical": "https://docs.example.com",
    "og:locale": "en_US"
  },
  "indexing": "navigable"
}
```

- `indexing`: `"navigable"` (only nav pages) or `"all"` (every page including hidden).

## Search

```json
"search": {
  "prompt": "Search documentation..."
}
```

## Contextual menu

```json
"contextual": {
  "options": ["copy", "chatgpt", "claude", "cursor", "vscode"],
  "display": "header"
}
```

- `options` (required): First item is the default action. Built-in values: `"assistant"`, `"copy"`, `"view"`, `"download-pdf"`, `"download-spec"`, `"chatgpt"`, `"claude"`, `"perplexity"`, `"grok"`, `"aistudio"`, `"devin"`, `"devin-desktop"`, `"mcp"`, `"add-mcp"`, `"cursor"`, `"vscode"`, `"devin-mcp"`. Custom objects accepted with `title`, `description`, `icon`, and `href` fields.
- `display`: Where to show the menu. `"header"` (default) or `"toc"`.

## Thumbnails

```json
"thumbnails": {
  "appearance": "light",
  "background": "/images/thumbnail-bg.svg",
  "fonts": {
    "family": "Inter"
  }
}
```

## Error handling

```json
"errors": {
  "404": {
    "redirect": true,
    "title": "Page not found",
    "description": "This page doesn't exist."
  }
}
```

## API configuration

```json
"api": {
  "openapi": "openapi.json",
  "playground": {
    "display": "interactive",
    "proxy": true
  },
  "examples": {
    "languages": ["bash", "javascript", "python"],
    "defaults": "all",
    "prefill": false,
    "autogenerate": true
  },
  "mdx": {
    "server": "https://api.example.com",
    "auth": {
      "method": "bearer"
    }
  }
}
```

- `openapi`: Single file, array, or object with `source` and `directory`.
- `asyncapi`: Same format as `openapi` for AsyncAPI specs.
- `playground.display`: `"interactive"`, `"simple"`, `"none"`, or `"auth"`.
- `playground.proxy`: Route requests through Mintlify's proxy. Default: `true`.
- `playground.credentials`: Include cookies and auth headers for cross-origin requests when proxy is `false`. Default: `false`.
- `params.expanded`: Expand all parameters by default. `"all"` or `"closed"` (default).
- `params.post`: OpenAPI schema field keys to surface as pills next to parameter names.
- `url`: Set to `"full"` to always show the full base URL (default: only shown when multiple base URLs exist).
- `examples.languages`: `bash`, `python`, `javascript`, `node`, `php`, `go`, `java`, `ruby`, `powershell`, `swift`, `csharp`, `dotnet`, `typescript`, `c`, `c++`, `kotlin`, `rust`, `dart`.
- `examples.defaults`: `"required"` or `"all"` (include optional params).
- `examples.prefill`: Pre-fill playground fields with spec example values. Default: `false`.
- `examples.autogenerate`: Generate code samples from API specs. Default: `true`.
- `mdx.auth.method`: `"bearer"`, `"basic"`, `"key"`, `"cobo"`.

## Integrations

```json
"integrations": {
  "ga4": { "measurementId": "G-XXXXXXXXXX" },
  "gtm": { "tagId": "GTM-XXXXX" },
  "posthog": { "apiKey": "phc_xxx", "apiHost": "https://app.posthog.com" },
  "amplitude": { "apiKey": "xxx" },
  "mixpanel": { "projectToken": "xxx" },
  "segment": { "key": "xxx" },
  "clarity": { "projectId": "xxx" },
  "fathom": { "siteId": "xxx" },
  "hotjar": { "hjid": "xxx", "hjsv": "xxx" },
  "logrocket": { "appId": "xxx" },
  "heap": { "appId": "xxx" },
  "pirsch": { "id": "xxx" },
  "plausible": { "domain": "xxx", "server": "optional" },
  "hightouch": { "writeKey": "xxx", "apiHost": "optional" },
  "clearbit": { "publicApiKey": "xxx" },
  "intercom": { "appId": "xxx" },
  "frontchat": { "snippetId": "xxx" },
  "telemetry": { "enabled": true },
  "cookies": { "key": "consent_key", "value": "accepted" }
}
```

## Reusable snippets

Store reusable content in the `/snippets/` directory.

### MDX snippets

```mdx
<!-- snippets/prerequisites.mdx -->
Before you begin, make sure you have:
- Node.js 18+
- A Mintlify account
```

Import in any page:

```mdx
import Prerequisites from "/snippets/prerequisites.mdx";

<Prerequisites />
```

### JSX components

```jsx
// snippets/counter.jsx
export const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};
```

Import in any page using the root-relative path to the file:

```mdx
import { Counter } from "/snippets/counter.jsx";

<Counter />
```

JSX components can live in any directory, not just `/snippets/`. Nested imports between snippet files are not supported.

## Hidden pages

Set `hidden: true` in frontmatter to remove from sidebar. Page remains accessible by URL.

```yaml
---
title: "Internal reference"
hidden: true
---
```

Or omit the page from `docs.json` navigation entirely.

## .mintignore

Exclude files completely from the published docs. Place `.mintignore` in the docs root. Uses `.gitignore` syntax.

```
drafts/
*.draft.mdx
private-notes.md
**/internal/**
!important.mdx
```

Files in `.mintignore` are not published, not indexed, and not accessible by URL.

## Custom CSS and JavaScript

### CSS

Add `.css` files to your repository. Class names become available in all MDX files.

```css
/* styles.css */
#navbar {
  background: #fffff2;
}
```

Built-in Tailwind CSS v3 classes are available. Arbitrary values (e.g., `w-[350px]`) are not supported — use inline `style` instead.

### JavaScript

Any `.js` file in the content directory is included globally on all pages.
