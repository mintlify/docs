---
type: llm
---

The response should contain a Python function that reverses a singly linked list in place.

PASS if the response contains Python code that walks the list once while re-pointing each node's `next` at the previous node, and returns the final node as the new head.
PASS whether or not the code defines its own node class, includes type hints, or adds explanation around it.
FAIL if the code builds a new list, collects the values into a Python list, or reverses values rather than re-pointing the links.
FAIL if the code does not return the new head, or if there is no Python code in the response.

Ignore formatting, comments, and any surrounding prose.
