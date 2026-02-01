/**
 * DMI Games SDK Types
 *
 * Type definitions for the product catalog and game integration system.
 */
/**
 * Product category enum
 */
type ProductCategory = 'blades' | 'core-bits' | 'accessories' | 'equipment';
/**
 * Master catalog product from the database
 * Represents a real DMI product with no game-specific modifications
 */
interface CatalogProduct {
    id: string;
    name: string;
    sku?: string;
    shopify_url: string;
    image_url?: string;
    category: ProductCategory;
    description?: string;
    price_cents?: number;
    active?: boolean;
    created_at?: string;
}
/**
 * Per-game product configuration stored in loadouts.products JSONB
 * References a CatalogProduct by ID and adds game-specific stats
 */
interface GameProductConfig {
    product_id: string;
    tier?: number;
    game_cost?: number;
    stats?: Record<string, number>;
    game_effect?: string;
    unlock_level?: number;
}
/**
 * Merged product for game use
 * Combines CatalogProduct with game-specific GameProductConfig
 */
interface GameProduct extends CatalogProduct {
    tier?: number;
    game_cost?: number;
    stats?: Record<string, number>;
    game_effect?: string;
    unlock_level?: number;
}
/**
 * Promo banner configuration
 */
interface PromoBanner {
    enabled: boolean;
    title?: string;
    subtitle?: string;
    cta_text?: string;
    cta_url?: string;
    image_url?: string;
}
/**
 * Feature flags for game configuration
 */
interface FeatureFlags {
    tool_drop_enabled?: boolean;
    show_prices?: boolean;
    [key: string]: boolean | undefined;
}
/**
 * Raw loadout data from Supabase
 * Products are stored as GameProductConfig references
 */
interface LoadoutRow {
    id: string;
    game_id: string;
    products: GameProductConfig[];
    promo_banner?: PromoBanner;
    feature_flags: FeatureFlags;
}
/**
 * Enriched loadout with merged GameProduct objects
 * This is what games actually use
 */
interface LoadoutConfig {
    game_id: string;
    products: GameProduct[];
    promo_banner?: PromoBanner;
    feature_flags: FeatureFlags;
}
/**
 * Analytics event for tracking
 */
interface TrackEvent {
    game_id: string;
    event_name: string;
    properties?: Record<string, unknown>;
    session_id?: string;
}
/**
 * SDK initialization configuration
 */
interface SDKConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
    gameId: string;
    fallbackProducts?: CatalogProduct[];
    fallbackLoadout?: LoadoutConfig;
}
/**
 * Legacy Product interface for backwards compatibility
 * @deprecated Use CatalogProduct or GameProduct instead
 */
interface Product {
    id: string;
    name: string;
    sku?: string;
    shopify_url: string;
    image_url?: string;
    category?: string;
}

/**
 * DMI Games SDK
 *
 * Shared library for all DMI arcade games.
 * Provides loadout fetching, promo engine, Tool Drop UI, and analytics.
 */

/**
 * Initialize the DMI Games SDK
 */
declare function initSDK(config: SDKConfig): void;
/**
 * Check if SDK is initialized
 */
declare function isInitialized(): boolean;
/**
 * Get current game ID
 */
declare function getGameId(): string | null;
/**
 * Get or create session ID for tracking
 */
declare function getSessionId(): string;
/**
 * Reset session (for new game session)
 */
declare function resetSession(): void;
/**
 * Fetch the full product catalog from Supabase
 * Use this for admin interfaces or when you need all products
 */
declare function fetchProductCatalog(): Promise<CatalogProduct[]>;
/**
 * Get cached product catalog (no network call)
 */
declare function getCatalog(): CatalogProduct[];
/**
 * Get a product from the catalog by ID
 */
declare function getCatalogProduct(productId: string): CatalogProduct | null;
/**
 * Get products from catalog by category
 */
declare function getCatalogProductsByCategory(category: ProductCategory): CatalogProduct[];
/**
 * Get merged game products for the current game
 * Returns products with both catalog data and game-specific stats
 */
declare function getGameProducts(): GameProduct[];
/**
 * Get a specific game product by ID
 */
declare function getProduct(productId: string): GameProduct | null;
/**
 * Get game products by category
 */
declare function getProductsByCategory(category: ProductCategory): GameProduct[];
/**
 * Get game products by tier
 */
declare function getProductsByTier(tier: number): GameProduct[];
/**
 * Get unlocked products (based on level)
 */
declare function getUnlockedProducts(level: number): GameProduct[];
/**
 * Fetch game loadout from Supabase
 * Falls back to embedded config if offline or error
 *
 * This function:
 * 1. Fetches the loadout config for the game
 * 2. Fetches referenced products from the catalog
 * 3. Merges game-specific stats onto base products
 * 4. Returns enriched GameProduct[]
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
declare function getRandomProduct(): GameProduct | null;
/**
 * Get a product appropriate for the player's level
 * Returns a product from a tier at or below their progress
 */
declare function getProductForLevel(level: number): GameProduct | null;
declare class ToolDropUI {
    private product;
    private container;
    private styleElement;
    private visible;
    private autoHideTimeout;
    /**
     * Show Tool Drop for a product
     */
    show(product: GameProduct | Product, autoHideMs?: number): void;
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
declare function showToolDrop(product: GameProduct | Product, autoHideMs?: number): void;
/**
 * Hide current Tool Drop
 */
declare function hideToolDrop(): void;
/**
 * Show Tool Drop for a random product appropriate for level
 */
declare function showToolDropForLevel(level: number, autoHideMs?: number): void;
/**
 * Track an analytics event
 */
declare function track(eventName: string, properties?: Record<string, unknown>): Promise<void>;
/**
 * Track game start
 */
declare function trackGameStart(): void;
/**
 * Track level complete
 */
declare function trackLevelComplete(level: number, score: number, extras?: Record<string, unknown>): void;
/**
 * Track game over
 */
declare function trackGameOver(score: number, level: number, extras?: Record<string, unknown>): void;
declare const VERSION = "0.2.0";

export { type CatalogProduct, type FeatureFlags, type GameProduct, type GameProductConfig, type LoadoutConfig, type LoadoutRow, type Product, type ProductCategory, type PromoBanner, type SDKConfig, ToolDropUI, type TrackEvent, VERSION, fetchLoadout, fetchProductCatalog, getCatalog, getCatalogProduct, getCatalogProductsByCategory, getGameId, getGameProducts, getProduct, getProductForLevel, getProductsByCategory, getProductsByTier, getPromoConfig, getRandomProduct, getSessionId, getUnlockedProducts, hideToolDrop, initPromoEngine, initSDK, isInitialized, isToolDropEnabled, resetSession, showToolDrop, showToolDropForLevel, track, trackGameOver, trackGameStart, trackLevelComplete };
