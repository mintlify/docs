# CLI reference

Condensed reference for common `mint` CLI commands and their key flags.

Install with `npm i -g mint`. The npm package is `mint`; do not install the legacy `mintlify` package.

## Global flags

Available on all commands.

| Flag | Description |
|------|-------------|
| `--telemetry`, `-t` | Enable or disable usage telemetry. |
| `--help`, `-h` | Display help for the command. |
| `--version`, `-v` | Display the CLI version. Alias for `mint version`. |

## Local development

- `mint dev`: Start local preview at localhost:3000. In a directory without `docs.json`, it generates one from the directory structure: root Markdown and MDX files go in an **Introduction** group, each top-level folder becomes a group (nested folders become subgroups, and leading number prefixes such as `01-` are dropped from group names), `index` and `readme` pages sort first, and paths starting with `.` or `_`, `node_modules`, `snippets`, and `.mintignore` entries are skipped. The site name comes from `name` in a `package.json` in the directory or its parent, otherwise the directory name. `--port` sets the port. `--host` exposes the preview on your network so other devices can open it; without it, the preview only accepts connections at `localhost`. `--no-open` skips browser launch. `--groups` mocks user groups (space-separated, e.g. `--groups admin user`). `--signed-in` previews as a signed-in reader with no groups; without `--signed-in` or `--groups`, the preview shows the signed-out view. `--disable-openapi` skips OpenAPI processing. `--disable-prefetch` disables navigation prefetching. `--local-schema` allows locally-hosted OpenAPI files over HTTP. The preview generates each page's OG image from local files at `/_mintlify/og/<page-path>.png` (`index.png` for the home page) and regenerates it on every request. Each page's `og:image` meta tag points to that image unless the page sets a custom `og:image`.
- `mint og [page]` — Render a page's social preview (OG) image to a PNG using the `docs.json` `thumbnails` settings and page or section `thumbnail` overrides. `page` defaults to `index`. `--preset` (`classic`, `headline`, `minimal`), `--surface` (`brand`, `neutral`), and `--appearance` (`light`, `dark`) try settings without editing `docs.json`. `--output <file>` sets the PNG path (default: a temporary file). `--no-open` skips opening the image; it is also skipped when `CI` is set. Warnings (title too long, missing logo, font load failure, low contrast) don't change the exit code. Exits `1` if `docs.json` is invalid or the page doesn't exist.
- `mint validate` — Strict build validation; exits non-zero on warnings or errors. `--groups` mocks user groups (space-separated). `--disable-openapi` skips OpenAPI processing. `--local-schema` allows local OpenAPI files.
- `mint export`: Export a static site zip for air-gapped deployment. `--output <file>` sets the output path (default: `export.zip`). `--groups` includes restricted pages (space-separated). `--disable-openapi` skips OpenAPI processing. `--base-path <path>` serves the export under a subpath such as `/docs` (letters, numbers, hyphens, and underscores, with `/` between segments); without it, the export must be served from the domain root. The export fails if any page path starts with the base path. `--client-version <version>` builds with a specific Mintlify client release (default: the latest release compatible with the CLI). The export includes a local search index, so search works offline and skips pages hidden from search.

## Content quality

- `mint broken-links` — Check for broken internal links. `--files <paths...>` limits the check to specific files or globs. `--check-anchors` validates `#` anchors. `--check-external` checks external URLs. `--check-redirects` checks that redirect destinations in `docs.json` resolve. `--check-snippets` checks that snippet import paths resolve. Relative and `#` links inside snippets are checked against each page that renders the snippet.
- `mint a11y` — Accessibility checks (alt text, color contrast). `--skip-contrast` or `--skip-alt-text` to narrow scope.
- `mint score [url]` — Score a docs site's AI/agent readiness. Checks llms.txt, MCP discoverability, robots.txt, sitemap, structured data, response latency, and more. Requires `mint login`. Defaults to your configured subdomain. `--format` accepts `table` (default), `plain`, or `json`.
- `mint format` — Format every `.mdx` file in the current directory and its subdirectories in place. Respects `.gitignore` and Mintlify ignore rules. Commit or stash changes first so you can review the rewrite.

## Authentication

