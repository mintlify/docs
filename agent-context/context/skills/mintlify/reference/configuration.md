# Configuration reference

Full docs.json settings, snippets, hidden pages, and custom CSS/JS.

## docs.json

The `docs.json` file controls the entire site. Required fields: `theme`, `name`, `colors.primary`, and `navigation`.

### Splitting configuration with `$ref`

Use `$ref` at any level of `docs.json` to load configuration from another JSON file. Useful for splitting large configs or sharing navigation across projects.

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
| `icon` | string | Lucide, Font Awesome, or Tabler icon name. Also accepts a single emoji, a URL, or a file path. |
| `iconType` | string | Font Awesome icon style: `regular`, `solid`, `light`, `thin`, `sharp-solid`, `duotone`, `brands`. |
| `tag` | string | Label next to page title in sidebar (e.g., "NEW"). |
| `hidden` | boolean | Remove from sidebar. Page still accessible by URL. Also excludes the page from search, sitemaps, external indexing, AI context, and `llms.txt`. To make a page visible again, remove the field entirely. Do not set `false`. |
| `noindex` | boolean | Exclude from site search, sitemaps, search engine indexing, and AI assistant context. Still visible in navigation. |
| `searchable` | boolean | At the page level, only `searchable: false` has an effect: excludes the page from site search and AI assistant context while keeping it indexable externally and visible in navigation. Does not override `hidden: true`. Pages with `searchable: false` still appear in `llms.txt` and `llms-full.txt`. |
| `boost` | number | Multiply the page's in-product search ranking. Values above 1 prioritize, between 0 and 1 de-prioritize. No effect when `searchable: false`. |
| `deprecated` | boolean | Show a "deprecated" label next to the page title. |
| `hideFooterPagination` | boolean | Hide the previous/next navigation links at the bottom of the page. |
| `related` | array or boolean | Related pages shown in the **Related topics** section, or `false` to hide it. Requires the Related pages add-on. |
| `hideApiMarker` | boolean | Hide the HTTP method badge next to the page title in the sidebar. |
| `contextual` | object | Override the site-wide contextual menu (`options`, `display`) for this page. `options: []` disables it. |
| `groups` | string[] | Limit the page to users in specific groups. With authentication, restricts access. With standalone personalization, only controls navigation visibility. Users can still open the page by direct URL. |
| `mode` | string | Page layout: `default`, `wide`, `custom`, `frame`, `center`, `assistant`. |
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

# Frame: like custom but keeps sidebar
---
title: "Page title"
mode: "frame"
---

# Center: removes sidebar and TOC, centers content (Maple and Almond keep the sidebar)
---
title: "Page title"
mode: "center"
---

# Assistant: full-screen assistant chat replaces page content (requires the assistant enabled)
---
title: "Ask AI"
mode: "assistant"
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

`logo.href` accepts an absolute URL or a relative path starting with `/` (for example, `/quickstart`). If omitted, the logo links to the homepage (or the current locale's first page).

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

Options: `"fontawesome"` (default), `"lucide"`, or `"tabler"`. You can only use one library per project. Individual icons can still use a single emoji, a URL, or a file path regardless of this setting.

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

Link and button `href` values accept an absolute URL or a relative path starting with `/`. For `github`, use a GitHub repository URL. For `discord`, use a Discord invite URL.

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

When a request matches more than one redirect, Mintlify uses exact `source` matches first, then partial wildcard matches (such as `/old/article-*`), then other wildcard matches. Within each step, the first matching entry in the array wins, so list specific sources before broader ones. Each source can contain only one wildcard; sources with more than one are skipped. A partial wildcard matches within a single path segment. Sources don't support regular expressions: `*` is the only wildcard character.

## Metadata

```json
"metadata": {
  "timestamp": true
}
```

Shows "Last modified on [date]" on all pages. Override per-page with `timestamp` frontmatter.

Date precedence: (1) the page's `lastUpdatedDate` frontmatter, (2) the date of the last Git commit that modified the page (GitHub/GitLab projects), (3) the most recent deployment timestamp. Set `lastUpdatedDate` when Git history doesn't reflect when content changed (e.g., imported or synced content).

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
  "indexing": "navigable",
  "paths": [
    {
      "path": "guides/v1",
      "metatags": { "robots": "noindex" }
    }
  ]
}
```

- `indexing`: `"navigable"` (only nav pages) or `"all"` (every page including hidden).
- `paths`: Folder-scoped meta tags. Each entry has `path` (folder relative to docs root, no leading or trailing slash, unique) and `metatags` (non-empty string values). Precedence: `seo.metatags` < matching `seo.paths` (longer path wins) < page frontmatter. Paths match page URLs, so language folders need their own entries (`guides/v1` doesn't apply to `es/guides/v1`). Mintlify ignores a `canonical` key in `paths` entries.

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
  "preset": "headline",
  "appearance": "light",
  "surface": "brand",
  "background": "/images/thumbnail-bg.svg",
  "fonts": {
    "family": "Inter"
  },
  "eyebrow": {
    "source": "tab",
    "style": "bar",
    "color": "#FDE68A"
  }
}
```

