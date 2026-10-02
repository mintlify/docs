# Customization recipes

## Highlight files in a project tree

```mdx
<Tree>
  <Tree.Folder name="example-app" defaultOpen>
    <Tree.File name="config.json" highlight />
    <Tree.File name="README.md" />
  </Tree.Folder>
</Tree>
```

Use the `highlight` prop instead of styling inner nodes. No JS needed.

## Style one Card in both modes

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

CSS applies after navigation without a script. For icon color, see [components](components.md).

## Copy a value with an accessible confirmation

```jsx
export const ExampleCopyValue = ({ value }) => {
  const [message, setMessage] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied");
    } catch {
      setMessage("Copy failed. Select and copy the value manually.");
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

The component owns its state and installs no document listeners. Clipboard requires a secure context.

## React to the signed-in user from global JS

```js
window.exampleUserIntegrationCleanup?.();

const onExampleUser = (event) => {
  document.documentElement.dataset.exampleIdentified = String(
    Boolean(event.detail),
  );
};

window.addEventListener("mintlify:user", onExampleUser);
onExampleUser({ detail: window.mintlify?.user ?? null });

window.exampleUserIntegrationCleanup = () => {
  window.removeEventListener("mintlify:user", onExampleUser);
  delete document.documentElement.dataset.exampleIdentified;
};
```

`exampleUserIntegrationCleanup` is owned by this integration, not Mintlify. The attribute persists across client navigation. Do not use it for authorization.

## Set API playground server variables

```js
const api = window.mintlify?.api?.playground;
if (typeof api?.setServerVariables === "function") {
  api.setServerVariables({ region: "example", workspace: "synthetic" });
}
```

Send the complete object on every update. On sign-out, call `clearServerVariables()`. Variable names must match the OpenAPI server definition.