- `mint login` — Authenticate your Mintlify account.
- `mint logout` — Log out of your account.
- `mint status` — Show current authentication status (CLI version, email, org, subdomain).
- `mint signup [flags]` — Create a new Mintlify account from the terminal. Flags: `--firstName`, `--lastName`, `--company`, `--email`; omit any to enter it interactively. Waits until you click the emailed verification link before it logs you in — run as a background process in scripts.
- `mint add-domain <domain> [--basePath <path>]` — Add a custom domain to the current project. Requires `mint login`. Pass `--basePath` to serve the documentation from a subpath such as `/docs`.

## Analytics

Query documentation analytics from the terminal. Requires `mint login` and a Pro or Enterprise plan. All `mint analytics` subcommands share these flags: `--subdomain`, `--from <YYYY-MM-DD>` (default: seven days ago, or `mint config set dateFrom`), `--to <YYYY-MM-DD>` (default: today, or `mint config set dateTo`), `--format` (`table`, `plain`, `json`, or `graph`; default: `plain`, or `json` in AI/CI environments).

- `mint analytics stats` — Top-line KPIs for a date range: views, visitors, searches, feedback, assistant usage. Human and agent traffic reported separately. `--page` filters to a page path.
- `mint analytics search` — Search queries with hit counts, click-through rates, top clicked page, and last searched date. `--query` filters by substring; `--page` filters to queries where the given page was the top clicked result.
- `mint analytics feedback` — User feedback entries. `--type page` aggregates by page path; `--type code` limits to code snippet feedback; `--page` filters to a page path.
- `mint analytics conversation list` — Recent assistant conversations. `--page` filters to conversations whose sources reference the page path.
- `mint analytics conversation view <id>` — Full message thread for one conversation.
- `mint analytics conversation buckets list` — Conversation clusters grouped by topic.
- `mint analytics conversation buckets view <id>` — Threads in a bucket. `--limit` (1-100), `--cursor` for pagination.

## Configuration

- `mint config set <key> <value>` — Persist a config value. Valid keys: `subdomain`, plus `dateFrom` and `dateTo` (defaults for `mint analytics`).
- `mint config get <key>` — Read a stored config value.
- `mint config clear <key>` — Remove a stored config value.

## Project setup

- `mint deploy` — Provision an anonymous docs site without login and print a hosted Git repository URL plus a short-lived write token. The CLI does not upload files: clone the hosted repository into a separate directory, copy `docs.json`, pages, and assets to its root, commit, and push to `main` with the token as an HTTP `Authorization: Bearer` header for that Git operation only. Never put the token in a remote URL, Git config, or public logs. `--subdomain` (required for the first deployment or `--new`), `--org-name`, `--directory` (default: `.`), `--new` creates another site, `--email` also returns a claim link. Rerun from the same directory to reuse the site and get a fresh token. Inside GitHub Actions (`GITHUB_ACTIONS=true`), `mint deploy` skips login and agent credentials: it exchanges the job's OIDC token for a write token and force-pushes the checked-out commit (the `--directory` subtree, or the repository root) to the site's `main`. The workflow needs `permissions: id-token: write`, `--subdomain` is required, and the repository and branch must be trusted for the site, otherwise the deploy fails with a 403.
- `mint claim` — Claim a site created with `mint deploy`. Run `mint claim --email <email>` to get a claim link, show it to the user, and ask them to sign in and return the displayed code. Then run `mint claim --code <code>`. `--email` and `--code` can't be combined. Run both from the original `mint deploy` directory, or pass `--directory`. The CLI uses its saved credentials; never read or print keychain secrets. Never invent an email address. If Mintlify signup fails, retry the same `--code` command.
- `mint new [directory]` — Scaffold a new Mintlify docs site. `--name` and `--theme` set initial config. `--template` selects a pre-defined template. `--force` overwrites an existing directory.

## Maintenance

- `mint update` — Update the CLI to the latest version.
- `mint version` — Show installed CLI and client versions.

## Telemetry

The CLI collects usage telemetry by default (command name, CLI version, OS, architecture, Node.js version, whether it runs in CI or an interactive terminal, whether this is its first run on the machine, whether you are logged in, and the detected AI coding agent name). When you are logged in, telemetry events also include your account email; logged-out usage stays anonymous. Opt out with `--telemetry false` or by setting either environment variable:

| Variable | Value | Description |
|----------|-------|-------------|
| `MINTLIFY_TELEMETRY_DISABLED` | `1` | Disable Mintlify CLI telemetry. |
| `DO_NOT_TRACK` | `1` | Disable telemetry using the Console Do Not Track standard. |
