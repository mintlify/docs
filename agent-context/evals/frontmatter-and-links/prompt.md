---
name: frontmatter-and-links
description: Checks frontmatter completeness (title/description/keywords), root-relative internal links without file extensions, and language-tagged code blocks.
expected_outcome: guides/authentication.mdx with title, description, and keywords in frontmatter; a root-relative link such as /quickstart; no ../ paths and no .mdx in link targets; every fenced block carries a language tag.
plugins: ["../.."]
tags: [content, standards]
max_turns: 15
timeout_seconds: 420
allowed_tools: [Read, Glob, Grep, Skill, Write]
---

Write a page at guides/authentication.mdx for my Mintlify docs explaining how to authenticate with an API key. Include a curl example. Point readers to the quickstart page for setup first.
