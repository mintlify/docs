# Interactive widgets

A widget is a React component written in the page itself: a calculator, a simulator, a chart with hover values, a step-through diagram, or a live version of the UI the page describes. Widgets run on published sites and in the Mintlify editor, including Workspace and private pages. They need no files outside the page, so you can write them through `create_node`, `write_page` and `edit_page`.

Reach for widgets as a normal part of writing a page, the way you would reach for a table or a code block, and follow the limits below exactly.

## When to build one

Build a widget when the reader understands faster by changing something and watching the result:

| The content is | Build |
|---|---|
| A value that depends on inputs (pricing, quotas, rate limits, retry backoff, timeouts, sizing) | A calculator with sliders or inputs and live results |
| A process, lifecycle or state machine (request flow, deploy pipeline, auth flow, retries) | A step-through with Back and Next, highlighting the active step |
| A structure to explore (architecture, data model, permission matrix, config tree) | A diagram where clicking or hovering a part shows its details |
| Numbers with a shape (benchmarks, trends, distributions, before and after) | An SVG chart with hover values |
| UI or visual behavior (a component, an animation, a layout, an interaction) | A live, working version of it |
| Options to compare | One widget with a toggle between them |

Prefer a widget over Mermaid, screenshots of charts, and screen recordings whenever a row above fits. A page about a UI component shows the component working, not a recording of it. Keep Mermaid for a static graph the user asks for, or when the site already uses Mermaid for that kind of diagram.

Don't build a widget for reference content (parameters, endpoints, config keys), procedures (use `<Steps>`), anything a built-in component covers (`<Tabs>`, `<Accordion>`, `<Tree>`, `<Columns>` with `<Card>`), or decoration.

The no-invention rule in `reference/writing.md` applies to every number, formula, label and behavior in a widget. Use the real formula or data from the source. When the widget simplifies (toy data, rounded constants, a reduced model), say so in a `<Note>` next to it.

Place each widget directly after the prose it illustrates. That prose states the point on its own; the widget lets the reader test it. A long explainer can carry several small widgets, one per idea, rather than one large one.

## Where the code goes

```mdx
---
title: "Retry backoff"
description: "..."
---

Failed requests are retried with exponential backoff...

<BackoffCalculator />

## Next steps

...

export const BackoffCalculator = () => {
  const [attempts, setAttempts] = useState(5);
  return <div className="not-prose">...</div>;
};
```

- Define each widget at the end of the file, after all page content, as `export const PascalCaseName = () => { ... }`, with a blank line before and after it. MDX hoists exports, so the tag renders the widget even above its definition. Exports are invisible blocks in the visual editor: above the first heading, Backspace at the start of that heading can delete them, and in source mode they push the page content down.
- Write plain JavaScript JSX. A TypeScript annotation breaks the whole page on the published site, not only the widget.
- Render it as a self-closing tag, `<PascalCaseName />`. Prefer no props and keep configuration as constants inside the component; if you pass props, use literal values only (`label="p95"`, `count={24}`), never spreads.
- Controls and the views they drive go in one component. Each usage has its own state, so two widgets on a page can't share state. Don't use a module-level variable to share it either: on the site it is shared across usages, in the editor it isn't. A widget can render another widget exported from the same page.
- Inside a widget, use HTML and SVG elements. Mintlify components such as `<Note>`, `<Tabs>`, `<Steps>`, `<Accordion>`, `<Columns>`, `<Badge>`, `<Tooltip>` and `<Icon>` also work, but `<Card>` inside a widget fails in the editor; put cards in the page around the widget.
- Use the default page layout, or `mode: "wide"` for wide widgets. Don't use `mode: "custom"` or `mode: "frame"`, because the editor shows those pages as a read-only preview.
- In a local repository, you can move a widget to `/snippets/<name>.jsx`, import it and place it directly in the page (see `reference/customization/react-and-snippets.md`); a widget that uses an imported snippet inside its own code fails in the editor. Through the Admin MCP server and in Workspace, keep widgets in the page.

## What you can use

