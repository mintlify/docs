---
name: "SEO and metadata audit"
on:
  cron: "0 9 * * 1"
notify:
  slack:
    channel_ids:
      - C0AKYE83VV4
automerge: false
---

Audit all MDX files in the docs for SEO and metadata quality. Check for:

- Missing or empty `title` frontmatter
- Titles that are too long (over 60 characters) — long titles are truncated in search result snippets
- Titles that follow a boilerplate pattern like "PageType - Mintlify" without describing the specific content of the page
- Missing or empty `description` frontmatter (see OpenAPI pages below — do not treat as missing when an OpenAPI spec supplies the description)
- Descriptions that are too short (under 130 characters) — short descriptions are frequently ignored by Google in favor of auto-generated snippets
- Descriptions that are too long (over 160 characters)
- Pages that share an identical description with other pages — each page needs a unique description

Open a pull request with improvements for any issues found.

When writing titles: be descriptive and specific about what the page covers. Avoid generic patterns like "Overview - Mintlify". Target 50-60 characters.

When writing descriptions: summarize what the specific page covers in plain language. Include 2-3 terms a user would actually search for. Never reuse the same description across pages. Target 130-155 characters.

### Pages with `openapi:` in frontmatter (API reference from spec)

The `openapi:` frontmatter value can be either an **operation reference** (e.g., `openapi: GET /users/{id}`) or a **file reference** (e.g., `openapi: ./openapi.yaml`). Only operation references supply per-page `summary` and `description` from the spec.

For pages with an **operation reference**:
- Read the referenced OpenAPI spec file to check whether the operation defines a `description`.
- If the operation **has** a `description`: do not add a `description:` field to frontmatter. If one was incorrectly added, remove it so the metadata comes from the spec.
- If the operation **has no** `description`: audit `description` frontmatter as normal — add one if missing or fix it if it fails the quality checks.
- If the operation defines a `summary` and the page has no `title:` frontmatter, treat the title as present — do not add one.
- Never edit the OpenAPI spec files themselves.

For pages with a **file reference**, audit all frontmatter fields as normal.

Success criteria:
- Pages have a unique title under 60 characters that describes the specific content
- Pages have a unique description between 130 and 160 characters (except for pages where the OpenAPI spec supplies the description)

## Important

- Only update frontmatter. Do not change page content or OpenAPI spec files.
- If all pages have complete and reasonable metadata, do nothing.
