export const AssistantWidgetPlayground = ({ CodeBlockComponent }) => {
  // Mintlify evaluates snippet exports independently, so shared values must stay in this scope.
  const EXAMPLE_WIDGET_ID = "YOUR_WIDGET_ID";
  const EMBED_URL =
    "https://cdn.jsdelivr.net/npm/@mintlify/assistant-widget@0.0/dist/browser/embed.js";
  const SUPPORT_EMAIL = "hi@mintlify.com";
  const STARTER_QUESTIONS = [
    "How do I get started with Mintlify?",
    "How do I customize my docs?",
    "How do I deploy my docs?",
  ];
  const PRESENTATION_OPTIONS = [
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
  const [trackEvents, setTrackEvents] = useState(true);
  const [reportErrors, setReportErrors] = useState(true);

  const classNames = (...classes) => classes.filter(Boolean).join(" ");

  const renderSegmentedControl = ({
    ariaLabel,
    onChange,
    options,
    value,
  }) => (
    <div
      role="group"
      aria-label={ariaLabel}
      className="grid grid-flow-col auto-cols-fr gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/10"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={classNames(
            "h-8 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
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
      <span>{label}</span>
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

  const liveHooks = useMemo(
    () => ({
      event: trackEvents
        ? (event) => console.log("Assistant event", event)
        : null,
      error: reportErrors
        ? (error) => console.error("Assistant error", error)
        : null,
    }),
    [reportErrors, trackEvents],
  );

  const updateMountedWidget = useCallback(() => {
    if (!window.MintlifyAssistant) return;
    // Keep the live preview in sync with the docs while generated examples retain "system".
    const liveTheme =
      appearance.theme === "system"
        ? document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
        : appearance.theme;

    void window.MintlifyAssistant.update({
      appearance: {
        ...appearance,
        theme: liveTheme,
      },
      hooks: liveHooks,
    }).catch(() => {});
  }, [appearance, liveHooks]);

  useEffect(() => {
    updateMountedWidget();
    window.addEventListener("mintlify-assistant-ready", updateMountedWidget);
    return () => {
      window.removeEventListener(
        "mintlify-assistant-ready",
        updateMountedWidget,
      );
    };
  }, [updateMountedWidget]);

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
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-gray-950/10 bg-white dark:border-white/10 dark:bg-transparent">
      <div className="px-5 py-4">
        <div className="text-sm font-medium text-gray-950 dark:text-white">
          Widget playground
        </div>
        <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
          Changes apply to the widget on this page.
        </p>
      </div>

      <div className="border-t border-gray-950/10 px-5 py-5 dark:border-white/10">
        <div className="space-y-6">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-gray-950 dark:text-white">
              Presentation
            </legend>
            {renderSegmentedControl({
              ariaLabel: "Presentation",
              value: variant,
              options: PRESENTATION_OPTIONS,
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
              <span>Accent</span>
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
                description: "Receive stable error codes and retry metadata.",
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
  );
};
