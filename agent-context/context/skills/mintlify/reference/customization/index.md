# Customize Mintlify documentation

Read the project's `docs.json`, applicable instructions, and existing CSS/JS/snippets before editing. Identify the theme, page mode, navigation structure, hosting base path, and environments that must work.

Choose configuration or a supported component prop when it expresses the requested behavior. Use authored `className` for a single instance, reusable MDX/JSX for content or interaction, and global CSS/JS for the remaining site-wide changes. Verify that the chosen component actually forwards the prop to the intended node.

Preserve exact selector syntax: `.card`, `card`, `#sidebar`, and `[data-component-part="card-icon"]` select different things. Distinguish attribute presence from values such as `"true"`, `"false"`, and `"open"`. Inspect the active mounted element; navigation transitions can briefly retain multiple trees.

The inventory distinguishes documented customization from observed behavior and deprecated hooks. An observed hook is a compatibility hint, not a stability promise. Check its availability and current DOM before relying on it. Use documented APIs and supported imports. Avoid coupling customizations to generated IDs or utility classes.

Load only the references needed for the task:

| Reference                                                           | Use for                                                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [Selectors](selectors.md) and [inventory](inventory.json)           | Exact ID/class/element/attribute syntax, owners, existence, examples, and stability          |
| [CSS variables](css-variables.md)                                   | Color formats, fonts, local tokens, measured geometry, and light/dark overrides              |
| [Browser APIs](browser-apis.md)                                     | User, geo, playground signatures, readiness, defaults, replacement, and reset                |
| [Events and lifecycle](events-and-lifecycle.md)                     | Dispatch targets/payloads, initialization, navigation, script ordering, and cleanup          |
| [Themes and layout](themes-and-layout.md)                           | All nine themes, breakpoints, offsets, scrolling, portals, and page modes                    |
| [Navigation](navigation.md)                                         | Products, versions, languages, groups, switchers, active states, and internal links          |
| [Components](components.md)                                         | Props, nested parts, icon rendering, forwarding, and hosted/package differences              |
| [React and snippets](react-and-snippets.md)                         | Named exports, hooks, imports, conditional MDX, props, collisions, and rendering constraints |
| [Extension mechanisms](extension-mechanisms.md)                     | Choosing where and how to implement the change                                               |
| [Assets and routing](assets-and-routing.md)                         | Fonts/images, multi-repository ownership, base paths, locale/version prefixes, and freshness |
| [Recipes](recipes.md)                                               | Complete synthetic customization examples and their verification steps                       |
| [Installation and updates](installation-and-updates.md)             | Installing, refreshing, and maintaining the skill                                            |
| [Compatibility and verification](compatibility-and-verification.md) | Evidence boundaries, checks, and maintenance                                                 |

Verify initial load, repeated internal navigation, back/forward, light/dark, and relevant responsive states. For layout changes, check related content offsets, sticky regions, scroll containers, and overlays. For scripts, verify single initialization and cleanup; `DOMContentLoaded` does not repeat on client navigation. Report what was actually verified and any remaining limitations.
