export const AssistantWidgetPlayground = ({ children, CodeBlockComponent }) => {
  // Mintlify evaluates snippet exports independently, so shared values must stay in this scope.
  const EXAMPLE_WIDGET_ID = "YOUR_WIDGET_ID";
  const EMBED_URL = "https://widget.mintlify.com/v1/embed.js";
  // The preview loads the hidden /assistant/widget-preview page at a real URL
  // because captcha providers reject srcdoc documents without a hostname.
  // Message names must stay in sync with snippets/assistant-widget-preview-host.jsx.
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
  ];
  // Labels match the widget API: `side` is the trigger's screen edge.
  const SIDE_OPTIONS = [
    { value: "bottom", label: "Bottom" },
    { value: "top", label: "Top" },
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

  const CustomizeIcon = () => (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.83337 4.83325V12.1666"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M13.1666 3.83325V11.1666"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <circle
        cx="2.83337"
        cy="3.33325"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <circle
        cx="13.1666"
        cy="12.6667"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M6.5 3.83325H7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M9.83337 3.83325H10.8334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M5.16663 12.1667H6.16663"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <path
        d="M8.5 12.1667H9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );

  // The theme icon SVG is inlined in the toolbar button below (not a nested
  // component) so React keeps the same DOM nodes across renders; a component
  // defined inside this function gets a new identity every render, which
  // remounts the SVG and prevents the CSS transition from ever running.
  const ICON_CENTER = 6.66667;

  const [installTarget, setInstallTarget] = useState("html");
  const [variant, setVariant] = useState("widget");
  const [previewTheme, setPreviewTheme] = useState(null);
  const [docsIsDark, setDocsIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );
  const [accent, setAccent] = useState("#166E3F");
  const [accentDraft, setAccentDraft] = useState("#166E3F");
  const [accentKeyboardFocus, setAccentKeyboardFocus] = useState(false);
  const [radius, setRadius] = useState(16);
  const [side, setSide] = useState("bottom");
  const [align, setAlign] = useState("end");
  const [trackEvents, setTrackEvents] = useState(false);
  const [reportErrors, setReportErrors] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(null);
  const [activeSelectOptionIndex, setActiveSelectOptionIndex] = useState(0);
  const [previewHostReady, setPreviewHostReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewStatus, setPreviewStatus] = useState("loading");
  const accentInputRef = useRef(null);
  const accentPointerFocusRef = useRef(false);
  const previewRef = useRef(null);
  const previewHostRef = useRef(null);

  useEffect(() => {
    // Resolve the preview page against the deployment base path (for example
    // /docs on mintlify.com). Every locale can reuse the same host document
    // because the preview UI is configured by this component.
    const pageMatch = window.location.pathname
      .replace(/\/$/, "")
      .match(/^(.*?)(\/[a-z]{2}(?:-[A-Za-z]{2,4})?)?\/assistant\/widget$/);
    const basePath = pageMatch?.[1] ?? "";
    const mode = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setPreviewUrl(`${basePath}/assistant/widget-preview?mode=${mode}`);
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

  useEffect(() => {
    const accentInput = accentInputRef.current;
    if (!accentInput) return undefined;

    // React's color-input change handler fires while the native picker moves.
    // Commit from the native change event instead, which fires on confirmation.
    const commitAccent = () => {
      const nextAccent = accentInput.value.toUpperCase();
      setAccentDraft(nextAccent);
      setAccent(nextAccent);
    };

    accentInput.addEventListener("change", commitAccent);
    return () => accentInput.removeEventListener("change", commitAccent);
  }, []);

  const renderSelectField = ({ id, label, onChange, options, value }) => {
    const isOpen = openSelect === id;
    const selectedIndex = options.findIndex((option) => option.value === value);
    const selectedOption = options[selectedIndex] ?? options[0];

    const openMenu = (initialIndex = selectedIndex) => {
      setActiveSelectOptionIndex(Math.max(initialIndex, 0));
      setOpenSelect(id);
    };

    const closeMenu = () => setOpenSelect(null);

    const selectByIndex = (index) => {
      const option = options[index];
      if (!option) return;
      onChange(option.value);
      closeMenu();
    };

    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!isOpen) {
          openMenu();
          return;
        }

        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActiveSelectOptionIndex(
          (currentIndex) =>
            (currentIndex + direction + options.length) % options.length,
        );
        return;
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        if (!isOpen) openMenu();
        setActiveSelectOptionIndex(
          event.key === "Home" ? 0 : options.length - 1,
        );
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (isOpen) {
          selectByIndex(activeSelectOptionIndex);
        } else {
          openMenu();
        }
        return;
      }
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        event.stopPropagation();
        closeMenu();
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
            aria-activedescendant={
              isOpen
                ? `assistant-playground-${id}-option-${activeSelectOptionIndex}`
                : undefined
            }
            aria-labelledby={`assistant-playground-${id}-label assistant-playground-${id}-value`}
            onClick={() => {
              if (isOpen) {
                closeMenu();
              } else {
                openMenu();
              }
            }}
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
              {options.map((option, index) => (
                <button
                  key={option.value}
                  id={`assistant-playground-${id}-option-${index}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={option.value === value}
                  data-active={
                    activeSelectOptionIndex === index ? "true" : "false"
                  }
                  data-selected={option.value === value ? "true" : "false"}
                  onPointerDown={(event) => event.preventDefault()}
                  onPointerMove={() => setActiveSelectOptionIndex(index)}
                  onClick={() => {
                    selectByIndex(index);
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

  const renderDivider = () => (
    <div
      role="separator"
      aria-orientation="horizontal"
      className="assistant-playground-customizer__divider"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        width="100%"
        height="1"
        preserveAspectRatio="none"
        viewBox="0 0 100 1"
      >
        <line
          x1="0"
          y1="0.5"
          x2="100"
          y2="0.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 5"
          strokeLinecap="butt"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );

  const appearance = useMemo(
    () => ({
      variant,
      accent,
      radius: `${radius}px`,
      side,
      align,
    }),
    [accent, align, radius, side, variant],
  );

  const isPreviewDark =
    previewTheme === "dark" || (previewTheme === null && docsIsDark);

  const togglePreviewTheme = () => {
    setPreviewTheme(isPreviewDark ? "light" : "dark");
  };

  const toggleCustomizer = () => {
    setCustomizeOpen((isOpen) => !isOpen);
    setOpenSelect(null);
  };

  const updatePreview = useCallback(() => {
    const previewWindow = previewRef.current?.contentWindow;
    if (!previewWindow) return;

    // Match the docs theme until the preview-only toggle overrides it.
    // Generated examples always retain "system".
    const liveTheme =
      previewTheme ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light");

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
  }, [appearance, previewTheme, reportErrors, trackEvents]);

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
    const themeObserver = new MutationObserver(() => {
      setDocsIsDark(document.documentElement.classList.contains("dark"));
      updatePreview();
    });

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
    "    theme: 'system',",
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
    strategy="afterInteractive"
    onReady={() => {
      void window.MintlifyAssistant.init(ASSISTANT_CONFIG);
    }}
  />
);`;
  const installCode = installTarget === "html" ? htmlCode : nextCode;

  return (
    <div data-assistant-playground-layout="">
      <section
        className="assistant-playground-frame not-prose"
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
            <CustomizeIcon />
            <span>Customize</span>
          </button>
          <button
            type="button"
            className="assistant-playground-toolbar__button assistant-playground-toolbar__button--icon"
            aria-label="Toggle preview theme"
            onClick={togglePreviewTheme}
          >
            <svg
              aria-hidden="true"
              className={`theme-icon${isPreviewDark ? " theme-icon--dark" : ""}`}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform={`translate(${ICON_CENTER} ${ICON_CENTER})`}>
                <g className="theme-icon__fill-wrap">
                  <g transform={`translate(${-ICON_CENTER} ${-ICON_CENTER})`}>
                    <path
                      className="theme-icon__fill"
                      d="M6.66667 4C8.13943 4 9.33333 5.19391 9.33333 6.66667C9.33333 8.13943 8.13943 9.33333 6.66667 9.33333V4Z"
                      fill="currentColor"
                    />
                  </g>
                </g>
              </g>
              <g transform={`translate(${ICON_CENTER} ${ICON_CENTER})`}>
                <g className="theme-icon__ring-wrap">
                  <g transform={`translate(${-ICON_CENTER} ${-ICON_CENTER})`}>
                    <path
                      className="theme-icon__ring"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.66667 0C10.3486 0 13.3333 2.98477 13.3333 6.66667C13.3333 10.3486 10.3486 13.3333 6.66667 13.3333C2.98477 13.3333 0 10.3486 0 6.66667C0 2.98477 2.98477 0 6.66667 0ZM6.66667 4C5.19391 4 4 5.19391 4 6.66667C4 8.13943 5.19391 9.33333 6.66667 9.33333V12.02083C9.62367 12.02083 12.02083 9.62367 12.02083 6.66667C12.02083 3.70966 9.62367 1.3125 6.66667 1.3125V4Z"
                      fill="currentColor"
                    />
                  </g>
                </g>
              </g>
            </svg>
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
              <span
                className="assistant-playground-accent"
                data-keyboard-focus={accentKeyboardFocus ? "true" : "false"}
              >
                <input
                  ref={accentInputRef}
                  type="color"
                  value={accentDraft}
                  onInput={(event) =>
                    setAccentDraft(event.currentTarget.value.toUpperCase())
                  }
                  onPointerDown={() => {
                    accentPointerFocusRef.current = true;
                    setAccentKeyboardFocus(false);
                  }}
                  onFocus={() => {
                    setAccentKeyboardFocus(!accentPointerFocusRef.current);
                    accentPointerFocusRef.current = false;
                  }}
                  onBlur={(event) => {
                    setAccentKeyboardFocus(false);
                    const nextAccent = event.currentTarget.value.toUpperCase();
                    setAccentDraft(nextAccent);
                    setAccent(nextAccent);
                  }}
                  onKeyDown={(event) => {
                    setAccentKeyboardFocus(true);
                    if (event.key === "Enter") {
                      const nextAccent =
                        event.currentTarget.value.toUpperCase();
                      setAccentDraft(nextAccent);
                      setAccent(nextAccent);
                    }
                  }}
                  aria-label="Accent color"
                  className="assistant-playground-accent__input"
                />
                <span
                  aria-hidden="true"
                  className="assistant-playground-accent__swatch"
                  style={{ backgroundColor: accentDraft }}
                />
                <span>{accentDraft}</span>
              </span>
            </label>
          </div>

          {renderDivider()}

          <div className="assistant-playground-customizer__section">
            <div className="assistant-playground-customizer__heading">Trigger</div>
            {renderSelectField({
              id: "side",
              label: "Placement",
              value: side,
              options: SIDE_OPTIONS,
              onChange: setSide,
            })}
            {renderSelectField({
              id: "align",
              label: "Alignment",
              value: align,
              options: ALIGN_OPTIONS,
              onChange: setAlign,
            })}
          </div>

          {renderDivider()}

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

      <div
        className="assistant-playground-code not-prose"
        data-assistant-code=""
      >
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
