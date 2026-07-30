export const AssistantWidgetPreviewHost = () => {
  // This component only runs on /assistant/widget-preview, which the widget
  // playground embeds at a real URL so the captcha provider sees a hostname
  // (srcdoc iframes have none).
  // Mintlify evaluates snippet exports independently, so these constants must
  // stay in sync with snippets/assistant-widget-playground.jsx.
  const EMBED_URL = "https://widget.mintlify.com/v1/embed.js";
  const PREVIEW_WIDGET_ID = "mint_widget_ce2bb750-8cc9-4057-96b3-cbd3aedd7acb";
  const PREVIEW_READY_MESSAGE = "mintlify-assistant-playground:ready";
  const PREVIEW_UPDATE_MESSAGE = "mintlify-assistant-playground:update";
  const PREVIEW_STATE_MESSAGE = "mintlify-assistant-playground:state";
  const SUPPORT_EMAIL = "hi@mintlify.com";
  const STARTER_QUESTIONS = [
    "How do I get started with Mintlify?",
    "How do I customize my docs?",
    "How do I deploy my docs?",
  ];

  useEffect(() => {
    // Only act as a preview host when embedded by the playground. Visiting
    // the page directly renders nothing.
    if (window.parent === window) return undefined;
    if (window.__mintlifyAssistantPreviewHost) return undefined;
    window.__mintlifyAssistantPreviewHost = true;

    const parentOrigin = window.location.origin;

    // playground.css hides the docs chrome and keeps this page transparent;
    // it scopes those rules to html[data-current-path$="/assistant/widget-preview"].

    const postPreviewState = (state, message) => {
      window.parent.postMessage(
        { type: PREVIEW_STATE_MESSAGE, state, message },
        parentOrigin,
      );
    };

    const reportPreviewError = (error) => {
      console.error("Mintlify Assistant preview failed", error);
      postPreviewState("error", error?.message ?? String(error));
    };

    // Track the visitor's open/close choice so config updates can preserve
    // it instead of forcing the widget open on every change.
    let isWidgetOpen = false;

    const createHooks = (trackEvents, reportErrors) => ({
      event: (event) => {
        if (event?.type === "open") isWidgetOpen = true;
        if (event?.type === "close") isWidgetOpen = false;
        if (trackEvents) console.log("Assistant event", event);
      },
      error: reportErrors ? (error) => console.error("Assistant error", error) : null,
    });

    const applyTheme = (theme) => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
    };

    const loadEmbedScript = () => {
      if (window.MintlifyAssistant) return;
      const existing = document.querySelector(`script[src="${EMBED_URL}"]`);
      if (existing) return;
      const script = document.createElement("script");
      script.type = "module";
      script.src = EMBED_URL;
      script.addEventListener(
        "error",
        () => reportPreviewError(new Error("Mintlify Assistant failed to load.")),
        { once: true },
      );
      document.head.append(script);
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
    let hasReportedReady = false;
    let assistantApi;
    let queuedPreviewUpdate;

    // Wait until the iframe viewport has a stable non-zero size. Opening the
    // widget popover before that (common on SPA navigations into the
    // playground) lets Floating UI measure an empty trigger box and park the
    // panel at (0, 0) — permanently, because a zero-size anchor disables
    // Floating UI's move tracking, so nothing repositions the panel afterwards.
    const waitForPreviewLayout = () =>
      new Promise((resolve) => {
        let timeoutAt = Date.now() + 2000;
        let previousHeight = -1;
        let stableFrames = 0;

        const tick = () => {
          const width = document.documentElement.clientWidth;
          const height = document.documentElement.clientHeight;

          if (width === 0 || height === 0) {
            // Never time out into a zero-size viewport. Park on the next
            // resize instead of polling — rAF may not run while the iframe
            // has no rendered box.
            stableFrames = 0;
            previousHeight = -1;
            window.addEventListener(
              "resize",
              () => {
                timeoutAt = Date.now() + 2000;
                tick();
              },
              { once: true },
            );
            return;
          }

          if (height === previousHeight) {
            stableFrames += 1;
            if (stableFrames >= 2) {
              resolve();
              return;
            }
          } else {
            stableFrames = 0;
            previousHeight = height;
          }

          // The timeout only breaks stabilization stalls; the viewport is
          // known non-zero here, so opening is safe.
          if (Date.now() > timeoutAt) {
            resolve();
            return;
          }

          requestAnimationFrame(tick);
        };

        tick();
      });

    const applyPreviewUpdate = async ({ appearance, reportErrors, trackEvents }) => {
      const nextPlacementKey = [
        appearance.variant,
        appearance.side,
        appearance.align,
      ].join(":");
      const previousPlacementKey = document.documentElement.dataset.previewPlacement;
      const isInitialApply = previousPlacementKey === undefined;
      // Skip close on the first apply — there is no prior surface to reset,
      // and close/open before layout is what sends the panel to the origin.
      const placementChanged =
        !isInitialApply && previousPlacementKey !== nextPlacementKey;

      // Capture the open state before the placement close below overwrites it.
      const wasOpen = isWidgetOpen;

      applyTheme(appearance.theme);
      // Theme/token updates can apply in place. Only close before updating
      // when placement changes — otherwise the widget popover remounts and
      // can remeasure before the trigger has a layout box, landing at (0, 0).
      if (placementChanged) {
        await assistantApi.close();
      }
      await assistantApi.update({
        appearance,
        hooks: createHooks(trackEvents, reportErrors),
      });
      if (isInitialApply || placementChanged) {
        await waitForPreviewLayout();
      }
      // Open on the first apply to showcase the widget, and reopen after a
      // placement change closed it. A widget the visitor closed stays closed.
      if (isInitialApply || (placementChanged && wasOpen)) {
        await assistantApi.open();
      }
      document.documentElement.dataset.previewPlacement = nextPlacementKey;
      if (!hasReportedReady) {
        hasReportedReady = true;
        postPreviewState("ready");
      }
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
      if (event.source !== window.parent || event.data?.type !== PREVIEW_UPDATE_MESSAGE) {
        return;
      }

      applyTheme(event.data.appearance.theme);
      queuePreviewUpdate(event.data);
    });

    const initializePreview = async () => {
      loadEmbedScript();

      // Keep closed until the first configured update + layout settle.
      // defaultOpen races SPA navigations where the iframe is still 0-sized.
      const baseConfig = {
        id: PREVIEW_WIDGET_ID,
        appearance: {
          theme: "light",
          variant: "widget",
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
      window.parent.postMessage({ type: PREVIEW_READY_MESSAGE }, parentOrigin);
      await processPreviewUpdates();
    };

    void initializePreview().catch(reportPreviewError);
    return undefined;
  }, []);

  return null;
};
