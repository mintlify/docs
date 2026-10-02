# Events and script lifecycle

| Event                            | Target / payload                                            | Timing and status                                                                                                                                                                                                                                           |
| -------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mintlify:user`                  | `window`; `CustomEvent<Record<string, unknown> \| null>`    | Documented. Dispatched when identified user content resolves or changes. Null means unidentified/signed out. Not replayed to a listener added later. Read `window.mintlify?.user` after subscribing.                                                        |
| `mintlify:api-playground-inputs` | `window`; `CustomEvent<{ server: Record<string, string> }>` | Source-observed. Dispatched synchronously after each accepted overlay set/clear, including actions drained during initialization. Invalid non-object setter arguments do not dispatch. There is no guaranteed initial notification when the queue is empty. |

```js
function subscribeToExampleUser(render) {
  const onUser = (event) => render(event.detail);
  window.addEventListener("mintlify:user", onUser);
  render(window.mintlify?.user ?? null);
  return () => window.removeEventListener("mintlify:user", onUser);
}

const unsubscribe = subscribeToExampleUser((user) => {
  document.documentElement.dataset.exampleIdentified = String(Boolean(user));
});
```

Call `unsubscribe()` when replacing this integration or unmounting its custom component. A global integration can intentionally last for the whole document lifetime; an element-local listener must be cleaned up when its element is replaced.

## Execution and navigation

Repository `.css` and `.js` files are discovered globally. Repository scripts run after the document becomes interactive. Multiple files have no supported execution-order guarantee; put dependent setup in one file or explicitly wait for the dependency. A route remount does not guarantee that the framework will re-execute an already registered script ID.

React effects run after mount, rerun when their dependencies change, and clean up on remount/unmount. Development can exercise setup/cleanup more than once. Use idempotent integration setup, a single owned script element for third-party dependencies, and their actual load/error events.

`DOMContentLoaded` covers the initial document only. It does not run for internal navigation. Prefer CSS reacting to `html[data-current-path]`, event delegation for authored controls, or React effects for authored components. If a DOM integration needs to detect replacement, observe the smallest relevant container, batch work, disconnect on cleanup, and avoid mutation loops caused by observing your own changes.

Internal navigation can change the content tree while the global layout and integration persist. Back/forward, query/hash changes, product/version/language switching, and full reload are distinct transitions; test each relevant transition. Do not monkey-patch history or invent a universal Mintlify route-ready event.

The inspected `CustomJsFiles` implementation disables repository JS in editor live preview and when custom JS is explicitly disabled. Local docs routes have their own script rendering path. A working editor preview does not prove deployed script lifecycle behavior.

Configured external `customScripts` and beforeInteractive strategies in source are deployment-managed settings deliberately excluded from the public docs.json integration schema. Use documented integration configuration or repository JS for public recipes; do not tell users to add the private setting to docs.json. Existing third-party scripts must be verified in their actual deployment; script presence alone does not prove readiness.

Provenance: user/playground producers listed in [browser APIs](browser-apis.md), `ui/custom-js-files.tsx`, `analytics/scripts/{CustomScripts,BeforeInteractiveCustomScripts}.tsx`, `layouts/GlobalLayout.tsx`, and local/multitenant page renderers. Reset semantics refer to a full browser document, not every navigation.
