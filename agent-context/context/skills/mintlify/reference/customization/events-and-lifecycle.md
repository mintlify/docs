# Events and script lifecycle

| Event                            | Target / payload                                            | Timing and status                                                                                                                                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mintlify:user`                  | `window`; `CustomEvent<Record<string, unknown> \| null>`    | Documented. Dispatched when identified user content resolves or changes. Null means unidentified/signed out. Not replayed to a listener added later. Read `window.mintlify?.user` after subscribing.                                                 |
| `mintlify:api-playground-inputs` | `window`; `CustomEvent<{ server: Record<string, string> }>` | Observed. Dispatched synchronously after each accepted overlay set/clear, including actions drained during initialization. Invalid non-object setter arguments do not dispatch. There is no guaranteed initial notification when the queue is empty. |

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

Custom JS can be unavailable in editor live preview or when disabled for the site. Verify local preview and deployed behavior separately.

Use documented integration configuration or authored JS files for external scripts. Verify third-party dependencies on the deployed site; script presence alone does not establish readiness.

See the [public documentation](https://www.mintlify.com/docs/customize/custom-scripts) for current supported options.
