---
name: negative-unrelated-request
description: Guards against over-triggering. The mintlify skill must not fire on a request that has nothing to do with documentation, and the answer must still be correct.
expected_outcome: A correct in-place singly linked list reversal in Python, produced without invoking the mintlify skill.
plugins: ["../.."]
tags: [negative, smoke]
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
---

Write a Python function that reverses a singly linked list in place and returns the new head.
