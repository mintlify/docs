---
name: page-mode-values
description: Cheapest case in the suite; no Write grant needed. Checks the agent knows the full set of page mode values, including the obscure ones.
expected_outcome: Explains that mode wide hides the table of contents and widens the content area, and names the other values including custom, frame, and center.
plugins: ["../.."]
tags: [frontmatter, probe]
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
---

In a Mintlify page's frontmatter, what does `mode: wide` do? And what are the other values `mode` accepts?
