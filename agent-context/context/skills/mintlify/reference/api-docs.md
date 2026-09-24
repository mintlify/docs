# API documentation reference

Setting up API documentation with OpenAPI, AsyncAPI, and MDX manual pages.

## OpenAPI setup

Spec requirements:
- OpenAPI 3.0 or 3.1, in JSON or YAML, stored in the repo or hosted at a public URL.
- `$ref` supports internal references only. External references are not supported.
- Include a `servers` field with the API base URL. Without it, the playground falls back to simple mode because it can't send requests.
- Define `components.securitySchemes` and `security` to get auth inputs in the playground.

Add an `openapi` field to a navigation element (tab, group, anchor, and so on) to generate endpoint pages there. With no `pages`, every endpoint in the spec gets a page:

```json
"navigation": {
  "tabs": [
    { "tab": "API reference", "openapi": "openapi.json" }
  ]
}
```

- The value can be a path, a URL, an array of specs, or an object: `{ "source": "openapi.json", "directory": "api-reference" }`. `directory` sets where generated pages live (default `api-reference`).
- To mix endpoints with other pages, set `openapi` on the element and list endpoints in `pages` as `METHOD /path`. Child elements inherit the parent's spec unless they set their own.
- To pull an endpoint from a specific spec without a default, use `"/path/to/spec.json POST /users"` as the page entry.
- `api.openapi` in `docs.json` accepts the same values.
- Hosted spec URLs don't trigger a redeploy when the spec changes. Call the trigger deployment API from the spec's CI to keep docs current.
- Use `mint dev --local-schema` to preview a spec served from `http://localhost`. Production requires HTTPS URLs.
- Generated pages take `title` from the operation `summary` (or method and path), `description` from `description`, and show a deprecated label when `deprecated: true`.

```json
{
  "group": "Users",
  "openapi": "openapi.json",
  "pages": ["users/overview", "GET /users", "POST /users", "GET /users/{id}"]
}
```

### Overlays

