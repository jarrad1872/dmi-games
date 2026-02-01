/**
 * DMI Games SDK Types
 *
 * Type definitions for the product catalog and game integration system.
 */

// ============================================================================
// Product Catalog Types (from Supabase products table)
// ============================================================================

/**
 * Product category enum
 */
export type ProductCategory = 'blades' | 'core-bits' | 'accessories' | 'equipment';

/**
 * Master catalog product from the database
 * Represents a real DMI product with no game-specific modifications
 */
export interface CatalogProduct {
  id: string;                    // Slug-based ID: 'blade-turbo'
  name: string;                  // Display name: 'DMI Turbo Diamond Blade'
  sku?: string;                  // Optional Shopify SKU
  shopify_url: string;           // Link to dmitools.com product page
  image_url?: string;            // Product image URL
  category: ProductCategory;     // Product category
  description?: string;          // Marketing description
  price_cents?: number;          // Real-world price in cents
  active?: boolean;              // Whether product is active in catalog
  created_at?: string;           // ISO timestamp
}

// ============================================================================
// Game-Specific Product Configuration
// ============================================================================

/**
 * Per-game product configuration stored in loadouts.products JSONB
 * References a CatalogProduct by ID and adds game-specific stats
 */
export interface GameProductConfig {
  product_id: string;                      // References products.id
  tier?: number;                           // Game tier/level (1-5)
  game_cost?: number;                      // In-game currency cost
  stats?: Record<string, number>;          // Game-specific stats (e.g., cutting_speed, durability)
  game_effect?: string;                    // Human-readable effect description
  unlock_level?: number;                   // Level required to unlock
}

/**
 * Merged product for game use
 * Combines CatalogProduct with game-specific GameProductConfig
 */
export interface GameProduct extends CatalogProduct {
  // Game-specific fields from GameProductConfig
  tier?: number;
  game_cost?: number;
  stats?: Record<string, number>;
  game_effect?: string;
  unlock_level?: number;
}

// ============================================================================
// Loadout Types
// ============================================================================

/**
 * Promo banner configuration
 */
export interface PromoBanner {
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
export interface FeatureFlags {
  tool_drop_enabled?: boolean;
  show_prices?: boolean;
  [key: string]: boolean | undefined;
}

/**
 * Raw loadout data from Supabase
 * Products are stored as GameProductConfig references
 */
export interface LoadoutRow {
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
export interface LoadoutConfig {
  game_id: string;
  products: GameProduct[];
  promo_banner?: PromoBanner;
  feature_flags: FeatureFlags;
}

// ============================================================================
// Analytics Types
// ============================================================================

/**
 * Analytics event for tracking
 */
export interface TrackEvent {
  game_id: string;
  event_name: string;
  properties?: Record<string, unknown>;
  session_id?: string;
}

// ============================================================================
// SDK Configuration
// ============================================================================

/**
 * SDK initialization configuration
 */
export interface SDKConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  gameId: string;
  fallbackProducts?: CatalogProduct[];
  fallbackLoadout?: LoadoutConfig;
}

// ============================================================================
// Legacy Compatibility
// ============================================================================

/**
 * Legacy Product interface for backwards compatibility
 * @deprecated Use CatalogProduct or GameProduct instead
 */
export interface Product {
  id: string;
  name: string;
  sku?: string;
  shopify_url: string;
  image_url?: string;
  category?: string;
}
