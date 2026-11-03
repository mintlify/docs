// The agent setup prompt on the home page. It follows the anatomy of the
// Mentha Prompt primitive: a sunken shell, a header with a title and
// actions, and a raised body that holds the prompt text. Tokens come from
// home.css, so this only renders correctly inside `.mentha-home`.
//
// The prompt stays short on purpose. The full setup workflow lives in the
// agent-only section of quickstart.mdx, so it has one source of truth and
// the prompt fits in an Open in Cursor link.

export const HomeSetupPrompt = () => {
  const prompt = `Set up Mintlify for me. Fetch https://www.mintlify.com/docs/quickstart.md and follow its agent setup workflow.`;

  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard
      .writeText(prompt)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard access can be denied. The prompt stays visible to copy by hand.
      });
  };

  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-[10px] bg-[var(--mh-surface-sunken-1)] p-1 text-left">
      <div className="flex min-h-9 flex-wrap items-center gap-2 ps-2.5">
        <span className="flex items-center gap-1.5 text-[14px] leading-5 font-medium text-[color:var(--mh-text-strong)]">
          <Icon icon="sparkles" size={16} color="var(--mh-icon-base)" />
          Agent setup prompt
        </span>

        <div className="ms-auto flex shrink-0 items-center gap-1 p-1">
          <button
            type="button"
            onClick={copy}
            className="mh-focus inline-flex h-7 cursor-pointer items-center gap-1 rounded-md bg-[var(--mh-surface-inverse)] px-2 text-[14px] leading-5 font-medium whitespace-nowrap text-[color:var(--mh-text-on-inverse)] mh-shadow-weak transition-opacity duration-150 ease-out hover:opacity-90"
          >
            <Icon
              icon={copied ? "check" : "copy"}
              size={16}
              color={copied ? "var(--mh-icon-success)" : "var(--mh-icon-weak)"}
            />
            {copied ? "Copied" : "Copy prompt"}
          </button>

          <a
            href={`https://cursor.com/link/prompt?text=${encodeURIComponent(prompt)}`}
            className="mh-focus-flat inline-flex h-7 items-center gap-1 rounded-md bg-[var(--mh-surface-grey)] px-2 text-[14px] leading-5 font-medium whitespace-nowrap text-[color:var(--mh-text-strong)] no-underline transition-colors duration-150 ease-out hover:bg-[var(--mh-hover-strong)]"
          >
            Open in Cursor
          </a>
        </div>
      </div>

      <div className="min-w-0 rounded-md bg-[var(--mh-surface-0)] p-2.5 mh-shadow-weak">
        <p className="m-0 text-[15px] leading-6 break-words whitespace-pre-wrap text-[color:var(--mh-text-base)]">
          {prompt}
        </p>
      </div>

      <span aria-live="polite" className="sr-only">
        {copied ? "Prompt copied to clipboard" : ""}
      </span>
    </div>
  );
};
