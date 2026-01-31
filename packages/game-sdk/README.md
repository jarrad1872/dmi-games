# @dmi-games/game-sdk

Shared SDK for DMI arcade games. Provides loadout fetching, promo engine, Tool Drop UI, and analytics.

## Installation

```bash
pnpm add @dmi-games/game-sdk
```

## Quick Start

```typescript
import {
  initSDK,
  fetchLoadout,
  initPromoEngine,
  showToolDrop,
  trackGameStart,
  trackLevelComplete,
  getRandomProduct
} from '@dmi-games/game-sdk';

// Initialize SDK (call once at game start)
initSDK({
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key',
  gameId: 'asmr_cut',
});

// Fetch loadout during title screen
const loadout = await fetchLoadout();
initPromoEngine(loadout);

// Track game start
trackGameStart();

// Show Tool Drop at milestone (e.g., level 5)
const product = getRandomProduct();
if (product) {
  showToolDrop(product);
}

// Track level completion
trackLevelComplete(5, 1000, { stars: 3 });
```

## API Reference

### Initialization

#### `initSDK(config: SDKConfig): void`
Initialize the SDK with Supabase credentials.

```typescript
interface SDKConfig {
  supabaseUrl: string;      // Your Supabase project URL
  supabaseAnonKey: string;  // Public anon key (safe for client)
  gameId: string;           // Game identifier (e.g., 'asmr_cut')
  fallbackLoadout?: LoadoutConfig;  // Optional offline fallback
}
```

#### `isInitialized(): boolean`
Check if SDK has been initialized.

### Loadout & Promo Engine

#### `fetchLoadout(gameId?: string): Promise<LoadoutConfig>`
Fetch game configuration from Supabase. Falls back to embedded config if offline.

```typescript
interface LoadoutConfig {
  game_id: string;
  products: Product[];
  promo_banner?: PromoBanner;
  feature_flags: Record<string, boolean>;
}
```

#### `initPromoEngine(config: LoadoutConfig): void`
Initialize the promo engine with fetched config.

#### `getPromoConfig(): LoadoutConfig | null`
Get current promo configuration.

#### `getRandomProduct(): Product | null`
Get a random product from the loadout for Tool Drop.

#### `isToolDropEnabled(): boolean`
Check if Tool Drop is enabled via feature flags.

### Tool Drop UI

#### `showToolDrop(product: Product, autoHideMs?: number): void`
Display the Tool Drop UI for a product. Auto-hides after 8 seconds by default.

```typescript
interface Product {
  id: string;
  name: string;
  sku?: string;
  shopify_url: string;
  image_url?: string;
  category?: string;
}
```

#### `hideToolDrop(): void`
Manually hide the Tool Drop UI.

#### `class ToolDropUI`
For advanced control over Tool Drop display:
```typescript
const ui = new ToolDropUI();
ui.show(product, 10000);  // Show for 10 seconds
ui.hide();                 // Hide manually
```

### Analytics

#### `track(eventName: string, properties?: Record<string, any>): Promise<void>`
Track a custom event.

#### `trackGameStart(): void`
Track game start event.

#### `trackLevelComplete(level: number, score: number, extras?: Record<string, any>): void`
Track level completion with score.

#### `trackGameOver(score: number, level: number, extras?: Record<string, any>): void`
Track game over with final score.

### Session Management

#### `getSessionId(): string`
Get current session ID (creates one if needed).

#### `resetSession(): void`
Reset session ID for new game session.

## Feature Flags

Control game behavior via `feature_flags` in loadout:

| Flag | Description |
|------|-------------|
| `tool_drop_enabled` | Show/hide Tool Drop UI |

## Events Tracked

| Event | Properties | When |
|-------|------------|------|
| `game_start` | timestamp | Game begins |
| `level_complete` | level, score, extras | Level finished |
| `game_over` | score, level, extras | Game ends |
| `tool_drop_shown` | product_id, product_name | Tool Drop displayed |
| `tool_drop_clicked` | product_id, product_name, shopify_url | CTA clicked |
| `tool_drop_dismissed` | product_id | Close button clicked |

## Offline Support

The SDK gracefully handles offline scenarios:
- `fetchLoadout` returns fallback config if network fails
- `track` silently fails without breaking the game
- Session IDs persist in localStorage

## Types

```typescript
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

export interface SDKConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  gameId: string;
  fallbackLoadout?: LoadoutConfig;
}
```
