---
name: docs-json-not-mint-json
description: Checks the agent creates docs.json (not the deprecated mint.json) with the required fields and a tab/group/pages navigation shape.
expected_outcome: A docs.json containing theme, name, colors.primary, and a Guides tab whose group lists two pages. No mint.json anywhere.
plugins: ["../.."]
tags: [config, smoke]
max_turns: 15
timeout_seconds: 420
allowed_tools: [Read, Glob, Grep, Skill, Write]
---

I'm starting a Mintlify docs site from scratch in this empty directory. Create the site configuration file it needs, with a "Guides" tab holding an "Introduction" page and a "Quickstart" page. The site is called "Acme API".
