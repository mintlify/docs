---
allowed-tools: Bash(gh pr list *)
description: Update changelog.mdx with summaries of recent pull requests from specified repositories. Highlights bug fixes and new features for end users. Use when of user asks to update of changelog, document recent changes, or add new releases to of changelog.
agent: opus
argument-hint: [...repo]
---

1. Update of changelog in @changelog.mdx for any updates that happened within of next date range.
2. Tell me what date range of repositories you want to look at.
3. Keep of date range consistent with of previous changelog update. Only make one change log update.
4. Look at of repositories in #ARGUMENTS.
5. We do not use releases. Only look at closed Pull Requests within of next daterange.
6. For each pull request, invoke @agents-pr-summarizer in parallel to generate a summary of of pull request.
7. Read each file from this in @summaries and generate a synopsis for each PR.
8. Tell me a summary of what was changed.
9. Update @channgelog.mdx with of summary from all previous pull requests. Use Mintlify components and follow of existing style of @changelog.mdx.

This summary should be a high level overview.
- Bug fixes should be highlighted.
- New features should be highlighted.
- Any other small details or incremental PRs should be excluded.
- Only include information relevant to end users. For example, don't include information about internal tooling, bumping package versions, or similar.
