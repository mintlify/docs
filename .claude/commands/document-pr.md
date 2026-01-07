---
allowed-tools: Bash(gh pr *)
description: Analyze a pull request and create or update documentation for new features. Identifies what pages need updates and suggests content locations. Use when the user asks to document a PR, add docs for a feature, or write documentation for a pull request.
argument-hint: [pr-number] [repository]
---

I need to document a new feature. Please:
1.a Analyze the code changes in pull request on #$1 in repo $2.
1.b If the GitHub CLI exists, utilize the GitHub CLI command `gh pr diff` to get the code changes
2. Search through the docs to see if any existing pages need updates
3. Identify what pages need to be updated and if new documentation is needed
4. Suggest the best location for new content (prefer updating existing pages)
5. Show me your plan for making these content updates
