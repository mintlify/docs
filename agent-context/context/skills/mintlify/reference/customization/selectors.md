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

## Unconfirmed hooks

These names appear in public guidance but were not found on current sites. Inspect the DOM before using them: `#header`, `#background-color`, `#mobile-nav-content`, `#feedback-thumbs-up`, `#feedback-thumbs-down`, `#localization-select-item`, `.columns`, `.nav-anchor`, `.pagination-title`, `.api-section`, `.api-section-heading`, `.api-section-heading-title`, `.api-section-heading-subtitle`, `.tryit-button`, `.method-pill`.
