# React components and snippets

Put components in `/snippets` as named exports and import them into the page.

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

- Injected hooks: `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`, `useContext`, `useReducer`. Do not import React.
- Not supported: default exports, npm packages, JSON imports, `React.lazy`, and dynamic imports.
- Access browser APIs only in effects and handlers, with cleanup.
- Write Tailwind classes as complete literals, not concatenated strings.

## Nesting

Import dependencies directly into the parent page; snippets cannot import other snippets. Avoid passing JSX through multiple snippet levels. Conditionally rendered nested snippets, such as `<MDX>{flag && <Outer />}</MDX>`, can render nothing while their headings still appear in the TOC. Check the rendered output, not only compilation.

See [React components](https://www.mintlify.com/docs/customize/react-components) and [reusable snippets](https://www.mintlify.com/docs/create/reusable-snippets).
