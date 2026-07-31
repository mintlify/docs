export const NavigationBuilder = () => {
  // Mintlify evaluates snippet exports independently, so shared values must stay in this scope.
  const DIVISIONS = {
    languages: { singular: "language", pluralLabel: "Languages", placeholder: "en" },
    versions: { singular: "version", pluralLabel: "Versions", placeholder: "v1" },
    products: { singular: "product", pluralLabel: "Products", placeholder: "Platform" },
    dropdowns: { singular: "dropdown", pluralLabel: "Dropdowns", placeholder: "Documentation" },
    tabs: { singular: "tab", pluralLabel: "Tabs", placeholder: "Guides" },
    anchors: { singular: "anchor", pluralLabel: "Anchors", placeholder: "API reference" },
    menu: { singular: "item", pluralLabel: "Menu items", placeholder: "Getting started" },
    groups: { singular: "group", pluralLabel: "Groups", placeholder: "Getting started" },
  }

  // Which child divisions are valid inside a given division, in the order buttons are shown.
  // Mirrors the nesting rules in /organize/navigation: each level holds only one child type,
  // and a group's own children always live in a "pages" array (which can itself nest groups).
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
  const nextId = (prefix) => `${prefix}-${++idRef.current}`

  const createContainer = (division) => ({
    id: nextId(division),
    type: "container",
    division,
    label: "",
    childDivision: null,
    children: [],
    pages: [],
  })
  const createLeaf = () => ({ id: nextId("page"), type: "leaf", value: "" })

  const [rootDivision, setRootDivision] = useState("groups")
  const [entries, setEntries] = useState([
    {
      id: "seed-group",
      type: "container",
      division: "groups",
      label: "Getting started",
      childDivision: "pages",
      children: [],
      pages: [
        { id: "seed-page-1", type: "leaf", value: "index" },
        { id: "seed-page-2", type: "leaf", value: "quickstart" },
        { id: "seed-page-3", type: "leaf", value: "development" },
      ],
    },
  ])
  const [copied, setCopied] = useState(false)

  const mapTree = (items, id, fn) =>
    items.map((item) => {
      if (item.id === id) return fn(item)
      if (item.type !== "container") return item
      return {
        ...item,
        children: item.children.length ? mapTree(item.children, id, fn) : item.children,
        pages: item.pages.length ? mapTree(item.pages, id, fn) : item.pages,
      }
    })

  const removeTree = (items, id) =>
    items
      .filter((item) => item.id !== id)
      .map((item) =>
        item.type === "container"
          ? { ...item, children: removeTree(item.children, id), pages: removeTree(item.pages, id) }
          : item,
      )

  const updateLabel = (id, value) =>
    setEntries((items) => mapTree(items, id, (item) => ({ ...item, label: value })))
  const updatePageValue = (id, value) =>
    setEntries((items) => mapTree(items, id, (item) => ({ ...item, value })))
  const removeNode = (id) => setEntries((items) => removeTree(items, id))
  const setChildDivision = (id, division) =>
    setEntries((items) =>
      mapTree(items, id, (item) => ({
        ...item,
        childDivision: division,
        children: division !== "pages" ? [createContainer(division)] : [],
        pages: division === "pages" ? [createLeaf()] : [],
      })),
    )
  const clearChildDivision = (id) =>
    setEntries((items) =>
      mapTree(items, id, (item) => ({ ...item, childDivision: null, children: [], pages: [] })),
    )
  const addChildContainer = (id) =>
    setEntries((items) =>
      mapTree(items, id, (item) => ({
        ...item,
        children: [...item.children, createContainer(item.childDivision)],
      })),
    )
  const addPageLeaf = (id) =>
    setEntries((items) => mapTree(items, id, (item) => ({ ...item, pages: [...item.pages, createLeaf()] })))
  const addNestedGroup = (id) =>
    setEntries((items) =>
      mapTree(items, id, (item) => ({ ...item, pages: [...item.pages, createContainer("groups")] })),
    )

  const chooseRootDivision = (division) => {
    setRootDivision(division)
    setEntries([division === "pages" ? createLeaf() : createContainer(division)])
  }
  const resetRoot = () => {
    setRootDivision(null)
    setEntries([])
  }
  const addRootEntry = () =>
    setEntries((items) => [...items, rootDivision === "pages" ? createLeaf() : createContainer(rootDivision)])

  const containerToJSON = (node) => {
    const meta = DIVISIONS[node.division]
    const json = { [meta.singular]: node.label.trim() || meta.placeholder }
    if (node.childDivision === "pages") {
      json.pages = node.pages.map(pageEntryToJSON)
    } else if (node.childDivision) {
      json[node.childDivision] = node.children.map(containerToJSON)
    }
    return json
  }
  const pageEntryToJSON = (entry) =>
    entry.type === "leaf" ? entry.value.trim() || "page-path" : containerToJSON(entry)

  const output = JSON.stringify(
    {
      navigation: !rootDivision
        ? {}
        : rootDivision === "pages"
          ? { pages: entries.map(pageEntryToJSON) }
          : { [rootDivision]: entries.map(containerToJSON) },
    },
    null,
    2,
  )

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const optionButtonClasses =
    "px-2.5 py-1 text-sm rounded-lg border border-zinc-950/10 dark:border-white/10 text-zinc-950/70 dark:text-white/70 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-colors"
  const addButtonClasses =
    "px-2.5 py-1 text-sm rounded-lg border border-dashed border-zinc-950/20 dark:border-white/20 text-zinc-950/70 dark:text-white/70 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-colors"
  const tagClasses =
    "shrink-0 px-2 py-1 rounded-md font-mono text-xs bg-zinc-950/5 dark:bg-white/10 text-zinc-950/50 dark:text-white/50"
  const inputClasses =
    "flex-1 min-w-0 px-2 py-1 text-sm rounded-md border border-zinc-950/10 dark:border-white/10 bg-transparent"

  const renderRemoveButton = (id, label) => (
    <button
      type="button"
      onClick={() => removeNode(id)}
      aria-label={`Remove ${label}`}
      className="shrink-0 px-1.5 py-1 rounded-md text-zinc-950/40 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  )

  const renderPageLeaf = (entry) => (
    <div key={entry.id} className="flex items-center gap-2">
      <span className={tagClasses}>page</span>
      <input
        type="text"
        value={entry.value}
        onChange={(event) => updatePageValue(entry.id, event.target.value)}
        placeholder="quickstart"
        aria-label="Page path"
        className={`${inputClasses} font-mono`}
      />
      {renderRemoveButton(entry.id, "page")}
    </div>
  )

  const renderContainer = (node) => {
    const meta = DIVISIONS[node.division]
    const childOptions = CHILD_OPTIONS[node.division] || []

    return (
      <div
        key={node.id}
        className="rounded-xl border border-zinc-950/10 dark:border-white/10 p-3 space-y-3"
      >
        <div className="flex items-center gap-2">
          <span className={tagClasses}>{meta.singular}</span>
          <input
            type="text"
            value={node.label}
            onChange={(event) => updateLabel(node.id, event.target.value)}
            placeholder={meta.placeholder}
            aria-label={`${meta.pluralLabel} label`}
            className={inputClasses}
          />
          {renderRemoveButton(node.id, meta.singular)}
        </div>

        {node.childDivision ? (
          <div className="pl-4 border-l border-dashed border-zinc-950/10 dark:border-white/10 space-y-3">
            {node.childDivision === "pages" ? (
              <>
                <div className="space-y-2">
                  {node.pages.map((entry) =>
                    entry.type === "leaf" ? renderPageLeaf(entry) : renderContainer(entry),
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => addPageLeaf(node.id)} className={addButtonClasses}>
                    + Add page
                  </button>
                  <button type="button" onClick={() => addNestedGroup(node.id)} className={addButtonClasses}>
                    + Nest a group
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">{node.children.map((child) => renderContainer(child))}</div>
                <button
                  type="button"
                  onClick={() => addChildContainer(node.id)}
                  className={addButtonClasses}
                >
                  + Add another {DIVISIONS[node.childDivision].singular}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => clearChildDivision(node.id)}
              className="text-xs text-zinc-950/40 dark:text-white/40 hover:text-zinc-950/70 dark:hover:text-white/70 transition-colors"
            >
              Change nesting
            </button>
          </div>
        ) : (
          <div className="pl-4 space-y-2">
            <div className="text-xs text-zinc-950/50 dark:text-white/50">Nest inside {meta.singular}:</div>
            <div className="flex flex-wrap gap-2">
              {childOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setChildDivision(node.id, option)}
                  className={optionButtonClasses}
                >
                  {option === "pages" ? "Pages" : DIVISIONS[option].pluralLabel}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="not-prose grid gap-4 lg:grid-cols-2 lg:items-start">
      <div className="rounded-2xl border dark:border-white/10 p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-base font-semibold text-zinc-950 dark:text-white">Navigation builder</div>
            <div className="text-sm text-zinc-950/70 dark:text-white/70">
              Add and nest as many entries as you need, then copy the generated docs.json.
            </div>
          </div>
          {rootDivision && (
            <button
              type="button"
              onClick={resetRoot}
              className="shrink-0 text-sm text-zinc-950/50 dark:text-white/50 hover:text-zinc-950/80 dark:hover:text-white/80 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {!rootDivision ? (
          <div className="space-y-2">
            <div className="text-sm text-zinc-950/70 dark:text-white/70">Choose a root pattern:</div>
            <div className="flex flex-wrap gap-2">
              {CHILD_OPTIONS.root.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => chooseRootDivision(option)}
                  className={optionButtonClasses}
                >
                  {option === "pages" ? "Pages" : DIVISIONS[option].pluralLabel}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-1 rounded-md font-mono text-xs bg-primary/10 text-primary dark:text-primary-light">
                {rootDivision}
              </span>
              <span className="text-xs text-zinc-950/50 dark:text-white/50">root pattern</span>
            </div>

            <div className="space-y-3">
              {entries.map((entry) => (entry.type === "leaf" ? renderPageLeaf(entry) : renderContainer(entry)))}
            </div>

            <button type="button" onClick={addRootEntry} className={addButtonClasses}>
              + Add another {rootDivision === "pages" ? "page" : DIVISIONS[rootDivision].singular}
            </button>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-4 relative">
        <button
          onClick={copyToClipboard}
          aria-label="Copy configuration"
          className="absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 group"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4 dark:text-white/60 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-white/60 transition-colors">
            <path d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className="absolute top-9 right-0 bg-primary text-white text-xs px-1.5 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
        <pre className="p-4 rounded-lg overflow-auto text-xs border dark:border-white/10 max-h-[32rem]">
          <code>{output}</code>
        </pre>
      </div>
    </div>
  )
}
