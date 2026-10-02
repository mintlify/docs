# Browser APIs

All properties below are optional while the browser initializes. They are unavailable during server rendering. Never assign a new `window.mintlify` object: doing so can erase product-owned methods or state. The signatures describe browser access; private source imports are not available to authored JSX snippets.

| API                                                   | Signature / return                                                       | Readiness, defaults, persistence, and reset                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `window.mintlify.user`                                | `Record<string, unknown> \| undefined`                                   | Documented identified user **content**, not a guaranteed authentication-provider profile. Undefined before resolution and when unidentified/signed out. Updated when user content changes; listen on window for `mintlify:user` and read the current value. Do not write it or place secrets in browser-readable content.                                      |
| `window.mintlify.geo`                                 | `{ country?: string; region?: string; continent?: string } \| undefined` | Source-observed approximate edge metadata. Read from navigation Server-Timing during head parse and again at DOMContentLoaded. Missing in local environments without edge metadata; no verified geo-ready event. Treat missing fields as unknown. It is not a location permission API or access-control boundary.                                              |
| `window.mintlify.api.playground.setServerVariables`   | `(variables: Record<string, string>) => void`                            | Documented setter. Replaces the complete runtime overlay, including removing omitted keys; it does not merge. Non-string entries are discarded, and invalid non-object arguments are ignored. Overlay values take precedence over schema defaults and saved values. Applies to mounted/future playgrounds in the page session; full document reload resets it. |
| `window.mintlify.api.playground.clearServerVariables` | `() => void`                                                             | Removes the runtime overlay, dispatches an update, and allows ordinary saved/default resolution to resume. It does not erase every saved user preference or change the OpenAPI schema.                                                                                                                                                                         |

The playground installer attaches the APIs at client-module initialization and again in an effect. The documented bootstrapping queues calls made before initialization. Do not implement or manipulate the private queue yourself. Optional chaining avoids a crash, but a skipped call has not been queued; when the methods are absent, use a bounded readiness check or initialize after they exist.

```js
function setExampleRegion(region) {
  const api = window.mintlify?.api?.playground;
  if (typeof api?.setServerVariables !== "function") return false;
  api.setServerVariables({ region });
  return true;
}

setExampleRegion("example");
```

For multiple server variables, send the entire desired object on every update. On sign-out or account changes, explicitly clear/replace it; SPA navigation alone is not a reset. Server variables are URL inputs, not a channel for API keys or access tokens. Avoid assuming unsupported keys apply to every schema: each OpenAPI server definition owns its variable names and allowed values.

The global geo API is source-observed. `getMintlifyGeo()` is a private helper, not an importable customer API. The internal playground queue, store functions, and auth hooks are excluded from the public inventory.

Provenance: `global.d.ts`, `utils/mintlifyUser.ts`, `hooks/useUserInfo/index.ts`, `utils/mintlifyGeo.ts`, `components/MintlifyGeoInitScript.tsx`, `utils/mintlifyApiPlaygroundInputs.ts`, and `components/MintlifyApiPlaygroundInputsInit.tsx`; overlay semantics are in `packages/api-playground/src/hooks/externalApiPlaygroundInputsStore.ts`. [Custom scripts documentation](https://www.mintlify.com/docs/customize/custom-scripts).
