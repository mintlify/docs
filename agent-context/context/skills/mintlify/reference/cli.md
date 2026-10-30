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

- `mint dev`: Start local preview at localhost:3000. `--port` sets the port. `--host` exposes the preview on your network so other devices can open it; without it, the preview only accepts connections at `localhost`. `--no-open` skips browser launch. `--groups` mocks user groups (space-separated, e.g. `--groups admin user`). `--signed-in` previews as a signed-in reader with no groups; without `--signed-in` or `--groups`, the preview shows the signed-out view. `--disable-openapi` skips OpenAPI processing. `--disable-prefetch` disables navigation prefetching. `--local-schema` allows locally-hosted OpenAPI files over HTTP.
  - In a directory with no `docs.json` or `mint.json`, it writes a `docs.json` generated from the directory structure: root Markdown and MDX files go in an **Introduction** group, each top-level folder becomes a group (nested folders become subgroups, and leading number prefixes such as `01-` are dropped from group names), `index` and `readme` pages sort first, and paths starting with `.` or `_`, `node_modules`, `snippets`, and `.mintignore` entries are skipped. The site name comes from `name` in a `package.json` in the directory or its parent, otherwise the directory name.
  - The preview generates each page's OG image from local files at `/_mintlify/og/<page-path>.png` (`index.png` for the home page) and regenerates it on every request. Each page's `og:image` meta tag points to that image unless the page sets a custom `og:image`.
- `mint og [page]` — Render a page's social preview (OG) image to a PNG using the `docs.json` `thumbnails` settings and page or section `thumbnail` overrides. `page` defaults to `index`. `--preset` (`classic`, `headline`, `minimal`), `--surface` (`brand`, `neutral`), and `--appearance` (`light`, `dark`) try settings without editing `docs.json`. `--output <file>` sets the PNG path (default: a temporary file). `--no-open` skips opening the image; it is also skipped when `CI` is set. Warnings (title too long, missing logo, font load failure, low contrast) don't change the exit code. Exits `1` if `docs.json` is invalid or the page doesn't exist.
- `mint export`: Export a static site zip for air-gapped deployment. `--output <file>` sets the output path (default: `export.zip`). `--groups` includes restricted pages (space-separated). `--disable-openapi` skips OpenAPI processing. `--base-path <path>` serves the export under a subpath such as `/docs` (letters, numbers, hyphens, and underscores, with `/` between segments); without it, the export must be served from the domain root. The export fails if any page path starts with the base path. `--client-version <version>` builds with a specific Mintlify client release (default: the latest release compatible with the CLI). The export includes a local search index, so search works offline and skips pages hidden from search.

## Validate

`mint validate` runs rules over pages, snippets, navigation, and OpenAPI specs, then a strict build, and prints findings grouped by file. The build runs only when no rule reported an error and a selected rule needs it.

For a quick loop while editing, run `mint validate --no-build --format json`, apply `--fix` for the issues it can fix, and fix the rest by hand. Run a full `mint validate` before you push.

Exit codes:

- `0`: no errors. Warnings don't fail the run.
- `1`: one or more errors.
- `2`: validate couldn't run, for example an unknown rule or group, `--files` matching nothing, or a crash.

Rules:

| Rule | Group | Severity | Needs build | `--fix` | Checks |
|------|-------|----------|-------------|---------|--------|
| `parse-error` | `content` | error | no | no | Files MDX can't parse. Always runs; other rules skip these files. |
| `void-tags` | `content` | error | no | yes | Lowercase HTML void elements (`<br>`, `<img>`, `<source>`, `<input>`, …) that aren't self-closed. Components such as `<Source />` aren't flagged. |
| `duplicate-h1` | `content` | warning | no | yes | A page's first heading is an H1 that repeats the frontmatter `title`. Skipped when `mode` is `custom` or `frame`. Not auto-fixed when the heading has a custom `{#id}` or links point to its anchor. |
| `unknown-component` | `content` | warning | no | yes | JSX components on a page that aren't built in, imported, or exported. The fix adds an import when `snippets/<Name>.jsx` or `.tsx` exists. |
| `katex` | `content` | warning | no | no | Math KaTeX can't render. Currency amounts such as `$5` are ignored. |
| `foreign-syntax` | `content` | warning | no | no | Syntax from other docs frameworks that Mintlify doesn't render: GitBook/Liquid tags, Hugo shortcodes, `:::` admonitions, MkDocs `!!!` admonitions, Kramdown `{: }` attributes, `[[wiki links]]`, ReadMe `doc:` links, and `@site/` paths. Each finding names the Mintlify replacement. Runs on files MDX can't parse. |
| `missing-file` | `content` | error | yes | no | Imported files that don't exist. |
| `import-error` | `content` | error | yes | no | Imports in pages and snippets that don't resolve. |
| `missing-nav-page` | `nav` | error | yes | no | Pages in the navigation that have no file. |
| `package-import` | `config` | error | yes | no | npm package imports that are undeclared or conflict. |
| `build-failed` | `config` | error | yes | no | The strict build failed for a reason no other rule reports. |
| `openapi-spec` | `openapi` | error | no | no | Specs in `docs.json` or `mint.json` that don't parse or validate, with overlays applied. Remote specs are fetched even with `--no-build`. |
| `openapi-build` | `openapi` | error | yes | no | OpenAPI pages the build couldn't generate. |

