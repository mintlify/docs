# Built-in components

Use the [component docs](https://www.mintlify.com/docs/components) for props. The standalone `@mintlify/components` package is a separate distribution; the same name does not guarantee identical props or parts.

| Component                                    | Customize with                                                                                                                                                                |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card / Columns                               | `title`, `icon`, `color`, `img`, `href`, `cta`, `horizontal`, `arrow`, `disabled`; `className` on the root. Icon, image, and CTA parts exist only when those props are set.   |
| Note / Tip / Warning / Info / Check / Danger | Restyle a type site-wide with `.callout[data-callout-type="note"]` (parts: `callout-icon`, `callout-content`). Use `className` only for a single instance. Preserve contrast. |
| Tabs / Tab                                   | Inactive panels can unmount; do not attach long-lived listeners to them.                                                                                                      |
| Tree                                         | `highlight` and `defaultOpen` instead of inner-node CSS. Folder highlight tints descendants.                                                                                  |
| Accordion / Expandable / Steps               | Props and content. The component owns disclosure state and keyboard behavior.                                                                                                 |
| Code blocks / CodeGroup                      | Fence metadata and props first. Controls reserve space through `--code-padding-right`.                                                                                        |
| Frame / images                               | `className` and image sizing. Preserve alt text.                                                                                                                              |
| Mermaid / Tooltip / search / assistant       | Overlays can be portaled. Target only configured features and keep focus behavior intact.                                                                                     |
| Banner / MDX / Visibility                    | No `className` support. Use props or an authored wrapper.                                                                                                                     |

## Icons

Prefer the `color` prop. If you must use CSS, inspect which branch rendered:

| Rendered as          | Recolor with                                             |
| -------------------- | -------------------------------------------------------- |
| SVG used as CSS mask | `background-color`; `fill` and `stroke` have no effect   |
| Inline SVG           | `fill`, `stroke`, or `currentColor`                      |
| `<img>`              | Cannot be recolored; size with width, height, object-fit |
| Emoji                | Multicolor glyphs do not recolor                         |

```css
.example-card [data-component-part="card-icon"] svg {
  background-color: #2563eb;
}

html.dark .example-card [data-component-part="card-icon"] svg {
  background-color: #93c5fd;
}
```

Keep SVGs fully opaque; use a lighter solid color for a softer look.