- React hooks without importing them: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useReducer`, `useLayoutEffect`, `useId` and the other built-in hooks, plus `React`.
- HTML elements, inline SVG, `<canvas>`, form controls such as `<input type="range">`, `<select>` and `<button>`.
- Browser APIs inside `useEffect` and event handlers, with cleanup: `requestAnimationFrame`, `ResizeObserver`, pointer and keyboard events, canvas 2D, fullscreen.
- An embedded hosted app: `<iframe src="https://..." style={{ width: "100%", height: 480 }} />`. The embedded page loads with its own network access, so hosted playgrounds, sandboxes and demos work. Use only URLs the user gave you or that come from the project.
- A charting or graphics library, only when hand-written SVG or canvas would be much worse: add a `<script>` element in `useEffect` that loads one exact pinned version from `https://cdn.jsdelivr.net/npm/` or `https://cdnjs.cloudflare.com/ajax/libs/`, then use its global after it loads. The library must not fetch anything after loading.
- A self-contained HTML app in ``<iframe srcDoc={`<!doctype html>...`} />`` with its own `<style>` and `<script>`, at a fixed height. Use this to port an existing single-file HTML artifact as is.

## Hard limits

Each of these breaks a widget in the editor, on the site, or both.

- No network calls from the component: no `fetch`, XHR, `WebSocket` or `EventSource`. Write data into the component as constants. An embedded `<iframe src>` is the only way to show live data.
- No `import` statements, npm packages, default exports or `React.lazy`. Never use dynamic `import()`: it breaks every widget on the page in the editor and blanks the page body on the site.
- No `localStorage`, `sessionStorage`, cookies or IndexedDB; they fail or do nothing in the editor. State resets on reload, and in the editor a widget also resets when it scrolls far off screen or the editor theme changes.
- No `alert`, `confirm` or `prompt`; the editor ignores them. Show messages inside the widget.
- Stay inside the widget's root element: no `document.querySelector` outside your own refs, no `window.parent` or `window.top`, and no global CSS. Page-level `<style>` blocks and the site's custom CSS don't reach widgets in the editor.
- No `position: fixed`. The editor clips anything drawn outside the widget's box, so keep tooltips and popovers inside the root element.
- Links inside a widget don't navigate in the editor. Put links in the surrounding prose.
- Keep each widget under about 300 lines. The editor runs at most 10 widgets at a time and pauses the rest until they scroll into view.

## Styling

- Give the root element `className="not-prose"` so the docs typography doesn't restyle your controls.
- Style with inline `style={{ ... }}` objects, or with one ``<style>{`...`}</style>`` element inside the component. In that element, prefix every class with a short widget-specific prefix (`.bc-row`, `.bc-bar`), because on the site it applies to the whole page.
- Make every color work in light and dark mode. Use `color: "inherit"` for text, translucent neutrals such as `rgba(127,127,127,.25)` for borders and surfaces, and accent colors of medium lightness. Set a solid background only for a deliberate screen, such as a canvas or a terminal, and set its text colors explicitly.
- Tailwind classes work as complete literal strings, including arbitrary values (`bg-[#0f172a]`) and `hover:` and `dark:` variants. Classes built by concatenation or template strings stay unstyled. In the editor, pages over about 500 KB lose Tailwind, so use inline styles on very large pages.
- Make the widget fit any width. Use `width: "100%"`, let rows wrap (`flexWrap: "wrap"` or `gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))"`), set `minWidth: 0` on flex and grid children that hold text, and draw SVG with a `viewBox` and `width: "100%"`. Height follows the content; give `<canvas>` and `<iframe>` explicit heights.
- Make it usable without a mouse. Use `<button type="button">` for actions and wrap inputs in a `<label>` with visible text, show each slider's current value next to it, and add an `aria-label` to icon-only buttons.

## Markdown output and crawlers

Widgets render for readers on the published site and in the editor. On the site they run once the page's JavaScript loads, so the initial server-rendered HTML, the page's `.md` URL and `llms-full.txt` don't include them.

- The surrounding prose must carry every fact the widget shows.
- On a public docs site, when the widget holds information that search and AI agents need, add a static version, such as a table, inside `<Visibility for="agents">`. Workspace pages don't need this.

## Warnings from write tools

`create_node`, `write_page` and `edit_page` can return `notRendered` warnings. They describe the server-rendered HTML, not what readers see after the page loads. For widget code, expect and ignore these:

- "event handlers are dropped", "JavaScript expressions are dropped", "`<style>` blocks are dropped", "scripts are dropped": these happen only in the server-rendered HTML. The widget runs in the browser.

Don't replace a working widget with static HTML because of these warnings. A write that fails to parse is refused; fix the syntax and write again. To change only a widget, use `edit_page` on the text of its export.

## Check the widget

- Before writing, check the code against the hard limits.
- After writing, open the `editorUrl` the tool returns if you can use a browser, and use every control. A widget that throws while rendering shows "could not be rendered" in the editor; one that throws after it appears leaves a blank gap; on the published site it disappears without a message. Check every control in the editor before publishing.
- If you can't open a browser, give the user the `editorUrl` and say which interactions to try.

