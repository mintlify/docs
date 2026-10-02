# Compatibility and verification

Use public documentation and the rendered site to check customization availability. The general `mintlify` skill covers documentation authoring; this skill covers appearance and browser behavior. A selector present on one site does not establish a stable API across every theme or deployment.

## Stability labels

| Label                    | Meaning                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `documented`             | A published API or authoring mechanism; respect its prerequisites                    |
| `documented-best-effort` | A documented CSS hook whose availability can change; inspect the rendered DOM        |
| `observed`               | Reviewed behavior without a public stability guarantee; verify it on the target site |
| `deprecated`             | A retained compatibility alias; use its replacement for new content                  |

The inventory contains usage, owning components or regions, availability, examples, and verification status. Unconfirmed selectors appear under `gaps`. Entries marked `browser: pending` have not passed every relevant browser case.

## Verification coverage

Isolated skills CLI installations for Codex, Cursor, Claude Code, and Kiro CLI included the complete skill and references. Project/global installations and reference updates were checked. These checks establish file bundling, not skill loading or cache refresh inside a running agent.

Chromium baseline captures covered all nine public theme demos in light/dark at 375, 768, 1024, and 1440 pixels: 72 hosted views. A local synthetic fixture also checked Card borders, Tree highlighting, and script execution across all nine themes in light/dark at 375 and 1440 pixels, including internal navigation. The script executed once per document load and persisted through those navigations. These checks do not establish every hook, navigation variant, accessibility result, or browser-specific behavior.

For each affected customization, check:

- Initial load and hydration; repeated internal navigation; back/forward; query/hash changes; remounts; cleanup and duplicate initialization.
- Relevant themes, light/dark, responsive widths, and boundaries immediately below/at affected breakpoints.
- Supported page modes, navigation structures, languages/versions/products, base paths, and internal links.
- Active/expanded/selected/disabled states, drawers, portals, scrolling, keyboard focus, and accessible confirmation text.
- Local and hosted previews separately where scripts or authoring behavior differs.
- Chromium, Firefox, and Safari for affected clipboard, scrolling, overlays, and routing; Edge Reading view when document structure changes.
- Complete installation, project/global updates, and agent reload after updating.

Use matching before/after screenshots for UI changes. Recipe checklists describe checks to perform; they do not imply that every case has passed.

## Maintenance

Maintain the skill and references directly in docs, manually or through a reviewed dashboard automation. Review public documentation and affected site behavior, then update the inventory, compatibility notes, and recipes together. Check relative links, complete installation, and affected browser cases.

Keep the skill and references free of internal repository names, implementation file paths, commit hashes, and private implementation history. Preserve synthetic examples and stability labels. A newly found selector is not automatically a supported customization API.
