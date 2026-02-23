---
name: "SEO and metadata audit"
on:
  cron: "0 9 * * 1"
automerge: false
---

Audit all MDX files in the docs for SEO and metadata quality. Check for:

- Missing or empty `description` frontmatter
- Descriptions that are too short (under 50 characters) or too long (over 160 characters)

Open a pull request with improvements for any issues found. Write descriptions that accurately summarize the page content in plain language.

Success criteria: All pages have up-to-date descriptions that accurately summarize the page content in plain language.

## Important

- Only update frontmatter. Do not change page content.
- If all pages have complete and reasonable metadata, do nothing.
