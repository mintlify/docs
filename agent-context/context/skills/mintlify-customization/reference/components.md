# Built-in components and parts

Use the built-in components documented for Mintlify sites. The standalone `@mintlify/components` package is a separate distribution; the same component name does not guarantee identical props, hooks, state, or styling. Check its own documentation when using that package.

Use [component documentation](https://www.mintlify.com/docs/components) for authoring signatures, and [inventory.json](inventory.json) for the reviewed rendered hooks. Confirm props against the actual renderer when a styling change depends on forwarding.

| Family                                       | Preferred customization and important conditions                                                                                                                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Card / Columns                               | Props for title, icon, img, href, cta, horizontal, arrow, disabled; className on Card root. Optional icon/image/CTA parts exist only when those props render them. Disabling navigation can remove href without making a native disabled button. |
| Note / Tip / Warning / Info / Check / Danger | Supported variant and authored className before overriding inner markup. These share callout rendering; avoid changing contrast or semantic role accidentally.                                                                                   |
| Tabs / Tab                                   | Tabs row parts and authored content; inspect Tab prop forwarding separately. Active Tab button uses `data-active="true"`/`"false"`. Inactive content can be omitted or replaced; do not attach a long-lived listener to a disposable panel.      |
| Tree / Tree.Folder / Tree.File               | `highlight` and `defaultOpen` express behavior more robustly than inner-node CSS. Root/file/folder className forwarding and expanded/highlighted parts must be verified on the client. Folder highlight can tint descendants.                    |
| Accordions / Expandable / Steps              | Props and authored content; disclosure state and keyboard behavior belong to the component. Keep labels, focus, and expandable controls intact.                                                                                                  |
| Code blocks / CodeGroup                      | Authored fence metadata/component props first. Copy/fade/toolbars reserve variable space; style controls using their reviewed hooks instead of changing all nested buttons.                                                                      |
| Frame / images                               | Authored className and actual img sizing; preserve alt text. Removing a frame's styling does not remove its markup.                                                                                                                              |
| Mermaid / Tooltip / search/assistant         | Overlay controls can have separate parts or portals. Only target mounted configured features and preserve positioning/focus ownership.                                                                                                           |
| Banner / MDX / Visibility                    | Do not assume universal className support; published authoring guidance lists these as exceptions. Use their documented props/configuration or an authored wrapper where appropriate.                                                            |

## Icon rendering

Depending on the authored icon value, an icon can render as a masked SVG, an image, or an emoji SVG. A Card can additionally wrap a React SVG or render an image as its icon. The standalone package has its own `icon-svg` part; do not assume that part is present on the hosted client.

| Rendered branch          | Correct styling                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| SVG used as a CSS mask   | Change `background-color`; fill/stroke does not recolor the mask silhouette                                                    |
| Ordinary inline SVG/path | Use the component's supported color prop or inspect fill/stroke/currentColor; background may simply draw a rectangle behind it |
| `<img>`                  | Width, height, object-fit, border/radius; fill and background do not recolor the image's pixels                                |
| Emoji SVG text           | Text uses currentColor where applicable, but multicolor emoji glyphs need not recolor like a monochrome icon                   |

Prefer the component's `color` prop. For a scoped masked Card icon override, inspect the real node before using:

```css
.example-card [data-component-part="card-icon"] svg {
  background-color: #2563eb;
}

html.dark .example-card [data-component-part="card-icon"] svg {
  background-color: #93c5fd;
}
```

This recipe applies to the inspected masked SVG branch, not every inline SVG or image. Keep SVGs fully opaque and use a lighter solid color for a softer treatment.
