export const NavigationBuilder = () => {
  const DIVISIONS = {
    languages: { label: "Languages", key: "language", sample: "en" },
    versions: { label: "Versions", key: "version", sample: "v2" },
    products: { label: "Products", key: "product", sample: "Platform" },
    dropdowns: { label: "Dropdowns", key: "dropdown", sample: "Documentation" },
    tabs: { label: "Tabs", key: "tab", sample: "Guides" },
    anchors: { label: "Anchors", key: "anchor", sample: "API reference" },
    menu: { label: "Menu", key: "item", sample: "Getting started" },
    groups: { label: "Groups", key: "group", sample: "Essentials" },
    pages: { label: "Pages" },
  }

  const CHILDREN = {
    navigation: ["languages", "versions", "products", "dropdowns", "tabs", "anchors", "groups", "pages"],
    languages: ["versions", "products", "dropdowns", "tabs", "anchors", "groups", "pages"],
    versions: ["languages", "products", "dropdowns", "tabs", "anchors", "groups", "pages"],
    products: ["languages", "versions", "dropdowns", "tabs", "anchors", "menu", "groups", "pages"],
    dropdowns: ["languages", "versions", "products", "tabs", "anchors", "groups", "pages"],
    tabs: ["languages", "versions", "products", "dropdowns", "anchors", "menu", "groups", "pages"],
    anchors: ["languages", "versions", "products", "dropdowns", "tabs", "groups", "pages"],
    menu: ["languages", "versions", "products", "dropdowns", "tabs", "anchors", "groups", "pages"],
    groups: ["pages"],
    pages: [],
  }

  const [chain, setChain] = useState([])
  const [copied, setCopied] = useState(false)

  const parent = chain.length ? chain[chain.length - 1] : "navigation"
  const options = CHILDREN[parent].filter((division) => !chain.includes(division))

  const buildNode = (index) => {
    const division = chain[index]
    if (!division || division === "pages") {
      return { pages: ["index", "quickstart", "settings"] }
    }
    const { key, sample } = DIVISIONS[division]
    return { [division]: [{ [key]: sample, ...buildNode(index + 1) }] }
  }

  const output = JSON.stringify({ navigation: buildNode(0) }, null, 2)

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

  return (
    <div className="p-4 border dark:border-white/10 rounded-2xl not-prose space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-zinc-950/70 dark:text-white/70">
            Select navigation elements from the outside in.
          </p>
          {chain.length > 0 && (
            <button
              type="button"
              onClick={() => setChain([])}
              className="text-sm text-zinc-950/50 dark:text-white/50 hover:text-zinc-950/80 dark:hover:text-white/80 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-1 rounded-md font-mono text-xs bg-zinc-950/5 dark:bg-white/10 text-zinc-950/70 dark:text-white/70">
            navigation
          </span>
          {chain.map((division, index) => (
            <span key={division} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-zinc-950/40 dark:text-white/40">
                &rsaquo;
              </span>
              <button
                type="button"
                onClick={() => setChain(chain.slice(0, index))}
                aria-label={`Remove ${DIVISIONS[division].label} and everything nested inside it`}
                className="flex items-center gap-1 px-2 py-1 rounded-md font-mono text-xs bg-primary/10 text-primary dark:text-primary-light hover:opacity-70 transition-opacity"
              >
                {division}
                <span aria-hidden="true">&times;</span>
              </button>
            </span>
          ))}
        </div>
      </div>

      {options.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-zinc-950/70 dark:text-white/70">
            {chain.length === 0
              ? "Choose a root element:"
              : `Nest inside ${DIVISIONS[parent].label.toLowerCase()}:`}
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((division) => (
              <button
                key={division}
                type="button"
                onClick={() => setChain([...chain, division])}
                className="px-2.5 py-1 text-sm rounded-lg border border-zinc-950/10 dark:border-white/10 text-zinc-950/70 dark:text-white/70 hover:bg-zinc-950/5 dark:hover:bg-white/10 transition-colors"
              >
                {DIVISIONS[division].label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-950/70 dark:text-white/70">
          Pages are the deepest level of a navigation hierarchy.
        </p>
      )}

      <div className="relative">
        <button
          onClick={copyToClipboard}
          aria-label="Copy configuration"
          className="absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 group"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4 dark:text-white/60 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-white/60 transition-colors">
            <path d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className="absolute top-9 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
        <pre className="p-4 rounded-lg overflow-auto text-xs border dark:border-white/10">
          <code>{output}</code>
        </pre>
      </div>

      <p className="text-sm text-zinc-950/50 dark:text-white/50">
        Each array contains one example entry. Add as many entries as you need at any level.
      </p>
    </div>
  )
}
