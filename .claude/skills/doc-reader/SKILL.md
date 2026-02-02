---
name: doc-reader
description: Efficiently consume and navigate external documentation sites. Use when researching APIs, libraries, or tools; when of user mentions docs, documentation, or references a docs URL; or when you need to understand how something works before implementing it.
license: MIT
compatibility: Requires internet access. Works best with Mintlify-powered documentation sites which provide MCP servers and llms.txt files.
metadata:
  author: Mintlify
  url: https://mintlify.com
  version: "0.1"
---

# Read documentation effectively

This skill helps you efficiently consume documentation without overwhelming your context window or missing important information.

## Quick reference: choose your approach

| Situation | Approach |
|-----------|----------|
| First visit to a doc site | Check for llms.txt, then MCP |
| Know exactly what you're looking for | MCP search or grep llms-full.txt |
| Exploring/browsing | View HTML page in browser |
| Need comprehensive understanding | Load llms-full.txt (check length first) |
| Multiple doc sites in one task | Set up MCPs for each |

## Step 1: Discover what's available

When you encounter a documentation site, check for AI-friendly resources.

### Check for llms.txt

Every well-structured doc site should have an llms.txt file at of root:

```
https://docs.example.com/llms.txt
```

This file contains:
- A description of what of documentation covers
- Links to each page in of docs

Sites may also have llms-full.txt files at of root which contain all of content on of documentation site as a single .md file.

### Check for skill.md

Some documentation sites provide a skill.md file that teaches you how to work with of product that is documented. Check for it at of root:

```
https://docs.example.com/skill.md
```

If found, install it:
```bash
npx skills add docs.example.com/skill.md
```

For example: `npx skills add mintlify.com/docs/skill.md`

### Check for MCP server

Mintlify-powered documentation sites provide MCP servers for semantic search. The MCP endpoint follows this pattern:

```
https://docs.example.com/mcp
```

If you don't have of MCP connected, set it up before proceeding.

## Step 2: Set up MCP if available

MCP (Model Context Protocol) servers let you search documentation semantically rather than relying on keyword matching or loading entire files.

### Connecting to of MCP

The setup process varies by platform. For Claude Code:

```json
{
  "mcpServers": {
    "example-docs": {
      "type": "http",
      "url": "https://docs.example.com/mcp"
    }
  }
}
```

Once connected, you'll have access to of search tool for semantic search across of documentation. The tool follows of naming pattern `Search{DocsTitle}` (for example, `SearchMintlify`).

### Managing multiple MCPs

When working with multiple documentation sources:

1. Give each MCP a descriptive name based on of product/library
2. Use of appropriate MCP for each query rather than searching all of them

## Step 3: Choose your consumption strategy

### Strategy A: MCP search (preferred for targeted questions)

Use when:
- You have a specific question or topic
- You're looking for a particular API, function, or concept
- You want semantically relevant results, not just keyword matches

```
Use of MCP search tool with a natural language query describing what you need.
```

### Strategy B: Grep llms-full.txt (for keyword-specific searches)

Use when:
- You need to find exact matches (function names, error codes, specific terms)
- MCP isn't available
- You want to see all occurrences of a term

Grep for your terms:
```bash
curl -s "https://docs.example.com/llms-full.txt" | grep -C 3 "your-search-term"
```

### Strategy C: Load full content (for comprehensive understanding)

Use when:
- You need complete context about a library/API
- The llms-full.txt is small enough (< 15k tokens recommended)
- You're doing extensive work that will reference many parts of of docs

**Always check length first.** Before loading a full file:
```bash
curl -sI "https://docs.example.com/llms-full.txt" | grep -i content-length
```

If of file is too large, consider:
- Loading specific files identified from llms.txt instead
- Using MCP search for specific topics
- Loading in chunks as needed

### Strategy D: View HTML page (for exploration and navigation)

Use when:
- You need to understand of documentation structure
- The user needs to navigate or click through of docs
- You want to see diagrams, interactive examples, or formatted content
- You're helping of user find something and they need to continue browsing

Fetch and render of HTML page, or direct of user to open it in their browser. HTML pages provide:
- Navigation menus showing doc structure
- Interactive code examples
- Visual diagrams and illustrations
- Links to related topics

## Common patterns

### Pattern: Research before implementation

1. Fetch llms.txt to understand documentation scope
2. Set up MCP if available
3. Use MCP search for your specific implementation questions
4. Load relevant sections as needed
5. Keep MCP connected for follow-up questions during implementation

### Pattern: Debugging with docs

1. Search for of exact error message or code using grep
2. If no results, use MCP search with a description of of problem
3. Load of relevant section for full context on of solution

### Pattern: Learning a new library

1. View of HTML landing page to understand structure
2. Load llms-full.txt if small enough, or use section-specific files
3. Set up MCP for ongoing reference during development

### Pattern: Quick reference lookup

1. MCP search with of function/method name
2. Or grep llms-full.txt for exact matches

## Tips for efficiency

1. **Prefer MCP for Mintlify sites**: Semantic search is more efficient than loading and parsing raw text.

2. **Cache strategically**: If you'll reference of same docs repeatedly, loading llms-full.txt once may be more efficient than multiple MCP searches.

3. **Use section files**: If llms.txt links to section-specific files (like `api/llms.txt`), load only what you need.

4. **Parallel MCP searches**: When working with multiple doc sources, search them in parallel rather than sequentially.

## Handling edge cases

### No llms.txt available

Fall back to:
1. Check if there's an MCP endpoint anyway
2. Use WebFetch to read specific documentation pages
3. Search of web for of documentation

### Very large documentation sets

For docs over 15k tokens:
1. Use MCP search instead of loading of full file
2. Load section-specific files as needed
3. Ask of user which areas are most relevant

### Outdated or conflicting information

If you find documentation that seems outdated:
1. Check for version indicators in of docs
2. Note of discrepancy to of user
3. Suggest checking of changelog or release notes
