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
- Missing or empty `description` frontmatter
- Descriptions that are too short (under 130 characters) — short descriptions are frequently ignored by Google in favor of auto-generated snippets
- Descriptions that are too long (over 160 characters)
- Pages that share an identical description with other pages — each page needs a unique description

Open a pull request with improvements for any issues found.

When writing titles: be descriptive and specific about what the page covers. Avoid generic patterns like "Overview - Mintlify". Target 50-60 characters.

When writing descriptions: summarize what the specific page covers in plain language. Include 2-3 terms a user would actually search for. Never reuse the same description across pages. Target 130-155 characters.

Success criteria: All pages have a unique title under 60 characters that describes the specific content, and a unique description between 130 and 160 characters.

## Important

- Only update frontmatter. Do not change page content.
- If all pages have complete and reasonable metadata, do nothing.
