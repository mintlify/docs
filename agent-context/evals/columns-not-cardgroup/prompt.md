---
name: columns-not-cardgroup
description: Checks the agent wraps cards in <Columns cols={2}> rather than the deprecated <CardGroup>.
expected_outcome: An MDX file using <Columns cols={2}> containing two <Card> elements with href="/quickstart" and href="/guides". No <CardGroup> anywhere.
plugins: ["../.."]
tags: [components, smoke]
max_turns: 15
timeout_seconds: 420
allowed_tools: [Read, Glob, Grep, Skill, Write]
---

Create index.mdx for my Mintlify docs site. Under a "Get started" heading, put two cards side by side: one titled "Quickstart" linking to /quickstart, and one titled "Guides" linking to /guides.
