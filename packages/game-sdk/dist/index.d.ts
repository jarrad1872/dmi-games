/**
 * DMI Games SDK
 *
 * Shared library for all DMI arcade games.
 * Provides loadout fetching, promo engine, Tool Drop UI, and analytics.
 */
interface Product {
    id: string;
    name: string;
    sku?: string;
    shopify_url: string;
    image_url?: string;
    category?: string;
}
interface PromoBanner {
    enabled: boolean;
    title?: string;
    subtitle?: string;
    cta_text?: string;
    cta_url?: string;
    image_url?: string;
}
interface LoadoutConfig {
    game_id: string;
    products: Product[];
    promo_banner?: PromoBanner;
    feature_flags: Record<string, boolean>;
}
interface TrackEvent {
    game_id: string;
    event_name: string;
    properties?: Record<string, any>;
    session_id?: string;
}
interface SDKConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
    gameId: string;
    fallbackLoadout?: LoadoutConfig;
}
/**
 * Initialize the DMI Games SDK
 */
declare function initSDK(config: SDKConfig): void;
/**
 * Check if SDK is initialized
 */
declare function isInitialized(): boolean;
/**
 * Get or create session ID for tracking
 */
declare function getSessionId(): string;
/**
 * Reset session (for new game session)
 */
declare function resetSession(): void;
/**
 * Fetch game loadout from Supabase
 * Falls back to embedded config if offline or error
 */
declare function fetchLoadout(gameId?: string): Promise<LoadoutConfig>;
/**
 * Initialize promo engine with loaded config
 */
declare function initPromoEngine(config: LoadoutConfig): void;
/**
 * Get current promo config
 */
declare function getPromoConfig(): LoadoutConfig | null;
/**
 * Check if Tool Drop is enabled
 */
declare function isToolDropEnabled(): boolean;
/**
 * Get a random product from loadout
 */
declare function getRandomProduct(): Product | null;
declare class ToolDropUI {
    private product;
    private container;
    private styleElement;
    private visible;
    private autoHideTimeout;
    /**
     * Show Tool Drop for a product
     */
    show(product: Product, autoHideMs?: number): void;
    /**
     * Hide Tool Drop with animation
     */
    hide(): void;
    private injectStyles;
    private render;
}
/**
 * Convenience function to show Tool Drop
 */
declare function showToolDrop(product: Product, autoHideMs?: number): void;
/**
 * Hide current Tool Drop
 */
declare function hideToolDrop(): void;
/**
 * Track an analytics event
 */
declare function track(eventName: string, properties?: Record<string, any>): Promise<void>;
/**
 * Track game start
 */
declare function trackGameStart(): void;
/**
 * Track level complete
 */
declare function trackLevelComplete(level: number, score: number, extras?: Record<string, any>): void;
/**
 * Track game over
 */
declare function trackGameOver(score: number, level: number, extras?: Record<string, any>): void;
declare const VERSION = "0.1.0";

export { type LoadoutConfig, type Product, type PromoBanner, type SDKConfig, ToolDropUI, type TrackEvent, VERSION, fetchLoadout, getPromoConfig, getRandomProduct, getSessionId, hideToolDrop, initPromoEngine, initSDK, isInitialized, isToolDropEnabled, resetSession, showToolDrop, track, trackGameOver, trackGameStart, trackLevelComplete };
