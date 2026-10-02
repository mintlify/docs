# Customization recipes

These synthetic recipes use public authoring mechanisms. Their verification checklist is part of each recipe; do not infer hosted verification from the source examples. Use the evidence file in [compatibility](compatibility-and-verification.md) to see the actual checked environments.

## Highlight files in a project tree

Edit the MDX page:

```mdx
<Tree>
  <Tree.Folder name="example-app" defaultOpen>
    <Tree.File name="config.json" highlight />
    <Tree.File name="README.md" />
  </Tree.Folder>
</Tree>
```

Prerequisites: the hosted client's Tree supports `highlight`. Prefer this prop to targeting internal text utilities. No global JS is needed; the component owns remount and expansion cleanup. Test light/dark, collapsed/expanded folders, keyboard navigation, narrow widths, and the highlighted row's accessibility state after navigating away/back. The standalone component package must be checked separately.

## Style one Card across appearances

Edit the page and a repository CSS file:

```mdx
<Card title="Example quickstart" href="/quickstart" className="example-card">
  Start a synthetic project.
</Card>
```

```css
.example-card {
  border: 2px solid #2563eb;
  border-radius: 0.75rem;
}

html.dark .example-card {
  border-color: #93c5fd;
}
```

Prerequisites: Card className forwarding and a valid internal destination. CSS applies when the instance renders, including after navigation; no script initializer is necessary. Verify light/dark, focus, disabled and linked variants, image/icon variants, base paths, and a mobile width. Use `color` props before nested icon CSS; masked SVGs require background-color and images cannot be recolored with fill.

## Copy an authored value with accessible confirmation

Create `/snippets/example-copy-value.jsx` and import it into the page using a named import:

```jsx
export const ExampleCopyValue = ({ value }) => {
  const [message, setMessage] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage('Copied');
    } catch {
      setMessage('Copy failed. Select and copy the value manually.');
    }
  };
  return (
    <div className="example-copy-value">
      <code>{value}</code>
      <button type="button" onClick={copy}>
        Copy value
      </button>
      <span role="status">{message}</span>
    </div>
  );
};
```

Prerequisites: a secure browser context with clipboard support and a non-secret display value. This component owns its state and unmounts naturally; no document listener is installed. It preserves any surrounding field permalink instead of hijacking it. Verify keyboard activation, success/failure messages, assistive announcement, client navigation, and browsers relevant to the project. If styling requires CSS, scope it to the authored class and include explicit dark values.

## Apply a public user-dependent integration

Use one repository JS file. Subscribe before reading the current value and retain the cleanup function:

```js
window.exampleUserIntegrationCleanup?.();

const onExampleUser = (event) => {
  document.documentElement.dataset.exampleIdentified = String(Boolean(event.detail));
};

window.addEventListener('mintlify:user', onExampleUser);
onExampleUser({ detail: window.mintlify?.user ?? null });

window.exampleUserIntegrationCleanup = () => {
  window.removeEventListener('mintlify:user', onExampleUser);
  delete document.documentElement.dataset.exampleIdentified;
};
```

`exampleUserIntegrationCleanup` is an integration-owned global, not a Mintlify API. Prerequisites: public personalization/authentication and browser-readable non-secret content. The document-level state survives SPA navigation; full reload reinitializes it. Call cleanup when removing/replacing the integration. Verify first unresolved state, resolved user, sign-out, repeated navigation, and duplicate script execution; do not use this attribute for authorization.

## Replace API server variables on account change

Once the API exists, send the complete desired overlay:

```js
const api = window.mintlify?.api?.playground;
if (typeof api?.setServerVariables === 'function') {
  api.setServerVariables({ region: 'example', workspace: 'synthetic' });
}
```

On sign-out/reset:

```js
window.mintlify?.api?.playground?.clearServerVariables?.();
```

Prerequisites: matching OpenAPI server variables and initialized methods. Optional chaining can skip a call; it does not queue it. If values arrive before readiness, retry with bounded initialization owned by the integration, then clean up timers/listeners. Verify open/future playgrounds, replacement removing omitted keys, clear restoring normal resolution, SPA persistence, and full-refresh reset. Do not pass secrets.

## Layout changes requiring a separate theme recipe

Sidebar resizing, relocating native switchers, sticky-header changes, and iframe chrome removal require theme-specific measured relationships. Start from [themes and layout](themes-and-layout.md); document the outer sidebar, content/footer offsets, scroll viewport, breakpoints, and portal ownership before implementing. An unverified snippet targeting only `#sidebar-content` is not a complete resizing recipe. Keep these cases in the audit backlog until demonstrated on their supported themes.
