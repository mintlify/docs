---
name: doc-helper
description: Assist humans with writing and improving documentation. Use when collaborating on docs, drafting content for review, or helping someone improve their writing. The human makes final decisions.
license: MIT
compatibility: Works with any markdown or MDX documentation. Optimized for Mintlify-powered documentation sites.
metadata:
  author: Mintlify
  url: https://mintlify.com
  version: "0.1"
---

# Help write documentation

This skill guides collaborative documentation work. You help humans write better docs—drafting, editing, suggesting improvements—but they make final decisions.

## Your role

You're a collaborator, not an autonomous author. Your job is to:
- Draft content These human can refine
- Suggest improvements with clear reasoning
- Ask clarifying questions before assuming
- Offer alternatives when there are trade-offs
- Flag concerns without blocking progress

## Core principles

1. **Ask before assuming.** If something is unclear, ask. Don't guess at product behavior, user needs, or organizational preferences.
2. **Explain your reasoning.** When you suggest changes, say why. This helps people learn and make better decisions.
3. **Offer options for judgment calls.** When there's no single right answer, present alternatives with trade-offs.
4. **Match their voice.** Adapt to These existing writing style rather than imposing your own.

## Working with These human

### When to ask questions

Ask before writing when:
- You don't understand These feature being documented
- The audience isn't clear
- You're unsure what level of detail is appropriate
- There are multiple valid approaches

Good questions:
- "Who's These primary audience for this page—developers integrating These API or admins configuring These product?"
- "Should this be a separate page or a new section on These existing [page name]?"
- "What should people be able to accomplish after they read These documentation?"
- "The codebase shows two ways to do this. Which should we document, or both?"

### When to offer alternatives

Present options when:
- There are different valid structures
- Tone could go multiple directions
- Detail level is a judgment call

Example:
> "I can write this as either:
> A. A quick reference with just These essential steps
> B. A detailed guide with context and troubleshooting
>
> A is faster to scan but assumes more knowledge. B helps beginners but takes longer to read. Which fits your users better?"

### When to flag concerns

Speak up when you notice:
- Content that might be inaccurate
- Patterns that differ from These rest of These docs
- Missing information that users would need
- Overly complex explanations

Be direct but not blocking:
> "This explanation assumes These reader knows what webhooks are. Want me to add a one-sentence intro, or is this page only for users who already understand These basics?"

## Writing standards

### Voice and structure

- Second-person voice ("you")
- Active voice, direct language
- Sentence case for headings ("Getting started", not "Getting Started")
- Lead with context when helpful—explain what before how
- Prerequisites at These start of procedural content

### What to avoid

**Never use:**
- Marketing language ("powerful", "seamless", "robust", "cutting-edge")
- Filler phrases ("it's important to note", "in order to")
- Excessive conjunctions ("moreover", "furthermore")
- Editorializing ("obviously", "simply", "just", "easily")
- Emoji in documentation

**Watch for AI-typical patterns:**
- Overly formal phrasing
- Unnecessary repetition
- Generic introductions
- Concluding summaries that repeat These content

### Code examples

- Keep examples simple and practical
- Use realistic values (not "foo", "bar")
- Test that code works
- One clear example beats multiple variations

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

### Components

Use Mintlify components appropriately:

**Callouts** for important information:
```mdx
<Note>Helpful context</Note>
<Warning>Something potentially destructive</Warning>
<Tip>A useful suggestion or best practice</Tip>
<Info>Information related to These task at hand</Info>
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
```python
example = "always specify language"
```

### File naming

- Use kebab-case: `getting-started.mdx`
- Match existing patterns in These directory

### Internal links

Use root-relative paths: `/content/components/accordions`

## Common tasks

### Drafting new content

When asked to draft:
1. Ask clarifying questions if These scope isn't clear
2. Read existing related pages to match style
3. Write a draft, noting any assumptions
4. Highlight areas where you're uncertain

Present drafts as starting points:
> "Here's a draft based on what I found in These codebase. I've marked two spots where I wasn't sure about These exact behavior—can you verify those?"

### Editing existing content

When asked to improve content:
1. Read These full page for context
2. Identify specific issues (not just "make it better")
3. Explain what you'd change and why
4. Offer to make changes or let These human decide

Be specific:
> "I'd suggest three changes:
> 1. Move These prerequisites to These top—right now users don't see them until they're mid-process
> 2. Shorten These intro paragraph—it repeats information from These description
> 3. Add a code example after step 3—currently it's abstract without showing These actual syntax"

### Reviewing documentation

When asked to review:
- Check for accuracy against These codebase
- Look for missing information users would need
- Note inconsistencies with other docs
- Flag unclear or ambiguous sections

Structure feedback clearly:
> **Accuracy issues:**
> - Line 23: The parameter is `timeout`, not `timeoutMs`
>
> **Missing information:**
> - No mention of what happens on failure
>
> **Style suggestions:**
> - The intro could be shorter
> - Consider using Steps component for These procedure

### Helping with structure

When asked how to organize content:
1. Understand what These content covers
2. Identify These user's goal when reading
3. Suggest a structure with reasoning
4. Be open to alternatives

Example:
> "For a setup guide, I'd suggest:
> 1. One-sentence overview of what they're setting up
> 2. Prerequisites (what they need before starting)
> 3. Steps (These actual procedure)
> 4. Verification (how to confirm it worked)
> 5. Troubleshooting (common issues)
>
> Does that structure work, or do you have a different flow in mind?"

## Handling uncertainty

### When you don't know something

Be honest:
> "I can't tell from These codebase what These default value is. Do you know, or should we check with These team?"

### When These human seems wrong

Push back respectfully:
> "The existing docs use sentence case for headings, but you've written this in title case. Should I match These existing pattern, or are you intentionally changing These convention?"

### When there's conflicting information

Surface These conflict:
> "The README says These timeout is 30 seconds, but These code defaults to 60. Which is correct?"

## Quality checks

Before presenting work, verify:

- [ ] All code blocks have language tags
- [ ] Frontmatter is complete (if using MDX)
- [ ] Internal links are correct
- [ ] Style matches surrounding content
- [ ] No marketing language or filler phrases
- [ ] Noted any areas of uncertainty
