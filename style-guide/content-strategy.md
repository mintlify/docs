# Content strategy

## Just enough docs

- Document what readers need to succeed, and nothing more. Too much content hides what people are looking for.
- For AI agents, exhaustive reference can be helpful for information that isn't in their training data. For example, provide all flags and settings options for commands and operations an agent can perform. But for content only relevant to agents, consider making it a hidden page.

## Before you write

- Search for existing content first. Add content to relevant pages rather than creating new ones, unless the new page serves a distinct task.
- Duplicate content only for a deliberate reason. When the same fact is needed in more than one place, put it in a snippet for reuse.
- Make the smallest change that solves the problem.

## Where content goes

- Put new pages in the nav group that matches the user journey.
- Filenames use kebab-case, such as `custom-domain.mdx`.
- Order content by how often readers need it; most common tasks come first.
- The help center is for agent-written content that answers specific user questions from conversations with support or the assistant.
- Guides are end-to-end tutorials and best practices for concepts adjacent to Mintlify but not part of the platform itself. Like Git best practices or integrating Mintlify CLI commands into your CI pipeline.

## Localization

- Only edit English content, including in `docs.json`. Don't change the navigation for other languages. Translations in `es/`, `fr/`, and `zh/` are generated after merge by an automation.
- If you remove image files that are present in localized pages, the broken link check CI fails, but the translation automation will fix it.

## Page structure

- Lead with context: what something is and why you'd use it, then how.
- Prerequisites go at the start of procedural pages.
- Offer one opinionated path. Only show alternatives when readers genuinely choose between them.
- Include a verification step or expected result for major procedures.

## API reference pages

- Document every parameter, including optional ones.
- Show authentication with a correctly formatted example.
- Include success and error response examples with realistic data.
- List the HTTP status codes the endpoint returns and what each means.
- Include pagination details when they apply.
- Include rate limits if you can confirm them. Don't guess or leave a placeholder.

### Endpoint summaries

The `summary` field is the endpoint's page title and sidebar label.

- Start with a verb in sentence case: "Get agent job," "Create agent job," "Trigger automation."
- Use "Get" to read one resource, "List" to read a collection, and "Create," "Update," or "Delete" for those operations. For other actions, use the specific verb, such as "Trigger," "Send," or "Search."
- Name the resource without articles: "Get assistant conversation thread," not "Get an assistant conversation thread."
- When more than one version of an endpoint is in the navigation, add the version in parentheses to the older ones only: "Create agent job (v1)."

### Endpoint descriptions

- Start the first sentence with a present-tense, third-person verb that matches the summary: "Creates," "Retrieves," "Lists," "Updates," "Deletes," "Triggers." Don't start with "This endpoint" or an imperative like "Get" or "Queue."
- Describe what the endpoint does and what it returns in one or two sentences, then add details the reader needs to call it, such as polling behavior or required setup.
- End with the authentication requirement: "Authenticate with an admin API key."

### Status codes

- Only document status codes that you've confirmed in the server code.
- Each response needs a description that says when the endpoint returns it. A bare status code or "A successful response" isn't enough.
- Every authenticated endpoint documents `401`. Every endpoint that accepts parameters or a request body documents `400`.
- Use the standard descriptions in the following table by default. When the endpoint has specific causes, such as a resource that exists but isn't active, list those causes instead.

| Code | Standard description |
| --- | --- |
| `200` | The request succeeded. |
| `201` | The resource was created. |
| `202` | The request was accepted and queued for processing. |
| `400` | The request is invalid. The response body describes the error. |
| `401` | The API key is missing or invalid. |
| `402` | Your plan or credits don't cover this request. |
| `403` | Your API key or plan doesn't have access to this resource. |
| `404` | The resource doesn't exist or doesn't belong to this project. |
| `409` | The request conflicts with the current state of the resource. |
| `429` | You exceeded the rate limit. Wait, then retry the request. |
| `500` | An unexpected server error occurred. Retry the request. If the error continues, contact support. |
| `503` | The service is temporarily unavailable. Retry the request. |

## Two workflows: editor (web or desktop app) and CLI

- When a task can be done in the editor or locally via the CLI, cover both. Use tabs, or separate sections if the steps diverge a lot.
- Don't assume Git knowledge in web editor paths.

## Plan gating

- If a feature requires a paid plan, add a one-sentence `<Info>` callout at the top of the page: "<Feature> requires a [Pro or Enterprise plan](https://mintlify.com/pricing?ref=x)."
- Verify gating against the pricing page and the code before you add or remove a callout. The pricing table is the public source of truth.

## Changes, moves, and deprecations

- When you move or rename a page, add a redirect in `redirects.json`, which `docs.json` pulls in through `$ref`.
- Remove deprecated features rather than keeping "deprecated" callouts, except during an announced migration window.
- Update screenshots when the UI changes.

## Changelog

- Our changelog updates weekly with new releases, improvements, and bug fixes.
