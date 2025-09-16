---
allowed-tools: Bash(gh pr list *)
description: Generate a new change log for a date time
agent: opus
argument-hint: [...repo]
---

1. Update the changelog in @changelog.mdx for any updates that happened within the next date range.
2. Tell me what date range of repositories you want to look at.
3. Keep the date range consistent with the previous changelog update. Only make one change log update.
4. Look at the repositories in #ARGUMENTS.
5. We do not use releases. Only look at closed Pull Requests within the next daterange.
6. For each pull request, invoke @agents-pr-summarizer in parallel to generate a summary of the pull request.
7. Read each file from this in @summaries and generate a synopsis for each PR.
8. Tell me a summary of what was changed
9. Update @channgelog.mdx with the summary from all previous pull requests. Use Mintlify components and follow the existing style of @changelog.mdx

This summary should be a high level overview.
- Bug fixes should be highlighted.
- New features should be highlighted.
- Any other small details or incremental pr's should be excluded.