## Patterns

### Calculator

Every number comes from state, and the derived values are computed during render.

```jsx
export const BackoffCalculator = () => {
  const [base, setBase] = useState(200);
  const [attempts, setAttempts] = useState(5);
  const delays = Array.from({ length: attempts }, (_, i) => base * 2 ** i);
  const max = delays[delays.length - 1];
  return (
    <div className="not-prose" style={{ border: "1px solid rgba(127,127,127,.25)", borderRadius: 12, padding: 16, display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 4, fontSize: 14 }}>
        Base delay: {base} ms
        <input type="range" min={50} max={1000} step={50} value={base} onChange={(e) => setBase(Number(e.target.value))} />
      </label>
      <label style={{ display: "grid", gap: 4, fontSize: 14 }}>
        Attempts: {attempts}
        <input type="range" min={1} max={8} value={attempts} onChange={(e) => setAttempts(Number(e.target.value))} />
      </label>
      {delays.map((delay, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{ width: 72 }}>Retry {i + 1}</span>
          <div style={{ height: 10, borderRadius: 5, background: "#3b82f6", width: `${(delay / max) * 100}%`, minWidth: 4 }} />
          <span style={{ whiteSpace: "nowrap" }}>{delay.toLocaleString()} ms</span>
        </div>
      ))}
      <div style={{ fontSize: 13, opacity: 0.7 }}>Total wait: {delays.reduce((sum, d) => sum + d, 0).toLocaleString()} ms</div>
    </div>
  );
};
```

### Step-through

Use this for processes and lifecycles in place of a Mermaid sequence or flow diagram. The steps array holds the real steps from the source.

```jsx
export const FlowSteps = () => {
  const steps = [
    { label: "Client", detail: "Redirects the user to the authorization server." },
    { label: "Authorization server", detail: "Authenticates the user and returns a code." },
    { label: "Client", detail: "Exchanges the code for an access token." },
    { label: "API", detail: "Accepts requests that carry the access token." },
  ];
  const [active, setActive] = useState(0);
  const navButton = { padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(127,127,127,.35)", background: "transparent", color: "inherit", font: "inherit", cursor: "pointer" };
  return (
    <div className="not-prose" style={{ border: "1px solid rgba(127,127,127,.25)", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
        {steps.map((step, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            style={{
              textAlign: "left", padding: 10, borderRadius: 8, font: "inherit", color: "inherit", cursor: "pointer",
              border: i === active ? "2px solid #3b82f6" : "1px solid rgba(127,127,127,.3)",
              background: i === active ? "rgba(59,130,246,.12)" : "transparent",
              opacity: i > active ? 0.5 : 1,
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7 }}>Step {i + 1}</div>
            <div style={{ fontWeight: 600 }}>{step.label}</div>
          </button>
        ))}
      </div>
      <p style={{ margin: "14px 0" }}>{steps[active].detail}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" style={navButton} disabled={active === 0} onClick={() => setActive(active - 1)}>Back</button>
        <button type="button" style={navButton} disabled={active === steps.length - 1} onClick={() => setActive(active + 1)}>Next</button>
      </div>
    </div>
  );
};
```

### Chart with hover values

Draw with SVG and a `viewBox`, and keep the tooltip inside the root element.

```jsx
export const LatencyChart = () => {
  const data = [
    { label: "p50", ms: 120 },
    { label: "p90", ms: 340 },
    { label: "p99", ms: 910 },
  ];
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map((d) => d.ms));
  return (
    <div className="not-prose" style={{ border: "1px solid rgba(127,127,127,.25)", borderRadius: 12, padding: 16 }}>
      <svg viewBox="0 0 300 120" style={{ width: "100%", display: "block" }} onMouseLeave={() => setHover(null)}>
        {data.map((d, i) => {
          const h = (d.ms / max) * 100;
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)}>
              <rect x={20 + i * 95} y={105 - h} width={70} height={h} rx={4} fill="#3b82f6" opacity={hover === null || hover === i ? 1 : 0.4} />
              <text x={55 + i * 95} y={117} textAnchor="middle" fontSize="10" fill="currentColor">{d.label}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ fontSize: 14, minHeight: 20 }}>{hover === null ? "Hover a bar" : `${data[hover].label}: ${data[hover].ms} ms`}</div>
    </div>
  );
};
```

The latency numbers in this example are placeholders. In a real page, take them from the source and say where they come from.
