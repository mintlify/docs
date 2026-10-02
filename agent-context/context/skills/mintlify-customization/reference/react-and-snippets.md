# React components and reusable snippets

Use named exports in authored JSX/MDX and import supported local components into the page. Use the documented authoring environment and supported imports.

```jsx
export const ExampleCounter = () => {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};
```

```mdx
import { ExampleCounter } from "/snippets/example-counter.jsx";

<ExampleCounter />
```

The public JSX environment injects useState, useEffect, useRef, useCallback, useMemo, useContext, and useReducer. Browser APIs belong in effects/handlers with cleanup. Components load with the page; React.lazy/dynamic imports and arbitrary external npm packages are not supported public authoring mechanisms. Public guidance also excludes JSON imports and default exports. Prefer named local exports and browser built-ins.

Keep reusable content and JSX components in the documented `/snippets` directory. Use explicit named imports in the parent page and follow the current reusable snippet guidance.

## Nested and conditional content

Public React guidance recommends importing dependencies directly into the parent page and disallows cross-snippet imports. Do not assume universal nesting support, especially JSX inside expressions or props passed through multiple snippet levels.

Use the supported composition explicitly until the exact nesting case has been reproduced. Check export names, props, occurrence count, rendered content, and table-of-contents entries. A heading in the table of contents does not establish that its conditional body renders.

A local synthetic preview rendered two occurrences of an outer MDX snippet that imported an inner MDX snippet and a named component also imported by the page. Both nested bodies appeared and repeated headings received distinct IDs. Putting that outer snippet inside `<MDX>{showExample && <ExampleOuter />}</MDX>` with a literal true page constant rendered no nested body or headings in the same preview. This is a specific observed limitation; verify your composition in local and hosted previews before relying on it.

Watch for duplicate declarations, first-definition collision warnings, shadowed variables, missing pass-through bindings, and TOC entries for content that never renders. Check local preview, hosted output, and agent-facing Markdown; successful compilation alone does not prove all three.

Component hooks and CSS class extraction can differ in editor live preview. Write Tailwind class names as complete literals, not runtime concatenation. Follow the current public styling guidance and verify both editor preview and published output.

Use React components for client interaction and reusable UI; use MDX snippets for content reuse. Do not rely on a particular SSR/no-flash guarantee without rendering evidence. Defer browser access to effects, and verify initial HTML, hydration, remount behavior, and cleanup for any recipe whose correctness depends on them.

See [React components](https://www.mintlify.com/docs/customize/react-components) and [reusable snippets](https://www.mintlify.com/docs/create/reusable-snippets) for supported authoring patterns.
