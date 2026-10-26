# Selectors and component state

The [public custom CSS docs](https://www.mintlify.com/docs/customize/custom-scripts) list the ID and class hooks for layout and components. This file covers syntax, state attributes, and component parts that the public list omits. All hooks exist only when their owning element renders.

## Syntax

| Syntax                              | Selects                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `.card`                             | An element with the `card` class                                            |
| `card`                              | An element whose tag is `<card>`. It does not match `div.card`.             |
| `#sidebar`                          | The element with ID `sidebar`. It does not necessarily own the scroll area. |
| `[data-component-part="card-icon"]` | A nested component part                                                     |
| `html.dark .example-card`           | An authored class in dark mode, including explicit theme selection          |

Native selectors such as `main`, `a`, `img`, `svg`, and `footer` match many unrelated elements. Scope them to an authored class or a known region.

## Layout regions

Target the main layout regions with `[data-layout-item="<region>"]`. Each region has the same hook in every theme, while IDs such as `#sidebar-content` point to different elements in different themes. Regions: `banner`, `topbar`, `mobile-nav`, `sidebar` (outer sidebar panel), `content`, `page-header`, `side-panel` (right panel containing the TOC), `toc`, `pagination`, `footer`, `search-entry`, and `assistant-entry` (both cover desktop and mobile).

## Page background

The page background is painted by a fixed `span#background-color`, not by `html` or `body`. Change its color with `docs.json` `background.color`; target the element only for effects that configuration cannot express.

## Page content

Page content renders inside `#content` (class `mdx-content`). Body paragraphs render as `span[data-as="p"]`, not `<p>`, so `p` selectors miss them. Set body typography on `#content` so paragraphs and lists inherit it, and restyle headings separately if needed.

## State attributes

| Selector                                                 | Semantics                                                                                 |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `[data-component-part="tab-button"][data-active="true"]` | Active Tab. Inactive buttons keep `data-active="false"`, so `[data-active]` matches both. |
| `.toc-item[data-active]`                                 | Active TOC item or ancestor. Test presence, not `="true"`.                                |
| `.toc-item[data-active-deepest]`                         | The exact active heading                                                                  |
| `.nav-tabs-item[data-active]`                            | Active top-level tab. Dropdown tab variants may not set it.                               |
| `.nav-dropdown-item[data-active]`                        | Active dropdown choice; omitted when inactive                                             |
| `.tree-folder[aria-expanded="true"]`                     | Expanded Tree folder                                                                      |
| `.tree-file[aria-current="true"]`                        | Highlighted Tree file                                                                     |
| `html[data-current-path="/quickstart"]`                  | Current page path, excluding query and hash. Updates on internal navigation.              |
| `.callout[data-callout-type="note"]`                     | One callout type. Values: `note`, `info`, `tip`, `warning`, `check`, `danger`.            |
| `#sidebar-content li[data-active]`                       | Active sidebar page link                                                                  |
| `.sidebar-group:has(> li[data-active])`                  | Sidebar group containing the current page. Groups have no `data-active` of their own.     |

A Card's `disabled` prop removes navigation; it does not add a native `[disabled]` attribute. `[data-state="open"]` exists only on primitives that set it.

## Component parts

Use as `[data-component-part="<name>"]` or `[data-component-name="<name>"]`. These are observed hooks without a stability promise.

| Component   | `data-component-part`                                                                                                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Callout     | `callout-icon`, `callout-content`                                                                                                                                                                                           |
| Card        | `card-title`, `card-content`, `card-content-container`, `card-icon` (with `icon`), `card-image` (with `img`), `card-cta` (with `cta`)                                                                                       |
| Tabs        | `tabs-list`, `tab-button`, `tab-content`                                                                                                                                                                                    |
| Tree file   | `tree-file-title`, `tree-file-icon`, `tree-file-highlight-bar`, `tree-file-highlight-bg`                                                                                                                                    |
| Tree folder | `tree-folder-title`, `tree-folder-icon-open`, `tree-folder-icon-closed`, `tree-folder-children-wrapper`, `tree-folder-children-line`, `tree-folder-highlight-bar`, `tree-folder-highlight-bg`, `tree-folder-highlight-tint` |
| Assistant   | `contact-support-button`, `contact-support-icon`, `contact-support-text`                                                                                                                                                    |

| Feature    | `data-component-name`                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Directory  | `directory`, `directory-group`, `directory-group-root`, `directory-page`, `directory-card`                                                |
| Mermaid    | `mermaid-container`, `mermaid-controls-wrapper`, `mermaid-fullscreen-modal`, `mermaid-fullscreen-backdrop`, `mermaid-fullscreen-controls` |
| Appearance | `theme-toggle`, `theme-preference-menu`                                                                                                   |
| Media      | `media-actions`                                                                                                                           |
| Sequoia    | `primary-header-button` (Sequoia theme only)                                                                                              |

`.card-group` is a deprecated alias; author `<Columns>` for new content.

## Table of contents

The TOC root `#table-of-contents` also carries `[data-layout-item="toc-content"]`. Parts, as `[data-layout-item="<name>"]`: `toc-title` (the "On this page" heading; its button scrolls to top), `toc-list` (every `ul`, nested ones included), `toc-item` (`li`, also `.toc-item`), `toc-item-link`, `toc-indicator` (themes with a dot marker), `toc-separator`, `toc-actions` (contextual menu with `contextual.display: "toc"`), `toc-button`, `toc-button-icon`, and `toc-button-label`. `toc-button[data-variant]` holds the contextual option ID.

- `toc-item[data-depth]` is 0-based: `"0"` for top-level headings.
- The active item and its ancestors, and their links, get `data-active`. The exact active link gets `aria-current="location"`.
- The root's `data-shell` (`panel`, `fluid`, `stack`), `data-marker` (`none`, `rail`, `arrow`, `dot`), and `data-look` (`default`, `mono`, `quiet`) vary by theme.
- Built-in TOC styles sit in a cascade layer with `:where()`, so unlayered custom CSS overrides them.

## Auth controls

On sites with authentication, the Log In control carries the class `login-link` and the Log Out control carries `logout-link`, in both the navbar and the sidebar. In the navbar the class is on the link itself. In the sidebar it is on the `<li>`, so match clicks with `event.target.closest(".login-link")`. Some sidebar variants use `href="#"`.

## Search

Style the search bar and dialog with `[data-search-item="<block>"]` or `[data-search-item="<block>-<part>"]`. These are documented, stable hooks that persist if internal class names change. Blocks: `trigger` (navbar search bar), `backdrop`, `dialog`, `header` (input area; has `data-disabled` when search is unavailable), `filter-list`, `list` (has `data-loading`), `group` (`data-variant` is `recent`, `results`, or `ask-ai`), `item`, and `footer`. Parts include `trigger-icon`, `trigger-label`, `trigger-hint`, `input`, `header-button`, `filter-trigger`, `filter-content`, `filter-item`, `group-title`, `item-icon`, `item-title`, `item-badge`, `item-breadcrumbs`, and `item-description`. State attributes sit on the named element, for example `[data-search-item="item"][data-highlighted]`: `item[data-highlighted]`, `item-icon[data-variant]` (`page`, `section`, `api-playground`), `item-badge[data-method]` (lowercase HTTP method), `filter-trigger[data-variant]` (`product`, `version`), `filter-trigger[data-open]`, `filter-trigger[data-active]`, and `filter-item[data-selected]`.

```css
[data-search-item="item"][data-highlighted] [data-search-item="item-title"] {
  color: #0D9373;
}
```

## Unconfirmed hooks

These names appear in public guidance but were not found on current sites. Inspect the DOM before using them: `#header`, `#mobile-nav-content`, `#feedback-thumbs-up`, `#feedback-thumbs-down`, `#localization-select-item`, `.columns`, `.nav-anchor`, `.pagination-title`, `.api-section`, `.api-section-heading`, `.api-section-heading-title`, `.api-section-heading-subtitle`, `.tryit-button`, `.method-pill`.
