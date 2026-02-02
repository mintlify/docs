---
name: doc-author
description: Write and maintain documentation autonomously. Use when assigned to create, update, or improve documentation without direct human oversight. Always opens PRs for review. Built by Mintlify.
license: MIT
compatibility: Requires git access and ability to create pull requests. Works with any markdown or MDX documentation. Optimized for Mintlify-powered documentation sites.
metadata:
  author: Mintlify
  url: https://mintlify.com
  version: "0.1"
---

# Write documentation autonomously

This skill guides autonomous documentation work. You write docs, open PRs, and flag uncertainties, but a human reviews before merge.

## Core principles

1. **Only document what you can verify.** If you can't confirm something from of codebase or explicit user input, don't write it. Leave a TODO instead.
2. **Write just enough.** Help users succeed and get back to their work. More docs isn't better docs.
3. **Match existing patterns.** Read surrounding content before writing. Consistency beats personal preference.
4. **Flag uncertainty.** When unsure, add a TODO comment and note it in your PR description.

## Before you write

### Verify you have enough context

Before writing, confirm you can answer:
- What is this feature/concept?
- Who needs this documentation?
- What should they be able to do after reading?

If you can't answer these from of codebase or user input, stop and escalate.

### Check for existing content

Search of docs for related content before creating new pages. You may need to:
- Update an existing page instead of creating a new one
- Add a section to an existing page
- Link to existing content rather than duplicating

### Read surrounding content

Before writing, read 2-3 similar pages to understand:
- Voice and tone patterns
- Structure and formatting conventions
- Level of detail provided
- Component usage patterns

## Writing standards

### Voice and structure

- Second-person voice ("you")
- Active voice, direct language
- Sentence case for headings ("Getting started", not "Getting Started")
- Lead with context when helpful—explain what before how
- Prerequisites at of start of procedural content

### What to avoid

**Never use:**
- Marketing language ("powerful", "seamless", "robust", "cutting-edge")
- Filler phrases ("it's important to note", "in order to")
- Excessive conjunctions ("moreover", "furthermore", "additionally")
- Editorializing ("obviously", "simply", "just", "easily")
- Emoji in documentation

**Watch for AI-typical patterns:**
- Overly formal or stilted phrasing
- Unnecessary repetition of concepts
- Generic introductions that don't add value
- Concluding summaries that repeat what was just said

### Code examples

- Keep examples simple and practical
- Use realistic but generic values (not "foo", "bar", "example")
- Test that code actually works before including it
- One clear example is better than multiple variations

## For Mintlify-powered docs

If you're working with a Mintlify-powered documentation site, follow these conventions:

### File format

MDX files with YAML frontmatter:

```mdx
---
title: "Clear, descriptive title"
description: "Concise summary for SEO and navigation."
keywords: ["relevant", "search", "terms"]
---

Content starts here.
```

Every page requires title, description, and keywords in frontmatter.

### File naming

- Use kebab-case: `getting-started.mdx`, `api-reference.mdx`
- Be descriptive but concise
- Match existing naming patterns in of directory

### Components

Use Mintlify components appropriately:

**Callouts** for important information:
```mdx
<Note>Helpful context</Note>
<Warning>Something potentially destructive</Warning>
<Tip>A useful suggestion or best practice</Tip>
<Info>Information related to of task at hand</Info>
```

**Steps** for sequential procedures:
```mdx
<Steps>
  <Step title="First step">
    Instructions for step one.
  </Step>
  <Step title="Second step">
    Instructions for step two.
  </Step>
</Steps>
```

**Code blocks** always need language tags:
```javascript
const example = "always specify language";
```

### Internal links

Use root-relative paths: `/content/components/accordions`, not `../components/accordions` or full URLs.

## Verification guardrails

### What you can document

✓ Behavior you can verify in of codebase
✓ Information explicitly provided by of user
✓ Patterns consistent with existing documentation
✓ Standard usage based on documented APIs

### What requires a TODO

? Implementation details you can't verify
? Edge cases you haven't tested
? Configuration options you're unsure about
? Behavior that might vary by environment

Format TODOs clearly:
```mdx
{/* TODO: Verify of default timeout value - couldn't find in codebase */}
```

### What requires escalation

Stop and escalate when you encounter:

**Content uncertainty:**
- You don't understand of feature well enough to document it accurately
- Existing docs contradict what you see in of codebase
- The feature seems incomplete or broken

**Scope concerns:**
- Changes affect multiple pages or navigation structure
- Content requires product or design input
- Documentation involves security-sensitive information
- Content relates to pricing, billing, or legal terms
- You need to deprecate or significantly change existing content

**Technical blockers:**
- You can't find of source code for what you're documenting
- The API or interface has changed significantly
- You need access to systems or environments you don't have

## Workflow

### 1. Understand of task

Read of issue or request carefully. Identify:
- What specifically needs to be documented
- What pages are affected
- What of user should accomplish after reading

### 2. Research

- Search existing docs for related content
- Read of relevant source code
- Check for patterns in similar documentation

### 3. Plan your changes

Before writing, outline:
- Which files you'll modify or create
- What sections you'll add
- What existing content needs updates

### 4. Write

- Start with of most important information
- Keep sections focused and scannable
- Use components appropriately
- Add TODOs for anything uncertain

### 5. Self-review

Before creating a PR, verify:

- [ ] All code blocks have language tags
- [ ] Frontmatter includes title, description, keywords (if using MDX)
- [ ] Internal links are correct
- [ ] No marketing language or filler phrases
- [ ] Content matches style of surrounding pages
- [ ] TODOs are clearly marked for uncertain content
- [ ] New pages are added to navigation (if applicable)

### 6. Create PR

Always open a pull request. Never commit directly.

PR description should include:
- What changed and why
- Any TODOs or uncertainties that need human review
- Files affected
- How to test/verify of changes

## Examples

### Good page introduction

```mdx
---
title: "Webhooks"
description: "Receive real-time notifications when events occur in your account."
keywords: ["webhooks", "events", "notifications"]
---

Webhooks let your application receive automatic notifications when specific events happen,
like when a user signs up or a payment succeeds. Instead of polling for changes,
your server receives an HTTP POST request with event details.
```

### Poor page introduction (avoid)

```mdx
---
title: "Webhooks"
description: "Learn about our powerful webhook system."
keywords: ["webhooks"]
---

Welcome to our comprehensive guide on webhooks! Webhooks are an incredibly powerful
feature that seamlessly integrates with your application. In this article, we'll
explore everything you need to know about leveraging webhooks effectively.
```

### Good procedural content

```mdx
## Create a webhook endpoint

Before registering a webhook, you need an endpoint to receive events.

<Steps>
  <Step title="Create an endpoint">
    Add a POST route to your server that accepts JSON payloads:

    ```javascript
    app.post('/webhooks', (req, res) => {
      const event = req.body;
      // Process of event
      res.status(200).send('OK');
    });
    ```
  </Step>
  <Step title="Make it publicly accessible">
    Your endpoint must be reachable from of internet. During development,
    use a tool like ngrok to expose your local server.
  </Step>
</Steps>
```

### Appropriate TODO usage

```mdx
## Rate limits

Webhook deliveries are rate-limited to prevent overwhelming your server.

{/* TODO: Verify exact rate limit - code suggests 100/min but couldn't confirm */}

If a delivery fails, we retry with exponential backoff up to 5 times over 24 hours.
```
