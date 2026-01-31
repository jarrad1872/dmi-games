// src/index.ts
import { createClient } from "@supabase/supabase-js";
var supabase = null;
var currentGameId = null;
var currentConfig = null;
var sessionId = null;
var initialized = false;
function initSDK(config) {
  if (initialized) {
    console.warn("[DMI SDK] Already initialized");
    return;
  }
  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  currentGameId = config.gameId;
  if (config.fallbackLoadout) {
    currentConfig = config.fallbackLoadout;
  }
  initialized = true;
  console.log("[DMI SDK] Initialized for game:", config.gameId);
}
function isInitialized() {
  return initialized;
}
function getSessionId() {
  if (!sessionId) {
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("dmi_session_id") : null;
    if (stored) {
      sessionId = stored;
    } else {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("dmi_session_id", sessionId);
      }
    }
  }
  return sessionId;
}
function resetSession() {
  sessionId = null;
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("dmi_session_id");
  }
}
async function fetchLoadout(gameId) {
  const targetGameId = gameId || currentGameId;
  if (!targetGameId) {
    throw new Error("[DMI SDK] No game ID provided. Call initSDK first or pass gameId.");
  }
  const fallback = currentConfig || {
    game_id: targetGameId,
    products: [],
    feature_flags: { tool_drop_enabled: true }
  };
  if (!supabase) {
    console.warn("[DMI SDK] Supabase not initialized, using fallback");
    return fallback;
  }
  try {
    const { data, error } = await supabase.from("loadouts").select("*").eq("game_id", targetGameId).single();
    if (error) {
      console.warn("[DMI SDK] Loadout fetch error:", error.message);
      return fallback;
    }
    const loadout = {
      game_id: data.game_id,
      products: Array.isArray(data.products) ? data.products : [],
      promo_banner: data.promo_banner || void 0,
      feature_flags: data.feature_flags || {}
    };
    currentConfig = loadout;
    return loadout;
  } catch (err) {
    console.warn("[DMI SDK] Network error, using fallback:", err);
    return fallback;
  }
}
function initPromoEngine(config) {
  currentConfig = config;
  currentGameId = config.game_id;
  console.log("[DMI SDK] Promo engine initialized with", config.products.length, "products");
}
function getPromoConfig() {
  return currentConfig;
}
function isToolDropEnabled() {
  return currentConfig?.feature_flags?.tool_drop_enabled ?? true;
}
function getRandomProduct() {
  if (!currentConfig || currentConfig.products.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * currentConfig.products.length);
  return currentConfig.products[index];
}
var TOOL_DROP_STYLES = `
  @keyframes dmi-slide-up {
    from { transform: translateX(-50%) translateY(100px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  @keyframes dmi-slide-down {
    from { transform: translateX(-50%) translateY(0); opacity: 1; }
    to { transform: translateX(-50%) translateY(100px); opacity: 0; }
  }
  #dmi-tool-drop {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    font-family: 'Roboto', -apple-system, sans-serif;
  }
  #dmi-tool-drop.dmi-entering {
    animation: dmi-slide-up 0.3s ease-out forwards;
  }
  #dmi-tool-drop.dmi-exiting {
    animation: dmi-slide-down 0.3s ease-in forwards;
  }
  .dmi-tool-drop-card {
    background: linear-gradient(135deg, #a61c00 0%, #8a1700 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 340px;
  }
  .dmi-tool-drop-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    background: rgba(255,255,255,0.1);
  }
  .dmi-tool-drop-content {
    flex: 1;
  }
  .dmi-tool-drop-title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 4px;
  }
  .dmi-tool-drop-subtitle {
    font-size: 12px;
    opacity: 0.9;
    margin-bottom: 8px;
  }
  .dmi-tool-drop-cta {
    display: inline-block;
    background: white;
    color: #a61c00;
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: transform 0.1s;
  }
  .dmi-tool-drop-cta:hover {
    transform: scale(1.05);
  }
  .dmi-tool-drop-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0,0,0,0.2);
    border: none;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
  }
`;
var ToolDropUI = class {
  constructor() {
    this.product = null;
    this.container = null;
    this.styleElement = null;
    this.visible = false;
    this.autoHideTimeout = null;
  }
  /**
   * Show Tool Drop for a product
   */
  show(product, autoHideMs = 8e3) {
    if (!isToolDropEnabled()) {
      console.log("[DMI SDK] Tool Drop disabled by feature flag");
      return;
    }
    this.product = product;
    this.visible = true;
    this.injectStyles();
    this.render();
    track("tool_drop_shown", { product_id: product.id, product_name: product.name });
    if (autoHideMs > 0) {
      this.autoHideTimeout = window.setTimeout(() => this.hide(), autoHideMs);
    }
  }
  /**
   * Hide Tool Drop with animation
   */
  hide() {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
      this.autoHideTimeout = null;
    }
    if (this.container) {
      this.container.classList.remove("dmi-entering");
      this.container.classList.add("dmi-exiting");
      setTimeout(() => {
        this.container?.remove();
        this.container = null;
        this.visible = false;
      }, 300);
    }
  }
  injectStyles() {
    if (this.styleElement) return;
    this.styleElement = document.createElement("style");
    this.styleElement.id = "dmi-tool-drop-styles";
    this.styleElement.textContent = TOOL_DROP_STYLES;
    document.head.appendChild(this.styleElement);
  }
  render() {
    if (!this.product || !this.visible) return;
    const existing = document.getElementById("dmi-tool-drop");
    if (existing) existing.remove();
    this.container = document.createElement("div");
    this.container.id = "dmi-tool-drop";
    this.container.className = "dmi-entering";
    const imageHtml = this.product.image_url ? `<img src="${this.product.image_url}" alt="${this.product.name}" class="dmi-tool-drop-image">` : "";
    this.container.innerHTML = `
      <div class="dmi-tool-drop-card">
        ${imageHtml}
        <div class="dmi-tool-drop-content">
          <div class="dmi-tool-drop-title">${this.product.name}</div>
          <div class="dmi-tool-drop-subtitle">Available at DMI Tools</div>
          <a href="${this.product.shopify_url}" target="_blank" class="dmi-tool-drop-cta"
             onclick="window.dmiTrackClick && window.dmiTrackClick('${this.product.id}')">
            Shop Now
          </a>
        </div>
        <button class="dmi-tool-drop-close" aria-label="Close">&times;</button>
      </div>
    `;
    const closeBtn = this.container.querySelector(".dmi-tool-drop-close");
    closeBtn?.addEventListener("click", () => {
      track("tool_drop_dismissed", { product_id: this.product?.id });
      this.hide();
    });
    const ctaBtn = this.container.querySelector(".dmi-tool-drop-cta");
    ctaBtn?.addEventListener("click", () => {
      track("tool_drop_clicked", {
        product_id: this.product?.id,
        product_name: this.product?.name,
        shopify_url: this.product?.shopify_url
      });
    });
    document.body.appendChild(this.container);
  }
};
var toolDropInstance = null;
function showToolDrop(product, autoHideMs) {
  if (!toolDropInstance) {
    toolDropInstance = new ToolDropUI();
  }
  toolDropInstance.show(product, autoHideMs);
}
function hideToolDrop() {
  toolDropInstance?.hide();
}
async function track(eventName, properties) {
  const gameId = currentGameId || "unknown";
  const sid = getSessionId();
  console.log("[DMI Track]", eventName, properties);
  if (!supabase) {
    return;
  }
  try {
    await supabase.from("events").insert({
      game_id: gameId,
      event_name: eventName,
      properties: properties || {},
      session_id: sid
    });
  } catch (err) {
    console.warn("[DMI SDK] Track error:", err);
  }
}
function trackGameStart() {
  track("game_start", { timestamp: Date.now() });
}
function trackLevelComplete(level, score, extras) {
  track("level_complete", { level, score, ...extras });
}
function trackGameOver(score, level, extras) {
  track("game_over", { score, level, ...extras });
}
var VERSION = "0.1.0";
if (typeof window !== "undefined") {
  window.dmiTrackClick = (productId) => {
    track("tool_drop_clicked", { product_id: productId });
  };
}
export {
  ToolDropUI,
  VERSION,
  fetchLoadout,
  getPromoConfig,
  getRandomProduct,
  getSessionId,
  hideToolDrop,
  initPromoEngine,
  initSDK,
  isInitialized,
  isToolDropEnabled,
  resetSession,
  showToolDrop,
  track,
  trackGameOver,
  trackGameStart,
  trackLevelComplete
};
