# Themes, layout, and navigation

Themes: **mint, maple, palm, willow, linden, almond, aspen, luma, sequoia**. Hooks that share a name across themes can belong to different elements.

## Theme differences that affect customization

| Theme        | Watch for                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| mint, linden | Sticky `#sidebar` wraps `#sidebar-content`, which wraps a nested scroll viewport.                              |
| maple        | Fixed sidebar shell. Resizing the inner viewport leaves the shell and content offset unchanged.                |
| palm, aspen  | Sidebar and side panel offsets change with tabs and banner. Measure each; do not reuse overrides between them. |
| willow       | Footer has its own left offset; TOC ordering is reversed.                                                      |
| almond       | Content scrolls inside an inner `main`, not the window. Window scroll position does not reflect page position. |
| luma         | `#sidebar-content` is the fixed sidebar itself; the scroll area is `#navigation-items`.                        |
| sequoia      | Compact header; `primary-header-button` exists only here.                                                      |

## Layout

- Breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536 px. The desktop sidebar usually appears at lg and side panels at xl. Test just below and at each affected breakpoint.
- Mobile drawers and desktop navigation are separate nodes, and hidden desktop markup can stay mounted. Scope integrations to one variant.
- Set the desktop sidebar width with `--sidebar-width` on `:root`. Every theme applies it to the sidebar and its dependent content, header, and footer offsets. Do not set `width` on `#sidebar` or `#sidebar-content` directly, and do not add `resize`; the offsets will not follow.
- Set the body text column width with `--content-width`. Do not cap `#content-container` or `#content-area` directly; in several themes that shrinks the column or breaks centering.
- Sticky positions depend on the scroll ancestor, banner, and tab rows. `overflow: hidden` overrides can break scrolling.
- Menus and dialogs can be portaled outside their trigger. A child's `z-index` cannot escape its parent's stacking context.
- Page modes are `default`, `wide`, `custom`, `frame`, and `center`.

## Navigation

Use `docs.json.navigation` (groups, tabs, anchors, dropdowns, products, versions, languages) before imitating structure with CSS or JS.

- A group with a root page navigates on title click and expands on chevron click. Do not block both with one click handler.
- Author internal links with site paths and keep required version, product, or language prefixes. Do not replace link handling with `location.href` unless you want a full reload.
- Hiding a navigation entry does not restrict access to its page.
- Active-state selectors are in [selectors](selectors.md).

See the [themes](https://www.mintlify.com/docs/customize/themes) and [navigation](https://www.mintlify.com/docs/organize/navigation) docs.
