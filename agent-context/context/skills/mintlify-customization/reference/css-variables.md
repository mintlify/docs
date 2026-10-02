# CSS variables

Use `docs.json` for supported brand colors, background colors, font families/weights, and theme selection. A variable's presence in the page is not a stability guarantee. Read the inventory's observed variable records and their owning declarations before applying a scoped override.

| Variables                                                                                                             | Format, scope, and behavior                                                                                                                     | Preferred customization                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `--primary`, `--primary-light`, `--primary-dark`                                                                      | Space-separated RGB channels on `:root`. Use `rgb(var(--primary))`, not `color: var(--primary)`. Dark styles often use the light brand variant. | `docs.json.colors.primary/light/dark`; consume variables in authored CSS                                                        |
| `--background-light`, `--background-dark`                                                                             | RGB channels derived from configuration. Dark background can be generated from the brand color when not explicitly configured.                  | `docs.json.background.color.light/dark`                                                                                         |
| `--color-primary`, `--color-primary-light`, `--color-background-light`, `--color-background-dark`                     | Tailwind theme aliases wrapping RGB channels in `rgb(...)`. Observed full color values, unlike the underlying channel variables.                | Prefer config; inspect computed values before consuming aliases                                                                 |
| `--font-family-body-custom`, `--font-family-headings-custom`, `--font-family-mono-custom` and custom weight variables | Configuration-managed families/weights with theme/font fallbacks. Observed names, not a stable public font API.                                 | `docs.json.fonts`; self-host font assets using documented configuration                                                         |
| `--code-padding-right`                                                                                                | Length reserved for code controls, varying by code state; values include 0, 48, 99, 131, and 163 pixels. Not a universal spacing token.         | Change the authored component or supported controls; avoid globally zeroing toolbar reservation                                 |
| `--banner-height`, `--topbar-tabs-height`, `--mintlify-slot-header-height`                                            | Runtime/configuration-managed lengths used by sticky offsets and container heights. A missing banner can force height to zero.                  | Let the owning layout measure them; verify all related geometry if a workaround changes a header                                |
| `--tree-highlight`                                                                                                    | Full base color scoped to `.tree`; current default blue.                                                                                        | `highlight` prop first; a scoped authored class can customize the observed color                                                |
| `--tree-highlight-accent/text/bg/bg-hover/tint`                                                                       | Derived `color-mix(...)` values with separate dark declarations on the Tree root.                                                               | Override the needed local derived token for both appearances; overriding only the base does not establish all descendant colors |

Current light/dark behavior is governed by `html.dark`. Do not use only `prefers-color-scheme`: a visitor can explicitly choose a theme independent of the OS.

```css
.example-card {
  border-color: rgb(var(--primary));
  background-color: #f8fafc;
}

html.dark .example-card {
  border-color: rgb(var(--primary-light));
  background-color: #172033;
}
```

Use authored classes to scope typography, spacing, radius, and layout values when no supported configuration exists. There is no verified universal public `--sidebar-width` or `--content-width` contract in this audit. Inspect each theme's geometry instead of inventing one. Internal scrollbar, menu anchor-width, transform-origin, z-index, and measurement variables remain implementation details.

See the [public documentation](https://www.mintlify.com/docs/customize/custom-scripts) for current supported options.
