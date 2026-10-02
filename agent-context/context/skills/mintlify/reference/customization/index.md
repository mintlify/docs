# Customize Mintlify documentation

Read the project's `docs.json` and existing CSS, JS, and snippets before editing. Identify the theme, page mode, navigation structure, and hosting base path.

## Choose the smallest mechanism

| Mechanism                | Use when                                                                 | Limits                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `docs.json`              | Brand colors, fonts, theme, appearance, navigation, integrations, banner | Use documented options and validate the result.                                                                              |
| Component props          | The component already supports the content, state, or presentation       | Preserves semantics and keyboard handling.                                                                                   |
| Authored `className`     | Styling one component instance                                           | Not every component forwards `className` to the intended node. Banner, MDX, and Visibility do not support it.                |
| React/JSX snippets       | Reusable interactive UI                                                  | Named exports and injected hooks only; no npm imports. Browser access belongs in effects with cleanup.                       |
| Global CSS               | Site-wide styling beyond configuration and props                         | Applies globally; scope selectors. No ordering guarantee across multiple CSS files.                                          |
| Global JS                | Browser integrations or delegated behavior across pages                  | Runs once per document load, not per navigation. No ordering guarantee across files. Can be disabled in editor live preview. |
| Third-party integrations | Analytics, consent, widgets                                              | Prefer documented integration configuration over injected scripts.                                                           |

CSS cannot add server data, replace full-page search, or provide accessible status messages through pseudo-content. Global `.js` files are not importable modules; keep JSX components in `/snippets`.

## Rules

- Preserve exact selector syntax. `.card`, `card`, `#sidebar`, and `[data-component-part="card-icon"]` select different things, and `[data-active]` differs from `[data-active="true"]`.
- Use `html.dark` for dark mode, not only `prefers-color-scheme`. Visitors can choose a theme independently of their OS.
- Do not couple customizations to generated IDs, `data-testid`, utility classes, or heading anchor generation.
- Selectors listed in the public custom CSS docs are best-effort and can change. Other observed hooks in these references have no stability promise. Inspect the rendered DOM before relying on either.
- Never assign a new `window.mintlify` object, and never put secrets in browser-readable content.

## References

| Reference                                   | Use for                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| [Selectors](selectors.md)                   | Selector syntax, component parts, state attributes, and unconfirmed hooks |
| [CSS variables](css-variables.md)           | Color formats, fonts, layout lengths, Tree tokens                         |
| [Browser APIs](browser-apis.md)             | `window.mintlify` APIs, events, and script lifecycle across navigation    |
| [Themes and layout](themes-and-layout.md)   | Theme differences, breakpoints, sticky offsets, portals, and navigation   |
| [Components](components.md)                 | Built-in component customization and icon rendering                       |
| [React and snippets](react-and-snippets.md) | Snippet exports, hooks, imports, and nesting limits                       |
| [Assets and routing](assets-and-routing.md) | Base paths, locale/version prefixes, and asset URLs                       |
| [Recipes](recipes.md)                       | Complete examples                                                         |

## Verify

Check initial load, repeated internal navigation, back/forward, light and dark mode, and affected breakpoints. For layout changes, check content offsets, sticky regions, scroll containers, and overlays. For scripts, confirm single initialization and cleanup. Report what you verified and what remains unchecked.
