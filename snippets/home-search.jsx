// A search field for the home page. It opens the site's own search dialog
// through the documented `data-search-item="trigger"` hook, so readers get
// the same results and assistant handoff as the navbar search. If no
// trigger is visible, it falls back to the `?search=` URL parameter.
// Tokens come from home.css, so this only renders correctly inside
// `.mentha-home`.

export const HomeSearch = () => {
  const [modKey, setModKey] = useState("⌘");

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) {
      setModKey("Ctrl ");
    }
  }, []);

  const openSearch = () => {
    const triggers = document.querySelectorAll('[data-search-item="trigger"], #search-bar-entry, #search-bar-entry-mobile');
    const visible = Array.from(triggers).find((el) => el.offsetParent !== null);
    if (visible) {
      visible.click();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("search", "");
    window.location.assign(url.toString());
  };

  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Search the documentation"
      className="mh-focus flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-[10px] bg-[var(--mh-surface-2)] px-3.5 text-left mh-shadow-weak transition-colors duration-150 ease-out hover:bg-[var(--mh-surface-1)]"
    >
      <Icon icon="search" size={18} color="var(--mh-icon-base)" />
      <span className="flex-1 truncate text-[15px] leading-6 text-[color:var(--mh-text-base)]">Search the docs or ask a question</span>
      <kbd className="hidden rounded-[4px] bg-[var(--mh-surface-grey)] px-1.5 font-sans text-[12px] leading-5 text-[color:var(--mh-text-base)] sm:inline-block">{modKey}K</kbd>
    </button>
  );
};
