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

## Recolor one callout type

```css
.callout[data-callout-type="note"] {
  border-color: #c4b5fd;
  background-color: #f5f3ff;
}

html.dark .callout[data-callout-type="note"] {
  border-color: #5b21b6;
  background-color: rgb(124 58 237 / 0.2);
}
```

Applies to every Note, including future ones, without editing MDX. Check text contrast in both modes.

## Highlight the sidebar group containing the current page

```css
.sidebar-group:has(> li[data-active]) {
  border-left: 2px solid #2563eb;
}

html.dark .sidebar-group:has(> li[data-active]) {
  border-left-color: #60a5fa;
}
```

The `:has()` is anchored to the group and checks only direct children, so it stays cheap. It follows client navigation without JavaScript.

## Enhance content on every page

```js
(() => {
  if (window.exampleHeadingLinks) return;
  window.exampleHeadingLinks = true;

  const addButtons = () => {
    document.querySelectorAll("#content h2[id]").forEach((heading) => {
      if (heading.querySelector(".example-copy-link")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "example-copy-link";
      button.textContent = "Copy link";
      button.addEventListener("click", () =>
        navigator.clipboard.writeText(
          `${location.origin}${location.pathname}#${heading.id}`,
        ),
      );
      heading.append(button);
    });
  };

  addButtons();
  window.addEventListener("mintlify:navigate", addButtons);
})();
```

The flag keeps one listener per document and the per-heading check keeps one button per heading. Card titles are also `h2` elements; skip them with `heading.closest(".card")` if they should not get a button.
