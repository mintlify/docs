# Assets and routing

Keep the distinction between the authored docs path, deployed base path, selected locale/version/product route prefix, and CDN asset URL. A site at `/docs` is not a reason to prepend `/docs` twice to every authored link.

| Case                                                                    | Required check                                                                                                                              |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Markdown links, component href props, raw JSX `<a>`, and computed hrefs | The rendered internal href includes the correct deployment path exactly once; direct load and SPA navigation both work                      |
| Hash links                                                              | Encoded heading identity, scroll ancestor, sticky offsets, back/forward, and content-derived anchor changes                                 |
| Locale/version/product switching                                        | Selected context and canonical route remain consistent; preview links do not unexpectedly jump to production                                |
| External/mailto/protocol-relative links                                 | Preserve intended scheme, target, and rel behavior rather than applying internal-path rewriting                                             |
| Fonts/images/icons                                                      | Correct content-repository owner, URL, MIME type, asset path, and appearance; CDN-backed icons can render differently from arbitrary images |
| Replacement/removal                                                     | Current preview/deployment serves the new asset or a correct not-found result; cached content is not proof that a repository change failed  |
| Multi-repository site                                                   | Determine which repository owns global CSS/JS/font assets and which prefixes are routing mounts, before duplicating files                   |

Use documented root-relative asset and page paths where supported. Do not hardcode an internal CDN deployment identifier as a reusable public URL. JSON data that cannot be imported into MDX can instead be fetched through a deliberately available public asset endpoint, but first verify that the filename/path is actually served; arbitrary `.txt`/JSON routes are not guaranteed by a successful `llms.txt` route.

The inspected client normalizes `html[data-current-path]` in an initial head script and after pathname changes. Query/hash are stripped. Source normalization and deployed base-path behavior must be checked together; initial parsing and later client navigation are different paths. Treat locale/version prefixes as meaningful until the actual routing configuration proves otherwise.

Embedding needs documented frame/CSP/auth configuration and an actually supported layout. The historic `_minimal` implementation is internal history, not an automatically supported iframe URL. Theme query parameters also require current support; a private helper's argument is not a public route contract.

Provenance: `ui/ClientLink`, DynamicLink/MDX anchor mapping, `utils/paths/normalizeDataCurrentPath.ts`, `components/DataCurrentPathInitScript.tsx`, `components/DataCurrentPathUpdater.tsx`, font/icon renderers, relevant server asset deployment services, and [subpath hosting docs](https://www.mintlify.com/docs/deploy/docs-subpath).
