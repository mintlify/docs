export const NavigationBuilder = ({ CodeBlockComponent }) => {
  // Mintlify evaluates snippet exports independently, so shared values must stay in this scope.
  // Based on the original builder by Royce Williams (mintlify/docs#6821).
  //
  // Security: user input is only rendered as React text and serialized with JSON.stringify.
  // The builder has no network requests, storage, global listeners, or raw HTML.

  // Supported codes from the language enum in https://mintlify.com/docs.json, minus the lowercase
  // aliases fr-ca and ja-jp. Update this when the schema changes.
  const SUPPORTED_LANGUAGE_CODES = [
    "ar", "ca", "cn", "cs", "da", "de", "en", "es", "fi", "fr", "fr-CA", "he", "hi", "hu", "id", "it", "ja",
    "ja-JP", "jp", "ko", "lv", "nb", "nl", "no", "pl", "pt", "pt-BR", "ro", "ru", "sv", "tr", "uk", "uz", "vi",
    "zh", "zh-CN", "zh-Hans", "zh-Hant", "zh-TW",
  ]
  // Common languages come first as defaults, then the rest, so default names don't repeat.
  const COMMON_LANGUAGE_CODES = ["en", "es", "fr", "de", "ja", "zh", "ko", "pt-BR"]
  const DEFAULT_LANGUAGE_ORDER = [
    ...COMMON_LANGUAGE_CODES,
    ...SUPPORTED_LANGUAGE_CODES.filter((code) => !COMMON_LANGUAGE_CODES.includes(code)),
  ]

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
    if (division === "languages") return DEFAULT_LANGUAGE_ORDER[(count - 1) % DEFAULT_LANGUAGE_ORDER.length]
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
  const [activePanel, setActivePanel] = useState("editor")

  const mapTree = (node, id, fn) => {
    if (node.id === id) return fn(node)
    if (node.type !== "container") return node
    return { ...node, children: node.children.map((child) => mapTree(child, id, fn)) }
  }
  // Removing the last child returns its parent to the child-type picker. Several navigation
  // arrays require at least one item, so the builder never outputs an empty array.
  const removeFromTree = (node, id) => {
    if (node.type !== "container") return node
    const children = node.children
      .filter((child) => child.id !== id)
      .map((child) => removeFromTree(child, id))
    return { ...node, children, childDivision: children.length ? node.childDivision : null }
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
    setActivePanel("editor")
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
    const nameLabel = `${meta.label.charAt(0).toUpperCase()}${meta.label.slice(1)} name`
    const setLabel = (event) => update(node.id, (item) => ({ ...item, label: event.target.value }))
    return (
      <div
        key={node.id}
        role="group"
        aria-label={nodeName(node)}
        className="rounded-xl border border-zinc-950/10 dark:border-white/10 p-3 space-y-3"
      >
        <div className="flex items-center gap-2">
          <span className={tagClasses} aria-hidden="true">
            {meta.key}
          </span>
          {/* Language names must be a supported code, so they come from a fixed list. */}
          {node.division === "languages" ? (
            <select
              value={node.label || node.defaultLabel}
              onChange={setLabel}
              aria-label="Language code"
              className={`${inputClasses} font-mono`}
            >
              {SUPPORTED_LANGUAGE_CODES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={node.label}
              onChange={setLabel}
              placeholder={node.defaultLabel}
              aria-label={nameLabel}
              className={inputClasses}
            />
          )}
          {renderRemoveButton(node)}
        </div>
        <div className="pl-4 border-l border-dashed border-zinc-950/15 dark:border-white/15">
          {renderChildren(node)}
        </div>
      </div>
    )
  }

  // The page renders one builder, so static IDs are unique.
  const PANELS = [
    { id: "editor", label: "Editor" },
    { id: "json", label: "docs.json" },
  ]

  const selectPanel = (id) => {
    setActivePanel(id)
    const tab = document.getElementById(`navigation-builder-tab-${id}`)
    if (tab) tab.focus()
  }

  // Arrow keys move between tabs, following the WAI-ARIA tabs pattern.
  const onTabKeyDown = (event) => {
    const index = PANELS.findIndex((panel) => panel.id === activePanel)
    let next = null
    if (event.key === "ArrowRight") next = (index + 1) % PANELS.length
    if (event.key === "ArrowLeft") next = (index - 1 + PANELS.length) % PANELS.length
    if (event.key === "Home") next = 0
    if (event.key === "End") next = PANELS.length - 1
    if (next === null) return
    event.preventDefault()
    selectPanel(PANELS[next].id)
  }

  return (
    <div className="not-prose rounded-2xl border border-zinc-950/10 dark:border-white/10 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-base font-semibold text-zinc-950 dark:text-white">Navigation builder</div>
        <div className="flex items-center gap-3">
          {root.childDivision ? (
            <button type="button" onClick={reset} className={subtleButtonClasses}>
              Start over
            </button>
          ) : null}
          <div
            role="tablist"
            aria-label="Navigation builder view"
            onKeyDown={onTabKeyDown}
            className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950/5 dark:bg-white/10"
          >
            {PANELS.map((panel) => {
              const selected = activePanel === panel.id
              return (
                <button
                  key={panel.id}
                  id={`navigation-builder-tab-${panel.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`navigation-builder-panel-${panel.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActivePanel(panel.id)}
                  className={`px-2.5 py-1 text-sm rounded-md transition-colors ${
                    selected
                      ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-medium shadow-sm"
                      : "text-zinc-950/60 dark:text-white/60 hover:text-zinc-950 dark:hover:text-white"
                  } ${panel.id === "json" ? "font-mono" : ""}`}
                >
                  {panel.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div
        id={`navigation-builder-panel-${activePanel}`}
        role="tabpanel"
        aria-labelledby={`navigation-builder-tab-${activePanel}`}
      >
        {activePanel === "editor" ? (
          renderChildren(root)
        ) : root.childDivision ? (
          <CodeBlockComponent language="json" filename="docs.json">
            {output}
          </CodeBlockComponent>
        ) : (
          <div className="text-sm text-zinc-950/70 dark:text-white/70">
            Choose a root element in the editor to generate JSON.
          </div>
        )}
      </div>
    </div>
  )
}
