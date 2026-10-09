# Browser APIs and script lifecycle

## APIs

All properties are browser-only and can be undefined during initialization. Never assign a new `window.mintlify` object.

| API                                                       | Behavior                                                                                                                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `window.mintlify.user`                                    | `Record<string, unknown> \| undefined`. Identified user content; undefined before resolution and when signed out. Read-only.                              |
| `window.mintlify.api.playground.setServerVariables(vars)` | Replaces the whole server-variable overlay; omitted keys are removed. Non-string values are dropped. Lasts for the page session; a full reload resets it. |
| `window.mintlify.api.playground.clearServerVariables()`   | Removes the overlay so saved and default values apply again.                                                                                              |
| `window.mintlify.geo`                                     | Observed. `{ country?, region?, continent? } \| undefined` from edge metadata. Missing locally. Not an access-control boundary.                           |

Optional chaining avoids a crash but skips the call; it does not queue it. If timing matters, retry with a bounded readiness check. Server variables are URL inputs, not a channel for tokens.

## Events

`mintlify:user` fires on `window` with `CustomEvent<Record<string, unknown> | null>` when user content resolves or changes; `null` means signed out. It is not replayed, so subscribe first and then read the current value:

```js
function subscribeToExampleUser(render) {
  const onUser = (event) => render(event.detail);
  window.addEventListener("mintlify:user", onUser);
  render(window.mintlify?.user ?? null);
  return () => window.removeEventListener("mintlify:user", onUser);
}
```

`mintlify:navigate` fires on `window` with `CustomEvent<{ path: string; search: string; hash: string }>` once per page change, after the new page renders. `path` matches `html[data-current-path]`. It does not fire on the initial load or on query/hash-only changes. Run your setup once and again on each event:

```js
function onEveryPage(run) {
  run();
  window.addEventListener("mintlify:navigate", run);
  return () => window.removeEventListener("mintlify:navigate", run);
}
```

## Lifecycle

- Repository `.js` files run once after the document becomes interactive. Multiple files have no ordering guarantee; keep dependent setup in one file.
- `DOMContentLoaded` fires only on the initial load, not on internal navigation. Prefer CSS on `html[data-current-path]`, event delegation, or React effects in snippets.
- Internal navigation replaces page content while the layout persists. To change content on every page, use `mintlify:navigate`, not a `MutationObserver` on `document.body`.
- Make setup idempotent. Deduplicate injected third-party script tags and wait for their `load`/`error` events.
- Do not monkey-patch `history`; listen for `mintlify:navigate` instead.

See the [public documentation](https://www.mintlify.com/docs/customize/custom-scripts).