Flags:

- `--files <paths...>`: Limit page checks to specific `.md` or `.mdx` files or globs. Site-wide checks and the build still cover the whole site.
- `--disable <list>` and `--enable <list>`: Turn rules or groups off or on. Comma-separated rule ids, groups (`content`, `nav`, `config`, `openapi`), or `all`. For example, `--disable all --enable content` runs only content rules (`missing-file` and `import-error` still run the build). `parse-error` can't be turned off.
- `--disable openapi`: Skip OpenAPI checks. `mint validate` no longer accepts `--disable-openapi`; `mint dev` and `mint export` still do.
- `--no-build`: Skip the strict build, so no client download is needed.
- `--fix`: Write the available automatic fixes to disk, then check again. Runs up to five fix passes, since one fix can unlock another, then runs every rule once more for the final report. Skips overlapping fixes and any fix that would make a file parse worse than before. Without `--fix`, output reports how many issues `--fix` would fix. Commit or stash changes first so you can review the edits.
- `--format json`: Print one JSON report on stdout and nothing else. Other output goes to stderr, and the publish prompt is skipped. If validate can't run, stdout is empty and stderr gets `Error: <message>`.
- `--groups <groups...>`: Mock user groups (space-separated).
- `--local-schema`: Allow locally hosted OpenAPI files served over HTTP. Hidden from `--help` but still supported.

JSON report fields:

- `passed`: `true` when there are no errors.
- `summary`: `errors`, `warnings`, and `byRule` (count per rule id).
- `diagnostics`: one entry per finding, with `rule`, `group`, `severity`, `file`, optional `line` and `column`, `message`, and optional `fix`.
- `build`: `{ "ran": true, "passed": <boolean> }`, or `{ "ran": false, "reason": <reason> }` where the reason is `disabled`, `errors found`, or `no build rules`.
- `fixed` (with `--fix` only): applied fixes, each with `rule`, `file`, optional `line` and `column`, `before`, and `after`.

## Content quality

- `mint broken-links` — Check for broken internal links. `--files <paths...>` limits the check to specific files or globs. `--check-anchors` validates `#` anchors. `--check-external` checks external URLs. `--check-redirects` checks that redirect destinations in `docs.json` resolve. `--check-snippets` checks that snippet import paths resolve. Paths without a leading `/`, `#`, or `?` (for example, `next` or `./next`) resolve from the page's directory, as in the browser. Inside snippets, these and `#` links are checked against each page that renders the snippet. Reference-style link definitions and `href`/`src` values written as string or static template literals (`href={"/a"}`) are checked; dynamic expressions are skipped.
- `mint a11y` — Accessibility checks (alt text, color contrast). `--skip-contrast` or `--skip-alt-text` to narrow scope.
- `mint score [url]` — Score a docs site's AI/agent readiness. Checks llms.txt, MCP discoverability, robots.txt, sitemap, structured data, response latency, and more. Requires `mint login`. Defaults to your configured subdomain. `--format` accepts `table` (default), `plain`, or `json`.
- `mint format` — Format every `.mdx` file in the current directory and its subdirectories in place. Respects `.gitignore` and Mintlify ignore rules. Commit or stash changes first so you can review the rewrite.

## Authentication

- `mint login` — Authenticate your Mintlify account.
- `mint logout` — Log out of your account.
- `mint status` — Show current authentication status (CLI version, email, org, subdomain).
- `mint signup [flags]` — Create a new Mintlify account from an interactive terminal. Flags: `--firstName`, `--lastName`, `--company`, `--email`; omit any to enter it interactively. Waits until you click the emailed verification link before it logs you in. When an agent runs it, or stdin isn't a TTY, it only prints https://mintlify.com/auth.md and creates no account; agents use `mint deploy` and `mint claim` instead.
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

## Coding agent setup

