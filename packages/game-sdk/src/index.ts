/**
 * DMI Games SDK
 *
 * Shared library for all DMI arcade games.
 * Provides loadout fetching, promo engine, Tool Drop UI, and analytics.
 */

// Types
export interface Product {
  id: string;
  name: string;
  sku?: string;
  shopify_url: string;
  image_url?: string;
  category?: string;
}

export interface PromoBanner {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_url?: string;
  image_url?: string;
}

export interface LoadoutConfig {
  game_id: string;
  products: Product[];
  promo_banner?: PromoBanner;
  feature_flags: Record<string, boolean>;
}

export interface TrackEvent {
  game_id: string;
  event_name: string;
  properties?: Record<string, any>;
  session_id?: string;
}

// Loadout fetching
export async function fetchLoadout(gameId: string): Promise<LoadoutConfig> {
  // TODO: Implement Supabase fetch
  // For now, return default config
  return {
    game_id: gameId,
    products: [],
    feature_flags: {},
  };
}

// Promo engine
let currentConfig: LoadoutConfig | null = null;

export function initPromoEngine(config: LoadoutConfig): void {
  currentConfig = config;
}

export function getPromoConfig(): LoadoutConfig | null {
  return currentConfig;
}

// Tool Drop UI
export class ToolDropUI {
  private product: Product | null = null;
  private container: HTMLElement | null = null;
  private visible: boolean = false;

  show(product: Product): void {
    this.product = product;
    this.visible = true;
    this.render();
  }

  hide(): void {
    this.visible = false;
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  private render(): void {
    if (!this.product || !this.visible) return;

    // Create container if doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'dmi-tool-drop';
      document.body.appendChild(this.container);
    }

    // TODO: Implement full UI
    this.container.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #a61c00;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-family: 'Roboto', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
      ">
        <strong>${this.product.name}</strong>
        <a href="${this.product.shopify_url}" target="_blank" style="color: white; margin-left: 12px;">
          Shop Now
        </a>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          margin-left: 12px;
          cursor: pointer;
        ">✕</button>
      </div>
    `;
  }
}

// Convenience function
export function showToolDrop(product: Product): void {
  const ui = new ToolDropUI();
  ui.show(product);
}

// Analytics tracking
export async function track(
  eventName: string,
  properties?: Record<string, any>
): Promise<void> {
  // TODO: Implement Supabase event tracking
  console.log('[DMI Track]', eventName, properties);
}

// Session management
let sessionId: string | null = null;

export function getSessionId(): string {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
}

// Export version
export const VERSION = '0.1.0';