Transform an OpenAPI spec without editing its source file using [OpenAPI Overlay](https://spec.openapis.org/overlay/v1.1.0.html) documents (Overlay versions 1.0 and 1.1). List overlays with the object form of `openapi`, which works anywhere `openapi` is accepted, including navigation elements and arrays:

```json
"openapi": {
  "source": "openapi.json",
  "overlays": ["overlays/rename-paths.yaml", "https://example.com/overlays/servers.yaml"]
}
```

An overlay document has an `overlay` version, an `info` object with `title` and `version`, an optional `extends` field linking it to a spec, and an `actions` array. Each action selects nodes with an RFC 9535 JSONPath `target` and applies one modifier: `update` (merge value into node), `remove` (delete node when `true`), or `copy` (copy node from another JSONPath; Overlay 1.1 only).

- Overlays apply in listed order, after parsing and before validation. Generated pages, navigation, `openapi` frontmatter references, and `mint validate` all use the transformed document, so frontmatter must reference post-overlay paths.
- Overlay paths must point to files inside the docs repo; overlay URLs must use `https`. Referencing the same spec with different `overlays` lists in different places fails the build.
- Auto-discovery: any JSON or YAML file with a top-level `overlay` key whose `extends` field resolves to one of your specs applies automatically, in alphabetical order of file paths. An explicit `overlays` list replaces auto-discovery for that spec. Set `"overlays": []` to disable all overlays for a spec.
- Explicit overlays that fail to load or apply fail the spec's validation; failed auto-discovered overlays are skipped and the spec publishes without them.

### File uploads

For OpenAPI 3.1 specs, describe a file upload field as a string schema with a binary `contentMediaType` inside a `multipart/form-data` request body. The playground renders it as a file input and sends the request as multipart form data.

```json
{
  "type": "object",
  "properties": {
    "file": {
      "type": "string",
      "contentMediaType": "application/octet-stream"
    }
  },
  "required": ["file"]
}
```

- Binary media types such as `application/octet-stream`, images, audio, video, PDFs, and archives are treated as file uploads. Structured types such as `application/json` are not.
- `contentEncoding` of `base64` or `base64url` sends the file as base64; other values use binary handling. A `contentEncoding` without a binary `contentMediaType` stays a text field.
- The legacy `format: "binary"` and `format: "base64"` fields remain supported.

## OpenAPI extensions

- `x-hidden`: Creates page but hides from navigation.
- `x-excluded`: Completely excludes endpoint from docs.
- `x-codeSamples`: Custom code examples per endpoint.
- `x-mint.playground.expand`: Set to `false` on an operation to collapse nested object fields in the playground by default. Request sections (Authorization, Headers, Query, Path, Body) and the top-level body object stay expanded. Defaults to expanded when unset.

```yaml
paths:
  /users:
    get:
      x-codeSamples:
        - lang: "bash"
          label: "List users"
          source: |
            curl https://api.example.com/users
```

## MDX pages from an OpenAPI spec

Create an MDX page per endpoint to control its metadata, content, and position while keeping the generated reference. The method and path must exactly match the spec.

```yaml
---
title: "Get users"
openapi: "openapi/users.json GET /users"
---
```

- Always include the spec file path when the repo contains more than one spec. Mintlify uploads every spec in the repo, even unreferenced ones, and `openapi: "GET /users"` without a path can resolve to the wrong spec.
- Webhooks (OpenAPI 3.1): `openapi: "openapi.json webhook orderUpdated"`, where the name matches a key in `webhooks`.
- Data models: `openapi-schema: "openapi.json OrderItem"` renders a `components.schemas` entry. The file path is optional unless schema names collide across specs.
- Generate MDX files from a spec with `npx @mintlify/scraping@latest openapi-file <path-to-spec> -o <folder>`.

## MDX manual API pages

For endpoints without an OpenAPI spec, set `api` in frontmatter and document parameters and responses with `ParamField` and `ResponseField`:

```mdx
---
title: "Create user"
api: "POST /users/{userId}"
---

<ParamField path="userId" type="string" required>
  Unique identifier for the user.
</ParamField>

<ParamField body="email" type="string" required>
  User's email address.
</ParamField>

<ResponseField name="id" type="string" required>
  ID of the created user.
</ResponseField>
```

- `api` takes a full URL (`POST https://api.example.com/users`, ignores `api.mdx.server`) or a relative path (requires `api.mdx.server` in `docs.json`). Wrap path parameters in `{}`.
- Wrap request and response code samples in `<RequestExample>` and `<ResponseExample>` to show them in the right sidebar.
- `playground` frontmatter (`interactive`, `simple`, `none`) overrides `api.playground.display` for the page.
- `authMethod` frontmatter (`bearer`, `basic`, `key`, `none`) overrides `api.mdx.auth.method` for the page. `none` disables auth.

## AsyncAPI

For WebSocket and event-driven APIs:

```json
"api": {
  "asyncapi": "asyncapi.yaml"
}
```

Reference channels in frontmatter:

```yaml
---
title: "WebSocket channel"
asyncapi: "/path/to/asyncapi.json channelName"
---
```

## Playground configuration

Control the API playground behavior in `docs.json`:

```json
"api": {
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

- `playground.display`: `"interactive"`, `"simple"`, `"none"`, or `"auth"`.
- `playground.proxy`: Route requests through Mintlify's proxy. Default: `true`.
- `playground.credentials`: Include cookies and auth headers for cross-origin requests when proxy is `false`. Default: `false`.
- `params.expanded`: Expand all parameters by default. `"all"` or `"closed"` (default).
- `params.post`: OpenAPI schema field keys to surface as pills next to parameter names (array of strings).
- `url`: Set to `"full"` to always show the full base URL.
- `examples.languages`: Supported values — `bash` (cURL), `python`, `javascript`, `node`, `php`, `go`, `java`, `ruby`, `powershell`, `swift`, `csharp`, `dotnet`, `typescript`, `c`, `c++`, `kotlin`, `rust`, `dart`.
- `examples.defaults`: `"required"` or `"all"` (include optional params).
- `examples.prefill`: Pre-fill playground fields with spec example values. Default: `false`.
- `examples.autogenerate`: Generate code samples from API specs. Default: `true`.
- `mdx.auth.method`: `"bearer"`, `"basic"`, `"key"`, `"cobo"`.
- `mdx.auth.name`: Header name for the API key, such as `x-api-key`. Required with `"key"`.

### Runtime server variables

Prefill OpenAPI server variables from custom JavaScript when values become available after page load (for example, after authentication or a tenant change). Runtime values take precedence over OpenAPI defaults and saved values. They apply to open and future playgrounds for the current page session, and reset on a full-page refresh. Do not use them for secrets.

```js
window.mintlify.api.playground.setServerVariables({
  tenantDomain: "example.us.auth0.com",
});

// Clear runtime values
window.mintlify.api.playground.clearServerVariables();
```

## Response rendering

The playground renders responses automatically based on the `Content-Type` header:

- `image/*` — rendered inline as an image.
- `audio/*` — rendered with a built-in audio player.
- `video/*` — rendered with a built-in video player.
- All other types — displayed in a code block.

## Parameter anchor links

Every parameter in the playground has a clickable anchor link. Hover over a parameter name to reveal the link icon, then click to copy a direct URL to that parameter. The URL format is `your-docs-url/endpoint-path#parameter-name`. For nested parameters, the anchor includes the parent path.

## Custom endpoint pages

Use the `x-mint` extension on an operation to customize its generated page while keeping everything in the spec. For full per-page control, create MDX pages from the spec instead.

- `x-mint.metadata`: Any frontmatter field except `openapi` (for example `title`, `sidebarTitle`, `description`). Includes `playground`, `groups`, and `public`, so `{"playground": "auth", "groups": ["admin"], "public": true}` makes the page public while limiting the playground to authenticated `admin` users.
- `x-mint.content`: MDX (any Mintlify component) rendered before the generated reference.
- `x-mint.href`: Custom URL for the generated page.
- `x-mint.playground.expand`: `false` collapses nested object fields in the playground (see OpenAPI extensions above).
- `x-mint.pre` / `x-mint.post` (on any schema): Arrays of strings rendered as pills before or after the parameter name.

```json
"/users": {
  "get": {
    "summary": "Get users",
    "x-mint": {
      "metadata": { "title": "List all users", "sidebarTitle": "List users" },
      "content": "## Prerequisites\n\n<Note>Requires an admin API key.</Note>",
      "href": "/api-reference/users/list"
    }
  }
}
```
