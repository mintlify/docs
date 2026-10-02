# Compatibility and verification

This skill audits the public documentation client and public authoring mechanisms. The general `mintlify` skill remains the entrypoint for documentation authoring and MCP administration. Historical custom deployments do not establish support for private imports or extra browser APIs.

## Evidence and stability

The reviewed inventory records the exact source revision, file, and line for each selected hook. Source inspection establishes how a producer works at that revision; it does not establish the revision running on every hosted site.

| Label                         | Meaning                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `documented`                  | A published browser API or authoring mechanism; respect the documented prerequisites                         |
| `documented-best-effort`      | A documented CSS customization hook matched to a producer; verify DOM availability before relying on it      |
| `source-observed`             | A useful implementation detail with source evidence; compatibility can change without a public API guarantee |
| `deprecated`                  | A compatibility alias requiring migration to its current replacement                                         |
| Unreviewed/internal candidate | Kept outside the public inventory until a reviewer selects it                                                |

Source baseline: Mint `1fa21d034151978007633e122a8f4083a8378209`, Components `468e3fea460b451a888ea619f95519246b33830c`, and Server `5a36245ce518da5b69dfe6c0e4298f4a97cce8e2`. The inspected public client package is `0.0.3745`. The inventory identifies documentation/source mismatches rather than silently publishing a missing selector.

The theme schema at this baseline contains mint, maple, palm, willow, linden, almond, aspen, luma, and sequoia. A new theme requires a source and browser coverage entry before making compatibility claims about it.

## Verification record

The audit records source evidence and installation checks separately from browser evidence. Entries marked `browser: pending` in `inventory.json` have not passed the full hosted verification matrix. Recipe checklists are instructions, not completed test results. Do not describe navigation, accessibility, or agent reload behavior as verified solely from these references.

Fresh GitHub-folder installations from the draft branch were checked with skills CLI `1.7.0` in an isolated project and isolated Node home/config/state profile. Codex, Cursor, Claude Code, and Kiro CLI selections received the complete canonical skill and references; the resulting project and global copies matched the source byte for byte. This verifies CLI bundling, not loading or cache refresh in a running agent.

The customization installation source is its complete canonical GitHub folder. Keep one installable folder with this skill name so repository updates do not discover conflicting copies. No new hosting or packaging pipeline is required.

Chromium baseline captures cover all nine official public theme demos in light/dark at 375, 768, 1024, and 1440 pixels: 72 hosted views. Their deployed client versions were unavailable, so these views do not prove that the pinned source is deployed. A local synthetic public-client fixture also checked authored Card borders, Tree highlighting, and script execution across all nine themes in light/dark at 375 and 1440 pixels, including one internal navigation per theme. The script executed once per page load and persisted through those navigations. Screenshot framing and remaining interaction/accessibility cases still need review; these checks do not verify every inventory hook or the full navigation matrix.

The hosted verification matrix requires all nine themes, light/dark, and 375, 768, 1024, and 1440 pixel widths: 72 baseline views. Add 1023/1024 and 1279/1280 boundaries for affected layout regions and other boundaries identified in [themes and layout](themes-and-layout.md). Record the environment, client version, route, configuration, page mode, browser, appearance, width, state, result, and screenshot for each case.

For each affected customization, check:

- Initial load and hydration; repeated internal navigation; back/forward; query/hash transitions; remounts; cleanup and duplicate initialization.
- Supported page modes, navigation structures, languages/versions/products, base paths, and computed internal links.
- Active/expanded/selected/disabled states, drawers, portals, scrolling, keyboard focus, and accessible confirmation text.
- Local preview and hosted preview separately where scripts, edge metadata, or compiler behavior differs.
- Chromium, Firefox, and Safari for affected clipboard, scroll, overlay, and routing behavior; Edge Reading view when document structure changes.
- Fresh named installation, complete reference bundling, project/global updates, upgrades, agent reload, and source provenance.

Use matching before/after screenshots when a recipe changes UI. Component Storybook and isolated API tests supplement the actual site checks; they cannot prove hosted navigation, authentication, or persistence.

## Maintenance

Maintain the skill and its references directly in docs, manually or through a reviewed dashboard automation. When behavior changes, inspect selector constants, JSX attributes, CSS, browser declarations, and event sites. Review additions and removals against owning producers and consumers, then update the reviewed inventory, source revisions, compatibility notes, and affected recipes together. Check relative links, complete installation, and the browser cases affected by the update.

Changes to a documented public API need a compatibility/deprecation decision. Avoid freezing implementation hooks merely because they exist in source. Keep private customer evidence and raw source inventories outside the public skill; publish synthetic examples and reusable conclusions.
