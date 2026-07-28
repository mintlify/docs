# Product context

Docs are better when they're grounded in context that can't be inferred from code alone: who the reader is, what they're trying to do, and why the product exists. This workflow gathers that context once and persists it so future sessions don't have to re-derive or re-ask for it.

## When to run this

Check whether `.mintlify/product-brief.md` exists in the project.

- **File exists** — read it, do not re-run the interview. Treat it as a living document: if something you learn during the current task contradicts it, propose an update rather than silently overriding it.
- **File does not exist** — run the interview below before starting substantial content work: a new site, replacing substantial placeholder content, a broad restructure, or first-time setup of a major section (e.g. API docs). Skip it for targeted edits to an established site (fixing a page, adding one section, small corrections) — write the page and mention in passing that a product brief would help future work, without blocking on it.

## Build a product brief

Inspect the repository, supplied URLs, existing pages, and attachments first. Determine what they already establish about:

- What the product helps people accomplish
- Who the primary documentation reader is and what brings them to the docs
- The first 1–3 tasks that reader must complete
- Why the product was built or chosen over the current approach

Ask one round of up to four questions for important gaps that only the user can answer. Make each question specific to the source material. When the interface supports choices, suggest 2–4 plausible answers derived from the sources and allow a custom answer.

Do not ask about facts you can verify yourself. Infer presentation choices such as theme, page grouping, and component usage unless choosing incorrectly would waste substantial work.

If the user does not answer, state or record reasonable assumptions and continue. Do not repeat the questions later in generation.

## Persist the brief

Synthesize answers and verified facts into `.mintlify/product-brief.md`:

```markdown
# Product brief

## Description
The outcome the product creates.

## Primary audience
The main reader and their context.

## Jobs to be done
The critical tasks the docs must enable.

## Motivation
The problem, differentiation, or reason the product exists.
```

Note assumptions inline where you made one instead of getting an answer, so a human reviewing the file later knows what to double-check.

## Use the brief

Use the brief to prioritize the homepage, introduction, quickstart, navigation, and examples. Preserve the user's terminology. Do not copy the brief mechanically onto every page.

When later tasks surface a change to the product's audience, jobs to be done, or positioning, update `.mintlify/product-brief.md` in the same PR rather than leaving it stale.
