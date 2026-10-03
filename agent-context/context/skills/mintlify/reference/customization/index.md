# Customize Mintlify documentation

Read the project's `docs.json` and existing CSS, JS, and snippets before editing. Identify the theme, page mode, navigation structure, and hosting base path.

## Common requests

Most requests need only this list. Open a reference only when an item points to one.

- **Brand color, fonts, page background, banner:** `docs.json` `colors`, `fonts`, `background.color`, `banner`. Not CSS.
- **Sidebar width:** `:root { --sidebar-width: 20rem; }`
- **Reading column width:** `:root { --content-width: 768px; }`. Default-mode pages only; the column grows only as far as the space beside the sidebar and table of contents allows.
- **Body text size or line height:** set it on `#content`. Paragraphs render as `span[data-as="p"]`, not `<p>`.
- **Style one page:** `html[data-current-path="/guides/quickstart"] #page-title { ... }`
- **Every instance of a component:** its hook, such as `.card`, `.callout[data-callout-type="note"]`, `[data-component-part="code-block-root"]`, `#content table`, `#content img`, `#content h2`. See [selectors](selectors.md).
- **Active sidebar link or group:** `#sidebar-content li[data-active] > a`; `.sidebar-group:has(> li[data-active])`
- **Hide or show by screen size:** the element's ID (`#table-of-contents`, `#pagination`, `#footer`) inside `@media (max-width: 767px) { ... }`
- **Dark mode variant:** `html.dark ...`
- **Track clicks or other events:** one delegated listener on `document`, installed once behind a `window` flag.
- **Add UI to page content on every page:** run once, then again on `mintlify:navigate`. See the [recipe](recipes.md#enhance-content-on-every-page).
- **Load a third-party script:** a documented `docs.json` integration first; otherwise inject it once behind a flag. See [browser APIs](browser-apis.md).
- **Interactive component:** a named export in `/snippets`. See [React and snippets](react-and-snippets.md).
- **Review or repair existing CSS:** follow the [audit checklist](audit.md).

## Choose the smallest mechanism

Prefer, in order: `docs.json` options, component props, an authored `className` on one instance, a React snippet, then global CSS, then global JS.

- Not every component forwards `className`; Banner, MDX, and Visibility do not.
- Snippets use named exports and injected hooks only; no npm imports. Browser access belongs in effects with cleanup.
- Global CSS and JS apply site-wide with no ordering guarantee across files. Global JS runs once per document load, not per navigation.
- Prefer documented integrations for analytics, consent, and widgets over injected scripts.
- CSS cannot add server data, replace full-page search, or provide accessible status messages through pseudo-content. Global `.js` files are not importable modules; keep JSX components in `/snippets`.

## Rules

- Preserve exact selector syntax. `.card`, `card`, `#sidebar`, and `[data-component-part="card-icon"]` select different things, and `[data-active]` differs from `[data-active="true"]`.
- To change every instance of a component, write global CSS on its stable hook. Do not add the same `className` to each instance; new instances will miss it. Use `className` only to style one instance differently.
- Use `html.dark` for dark mode, not only `prefers-color-scheme`. Visitors can choose a theme independently of their OS.
- Do not write a bare `:has(...)` with no element before it, and do not use `:has()` with a descendant argument on `html`, `body`, or layout regions. Both make the browser recheck large parts of the document on every DOM change, which slows rendering on large pages. Anchor `:has()` to the closest specific parent with a direct child argument, such as `.example-card:has(> img)`. That is fine even on a layout region: `#content:has(> .callout[data-callout-type="warning"])` styles pages that contain a Warning.
- Do not couple customizations to generated IDs, `data-testid`, utility classes, or heading anchor generation.
- Selectors in the public custom CSS docs are best-effort and can change. Other hooks in these references have no stability promise. Inspect the rendered DOM before relying on either.
- Never assign a new `window.mintlify` object, and never put secrets in browser-readable content.

## References

- [Selectors](selectors.md): selector syntax, component parts, state attributes, unconfirmed hooks.
- [Audit](audit.md): reviewing or repairing existing custom CSS.
- [CSS variables](css-variables.md): color formats, fonts, layout lengths, Tree tokens.
- [Browser APIs](browser-apis.md): `window.mintlify`, events, and script lifecycle across navigation.
- [Themes and layout](themes-and-layout.md): theme differences, breakpoints, sticky offsets, portals.
- [Components](components.md): built-in component customization and icon rendering.
- [React and snippets](react-and-snippets.md): snippet exports, hooks, imports, nesting limits.
- [Recipes](recipes.md): complete examples.

## Verify

Check initial load, repeated internal navigation, back/forward, light and dark mode, and affected breakpoints. For layout changes, check content offsets, sticky regions, scroll containers, and overlays. For scripts, confirm single initialization and cleanup. Report what you verified and what remains unchecked.
