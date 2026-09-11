---
name: admin-checkout-before-edit
description: Checks the agent follows the Admin MCP workflow the skill documents - checkout first, then content edits, then save to publish.
expected_outcome: Calls checkout before touching content, edits the pricing page, calls save, and reports the resulting PR URL rather than claiming the change is already live.
plugins: ["../.."]
tags: [mcp, admin]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill]
---

Add an Enterprise tier to the pricing page on my Mintlify docs site, alongside Starter and Pro. Pricing is "Contact us", and it adds SSO/SAML, a 99.9% uptime SLA, and a dedicated support channel. Everything else matches Pro. Publish it when you're done.
