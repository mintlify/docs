export const AssistantWidgetPlayground = ({ CodeBlockComponent }) => {
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
  const BOOLEAN_OPTIONS = [
    { value: "off", label: "Off" },
    { value: "on", label: "On" },
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
    // SPA navigations can mount this page before the preview host has a
    // laid-out box. Delay the iframe until the host has size.
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

  const renderSelectField = ({ hint, label, onChange, options, value }) => (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-gray-950/10 bg-white pl-3 pr-8 text-sm text-gray-950 shadow-sm outline-none transition-colors hover:border-gray-950/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:focus-visible:border-primary-light dark:focus-visible:ring-primary-light/30"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {hint ? (
        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </span>
      ) : null}
    </label>
  );

  const renderBooleanSelect = ({ checked, hint, label, onChange }) =>
    renderSelectField({
      label,
      hint,
      value: checked ? "on" : "off",
      options: BOOLEAN_OPTIONS,
      onChange: (value) => onChange(value === "on"),
    });

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
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-gray-950/10 dark:border-white/10">
      <div className="flex flex-col lg:h-[36rem] lg:flex-row">
        <div className="flex w-full flex-col border-b border-gray-950/10 dark:border-white/10 lg:h-full lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="border-b border-gray-950/10 px-4 py-3.5 dark:border-white/10">
            <div className="text-sm font-medium text-gray-950 dark:text-white">
              Widget playground
            </div>
            <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
              Changes apply to the widget preview.
            </p>
          </div>

          <div className="min-h-0 flex-1 space-y-4 p-4 lg:overflow-y-auto">
            {renderSelectField({
              label: "Variant",
              value: variant,
              options: VARIANT_OPTIONS,
              onChange: setVariant,
            })}

            {renderSelectField({
              label: "Theme",
              value: theme,
              options: THEME_OPTIONS,
              onChange: setTheme,
            })}

            <label className="block min-w-0">
              <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Accent
              </span>
              <span className="flex h-9 items-center gap-2 rounded-lg border border-gray-950/10 bg-white px-2 shadow-sm dark:border-white/10 dark:bg-white/5">
                <input
                  type="color"
                  value={accent}
                  onChange={(event) => setAccent(event.target.value)}
                  aria-label="Accent color"
                  className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
                <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                  {accent}
                </span>
              </span>
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
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

            {renderSelectField({
              label: "Trigger side",
              value: side,
              options: SIDE_OPTIONS,
              onChange: setSide,
            })}

            {renderSelectField({
              label: "Trigger alignment",
              value: align,
              options: ALIGN_OPTIONS,
              onChange: setAlign,
            })}

            {renderBooleanSelect({
              label: "Lifecycle events",
              hint: "Observe open, close, ask, update, and navigation events.",
              checked: trackEvents,
              onChange: setTrackEvents,
            })}

            {renderBooleanSelect({
              label: "Structured errors",
              hint: "Receive stable error codes and retry metadata.",
              checked: reportErrors,
              onChange: setReportErrors,
            })}
          </div>
        </div>

        <div
          ref={previewHostRef}
          className="relative h-[26rem] min-w-0 flex-1 lg:h-full"
        >
          {previewHostReady && previewUrl ? (
            <iframe
              ref={previewRef}
              title="Live Assistant Widget preview"
              src={previewUrl}
              onLoad={updatePreview}
              scrolling="no"
              className="h-full w-full border-0 bg-transparent [color-scheme:light_dark] dark:[color-scheme:dark]"
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
      </div>

      <div className="border-t border-gray-950/10 p-4 dark:border-white/10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-gray-950 dark:text-white">
              Install
            </div>
            <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
              Copy the generated setup for your stack.
            </div>
          </div>
          <div className="w-32">
            {renderSelectField({
              label: "Target",
              value: installTarget,
              options: INSTALL_OPTIONS,
              onChange: setInstallTarget,
            })}
          </div>
        </div>

        <CodeBlockComponent
          // always use jsx as language to render code highlighting correctly
          language="jsx"
          filename={
            installTarget === "html" ? "index.html" : "assistant-widget.jsx"
          }
          wrap
          expandable
        >
          {installCode}
        </CodeBlockComponent>
      </div>
    </div>
  );
};