- `preset`: Layout. `"classic"` (logo top left), `"headline"` (title at the top, logo bottom right), or `"minimal"` (centered text above a logo panel). Default: `"classic"`, or the original layout when `background` is set without a preset. With a preset, the eyebrow always uses a monospace font.
- `appearance`: `"light"` or `"dark"`. Default: the site color scheme.
- `surface`: Background style for preset thumbnails, including the default `classic`. `"brand"` (default) tints the background and glow with the primary color hue, or uses `background.color` if set. `"neutral"` uses the site background color with no glow.
- `background`: Image path or absolute URL. On preset thumbnails, it replaces the `surface` background and glow.
- `fonts.family` (required with `fonts`): Google Fonts family name, or the name of a self-hosted font. `fonts.source`: URL or path to a self-hosted font file. `fonts.format`: `"woff"`, `"ttf"`, or `"otf"`; required with `source` (`woff2` is not supported). If the font fails to load, thumbnails use the default font.
- `eyebrow.source`: Navigation level whose name appears above the title: `"group"` (default), `"tab"`, `"dropdown"`, `"anchor"`, `"language"`, `"product"`, `"version"`, `"item"`, or `"none"` to hide it. Falls back to the group name when the page is not inside that level.
- `eyebrow.style`: `"plain"`, `"bar"`, or `"pill"` on preset thumbnails. Default: `"bar"` for `classic`, `"pill"` for `headline`, `"plain"` for `minimal`.
- `eyebrow.color`: Hex color on preset thumbnails. Default: derived from theme colors.

To override thumbnails for one page, add a `thumbnail` object to the page frontmatter. To override them for a section, add `thumbnail` to a group, tab, anchor, dropdown, product, version, language, or menu item in `docs.json`. An override accepts `preset`, `appearance`, `surface`, `background`, and `eyebrow`. In an override, `eyebrow` is the literal text shown above the title (`""` hides it), and `background: ""` removes an inherited image. Eyebrow `source`, `style`, and `color` are site-wide only. Mintlify resolves each key separately: page frontmatter first, then the nearest navigation section that sets it, then `thumbnails`. Invalid override values are ignored.

```yaml
---
title: "Webhooks"
thumbnail:
  preset: minimal
  eyebrow: "API Reference"
---
```

Preview a page's thumbnail locally with `mint og` (see the CLI reference).

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

- `openapi`: Single path or URL, array of paths/URLs/objects, or object with `source`, `directory`, and `overlays` (array of OpenAPI Overlay paths or URLs applied in order; `[]` disables all overlays, including auto-discovered ones).
- `asyncapi`: Single file, array, or object with `source` and `directory` for AsyncAPI specs.
- `playground.display`: `"interactive"`, `"simple"`, `"none"`, or `"auth"`.
- `playground.proxy`: Route requests through Mintlify's proxy. Default: `true`.
- `playground.credentials`: Include cookies and auth headers for cross-origin requests when proxy is `false`. Default: `false`.
- `params.expanded`: Expand all parameters by default. `"all"` or `"closed"` (default).
- `params.post`: OpenAPI schema field keys to surface as pills next to parameter names.
- `optional`: How optional request fields display in the playground. `"collapsed"` (default), `"expanded"`, or `"static"` (always shown, no toggle).
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

Store reusable content in the `/snippets/` directory. Snippet files must be `.mdx`, `.md`, `.js`, or `.jsx`. You cannot import `.json` or `.yaml` files directly. Keep data in a `.js` snippet with a named export, or generate one from a JSON or YAML source.

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

### npm packages

To import React components from npm packages, add a `packages` key to `docs.json` (an empty object turns it on), a `package.json` listing every imported package under `dependencies` (including `react` and `react-dom`), and a committed `package-lock.json` or `pnpm-lock.yaml` next to `docs.json`. Deployments with `packages` fail on sites that use authentication or personalization, or that restrict preview deployments with organization authentication or a password. While `packages` is in use, you can't turn on authentication, personalization, or preview access restrictions.

