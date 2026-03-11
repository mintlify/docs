---
name: "Code changes to the frontend"
on:
  push:
    - repo: "mintlify/mint"
context:
  - repo: "mintlify/mint"
notify:
  slack:
    channel_ids:
      - C0AKYE83VV4
---

Anytime you see a frontend change to the way something renders. Make sure to open a PR modifying the relevant document to clarify that.
