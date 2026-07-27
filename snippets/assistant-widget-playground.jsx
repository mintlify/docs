export const AssistantWidgetPlayground = ({ children, CodeBlockComponent }) => {
  // Mintlify evaluates snippet exports independently, so shared values must stay in this scope.
  const EXAMPLE_WIDGET_ID = "YOUR_WIDGET_ID";
  const PREVIEW_WIDGET_ID = "mint_widget_bececb2f-70d4-4e52-910f-7e437db35da8";
  const EMBED_URL =
    "https://cdn.jsdelivr.net/npm/@mintlify/assistant-widget@0.0/dist/browser/embed.js";
  const PREVIEW_READY_MESSAGE = "mintlify-assistant-playground:ready";
  const PREVIEW_UPDATE_MESSAGE = "mintlify-assistant-playground:update";
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
  const previewRef = useRef(null);

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
      "*",
    );
  }, [appearance, reportErrors, trackEvents]);

  useEffect(() => {
    const handlePreviewMessage = (event) => {
      if (
        event.source !== previewRef.current?.contentWindow ||
        event.data?.type !== PREVIEW_READY_MESSAGE
      ) {
        return;
      }

      updatePreview();
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

  const previewDocument = `<!doctype html>
<html lang="en" data-preview-state="loading">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      // Resolve theme before first paint so the loading state matches the docs site.
      // postMessage applyTheme() still owns later updates.
      (() => {
        try {
          const parentIsDark =
            window.parent.document.documentElement.classList.contains("dark");
          document.documentElement.dataset.theme = parentIsDark
            ? "dark"
            : "light";
        } catch {
          document.documentElement.dataset.theme = "light";
        }
      })();
    </script>
    <style>
      :root {
        --preview-loading-background: #eeeeef;
        --preview-loading-border: #c7c7cc;
        --preview-loading-foreground: #52525b;
        color-scheme: light;
        background: var(--preview-loading-background);
      }

      :root[data-theme="dark"] {
        --preview-loading-background: #0f0f10;
        --preview-loading-border: #3f3f46;
        --preview-loading-foreground: #b4b4bc;
        color-scheme: dark;
        background: var(--preview-loading-background);
      }

      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
      }

      [data-preview-status] {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        color: var(--preview-loading-foreground);
        background: var(--preview-loading-background);
        font: 400 0.875rem/1.4 ui-sans-serif, system-ui, sans-serif;
        text-align: center;
      }

      :root[data-preview-state="ready"] [data-preview-status] {
        display: none;
      }

      [data-preview-spinner] {
        width: 1.125rem;
        height: 1.125rem;
        border: 1.5px solid var(--preview-loading-border);
        border-top-color: var(--preview-loading-foreground);
        border-radius: 9999px;
        animation: preview-spin 700ms linear infinite;
      }

      :root[data-preview-state="error"] [data-preview-spinner] {
        display: none;
      }

      @keyframes preview-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        [data-preview-spinner] {
          animation: none;
        }
      }
    </style>
    <script type="module" src="${EMBED_URL}"></script>
    <script type="module">
      const READY_MESSAGE = ${JSON.stringify(PREVIEW_READY_MESSAGE)};
      const UPDATE_MESSAGE = ${JSON.stringify(PREVIEW_UPDATE_MESSAGE)};
      const WIDGET_ID = ${JSON.stringify(PREVIEW_WIDGET_ID)};
      const SUPPORT_EMAIL = ${JSON.stringify(SUPPORT_EMAIL)};
      const STARTER_QUESTIONS = ${JSON.stringify(STARTER_QUESTIONS)};

      const createHooks = (trackEvents, reportErrors) => ({
        event: trackEvents
          ? (event) => console.log("Assistant event", event)
          : null,
        error: reportErrors
          ? (error) => console.error("Assistant error", error)
          : null,
      });

      const applyTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
      };

      const reportPreviewError = (error) => {
        console.error("Mintlify Assistant preview failed", error);
        document.documentElement.dataset.previewError =
          error?.message ?? String(error);
        document.documentElement.dataset.previewState = "error";
        const statusLabel = document.querySelector(
          "[data-preview-status-label]",
        );
        if (statusLabel) {
          statusLabel.textContent =
            "The live preview could not load. Check the browser console for details.";
        }
      };

      const waitForAssistantApi = () =>
        new Promise((resolve, reject) => {
          const timeoutAt = Date.now() + 15000;
          const checkForAssistantApi = () => {
            if (window.MintlifyAssistant) {
              resolve(window.MintlifyAssistant);
              return;
            }
            if (Date.now() >= timeoutAt) {
              reject(new Error("Mintlify Assistant failed to load."));
              return;
            }
            window.setTimeout(checkForAssistantApi, 50);
          };

          checkForAssistantApi();
        });

      let isPreviewInitialized = false;
      let isApplyingPreviewUpdate = false;
      let assistantApi;
      let queuedPreviewUpdate;

      const applyPreviewUpdate = async ({
        appearance,
        reportErrors,
        trackEvents,
      }) => {
        const nextPlacementKey = [
          appearance.variant,
          appearance.side,
          appearance.align,
        ].join(":");

        applyTheme(appearance.theme);
        // Keep configuration changes from moving an already-open surface.
        await assistantApi.close();
        await assistantApi.update({
          appearance,
          hooks: createHooks(trackEvents, reportErrors),
        });
        await assistantApi.open();
        document.documentElement.dataset.previewPlacement =
          nextPlacementKey;
        document.documentElement.dataset.previewState = "ready";
      };

      const processPreviewUpdates = async () => {
        if (!isPreviewInitialized || isApplyingPreviewUpdate) return;

        isApplyingPreviewUpdate = true;
        try {
          while (queuedPreviewUpdate) {
            const nextUpdate = queuedPreviewUpdate;
            queuedPreviewUpdate = undefined;
            await applyPreviewUpdate(nextUpdate);
          }
        } finally {
          isApplyingPreviewUpdate = false;
        }
      };

      const queuePreviewUpdate = (payload) => {
        queuedPreviewUpdate = payload;
        void processPreviewUpdates().catch(reportPreviewError);
      };

      window.addEventListener("message", (event) => {
        if (
          event.source !== window.parent ||
          event.data?.type !== UPDATE_MESSAGE
        ) {
          return;
        }

        applyTheme(event.data.appearance.theme);
        queuePreviewUpdate(event.data);
      });

      const initializePreview = async () => {
        const baseConfig = {
          id: WIDGET_ID,
          defaultOpen: true,
          appearance: {
            theme: document.documentElement.dataset.theme || "light",
            side: "bottom",
            align: "end",
          },
        };

        assistantApi = await waitForAssistantApi();

        try {
          await assistantApi.init({
            ...baseConfig,
            supportEmail: SUPPORT_EMAIL,
            starterQuestions: STARTER_QUESTIONS,
          });
        } catch (error) {
          const message = error?.message ?? "";
          const sessionOverridesUnsupported =
            message.includes("config.supportEmail is not supported") ||
            message.includes("config.starterQuestions is not supported");

          if (!sessionOverridesUnsupported) throw error;
          await assistantApi.init(baseConfig);
        }

        isPreviewInitialized = true;
        window.parent.postMessage({ type: READY_MESSAGE }, "*");
        await processPreviewUpdates();
      };

      void initializePreview().catch(reportPreviewError);
    </script>
  </head>
  <body>
    <div aria-live="polite" data-preview-status role="status">
      <span aria-hidden="true" data-preview-spinner></span>
      <span data-preview-status-label>Loading assistant preview...</span>
    </div>
  </body>
</html>`;

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
        <div className="not-prose overflow-hidden rounded-xl border border-gray-950/10 bg-white dark:border-white/10 dark:bg-transparent">
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

          <div className="border-t border-gray-950/10 bg-gray-50/60 p-5 dark:border-white/10 dark:bg-white/[0.02]">
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
              language={installTarget === "html" ? "html" : "jsx"}
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
          className="flex h-[42rem] min-h-0 flex-col overflow-hidden rounded-xl border border-gray-950/10 bg-white dark:border-white/10 dark:bg-gray-950 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]"
          data-assistant-preview-card=""
        >
          <iframe
            ref={previewRef}
            title="Live Assistant Widget preview"
            srcDoc={previewDocument}
            onLoad={updatePreview}
            scrolling="no"
            className="min-h-0 w-full flex-1 border-0 bg-gray-50 dark:bg-gray-900"
          />
        </div>
      </aside>
    </div>
  );
};