```json
"packages": {
  "css": ["@acme/ui/dist/styles.css"],
  "provider": "/snippets/provider.jsx",
  "registries": { "@acme": "https://npm.acme.com/" },
  "ssr": true
}
```

All fields are optional. `css` lists compiled stylesheets inside installed packages. `provider` points to a snippet that exports a `Provider` component, which wraps each package component separately. `registries` maps npm scopes to registry URLs. `ssr` (default `true`) renders package components to HTML at deploy time. Place package components on their own lines, and pass functions, arrays, objects, or JSX props through a wrapper component in a snippet.

### Data snippets

Export structured data from a `.js` snippet and render it with a `.jsx` snippet to keep tables, lists, or cards in sync across pages.

```js
// snippets/sdk-components.js
export const sdkComponents = [
  { name: "CardForm", version: "2.4.0", status: "Stable" },
  { name: "PinReveal", version: "1.9.2", status: "Beta" }
];
```

```mdx
import { sdkComponents } from "/snippets/sdk-components.js";
import { ComponentsTable } from "/snippets/components-table.jsx";

<ComponentsTable rows={sdkComponents} />
```

MDX expressions (imported variables like `{myName}` and inline expressions like `{1 + 1}`) are evaluated client-side. Their values are absent from a page's initial HTML and from offline exports. Crawlers, LLMs, and other tools that do not run JavaScript do not see them. Write values as plain text when they must be visible in those situations.

## Hidden pages

Set `hidden: true` in frontmatter to remove from sidebar. Page remains accessible by URL.

```yaml
---
title: "Internal reference"
hidden: true
---
```

Or omit the page from `docs.json` navigation entirely. The two approaches differ for external search engines: `hidden: true` adds a `noindex` meta tag to the page, while leaving the page out of `docs.json` only removes it from `sitemap.xml`, so a crawler that finds the URL elsewhere can still index it. Add `hidden: true` or `noindex: true` to the frontmatter when you need the meta tag.

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

Built-in Tailwind CSS v3 classes are available, including arbitrary values (e.g., `w-[350px]`) and variants (`sm:`, `hover:`, `dark:`). All built-in components except Banner, MDX, and Visibility accept a `className` prop. Write class names out in full: Mintlify generates CSS only for class names found in the page source, so runtime-assembled names produce no CSS. Avoid the inline `style` prop; it can cause layout shift on page load.

To style one page without a global `.css` file, add a `<style>` block whose child is a static template literal. Mintlify scopes every selector in the block to the page's content area, so rules do not affect navigation, the sidebar, or other pages. Allowed at-rules are `@media`, `@supports`, `@container`, and `@keyframes` named `page-` followed by letters, digits, `_`, or `-`; reference a keyframe from `animation` or a Tailwind arbitrary class such as `animate-[page-pulse_2s_infinite]`. Mintlify drops other at-rules (such as `@import` and `@font-face`), selectors that start with a combinator (`>`, `+`, `~`) or use `&`, `url()`, `image-set()` and other resource-loading declarations, `position: fixed`, `!important` inside keyframes, and attributes on `<style>`. It removes the whole block if the CSS is not a plain template literal (for example, it uses `${}` or a variable).

````mdx
<style>{`
  .pricing-callout {
    border-left: 4px solid #0D9373;
    padding-left: 1rem;
  }

  @keyframes page-pulse {
    from { opacity: 1; }
    to { opacity: 0.3; }
  }
`}</style>

<div className="pricing-callout">Prices shown in USD.</div>

<div className="animate-[page-pulse_1s_ease-in-out_infinite_alternate]">Live</div>
````

Inline SVGs in a page can use SMIL animation elements: `<animate>`, `<animateTransform>`, `<animateMotion>`, `<set>`, and `<mpath>`. Mintlify removes a SMIL element entirely if its `attributeName` targets `href`, `xlink:href`, `src`, `style`, or an `on*` attribute; if `values`, `from`, `to`, or `by` contains `javascript:`, `vbscript:`, or `data:`; if its `href` or `xlink:href` is anything other than a same-document `#fragment`; or if it has an `on*` attribute, an expression attribute, or a spread attribute. Animate presentation attributes such as `fill`, `opacity`, `transform`, `x`, or `d` with static string values.

````mdx
<svg width="40" height="40" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="8" fill="currentColor">
    <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
  </circle>
</svg>
````

### JavaScript

Any `.js` file in the content directory is included globally on all pages.
