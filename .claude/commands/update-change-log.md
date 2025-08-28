---
allowed-tools: Bash(gh pr list *)
description: Generate a new change log for a date time
argument-hint: [...repo]
---

1. Update the changelog in @changelog.mdx for any updates that happened within the next date range.
2. Tell me what date range of repositories you want to look at.
3. Look at the repositories in #ARGUMENTS.
4. We do not use releases. Only look at closed Pull Requests within the next daterange.
5. Generate a summary and a test plan for relevant features we should add into @changelog.mdx.
6. Tell me a summary of what was changed

This summary should be a high level overview.
- Bug fixes should be highlighted.
- New features should be highlighted.
- Any other small details or incremental pr's should be excluded.
