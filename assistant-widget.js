const ASSISTANT_WIDGET_ID = "mint_widget_b6d4fae8-946b-4a5d-9f6b-f48948ab115b";
const ASSISTANT_WIDGET_EMBED_URL =
  "https://cdn.jsdelivr.net/npm/@mintlify/assistant-widget@0.0/dist/browser/embed.js";
const ASSISTANT_WIDGET_PATH = "/assistant/widget";

let assistantInitialized = false;
let assistantLoaderPromise;
let assistantThemeObserver;
let assistantRouteTransition = Promise.resolve();

const reportAssistantError = (error) => {
  console.error("Mintlify Assistant failed to initialize", error);
};

const notifyAssistantReady = () => {
  window.dispatchEvent(new Event("mintlify-assistant-ready"));
};

const normalizePath = (path) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

const getCurrentDocsPath = () =>
  document.documentElement.dataset.currentPath || window.location.pathname;

const isAssistantWidgetPage = () =>
  normalizePath(getCurrentDocsPath()) === ASSISTANT_WIDGET_PATH;

const getDocsTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const syncAssistantTheme = (assistant) =>
  assistant.update({ appearance: { theme: getDocsTheme() } });

const observeDocsTheme = (assistant) => {
  assistantThemeObserver?.disconnect();

  let currentTheme = getDocsTheme();
  const observer = new MutationObserver(() => {
    const nextTheme = getDocsTheme();
    if (nextTheme === currentTheme) return;

    currentTheme = nextTheme;
    void syncAssistantTheme(assistant).catch(reportAssistantError);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  assistantThemeObserver = observer;
};

const openAssistantWidget = async (assistant) => {
  await assistant.open({ focus: false });
  observeDocsTheme(assistant);
  notifyAssistantReady();
  void syncAssistantTheme(assistant).catch(reportAssistantError);
};

const initializeAssistantApi = async (assistant) => {
  const baseConfig = {
    id: ASSISTANT_WIDGET_ID,
    appearance: {
      theme: getDocsTheme(),
      side: "bottom",
      align: "end",
    },
  };

  try {
    await assistant.init({
      ...baseConfig,
      supportEmail: "hi@mintlify.com",
      starterQuestions: [
        "How do I get started with Mintlify?",
        "How do I customize my docs?",
        "How do I deploy my docs?",
      ],
    });
  } catch (error) {
    const message = error && error.message ? error.message : "";
    const sessionOverridesUnsupported =
      message.includes("config.supportEmail is not supported") ||
      message.includes("config.starterQuestions is not supported");

    // Keep the docs usable until the published browser package includes these overrides.
    if (sessionOverridesUnsupported) {
      await assistant.init(baseConfig);
      return;
    }

    if (!message.includes("requires a non-empty public Widget ID")) throw error;

    await assistant.init({
      widgetId: ASSISTANT_WIDGET_ID,
      theme: getDocsTheme(),
    });
  }
};

const loadAssistantApi = () => {
  if (window.MintlifyAssistant) {
    return Promise.resolve(window.MintlifyAssistant);
  }
  if (assistantLoaderPromise) return assistantLoaderPromise;

  assistantLoaderPromise = new Promise((resolve, reject) => {
    const handleLoad = () => {
      const assistant = window.MintlifyAssistant;
      if (assistant) {
        resolve(assistant);
        return;
      }

      reject(new Error("The Assistant loader did not install its browser API."));
    };
    const handleError = () => {
      reject(new Error("The Assistant loader could not be loaded."));
    };
    const existingLoader = document.querySelector(
      `script[src="${ASSISTANT_WIDGET_EMBED_URL}"]`,
    );

    if (existingLoader) {
      existingLoader.addEventListener("load", handleLoad, { once: true });
      existingLoader.addEventListener("error", handleError, { once: true });
      return;
    }

    const assistantLoader = document.createElement("script");
    assistantLoader.type = "module";
    assistantLoader.src = ASSISTANT_WIDGET_EMBED_URL;
    assistantLoader.crossOrigin = "anonymous";
    assistantLoader.addEventListener("load", handleLoad, { once: true });
    assistantLoader.addEventListener("error", handleError, { once: true });
    document.head.append(assistantLoader);
  });

  return assistantLoaderPromise;
};

const destroyAssistantWidget = async () => {
  assistantThemeObserver?.disconnect();
  assistantThemeObserver = undefined;
  if (!assistantInitialized) return;

  assistantInitialized = false;
  await window.MintlifyAssistant?.destroy();
};

const initializeAssistantWidget = async () => {
  if (assistantInitialized || !isAssistantWidgetPage()) return;

  const assistant = await loadAssistantApi();
  if (!isAssistantWidgetPage()) return;

  await initializeAssistantApi(assistant);
  assistantInitialized = true;

  if (!isAssistantWidgetPage()) {
    await destroyAssistantWidget();
    return;
  }

  await openAssistantWidget(assistant);
};

const reconcileAssistantWidget = () => {
  assistantRouteTransition = assistantRouteTransition
    .then(async () => {
      if (isAssistantWidgetPage()) {
        await initializeAssistantWidget();
      } else {
        await destroyAssistantWidget();
      }
    })
    .catch(reportAssistantError);
};

const assistantRouteObserver = new MutationObserver(reconcileAssistantWidget);
assistantRouteObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-current-path"],
});
window.addEventListener("popstate", reconcileAssistantWidget);
reconcileAssistantWidget();
