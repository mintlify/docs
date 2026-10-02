# React components and reusable snippets

Use named exports in authored JSX/MDX and import supported local components into the page. Do not import private client modules or assume a historical bespoke client makes npm packages available in public documentation.

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
import { ExampleCounter } from '/snippets/example-counter.jsx';

<ExampleCounter />
```

The public JSX environment injects useState, useEffect, useRef, useCallback, useMemo, useContext, and useReducer. Browser APIs belong in effects/handlers with cleanup. Components load with the page; React.lazy/dynamic imports and arbitrary external npm packages are not supported public authoring mechanisms. Public guidance also excludes JSON imports and default exports. Prefer named local exports and browser built-ins.

Reusable Markdown snippets and reusable JSX components take different compilation paths. A file in `/snippets` is always treated as a snippet; general reusable MDX can also be detected through imports. Verify the project's current CLI/compiler before relying on path-based classification or shorthand `<Snippet file>` behavior.

## Nested and conditional content

Current public React guidance says to import dependencies directly into the parent page and disallows cross-snippet imports. Compiler source and historical changes support some nested/import-deduplication cases, but this does not establish universal nesting support, especially JSX inside expressions or prop pass-through.

The inspected merged import/TOC changes deduplicate a component imported by a page and a snippet, and omit TOC headings from conditional `<MDX>` branches that a literal page constant proves unreachable. Unknown conditions conservatively retain headings; TOC analysis does not evaluate arbitrary customer code or establish rendered branch correctness. Bounded analysis can preserve extra headings rather than prune them.

Nested conditional snippet inlining and per-occurrence pass-through props must be verified against the current compiler and browser. An unmerged proposed change is not evidence. Until a case is reproduced, import dependencies in the parent MDX and author the supported composition explicitly. Record the exact nesting shape, export names, props, occurrence count, CLI version, and deployed result rather than saying merely “nested snippets work.”

At the pinned public-client revision, a local synthetic page rendered two occurrences of an outer MDX snippet that imported an inner MDX snippet and a named component also imported by the page. Both nested bodies appeared, the component declaration was deduplicated, and repeated headings received distinct IDs. Putting that outer snippet inside `<MDX>{showExample && <ExampleOuter />}</MDX>` with a literal true page constant rendered no nested body or headings in the same local pipeline. This is a specific observed limitation, not a hosted compatibility claim or evidence for per-occurrence prop pass-through.

Watch for duplicate declarations, first-definition collision warnings, shadowed variables, missing pass-through bindings, and TOC entries for content that never renders. Check local preview, hosted output, and agent-facing Markdown; successful compilation alone does not prove all three.

Component hooks and CSS class extraction can differ in editor live preview. Write Tailwind class names as complete literals, not runtime concatenation. The inspected client uses newer Tailwind internals than some published authoring prose; do not infer every framework feature is supported for customers from the dependency version alone.

Use React components for client interaction and reusable UI; use MDX snippets for content reuse. Do not rely on a particular SSR/no-flash guarantee without rendering evidence. Defer browser access to effects, and verify initial HTML, hydration, remount behavior, and cleanup for any recipe whose correctness depends on them.

Provenance: `packages/common/src/mdx/`, `packages/prebuild/src/`, the server `api/utils/preparse/` path, the client MDX registry/renderers, and public [React components](https://www.mintlify.com/docs/customize/react-components) / [reusable snippets](https://www.mintlify.com/docs/create/reusable-snippets) guidance. Compiler revisions are recorded in the inventory; unresolved cases remain explicit in compatibility notes.
