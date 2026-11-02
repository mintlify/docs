export const NavigationBuilder = ({ CodeBlockComponent }) => {
  // Mintlify evaluates snippet exports independently, so shared values must stay in this scope.
  // Based on the original builder by Royce Williams (mintlify/docs#6821).
  //
  // Security: user input is only rendered as React text and serialized with JSON.stringify.
  // The builder has no network requests, storage, global listeners, or raw HTML.

  const LANGUAGE_CODES = ["en", "es", "fr", "de", "ja", "zh", "ko", "pt-BR"]

  // key: the JSON key that names each entry. label: UI name for one entry.
  const DIVISIONS = {
    languages: { key: "language", label: "language", plural: "Languages" },
    versions: { key: "version", label: "version", plural: "Versions" },
    products: { key: "product", label: "product", plural: "Products" },
    dropdowns: { key: "dropdown", label: "dropdown", plural: "Dropdowns" },
    tabs: { key: "tab", label: "tab", plural: "Tabs" },
    anchors: { key: "anchor", label: "anchor", plural: "Anchors" },
    menu: { key: "item", label: "menu item", plural: "Menu" },
    groups: { key: "group", label: "group", plural: "Groups" },
  }

  // Child types each element accepts, mirroring the navigation definitions in
  // https://mintlify.com/docs.json (navigationSchema, tabSchema, anchorSchema, and so on).
  // Update this when the schema changes. Groups always hold pages, which can include nested groups.
  const CHILD_OPTIONS = {
    root: ["languages", "versions", "products", "dropdowns", "tabs", "anchors", "groups", "pages"],
    languages: ["versions", "products", "dropdowns", "tabs", "anchors", "groups", "pages"],
    versions: ["languages", "products", "dropdowns", "tabs", "anchors", "groups", "pages"],
    products: ["languages", "versions", "dropdowns", "tabs", "anchors", "menu", "groups", "pages"],
    dropdowns: ["languages", "versions", "products", "tabs", "anchors", "groups", "pages"],
    tabs: ["languages", "versions", "products", "dropdowns", "anchors", "menu", "groups", "pages"],
    anchors: ["languages", "versions", "products", "dropdowns", "tabs", "groups", "pages"],
    menu: ["languages", "versions", "products", "dropdowns", "tabs", "anchors", "groups", "pages"],
    groups: ["pages"],
  }

  const idRef = useRef(0)
  const countersRef = useRef({})

  const nextCount = (name) => {
    countersRef.current[name] = (countersRef.current[name] || 0) + 1
    return countersRef.current[name]
  }

  // Each new element gets a unique default name so the generated JSON reads like a real config.
  const defaultLabel = (division) => {
    const count = nextCount(division)
    if (division === "languages") return LANGUAGE_CODES[(count - 1) % LANGUAGE_CODES.length]
    if (division === "versions") return `v${count}`
    const label = DIVISIONS[division].label
    return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${count}`
  }

  const createContainer = (division) => ({
    id: `node-${++idRef.current}`,
    type: "container",
    division,
    label: "",
    defaultLabel: defaultLabel(division),
    childDivision: null,
    children: [],
  })
  const createPage = () => ({
    id: `node-${++idRef.current}`,
    type: "page",
    value: "",
    defaultValue: `page-${nextCount("pages")}`,
  })

  const createRoot = () => ({
    id: "root",
    type: "container",
    division: "root",
    childDivision: null,
    children: [],
  })

  const [root, setRoot] = useState(createRoot)

  const mapTree = (node, id, fn) => {
    if (node.id === id) return fn(node)
    if (node.type !== "container") return node
    return { ...node, children: node.children.map((child) => mapTree(child, id, fn)) }
  }
  const removeFromTree = (node, id) =>
    node.type !== "container"
      ? node
      : {
          ...node,
          children: node.children
            .filter((child) => child.id !== id)
            .map((child) => removeFromTree(child, id)),
        }

  const update = (id, fn) => setRoot((current) => mapTree(current, id, fn))

  // New nodes are created outside the state updaters so updaters stay pure.
  const setChildDivision = (id, division) => {
    const first = division === "pages" ? createPage() : createContainer(division)
    update(id, (node) => ({ ...node, childDivision: division, children: [first] }))
  }
  const clearChildDivision = (id) =>
    update(id, (node) => ({ ...node, childDivision: null, children: [] }))
  const addChild = (id, division) => {
    const child = division === "pages" ? createPage() : createContainer(division)
    update(id, (node) => ({ ...node, children: [...node.children, child] }))
  }
  const addNestedGroup = (id) => {
    const group = createContainer("groups")
    update(id, (node) => ({ ...node, children: [...node.children, group] }))
  }
  const removeNode = (id) => setRoot((current) => removeFromTree(current, id))
  const reset = () => {
    idRef.current = 0
    countersRef.current = {}
    setRoot(createRoot())
  }

  const toJSON = (node) => {
    if (node.type === "page") return node.value.trim() || node.defaultValue
    const json =
      node.division === "root" ? {} : { [DIVISIONS[node.division].key]: node.label.trim() || node.defaultLabel }
    if (node.childDivision) json[node.childDivision] = node.children.map(toJSON)
    return json
  }

  const output = JSON.stringify({ navigation: toJSON(root) }, null, 2)

  const optionButtonClasses =
    "px-2.5 py-1 text-sm rounded-lg border border-zinc-950/10 dark:border-white/10 text-zinc-950/70 dark:text-white/70 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-colors"
  const addButtonClasses =
    "px-2.5 py-1 text-sm rounded-lg border border-dashed border-zinc-950/20 dark:border-white/20 text-zinc-950/70 dark:text-white/70 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-colors"
  const subtleButtonClasses =
    "text-xs text-zinc-950/60 dark:text-white/60 hover:text-zinc-950 dark:hover:text-white underline-offset-2 hover:underline"
  const tagClasses =
    "shrink-0 px-2 py-1 rounded-md font-mono text-xs bg-zinc-950/5 dark:bg-white/10 text-zinc-950/60 dark:text-white/60"
  const inputClasses =
    "flex-1 min-w-0 px-2 py-1 text-sm rounded-md border border-zinc-950/10 dark:border-white/10 bg-transparent text-zinc-950 dark:text-white placeholder:text-zinc-950/40 dark:placeholder:text-white/40"

  const nodeName = (node) =>
    node.type === "page"
      ? `page ${node.value.trim() || node.defaultValue}`
      : `${DIVISIONS[node.division].label} ${node.label.trim() || node.defaultLabel}`

  const renderRemoveButton = (node) => (
    <button
      type="button"
      onClick={() => removeNode(node.id)}
      aria-label={`Remove ${nodeName(node)}`}
      className="shrink-0 px-2 py-1 rounded-md text-zinc-950/50 dark:text-white/50 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  )

  const renderPage = (node) => (
    <div key={node.id} className="flex items-center gap-2">
      <span className={tagClasses} aria-hidden="true">
        page
      </span>
      <input
        type="text"
        value={node.value}
        onChange={(event) => update(node.id, (item) => ({ ...item, value: event.target.value }))}
        placeholder={node.defaultValue}
        aria-label="Page path"
        spellCheck={false}
        className={`${inputClasses} font-mono`}
      />
      {renderRemoveButton(node)}
    </div>
  )

  // The child area of any container, including the root: either a picker for the child type,
  // or the list of children with controls to add more.
  const renderChildren = (node) => {
    const parentName = node.division === "root" ? "navigation" : DIVISIONS[node.division].label

    if (!node.childDivision) {
      const options = CHILD_OPTIONS[node.division]
      const headingId = `${node.id}-options`
      return (
        <div className="space-y-2">
          <div id={headingId} className="text-sm text-zinc-950/70 dark:text-white/70">
            {node.division === "root" ? "Choose a root element:" : `Add to this ${parentName}:`}
          </div>
          <div role="group" aria-labelledby={headingId} className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setChildDivision(node.id, option)}
                className={optionButtonClasses}
              >
                {option === "pages" ? "Pages" : DIVISIONS[option].plural}
              </button>
            ))}
          </div>
        </div>
      )
    }

    const isPages = node.childDivision === "pages"
    const childLabel = isPages ? "page" : DIVISIONS[node.childDivision].label

    return (
      <div className="space-y-3">
        <div className="space-y-3">
          {node.children.map((child) => (child.type === "page" ? renderPage(child) : renderContainer(child)))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => addChild(node.id, node.childDivision)} className={addButtonClasses}>
            + Add {childLabel}
          </button>
          {isPages ? (
            <button type="button" onClick={() => addNestedGroup(node.id)} className={addButtonClasses}>
              + Add nested group
            </button>
          ) : null}
          {node.division !== "root" ? (
            <button type="button" onClick={() => clearChildDivision(node.id)} className={subtleButtonClasses}>
              Change contents
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  const renderContainer = (node) => {
    const meta = DIVISIONS[node.division]
    const hint = node.division === "languages" ? "Use a language code, like en or fr." : null
    const hintId = `${node.id}-hint`
    return (
      <div
        key={node.id}
        role="group"
        aria-label={nodeName(node)}
        className="rounded-xl border border-zinc-950/10 dark:border-white/10 p-3 space-y-3"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={tagClasses} aria-hidden="true">
              {meta.key}
            </span>
            <input
              type="text"
              value={node.label}
              onChange={(event) => update(node.id, (item) => ({ ...item, label: event.target.value }))}
              placeholder={node.defaultLabel}
              aria-label={`${meta.label.charAt(0).toUpperCase()}${meta.label.slice(1)} name`}
              aria-describedby={hint ? hintId : undefined}
              className={inputClasses}
            />
            {renderRemoveButton(node)}
          </div>
          {hint ? (
            <div id={hintId} className="text-xs text-zinc-950/60 dark:text-white/60">
              {hint}
            </div>
          ) : null}
        </div>
        <div className="pl-4 border-l border-dashed border-zinc-950/15 dark:border-white/15">
          {renderChildren(node)}
        </div>
      </div>
    )
  }

  return (
    <div className="not-prose space-y-4">
      <div className="rounded-2xl border border-zinc-950/10 dark:border-white/10 p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-base font-semibold text-zinc-950 dark:text-white">Navigation builder</div>
          {root.childDivision ? (
            <button type="button" onClick={reset} className={subtleButtonClasses}>
              Start over
            </button>
          ) : null}
        </div>
        {renderChildren(root)}
      </div>
      {root.childDivision ? (
        <CodeBlockComponent language="json" filename="docs.json">
          {output}
        </CodeBlockComponent>
      ) : null}
    </div>
  )
}
