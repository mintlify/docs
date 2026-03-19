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

- Missing or empty `description` frontmatter
- Descriptions that are too short (under 50 characters) or too long (over 160 characters)
- Missing or empty `title` frontmatter
- Titles that are too long (over 60 characters) — long titles are truncated in search result snippets

Open a pull request with improvements for any issues found. Write descriptions that accurately summarize the page content in plain language.

Success criteria: All pages have a title under 60 characters and a description between 50 and 160 characters that accurately summarizes the page content in plain language.

## Important

- Only update frontmatter. Do not change page content.
- If all pages have complete and reasonable metadata, do nothing.
