# Themes and layout

The pinned theme schema enumerates **mint, maple, palm, willow, linden, almond, aspen, luma, sequoia**. Re-enumerate `packages/validation/src/mint-config/schemas/v2/themes/themes.ts` when refreshing the inventory. Theme-specific hooks do not become universal because they share a name.

## Source layout matrix

This matrix describes source relationships, not completed browser measurements. Each theme has light/dark appearance; CSS follows `html.dark`. Configuration and page modes can remove or hide sidebar/TOC/chrome.

| Theme   | Source / layout relationship to verify                                                                                                                                                                                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mint    | `themes/mint/MainContentLayout/`: desktop sticky `#sidebar` is 18rem in the inspected default layout; `#sidebar-content` wraps a nested scroll viewport. Content flexes next to it. Header slot, topbar tabs, and banner contribute to the sticky top.   |
| maple   | `themes/maple/`: fixed 19rem sidebar; content wrapper and fixed tab navigation reserve related horizontal/vertical space. Bottom sidebar controls have their own width. Resizing only the inner viewport leaves the fixed shell unchanged.               |
| palm    | `themes/palm/`: sidebar/header geometry differs with tabs; content has its own left padding. Side panel sticky offsets differ for tab and banner combinations.                                                                                           |
| willow  | `themes/willow/`: sidebar plus content in a flex layout; footer has its own desktop left offset. TOC/side layout uses reversed ordering and different widths for API examples. Typography and default font families differ.                              |
| linden  | `themes/linden/`: sticky sidebar container and nested viewport, adjacent flexing content. Header-slot/banner heights contribute to the top and available height. Mono default typography differs from mint.                                              |
| almond  | `themes/almond/`: rounded, viewport-height content shell with an **inner scrolling main**. Desktop content uses an independent left margin. Sidebar/banner/header measurements affect shell height; window scroll alone does not describe page position. |
| aspen   | `themes/aspen/`: header/tab variants change sidebar offset; content and side panel have separate tab/banner-dependent spacing. Do not reuse a palm override without measuring both.                                                                      |
| luma    | `themes/luma/`: the fixed sidebar nav itself uses `#sidebar-content`; its nested ScrollArea uses `#navigation-items`. It has a 3rem header plus banner offset and a distinct right TOC scroller. This differs from mint's ID ownership.                  |
| sequoia | `themes/sequoia/`: compact header geometry differs with tabs; side layout has a bordered TOC variant and separate API-example spacing. `data-component-name="primary-header-button"` is theme-specific.                                                  |

## Responsive behavior

Current source breakpoints in `css/theme.css` are sm 640, md 768, lg 1024, xl 1280, 2xl 1536, and 3xl 2100 pixels. Common desktop sidebar branches use lg; side panels often use xl. Individual elements can choose different breakpoints. Baseline views at 375/768/1024/1440 do not replace checks at 1023/1024 and 1279/1280 for affected regions.

Mobile drawers, search/assistant triggers, switchers, and desktop navigation are distinct nodes. Hidden desktop markup may remain mounted. Scope a DOM integration to its intended variant, verify visibility and focus, and avoid initializing the same integration twice.

## Geometry and overlays

When changing sidebar width, identify the outer width, content margin/padding, footer offset, fixed controls, scroll viewport, and minimum content width. Compute all affected relationships per theme. Do not blindly add `resize: horizontal` to `#sidebar-content`: its owning element differs between themes, and an independent content offset can cause overlap.

Sticky positions depend on the actual scroll ancestor and its height/overflow. Banner presence and tab rows can alter both the sticky top and available height. An `overflow: hidden` override can clip navigation or prevent scrolling.

Menus and dialogs can be portaled outside their trigger subtree. Inspect the destination and stacking context; raising a child's z-index cannot escape its parent's stacking context. Keep the menu's focus management and positioning owner intact. Moving switcher nodes with JS is a best-effort workaround requiring navigation/remount/portal checks, not a supported way to change layout ownership.

Modes to inspect include default, wide, custom, frame, center, and assistant. The historic `_minimal` route is a separate embedding implementation, not a public frontmatter mode. Do not recommend that internal route without current product/deployment support. Center/custom behavior can be coordinated by persistent topbar peer state; it is not safe to infer it solely from the current content node.

Provenance: `themes/index.tsx`, the nine `themes/<name>/` implementations, `themes/shared/utils.tsx`, `constants/topbar-peer-classes.ts`, `css/theme.css`, and the theme schema at the revision in [inventory.json](inventory.json).
