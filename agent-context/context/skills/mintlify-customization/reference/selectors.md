# Selectors and component state

Use [inventory.json](inventory.json) to search by `name`, `usage`, `category`, or `owner`. Each record includes purpose, availability, stability, source revision/locations, an example, and verification status. The inventory is curated from documented names and reviewed producers; it is not an export of every internal ID.

## Exact syntax

| Syntax                                   | Meaning                                                   | Availability/example                                                              |
| ---------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `.card`                                  | A class on the hosted client's Card root                  | Authored `<Card>`; `.card { border-radius: 0.75rem; }`                            |
| `card`                                   | An element whose tag name is `card`                       | Use only if inspection shows that actual tag; it does not select a `div.card`     |
| `#sidebar`                               | The sidebar element with that ID                          | Desktop layout/configuration dependent; do not assume it owns its scroll viewport |
| `#sidebar-content`                       | Sidebar scroll-area wrapper in the inspected client       | Its width alone does not update the outer sidebar or content offset               |
| `[data-component-part="card-icon"]`      | A nested Card icon wrapper or image                       | Only with an icon; the renderer determines how to recolor it                      |
| `[data-component-part="tabs-list"]`      | The Tabs button row                                       | Only when Tabs is authored                                                        |
| `[data-component-part="tree-file-icon"]` | A Tree file icon                                          | Only for mounted file rows                                                        |
| `html.dark .example-card`                | An authored class under the site's actual dark appearance | Responds to explicit theme selection as well as system preference                 |

Some published selector descriptions use bare names for hooks that the pinned client applies through `className`. The inventory preserves the observed `.class` syntax. Confirm the deployed DOM before using those entries; source evidence does not prove every deployment is on that revision. Native selectors such as `main`, `a`, `img`, `svg`, `h2`, and `footer` can match many unrelated elements. Scope them to an authored class or reviewed region.

## Presence and values

| State selector                                           | Semantics and producer                                                                                                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[data-component-part="tab-button"][data-active="true"]` | Active Tab representation. `components/Tabs/Tab.tsx` passes a boolean, so inactive nodes can retain `data-active="false"`; `[data-active]` alone selects both.                       |
| `.toc-item[data-active]`                                 | TOC ancestor/active state maintained by DOM attribute updates. Test presence, not `="true"`.                                                                                         |
| `.toc-item[data-active-deepest]`                         | Exact active heading; ancestors may have `data-active` without this attribute.                                                                                                       |
| `.nav-tabs-item[data-active]`                            | Simple top-level active tab. Dropdown tab variants may not publish the same attribute.                                                                                               |
| `.nav-dropdown-item[data-active]`                        | Active dropdown choice; the React producer omits the attribute for an inactive choice.                                                                                               |
| `[aria-expanded="true"]`                                 | Expanded disclosure where the owning component publishes this state. Confirm the attribute is on the trigger, not the child panel.                                                   |
| `[aria-current="true"]`                                  | Inspected highlighted Tree file/folder row. This differs from sidebar link current-page semantics.                                                                                   |
| `[disabled]`                                             | Native disabled form control. A Card's `disabled` prop can instead remove navigation; do not assume a native disabled attribute.                                                     |
| `[data-state="open"]`                                    | Open state on primitives that actually expose it; not a universal Mintlify component state.                                                                                          |
| `html[data-current-path="/quickstart"]`                  | Normalized current page path. Initial head script and a layout-effect updater own it; query/hash are excluded. Check subpath/localization/version behavior on the actual deployment. |

Do not infer support from `data-testid`, React `useId()`, generated heading IDs, utility classes, or internal peer classes. Heading anchors are content-derived routing targets; avoid treating their generation algorithm as a styling contract. During transitions, locate the visible active tree rather than assuming `querySelector` found the current page.

## Stability

`documented` means the public docs describe the API/prop. `documented-best-effort` means public CSS customization guidance explicitly permits compatibility changes. `source-observed` records behavior at a pinned source revision without a public stability commitment. `deprecated` records a retained compatibility alias. Unmatched documented names are listed under `gaps`, not silently invented. `.card-group` is retained as a legacy Columns hook; author `<Columns>` for new content.

Owners, producer paths, and revisions are in the inventory. State producers also include `ui/Content/TableOfContents/`, `themes/shared/components/`, `components/tree/`, `components/DataCurrentPathUpdater.tsx`, and `utils/paths/normalizeDataCurrentPath.ts` in `mint/apps/client/src`.
