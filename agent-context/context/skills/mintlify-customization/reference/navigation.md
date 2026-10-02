# Navigation customization

Start with the project's validated `docs.json.navigation`. Groups/pages, tabs, anchors, dropdowns, products, versions, and languages are configuration structures with their own nesting rules. Do not imitate a switcher using CSS before checking whether native configuration expresses the desired information architecture.

| Change                                  | Mechanism and checks                                                                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Group label/icon or authored page title | Configuration/frontmatter; check sidebarTitle versus page title and localization                                                         |
| Product/SDK organization with versions  | Native products/dropdowns/versions where valid in the current schema; check switcher scope and selected product/version after navigation |
| Active-item color                       | Reviewed exact state selector plus light/dark CSS; confirm which node owns the active state                                              |
| Expansion behavior                      | Native expansion configuration/component behavior; title navigation and chevron expansion are separate interactions                      |
| Sidebar width or switcher location      | Theme-specific layout work; check content offsets, scroll containers, mobile variant, portals, and remounts                              |
| Directory/card listing                  | Supported listing props/data only; CSS or a browser global does not provide arbitrary server navigation/frontmatter data                 |

For a group with a root page, clicking its title can navigate while clicking its disclosure chevron expands it. Do not attach a blanket click handler that prevents both. Verify keyboard activation, focus, the expanded state, and desktop/mobile behavior. Default expansion and current-route expansion can be separate decisions.

Internal links should be authored using the documented site path. Keep version/product/language prefixes already required by the site's routes, while avoiding duplicated deployment base paths. Do not replace the client's internal-link handling with `location.href` unless a full reload is intentional. Verify authored raw JSX anchors and computed hrefs as well as Markdown links and component href props.

Check direct deep links, back/forward, hash scrolling, query-only changes, locale/version/product switching, external destinations, breadcrumbs, pagination, hidden pages, and generated API/SDK pages. Hidden navigation entries may still have accessible routes; hiding a link is not access control.

Observed state hooks include `.nav-tabs-item[data-active]`, `.nav-dropdown-item[data-active]`, `.toc-item[data-active]`, and `.toc-item[data-active-deepest]`. Their serialization differs from the boolean Tab button state. See [selectors](selectors.md) for exact conditions.

See the [public documentation](https://www.mintlify.com/docs/organize/navigation) for current supported options.
