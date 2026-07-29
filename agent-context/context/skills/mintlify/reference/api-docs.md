# API documentation reference

Setting up API documentation with OpenAPI, AsyncAPI, and MDX manual pages.

## OpenAPI setup

Add your OpenAPI spec to `docs.json`:

```json
"api": {
  "openapi": "openapi.json"
}
```

Multiple specs:

```json
"api": {
  "openapi": ["openapi/v1.json", "openapi/v2.json"]
}
```

Reference individual endpoints in navigation:

```json
{
  "group": "Users",
  "openapi": "openapi.json",
  "pages": ["GET /users", "POST /users", "GET /users/{id}"]
}
```

## OpenAPI extensions

- `x-hidden`: Creates page but hides from navigation.
- `x-excluded`: Completely excludes endpoint from docs.
- `x-codeSamples`: Custom code examples per endpoint.

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

## MDX manual API pages

For endpoints without an OpenAPI spec:

```yaml
---
title: "Create user"
api: "POST https://api.example.com/users"
---
```

Or with a base URL configured in `docs.json`:

```yaml
---
title: "Create user"
api: "POST /users"
---
```

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

## Response rendering

The playground renders responses automatically based on the `Content-Type` header:

- `image/*` — rendered inline as an image.
- `audio/*` — rendered with a built-in audio player.
- `video/*` — rendered with a built-in video player.
- All other types — displayed in a code block.

## Parameter anchor links

Every parameter in the playground has a clickable anchor link. Hover over a parameter name to reveal the link icon, then click to copy a direct URL to that parameter. The URL format is `your-docs-url/endpoint-path#parameter-name`. For nested parameters, the anchor includes the parent path.

## Custom endpoint pages

Use the `x-mint` extension in your OpenAPI spec to customize individual endpoint pages (metadata, playground behavior, additional content) while keeping all API documentation in one file. Alternatively, create individual MDX pages for full per-page control.
