# Documentation project context

## Project overview
This is a Mintlify documentation site built with MDX files and configured
via docs.json. The site follows Mintlify's documentation framework with
structured navigation, components, and theming.

## File structure and conventions
- **Main config**: `docs.json` - contains navigation, theme settings, and
site configuration
- **Content**: All documentation is in `.mdx` files with frontmatter
- **Structure**: Organized in folders matching the navigation structure
- **Images**: Stored in `/images/` directory with light/dark variants
- **Components**: Reusable components documented in `/components/` folder

## Documentation standards
- Use MDX format with YAML frontmatter containing: title, description,
icon
- Follow existing navigation structure defined in docs.json
- Use Mintlify components: `<Info>`, `<Warning>`, `<Tip>`, `<Note>`,
`<Check>`, `<Danger>`
- Include light/dark mode image variants when applicable
- Use `<Frame>` component for image containers
- Code blocks should specify language for syntax highlighting

## Writing style
- Clear, concise technical writing
- Step-by-step guides with numbered lists
- Use callouts for important information
- Include prerequisites sections where needed
- Provide code examples and configuration snippets

## Common components
- `<Info>`, `<Warning>`, `<Tip>`, `<Note>`, `<Check>`, `<Danger>` for
callouts
- `<Frame>` for image containers
- `<RequestExample>` for code examples
- Custom React components (like HeroCard in index.mdx)

## Key areas
- Getting started guides (quickstart, installation)
- API documentation and playground setup
- Component documentation
- Integration guides
- Settings and configuration
- Authentication and personalization

## When editing existing files
- Maintain consistent frontmatter structure
- Follow existing component usage patterns
- Keep navigation structure aligned with docs.json
- Use appropriate callout types for different message types
- Include relevant icons in frontmatter
