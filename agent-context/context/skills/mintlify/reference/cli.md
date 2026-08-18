# CLI reference

Condensed reference for common `mint` CLI commands and their key flags.

Install with `npm i -g mint`.

## Global flags

Available on all commands.

| Flag | Description |
|------|-------------|
| `--telemetry`, `-t` | Enable or disable anonymous usage telemetry. |
| `--help`, `-h` | Display help for the command. |
| `--version`, `-v` | Display the CLI version. Alias for `mint version`. |

## Local development

- `mint dev` — Start local preview at localhost:3000. `--port` sets the port. `--no-open` skips browser launch. `--groups <names>` mocks user groups. `--disable-openapi` skips OpenAPI processing. `--disable-prefetch` disables navigation prefetching. `--local-schema` allows locally-hosted OpenAPI files over HTTP.
- `mint validate` — Strict build validation; exits non-zero on warnings or errors. `--groups <names>` mocks user groups. `--disable-openapi` skips OpenAPI processing. `--local-schema` allows local OpenAPI files.
- `mint export` — Export a static site zip for air-gapped deployment. `--output <file>` sets the output path (default: `export.zip`). `--groups <names>` includes restricted pages. `--disable-openapi` skips OpenAPI processing.

## Content quality

- `mint broken-links` — Check for broken internal links. `--files <paths...>` limits the check to specific files or globs. `--check-anchors` validates `#` anchors. `--check-external` checks external URLs. `--check-redirects` checks that redirect destinations in `docs.json` resolve. `--check-snippets` checks links inside `<Snippet>` components.
- `mint a11y` — Accessibility checks (alt text, color contrast). `--skip-contrast` or `--skip-alt-text` to narrow scope.
- `mint score [url]` — Score a docs site's AI/agent readiness. Checks llms.txt, MCP discoverability, robots.txt, sitemap, structured data, response latency, and more. Requires `mint login`. Defaults to your configured subdomain. `--format` accepts `table` (default), `plain`, or `json`.
- `mint format` — Format every `.mdx` file in the current directory and its subdirectories in place. Respects `.gitignore` and Mintlify ignore rules. Commit or stash changes first so you can review the rewrite.

## Authentication

- `mint login` — Authenticate your Mintlify account.
- `mint logout` — Log out of your account.
- `mint status` — Show current authentication status (CLI version, email, org, subdomain).
- `mint signup [flags]` — Create a new Mintlify account from the terminal. Flags: `--firstName`, `--lastName`, `--company`, `--email`; omit any to enter it interactively. Waits until you click the emailed verification link before it logs you in — run as a background process in scripts.
- `mint add-domain <domain> [--basePath <path>]` — Add a custom domain to the current deployment. Requires `mint login`. Pass `--basePath` to serve the documentation from a subpath such as `/docs`.

## Configuration

- `mint config set <key> <value>` — Persist a config value. Valid keys: `subdomain`.
- `mint config get <key>` — Read a stored config value.
- `mint config clear <key>` — Remove a stored config value.

## Project setup

- `mint new [directory]` — Scaffold a new Mintlify docs site. `--name` and `--theme` set initial config. `--template` selects a pre-defined template. `--force` overwrites an existing directory.

## MCP setup

- `mint index [options]` — Install the hosted Mintlify Index MCP server (`https://index.mintlify.com/mcp`) in supported coding agents. The server exposes a `context` tool for researching libraries, frameworks, SDKs, APIs, and CLI tools across all public Mintlify sites. Separate from the [Mintlify Docs MCP server](/ai/model-context-protocol), which searches a single site.

  Client flags (pass one or more to skip the interactive picker): `--claude`, `--cursor`, `--vscode`, `--codex`, `--opencode`, `--windsurf`, `--zed`. Other flags: `--project` writes project-level configuration where the client supports it (Windsurf always writes MCP config globally); `--yes`, `-y` configures every detected client without prompts.

  The command adds a `mintlify-index` server entry plus a usage rule (for every client except Zed) that tells the agent to prefer the `context` tool over web search for documentation research. Reruns update the existing entry and rule and leave unrelated configuration intact. If a JSON/JSONC config file is invalid, the command reports an error and does not write to it.

  Standard configuration paths per client:

  | Client | Global | Project |
  |--------|--------|---------|
  | Claude Code | `~/.claude.json` | `.mcp.json` |
  | Cursor | `~/.cursor/mcp.json` | `.cursor/mcp.json` |
  | VS Code | User `mcp.json` | `.vscode/mcp.json` |
  | Codex | `~/.codex/config.toml` | `.codex/config.toml` |
  | OpenCode | `~/.config/opencode/opencode.json` | `opencode.json` |
  | Windsurf | `~/.codeium/windsurf/mcp_config.json` | Global only |
  | Zed | User `settings.json` | `.zed/settings.json` |

## Automations

All `mint automations` subcommands share these flags: `--subdomain`, `--format` (table/json; default: table). `mint workflow` and `mint workflows` continue to work as aliases.

- `mint automations create` — Create an automation. Requires exactly one trigger: `--cron <expr>` for scheduled or `--push-repo <owner/repo>` (repeatable) for push-triggered. Key flags: `--name`, `--type` (one of `changelog`, `source-code-agent`, `translations`, `writing-style`, `typo-check`, `broken-link-detection`, `seo-metadata-audit`, `assistant-docs-updates`, `contextual-feedback-docs-updates`; omit for custom), `--prompt`, `--context-repo` (repeatable, up to 10), `--automerge`, `--file <path>` (JSON/YAML file overrides inline flags).
- `mint automations list` — List automations for the current deployment.
- `mint automations delete <id>` — Delete an automation by ID. Use `mint automations list` to get the ID.

## Maintenance

- `mint update` — Update the CLI to the latest version.
- `mint version` — Show installed CLI and client versions.

## Telemetry

The CLI collects anonymous usage telemetry by default. Opt out with `--telemetry false` or by setting either environment variable:

| Variable | Value | Description |
|----------|-------|-------------|
| `MINTLIFY_TELEMETRY_DISABLED` | `1` | Disable Mintlify CLI telemetry. |
| `DO_NOT_TRACK` | `1` | Disable telemetry using the Console Do Not Track standard. |
