# CSS variables

Set brand colors, background colors, and fonts in `docs.json`. Consume these variables in authored CSS; do not override them globally. They are observed, not a stable public API.

| Variables                                                                                                                                               | Format and behavior                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `--primary`, `--primary-light`, `--primary-dark`                                                                                                        | Space-separated RGB channels. Use `rgb(var(--primary))`. Dark mode typically uses `--primary-light`. |
| `--background-light`, `--background-dark`                                                                                                               | RGB channels from `docs.json.background.color`                                                       |
| `--color-primary`, `--color-primary-light`, `--color-primary-dark`, `--color-background-light`, `--color-background-dark`                               | Full color values; use directly as `var(--color-primary)`                                            |
| `--font-family-body-custom`, `--font-family-headings-custom`, `--font-family-mono-custom`, `--font-weight-body-custom`, `--font-weight-headings-custom` | Set from `docs.json.fonts`                                                                           |
| `--banner-height`, `--topbar-tabs-height`, `--mintlify-slot-header-height`                                                                              | Measured at runtime and used for sticky offsets. Read them; do not set them.                         |
| `--code-padding-right`                                                                                                                                  | Space reserved for code block controls. Do not zero it globally.                                     |
| `--tree-highlight`                                                                                                                                      | Base Tree highlight color, scoped to `.tree`                                                         |
| `--tree-highlight-accent`, `-text`, `-bg`, `-bg-hover`, `-tint`                                                                                         | Derived from the base with separate dark declarations. Override each one you need, in both modes.    |

```css
.example-card {
  border-color: rgb(var(--primary));
}

html.dark .example-card {
  border-color: rgb(var(--primary-light));
}
```

## Layout

| Variable          | Default                                                                                               | Notes                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `--sidebar-width` | 18rem in mint, linden, willow, aspen, sequoia; 19rem in maple, palm; 16.5rem in almond; 14rem in luma | Desktop sidebar width. Set on `:root`. Palm's collapsed sidebar stays 4rem. |

| `--content-width` | No cap in mint, palm, aspen (and linden below xl); 35.75rem in linden; 36rem in maple (42rem from 2xl) and almond; 600px in willow; 40.5rem in sequoia, luma | Max width of the body text column on default-mode pages. The column grows only as far as the space beside the sidebar and table of contents allows; wide, center, custom, and frame modes ignore it. |

```css
:root {
  --sidebar-width: 20rem;
  --content-width: 768px;
}
```

Use these variables instead of setting `width`, `max-width`, or margins on `#sidebar`, `#content-container`, or `#content-area`.
