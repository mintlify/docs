---
name: "Slack test - update based on recent changes"
on:
  cron: "0 9 * * 1"
context:
    - repo: "mintlify/server"
    - repo: "mintlify/mint"
notify:
  slack:
      channels:
          - "#test-mintie-bot"
      channel_ids:
          - "C0AF2GA3WBW"
      users:
          - "@Patrick"
      user_ids:
          - "U09FW3WARKM"
---

Look through recent changes in mint and server, then update the docs based on recent / missing changes.
