# Themes and layout

The skill covers **mint, maple, palm, willow, linden, almond, aspen, luma, sequoia**. Check the public theme documentation when updating this list. Theme-specific hooks do not become universal because they share a name.

## Layout relationships

Use this matrix to identify layout relationships that need checking on your site. Each theme has light/dark appearance; CSS follows `html.dark`. Configuration and page modes can remove or hide sidebar/TOC/chrome.

| Theme   | Layout relationship to verify                                                                                                                                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| mint    | desktop sticky `#sidebar` is 18rem in the inspected default layout; `#sidebar-content` wraps a nested scroll viewport. Content flexes next to it. Header slot, topbar tabs, and banner contribute to the sticky top.                   |
| maple   | fixed 19rem sidebar; content wrapper and fixed tab navigation reserve related horizontal/vertical space. Bottom sidebar controls have their own width. Resizing only the inner viewport leaves the fixed shell unchanged.              |
| palm    | sidebar/header geometry differs with tabs; content has its own left padding. Side panel sticky offsets differ for tab and banner combinations.                                                                                         |
| willow  | sidebar plus content in a flex layout; footer has its own desktop left offset. TOC/side layout uses reversed ordering and different widths for API examples. Typography and default font families differ.                              |
| linden  | sticky sidebar container and nested viewport, adjacent flexing content. Header-slot/banner heights contribute to the top and available height. Mono default typography differs from mint.                                              |
| almond  | rounded, viewport-height content shell with an **inner scrolling main**. Desktop content uses an independent left margin. Sidebar/banner/header measurements affect shell height; window scroll alone does not describe page position. |
| aspen   | header/tab variants change sidebar offset; content and side panel have separate tab/banner-dependent spacing. Do not reuse a palm override without measuring both.                                                                     |
| luma    | the fixed sidebar nav itself uses `#sidebar-content`; its nested ScrollArea uses `#navigation-items`. It has a 3rem header plus banner offset and a distinct right TOC scroller. This differs from mint's ID ownership.                |
| sequoia | compact header geometry differs with tabs; side layout has a bordered TOC variant and separate API-example spacing. `data-component-name="primary-header-button"` is theme-specific.                                                   |

## Responsive behavior

Observed responsive thresholds across these layouts are sm 640, md 768, lg 1024, xl 1280, 2xl 1536, and 3xl 2100 pixels. Common desktop sidebar branches use lg; side panels often use xl. Individual elements can choose different breakpoints. Baseline views at 375/768/1024/1440 do not replace checks at 1023/1024 and 1279/1280 for affected regions.

Mobile drawers, search/assistant triggers, switchers, and desktop navigation are distinct nodes. Hidden desktop markup may remain mounted. Scope a DOM integration to its intended variant, verify visibility and focus, and avoid initializing the same integration twice.

## Geometry and overlays

When changing sidebar width, identify the outer width, content margin/padding, footer offset, fixed controls, scroll viewport, and minimum content width. Compute all affected relationships per theme. Do not blindly add `resize: horizontal` to `#sidebar-content`: its owning element differs between themes, and an independent content offset can cause overlap.

Sticky positions depend on the actual scroll ancestor and its height/overflow. Banner presence and tab rows can alter both the sticky top and available height. An `overflow: hidden` override can clip navigation or prevent scrolling.

Menus and dialogs can be portaled outside their trigger subtree. Inspect the destination and stacking context; raising a child's z-index cannot escape its parent's stacking context. Keep the menu's focus management and positioning owner intact. Moving switcher nodes with JS is a best-effort workaround requiring navigation/remount/portal checks, not a supported way to change layout ownership.

Use documented page modes such as default, wide, custom, frame, and center. Check header and content behavior together when changing modes; layout elements can persist across internal navigation.

See the [public documentation](https://www.mintlify.com/docs/customize/themes) for current supported options.