- `mint agent setup`: Install Mintlify skills and add the admin MCP (server name `mintlify-admin`, URL `https://mcp.mintlify.com`) to Claude Code, Codex, or Cursor. Requires Node.js 22.20 or later and npm. `--agent`/`-a` takes one or more of `claude-code`, `codex`, `cursor`; without it, an interactive terminal prompts with detected agents preselected, and a non-interactive run uses detected agents and fails if none are found. `--global`/`-g` configures the user account instead of the current project (project files: `.mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`; global: `~/.claude.json`, `~/.codex/config.toml` or `$CODEX_HOME/config.toml`, `~/.cursor/mcp.json`). Existing configuration is preserved and a matching `mintlify-admin` entry is skipped; a conflicting entry or unparseable file stops setup before skills install. Setup also stops with an error when the Codex configuration defines `mcp_servers` as an inline table (add a `mintlify-admin` entry with `url = "https://mcp.mintlify.com"` to that table by hand) and when `--global` targets Claude Code while `CLAUDE_CONFIG_DIR` is set (run `claude mcp add --scope user --transport http mintlify-admin https://mcp.mintlify.com` instead). Rerunning refreshes the installed skills and overwrites local edits to them. It does not reuse `mint login` credentials: complete OAuth sign-in for `mintlify-admin` in each agent afterward (Claude Code: `/mcp`; Cursor: MCP settings; Codex: the `codex mcp login` command the CLI prints).
- `mint instructions [topic] [subtopic]`: Print instructions about how to use Mintlify for agents as Markdown. Without a topic, lists the topics. Topics: `overview`, `new-site`, `write` (subtopic `components`), `configure` (`navigation`, `settings`, `customization`), `api-docs` (`sdk`), `publish` (`domain`, `repo`, `analytics`, `assistant`), `access` (`team`), `automate`, `migrate`, `troubleshoot`. Each topic downloads from the live Mintlify documentation, so it needs network access and can be newer than this skill. An unknown topic exits with an error. If the installed CLI doesn't recognize the command, run `mint update` or `npx mint@latest instructions`. Example: `mint instructions publish domain`.

## Project setup

- `mint deploy` — Provision an anonymous docs site without login and print a hosted Git repository URL plus a short-lived write token. The CLI does not upload files: clone the hosted repository into a separate directory, copy `docs.json`, pages, and assets to its root, commit, and push to `main` with the token as an HTTP `Authorization: Bearer` header for that Git operation only. Never put the token in a remote URL, Git config, or public logs. `--subdomain` (required for the first deployment or `--new`), `--org-name`, `--directory` (default: `.`), `--new` creates another site, `--email` also returns a claim link. `--github` (run from the root of a GitHub repository; uses the `gh` CLI and the `origin` remote) trusts the repository to deploy the site and writes `.github/workflows/mintlify.yml`, which runs `mint deploy` on every push to the default branch; commit and push that file. `--force` overwrites an existing, different workflow file. `--github` only works for unclaimed sites and can't be combined with `--email`. Rerun from the same directory to reuse the site and get a fresh token. If the CLI can't save credentials to the keyring or the fallback file, `mint deploy` and `mint claim` fail before provisioning or signup. Inside GitHub Actions (`GITHUB_ACTIONS=true`), `mint deploy` skips login and agent credentials: it exchanges the job's OIDC token for a write token and force-pushes the checked-out commit (the `--directory` subtree, or the repository root) to the site's `main`. The workflow needs `permissions: id-token: write`, `--subdomain` is required, and the repository and branch must be trusted for the site, otherwise the deploy fails with a 403.
- `mint claim` — Claim a site created with `mint deploy`. Run `mint claim --email <email>` to get a claim link, show it to the user, and ask them to sign in and return the displayed code. Then run `mint claim --code <code>`. `--email` and `--code` can't be combined. Run both from the original `mint deploy` directory, or pass `--directory`. The CLI uses its saved credentials from the system keyring, or from `~/.config/mintlify/agent-credentials.json` when the keyring is unavailable; never read or print these secrets. Never invent an email address. If Mintlify signup fails, retry the same `--code` command.
- `mint new [directory]` — Scaffold a new Mintlify docs site. `--name` and `--theme` set initial config. `--template` selects a pre-defined template. `--force` overwrites an existing directory.
- `mint migrate`: Print instructions for migrating an existing docs site into a Mintlify project in the current directory: a workflow overview plus the lists of topics and source platforms. `--from <platform>` adds that platform's guide to the overview. `--topic <name>` prints one topic only. `--agent` (`claude`, `codex`, `cursor`, or `gemini`; `--claude` is an alias for `--agent claude`) launches that agent's CLI with a prompt to run `mint migrate` and follow it; the agent's CLI must be installed, otherwise the command fails and prints the install command.

## Maintenance

- `mint update` — Update the CLI to the latest version.
- `mint version` — Show installed CLI and client versions.

## Telemetry

The CLI collects usage telemetry by default (command name, CLI version, OS, architecture, Node.js version, whether it runs in CI or an interactive terminal, whether this is its first run on the machine, whether you are logged in, and the detected AI coding agent name). When you are logged in, telemetry events also include your account email; logged-out usage stays anonymous. Opt out with `--telemetry false` or by setting either environment variable:

| Variable | Value | Description |
|----------|-------|-------------|
| `MINTLIFY_TELEMETRY_DISABLED` | `1` | Disable Mintlify CLI telemetry. |
| `DO_NOT_TRACK` | `1` | Disable telemetry using the Console Do Not Track standard. |
