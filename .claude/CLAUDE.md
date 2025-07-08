# Mintlify documentation

## Project context
- Official documentation site for Mintlify platform
- Format: MDX files with YAML frontmatter
- Config: docs.json for navigation, theme, settings
- Images: /images/ directory with light/dark variants

## Content strategy
- Use MCP search before writing new content
- Check existing patterns for consistency
- Cross-link to related information when it helps users accomplish tasks
- Maintain examples that work for all Mintlify users

## Frontmatter requirements
- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation
- icon: Appropriate icon matching content type

## Writing standards
- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples
- Include both basic and advanced use cases
- Add troubleshooting for complex features

## Components (quick reference)
- Callouts: `<Info>`, `<Warning>`, `<Tip>`, `<Note>`, `<Check>`, `<Danger>`
- Layout: `<Frame>`, `<CodeGroup>`, `<Steps>`, `<Tabs>`

## File standards
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links
- Light/dark image variants where applicable

## Do Not
- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Break backward compatibility without migration notes
