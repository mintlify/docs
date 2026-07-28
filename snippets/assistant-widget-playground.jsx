export const AssistantWidgetPlayground = ({ children, CodeBlockComponent }) => {
  // Mintlify evaluates snippet exports independently, so shared values must stay in this scope.
  const EXAMPLE_WIDGET_ID = "YOUR_WIDGET_ID";
  const EMBED_URL =
    "https://cdn.jsdelivr.net/npm/@mintlify/assistant-widget@0.0/dist/browser/embed.js";
  // The preview loads the hidden /assistant/widget-preview page through the
  // chromeless `/_minimal/` renderer instead of a srcdoc iframe: captcha
  // providers reject documents without a hostname, and srcdoc documents have
  // none. Message names must stay in sync with
  // snippets/assistant-widget-preview-host.jsx.
  const PREVIEW_READY_MESSAGE = "mintlify-assistant-playground:ready";
  const PREVIEW_UPDATE_MESSAGE = "mintlify-assistant-playground:update";
  const PREVIEW_STATE_MESSAGE = "mintlify-assistant-playground:state";
  const SUPPORT_EMAIL = "hi@mintlify.com";
  const STARTER_QUESTIONS = [
    "How do I get started with Mintlify?",
    "How do I customize my docs?",
    "How do I deploy my docs?",
  ];
  const VARIANT_OPTIONS = [
    { value: "widget", label: "Widget" },
    { value: "modal", label: "Modal" },
    { value: "panel", label: "Panel" },
  ];
  const THEME_OPTIONS = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];
  const SIDE_OPTIONS = [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "inline-start", label: "Inline start" },
    { value: "inline-end", label: "Inline end" },
  ];
  const ALIGN_OPTIONS = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ];
  const INSTALL_OPTIONS = [
    { value: "html", label: "HTML" },
    { value: "next", label: "Next.js" },
  ];

  const [installTarget, setInstallTarget] = useState("html");
  const [variant, setVariant] = useState("widget");
  const [theme, setTheme] = useState("system");
  const [accent, setAccent] = useState("#16a34a");
  const [radius, setRadius] = useState(18);
  const [side, setSide] = useState("bottom");
  const [align, setAlign] = useState("end");
  const [trackEvents, setTrackEvents] = useState(false);
  const [reportErrors, setReportErrors] = useState(false);
  const [previewHostReady, setPreviewHostReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewStatus, setPreviewStatus] = useState("loading");
  const previewRef = useRef(null);
  const previewHostRef = useRef(null);

  useEffect(() => {
    // Resolve the preview page against the deployment base path (for example
    // /docs on mintlify.com). Translated pages keep their locale segment
    // after the /_minimal/ renderer prefix.
    const pageMatch = window.location.pathname
      .replace(/\/$/, "")
      .match(/^(.*?)(\/[a-z]{2}(?:-[A-Za-z]{2,4})?)?\/assistant\/widget$/);
    const basePath = pageMatch?.[1] ?? "";
    const locale = pageMatch?.[2] ?? "";
    const mode = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setPreviewUrl(
      `${basePath}/_minimal${locale}/assistant/widget-preview?mode=${mode}`,
    );
  }, []);

  useEffect(() => {
    // A deleted custom script can leave its parent-page widget mounted during local hot reloads.
    const removeRootWidget = () => {
      const rootWidget = document.querySelector("body > mintlify-assistant");
      if (!rootWidget) return false;

      const destroyPromise = window.MintlifyAssistant?.destroy();
      void destroyPromise?.catch(() => {});
      rootWidget.remove();
      return true;
    };
    const rootWidgetObserver = new MutationObserver(removeRootWidget);

    removeRootWidget();
    rootWidgetObserver.observe(document.body, { childList: true });

    return () => rootWidgetObserver.disconnect();
  }, []);

  useEffect(() => {
    // SPA navigations can mount this page before the sticky/absolute preview
    // host has a laid-out box. Delay the iframe until the host has size.
    const host = previewHostRef.current;
    if (!host) return undefined;

    const markReady = (height) => {
      if (height > 0) setPreviewHostReady(true);
    };

    markReady(host.getBoundingClientRect().height);

    if (typeof ResizeObserver === "undefined") {
      setPreviewHostReady(true);
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      markReady(entries[0]?.contentRect.height ?? 0);
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const classNames = (...classes) => classes.filter(Boolean).join(" ");

  const renderSegmentedControl = ({
    ariaLabel,
    onChange,
    options,
    threeColumns = false,
    value,
  }) => (
    <div
      role="group"
      aria-label={ariaLabel}
      className="grid gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/10"
      style={{
        gridTemplateColumns: `repeat(${threeColumns ? 3 : options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={classNames(
            "min-h-8 rounded-md px-2 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            value === option.value
              ? "bg-white text-gray-950 shadow-sm dark:bg-white/15 dark:text-white"
              : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const renderSelectField = ({ label, onChange, options, value }) => (
    <label className="flex min-w-0 flex-col text-sm font-medium text-gray-700 dark:text-gray-300">
      <span className="mb-2">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-gray-950/10 bg-transparent px-3 text-sm font-normal text-gray-950 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/10 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );

  const renderToggleRow = ({ checked, description, label, onChange }) => (
    <label className="flex cursor-pointer items-center justify-between gap-5 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-950 dark:text-white">
          {label}
        </span>
        <span className="block text-sm text-gray-600 dark:text-gray-400">
          {description}
        </span>
      </span>
      <span className="relative inline-flex shrink-0 rounded-full focus-within:ring-2 focus-within:ring-primary/40">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={classNames(
            "h-5 w-9 rounded-full transition-colors",
            checked ? "bg-primary" : "bg-gray-200 dark:bg-white/15",
          )}
        />
        <span
          aria-hidden="true"
          className={classNames(
            "pointer-events-none absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-all",
            checked && "ml-4",
          )}
        />
      </span>
    </label>
  );

  const appearance = useMemo(
    () => ({
      variant,
      theme,
      accent,
      radius: `${radius}px`,
      side,
      align,
    }),
    [accent, align, radius, side, theme, variant],
  );

  const updatePreview = useCallback(() => {
    const previewWindow = previewRef.current?.contentWindow;
    if (!previewWindow) return;

    // Match the docs theme in the iframe while generated examples retain "system".
    const liveTheme =
      appearance.theme === "system"
        ? document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
        : appearance.theme;

    previewWindow.postMessage(
      {
        type: PREVIEW_UPDATE_MESSAGE,
        trackEvents,
        reportErrors,
        appearance: {
          ...appearance,
          theme: liveTheme,
        },
      },
      // The preview page is same-origin (served by this docs site).
      window.location.origin,
    );
  }, [appearance, reportErrors, trackEvents]);

  useEffect(() => {
    const handlePreviewMessage = (event) => {
      if (event.source !== previewRef.current?.contentWindow) return;

      if (event.data?.type === PREVIEW_READY_MESSAGE) {
        updatePreview();
        return;
      }
      if (event.data?.type === PREVIEW_STATE_MESSAGE) {
        setPreviewStatus(event.data.state === "error" ? "error" : "ready");
      }
    };
    const themeObserver = new MutationObserver(updatePreview);

    window.addEventListener("message", handlePreviewMessage);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    updatePreview();

    return () => {
      window.removeEventListener("message", handlePreviewMessage);
      themeObserver.disconnect();
    };
  }, [updatePreview]);

  useEffect(() => {
    // Local docs previews don't serve the `/_minimal/` renderer, and a broken
    // embed never reports readiness. Surface a hint instead of spinning.
    if (!previewHostReady || !previewUrl || previewStatus !== "loading") {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setPreviewStatus((status) => (status === "loading" ? "error" : status));
    }, 20000);
    return () => window.clearTimeout(timeout);
  }, [previewHostReady, previewStatus, previewUrl]);

  const configLines = [
    "{",
    `  id: '${EXAMPLE_WIDGET_ID}',`,
    `  supportEmail: '${SUPPORT_EMAIL}',`,
    "  starterQuestions: [",
    ...STARTER_QUESTIONS.map((question) => `    '${question}',`),
    "  ],",
    "  appearance: {",
    `    variant: '${variant}',`,
    `    theme: '${theme}',`,
    `    accent: '${accent}',`,
    `    radius: '${radius}px',`,
    `    side: '${side}',`,
    `    align: '${align}',`,
    "  },",
  ];

  if (trackEvents || reportErrors) {
    configLines.push("  hooks: {");
    if (trackEvents) {
      configLines.push(
        "    event(event) {",
        "      console.log('Assistant event', event);",
        "    },",
      );
    }
    if (reportErrors) {
      configLines.push(
        "    error(error) {",
        "      console.error('Assistant error', error.code, error);",
        "    },",
      );
    }
    configLines.push("  },");
  }

  configLines.push("}");

  const configCode = configLines.join("\n");
  const indentedConfig = configCode.split("\n").join("\n  ");
  const htmlCode = `<script
  type="module"
  src="${EMBED_URL}"
></script>
<script type="module">
  await window.MintlifyAssistant.init(${indentedConfig});
</script>`;
  const nextCode = `'use client';

import Script from 'next/script';

const ASSISTANT_CONFIG = ${configCode};

export const AssistantWidget = () => (
  <Script
    type="module"
    src="${EMBED_URL}"
    onReady={() => {
      void window.MintlifyAssistant.init(ASSISTANT_CONFIG);
    }}
  />
);`;
  const installCode = installTarget === "html" ? htmlCode : nextCode;

  return (
    <div className="my-6 grid gap-8" data-assistant-playground-layout="">
      <div className="min-w-0">
        <div className="not-prose overflow-hidden rounded-xl border border-gray-950/10 dark:border-white/10">
          <div className="px-5 py-4">
            <div className="text-sm font-medium text-gray-950 dark:text-white">
              Widget playground
            </div>
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
              Changes apply to the widget preview.
            </p>
          </div>

          <div className="border-t border-gray-950/10 px-5 py-5 dark:border-white/10">
            <div className="space-y-6">
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-gray-950 dark:text-white">
                  Variants
                </legend>
                {renderSegmentedControl({
                  ariaLabel: "Variants",
                  value: variant,
                  options: VARIANT_OPTIONS,
                  onChange: setVariant,
                })}
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                {renderSelectField({
                  label: "Theme",
                  value: theme,
                  options: THEME_OPTIONS,
                  onChange: setTheme,
                })}

                <label className="flex min-w-0 flex-col text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="mb-2">Accent</span>
                  <span className="flex h-10 items-center gap-2 rounded-xl border border-gray-950/10 px-2 dark:border-white/10">
                    <input
                      type="color"
                      value={accent}
                      onChange={(event) => setAccent(event.target.value)}
                      aria-label="Accent color"
                      className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <span className="font-mono text-xs font-normal text-gray-600 dark:text-gray-400">
                      {accent}
                    </span>
                  </span>
                </label>
              </div>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="mb-2 flex items-center justify-between">
                  Corner radius
                  <output className="font-mono text-xs font-normal text-gray-500 dark:text-gray-400">
                    {radius}px
                  </output>
                </span>
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="2"
                  value={radius}
                  onChange={(event) =>
                    setRadius(Number.parseInt(event.target.value))
                  }
                  className="block w-full accent-primary"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-gray-950 dark:text-white">
                    Trigger side
                  </legend>
                  {renderSegmentedControl({
                    ariaLabel: "Trigger side",
                    threeColumns: true,
                    value: side,
                    options: SIDE_OPTIONS,
                    onChange: setSide,
                  })}
                </fieldset>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-gray-950 dark:text-white">
                    Trigger alignment
                  </legend>
                  {renderSegmentedControl({
                    ariaLabel: "Trigger alignment",
                    value: align,
                    options: ALIGN_OPTIONS,
                    onChange: setAlign,
                  })}
                </fieldset>
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-gray-950 dark:text-white">
                  Hooks
                </legend>
                <div className="mt-1 divide-y divide-gray-950/10 dark:divide-white/10">
                  {renderToggleRow({
                    label: "Lifecycle events",
                    description:
                      "Observe open, close, ask, update, and navigation events.",
                    checked: trackEvents,
                    onChange: setTrackEvents,
                  })}
                  {renderToggleRow({
                    label: "Structured errors",
                    description:
                      "Receive stable error codes and retry metadata.",
                    checked: reportErrors,
                    onChange: setReportErrors,
                  })}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="border-t border-gray-950/10 p-5 dark:border-white/10">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-gray-950 dark:text-white">
                  Install
                </div>
                <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                  Copy the generated setup for your stack.
                </div>
              </div>
              {renderSegmentedControl({
                ariaLabel: "Installation target",
                value: installTarget,
                options: INSTALL_OPTIONS,
                onChange: setInstallTarget,
              })}
            </div>

            <CodeBlockComponent
              // always use jsx as langugae to render code highlighting correctly
              language= "jsx"
              filename={
                installTarget === "html" ? "index.html" : "assistant-widget.jsx"
              }
              wrap
            >
              {installCode}
            </CodeBlockComponent>
          </div>
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>

      <aside className="not-prose" data-assistant-preview="">
        <div
          ref={previewHostRef}
          className="relative flex h-[42rem] min-h-0 flex-col overflow-hidden rounded-xl border border-gray-950/10 bg-transparent dark:border-white/10 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]"
          data-assistant-preview-card=""
        >
          {previewHostReady && previewUrl ? (
            <iframe
              ref={previewRef}
              title="Live Assistant Widget preview"
              src={previewUrl}
              onLoad={updatePreview}
              scrolling="no"
              className="min-h-0 w-full flex-1 border-0 bg-transparent [color-scheme:light_dark] dark:[color-scheme:dark]"
            />
          ) : null}
          {previewStatus !== "ready" ? (
            <div
              aria-live="polite"
              role="status"
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-3 px-6 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              {previewStatus === "loading" ? (
                <span
                  aria-hidden="true"
                  className="size-[18px] shrink-0 animate-spin rounded-full border-[1.5px] border-gray-300 border-t-gray-600 motion-reduce:animate-none dark:border-gray-600 dark:border-t-gray-300"
                />
              ) : null}
              <span>
                {previewStatus === "loading"
                  ? "Loading assistant preview..."
                  : "The live preview could not load. It requires a deployed docs site and the browser console may have details."}
              </span>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
};
