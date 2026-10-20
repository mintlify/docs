# Project settings and analytics

Dashboard-managed settings belong to the deployment, not to the docs files, and are not in `docs.json` (for those, see `reference/configuration.md`). Through the Mintlify Admin MCP server, read them with `get_deployment_settings`, `get_workflows`, `list_repos_and_prs`, `get_analytics_report`, `get_analytics_schema` and `query_analytics`, and change them with `update_deployment_settings`, `manage_custom_domain`, `manage_git_source`, `manage_access_auth`, `manage_workflow`, `manage_members_sharing` and `manage_workflow_prs`. Writes apply immediately to the live project: there is no draft, branch or undo.

## Answering "what is this set to" or "how do I"

1. Read the saved value first. Never state a setting's value from memory, from a settings screen the user is looking at, or from what is usual.
2. If the question is how a Mintlify feature works, search the Mintlify docs and answer from the result with a link of the form `https://mintlify.com/docs/<path>`.
3. If no tool covers the setting, say where it is changed in the dashboard. Do not claim to have changed it.

## Not covered by any tool

These change only in the dashboard. Answer with where to change them; do not ask a follow-up question and do not offer a different setting as a substitute:

- the organization name and organization-level settings
- billing, plan, credits and invoices
- inviting new members (removing members and changing roles are `manage_members_sharing`)
- API keys, SSO, and the GitHub or GitLab app installation
- deleting the deployment

## Changing a setting

- Each tool takes `request: { action, ...fields }` (`report` for `get_analytics_report`); the tool schema lists every action and its fields.
- Change a setting only when the user asks for that change, and only that setting. Viewing a settings screen does not authorize a change.
- For automation requests, inspect existing workflows with `get_workflows` first, and use a schedule or target the user already gave.
- Removing a domain, a member, a git source or authentication is destructive. Confirm first unless the user named the exact thing to remove.
- After a write, report the `state` the tool returned, not what you intended.
- If a tool returns an authorization error, report it and do not retry with unrelated tools.
- If listing members with roles fails, retry once without roles before reporting.

## Analytics

Answer questions about traffic, page views, popular pages, search, assistant usage and feedback from query results, never from memory, and never by editing pages.

- `get_analytics_report` covers most questions; pick the report with `request.report`. With a local CLI, `mint analytics` reads the same data.
- Default to the last 30 days when the user gives no range.
- Every number you state must come from a result. Lead with the answer and the key number in one or two sentences; mention a caveat only if it changes the conclusion.
