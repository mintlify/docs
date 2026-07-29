export const AssistantWidgetPlayground = ({
  children,
  CodeBlockComponent,
  CustomizeIconComponent,
  ThemeIconComponent,
}) => {
  // Mintlify evaluates snippet exports independently, so shared values must stay in this scope.
  const EXAMPLE_WIDGET_ID = "YOUR_WIDGET_ID";
  const EMBED_URL =
    "https://cdn.jsdelivr.net/npm/@mintlify/assistant-widget@0.0/dist/browser/embed.js";
  // The preview loads the hidden /assistant/widget-preview page through the
  // chromeless `/_minimal/` renderer when deployed, and directly in local
  // previews where that renderer is unavailable. A real page URL is required
  // because captcha providers reject srcdoc documents without a hostname.
  // Message names must stay in sync with
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
  const RADIUS_OPTIONS = [
    { value: 0, label: "None", detail: "0px" },
    { value: 4, label: "Extra small", detail: "4px" },
    { value: 8, label: "Small", detail: "8px" },
    { value: 12, label: "Medium", detail: "12px" },
    { value: 16, label: "Large", detail: "16px" },
    { value: 20, label: "Extra large", detail: "20px" },
    { value: 24, label: "2X large", detail: "24px" },
    { value: 28, label: "3X large", detail: "28px" },
    { value: 32, label: "4X large", detail: "32px" },
  ];
  // Mentha labels the direction the assistant opens; the widget API stores
  // the trigger's screen edge, so each label maps to the opposite edge.
  const SIDE_OPTIONS = [
    { value: "bottom", label: "Top" },
    { value: "top", label: "Bottom" },
    { value: "right", label: "Left" },
    { value: "left", label: "Right" },
    { value: "inline-end", label: "Inline start" },
    { value: "inline-start", label: "Inline end" },
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
  const [accent, setAccent] = useState("#166E3F");
  const [radius, setRadius] = useState(16);
  const [side, setSide] = useState("bottom");
  const [align, setAlign] = useState("end");
  const [trackEvents, setTrackEvents] = useState(false);
  const [reportErrors, setReportErrors] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(null);
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
    const rendererPrefix =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
        ? ""
        : "/_minimal";
    setPreviewUrl(
      `${basePath}${rendererPrefix}${locale}/assistant/widget-preview?mode=${mode}`,
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

  useEffect(() => {
    if (!openSelect) return undefined;

    const closeOnPointerDown = (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest(`[data-assistant-select="${openSelect}"]`)
      ) {
        return;
      }
      setOpenSelect(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpenSelect(null);
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openSelect]);

  const renderSelectField = ({ id, label, onChange, options, value }) => {
    const isOpen = openSelect === id;
    const selectedIndex = options.findIndex((option) => option.value === value);
    const selectedOption = options[selectedIndex] ?? options[0];

    const selectByIndex = (index) => {
      const option = options[index];
      if (option) onChange(option.value);
    };

    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!isOpen) {
          setOpenSelect(id);
          return;
        }

        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex =
          (Math.max(selectedIndex, 0) + direction + options.length) %
          options.length;
        selectByIndex(nextIndex);
        return;
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        selectByIndex(event.key === "Home" ? 0 : options.length - 1);
      }
    };

    return (
      <div className="assistant-playground-field">
        <span
          id={`assistant-playground-${id}-label`}
          className="assistant-playground-field__label"
        >
          {label}
        </span>
        <div
          className="assistant-playground-select"
          data-assistant-select={id}
          data-open={isOpen ? "true" : "false"}
          onBlur={(event) => {
            if (
              !(event.relatedTarget instanceof Node) ||
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              setOpenSelect(null);
            }
          }}
        >
          <button
            type="button"
            className="assistant-playground-field__control"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={`assistant-playground-${id}-options`}
            aria-labelledby={`assistant-playground-${id}-label assistant-playground-${id}-value`}
            onClick={() =>
              setOpenSelect((currentSelect) =>
                currentSelect === id ? null : id,
              )
            }
            onKeyDown={handleKeyDown}
          >
            <span id={`assistant-playground-${id}-value`}>
              {selectedOption?.label}
            </span>
            <span className="assistant-playground-select__end">
              {selectedOption?.detail ? (
                <span className="assistant-playground-select__detail">
                  {selectedOption.detail}
                </span>
              ) : null}
              <svg
                aria-hidden="true"
                className="assistant-playground-select__chevron"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4 6L8 10L12 6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </button>
          {isOpen ? (
            <div
              id={`assistant-playground-${id}-options`}
              className="assistant-playground-select__options"
              role="listbox"
              aria-labelledby={`assistant-playground-${id}-label`}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={option.value === value}
                  data-selected={option.value === value ? "true" : "false"}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(option.value);
                    setOpenSelect(null);
                  }}
                >
                  <span>{option.label}</span>
                  {option.detail ? (
                    <span className="assistant-playground-select__detail">
                      {option.detail}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderToggleRow = ({ checked, description, label, onChange }) => (
    <label className="assistant-playground-hook">
      <span className="assistant-playground-hook__copy">
        <span className="assistant-playground-hook__label">{label}</span>
        <span className="assistant-playground-hook__description">{description}</span>
      </span>
      <span
        className="assistant-playground-switch"
        data-checked={checked ? "true" : "false"}
      >
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="assistant-playground-switch__input"
        />
        <span aria-hidden="true" className="assistant-playground-switch__knob" />
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

  const togglePreviewTheme = () => {
    setTheme((currentTheme) => {
      const isDark =
        currentTheme === "dark" ||
        (currentTheme === "system" &&
          document.documentElement.classList.contains("dark"));
      return isDark ? "light" : "dark";
    });
  };

  const toggleCustomizer = () => {
    setCustomizeOpen((isOpen) => !isOpen);
    setOpenSelect(null);
  };

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
    // Stop showing the loading state if the preview page never reports readiness.
    // Leave the iframe untouched so local 404 pages remain visible while developing.
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
    <div className="not-prose" data-assistant-playground-layout="">
      <section
        className="assistant-playground-frame"
        data-customize-open={customizeOpen ? "true" : "false"}
        aria-label="Assistant widget playground"
      >
        <div className="assistant-playground-toolbar">
          <button
            type="button"
            className="assistant-playground-toolbar__button assistant-playground-toolbar__button--labeled"
            aria-controls="assistant-playground-customizer"
            aria-expanded={customizeOpen}
            onClick={toggleCustomizer}
          >
            {CustomizeIconComponent ? <CustomizeIconComponent /> : null}
            <span>Customize</span>
          </button>
          <button
            type="button"
            className="assistant-playground-toolbar__button assistant-playground-toolbar__button--icon"
            aria-label="Toggle preview theme"
            onClick={togglePreviewTheme}
          >
            {ThemeIconComponent ? <ThemeIconComponent /> : null}
          </button>
        </div>

        <div
          id="assistant-playground-customizer"
          className="assistant-playground-customizer"
          role="dialog"
          aria-label="Customize assistant widget"
          hidden={!customizeOpen}
        >
          <div className="assistant-playground-customizer__section">
            <div className="assistant-playground-customizer__heading">
              Component
            </div>
            {renderSelectField({
              id: "variant",
              label: "Variant",
              value: variant,
              options: VARIANT_OPTIONS,
              onChange: setVariant,
            })}
            {renderSelectField({
              id: "radius",
              label: "Corner radius",
              value: radius,
              options: RADIUS_OPTIONS,
              onChange: setRadius,
            })}
            <label className="assistant-playground-field">
              <span className="assistant-playground-field__label">Accent</span>
              <span className="assistant-playground-accent">
                <input
                  type="color"
                  value={accent}
                  onChange={(event) => setAccent(event.target.value.toUpperCase())}
                  aria-label="Accent color"
                  className="assistant-playground-accent__input"
                />
                <span
                  aria-hidden="true"
                  className="assistant-playground-accent__swatch"
                  style={{ backgroundColor: accent }}
                />
                <span>{accent}</span>
              </span>
            </label>
          </div>

          <div className="assistant-playground-customizer__divider" />

          <div className="assistant-playground-customizer__section">
            <div className="assistant-playground-customizer__heading">Trigger</div>
            {renderSelectField({
              id: "side",
              label: "Alignment",
              value: side,
              options: SIDE_OPTIONS,
              onChange: setSide,
            })}
            {renderSelectField({
              id: "align",
              label: "Placement",
              value: align,
              options: ALIGN_OPTIONS,
              onChange: setAlign,
            })}
          </div>

          <div className="assistant-playground-customizer__divider" />

          <div className="assistant-playground-customizer__section">
            <div className="assistant-playground-customizer__heading">Hooks</div>
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
        </div>

        <div
          ref={previewHostRef}
          className="assistant-playground-preview"
          data-assistant-preview=""
          data-assistant-preview-card=""
        >
          {previewHostReady && previewUrl ? (
            <iframe
              ref={previewRef}
              title="Live Assistant Widget preview"
              src={previewUrl}
              onLoad={updatePreview}
              scrolling="no"
            />
          ) : null}
          {previewStatus === "loading" ? (
            <div
              aria-live="polite"
              role="status"
              className="assistant-playground-preview__status"
            >
              <span
                aria-hidden="true"
                className="assistant-playground-preview__spinner"
              />
              <span>Loading assistant preview...</span>
            </div>
          ) : null}
        </div>
      </section>

      <div className="assistant-playground-code" data-assistant-code="">
        <div className="assistant-playground-code__header">
          <div>
            <div className="assistant-playground-code__title">Install</div>
            <div className="assistant-playground-code__description">
              Copy the generated setup for your stack.
            </div>
          </div>
          <div
            role="group"
            aria-label="Installation target"
            className="assistant-playground-code__tabs"
          >
            {INSTALL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                data-active={installTarget === option.value ? "true" : "false"}
                aria-pressed={installTarget === option.value}
                onClick={() => setInstallTarget(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <CodeBlockComponent
          // Always use JSX to render the generated HTML and Next.js snippets consistently.
          language="jsx"
          filename={
            installTarget === "html" ? "index.html" : "assistant-widget.jsx"
          }
          wrap
        >
          {installCode}
        </CodeBlockComponent>
      </div>

      {children ? <div className="assistant-playground-children">{children}</div> : null}
    </div>
  );
};
