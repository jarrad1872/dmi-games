# @dmi-games/game-sdk

Shared SDK for DMI arcade games. Provides loadout fetching, promo engine, Tool Drop UI, and analytics.

## Installation

```bash
pnpm add @dmi-games/game-sdk
```

## Usage

```typescript
import {
  fetchLoadout,
  initPromoEngine,
  showToolDrop,
  track
} from '@dmi-games/game-sdk';

// On game load
const loadout = await fetchLoadout('asmr_cut');
initPromoEngine(loadout);

// Show Tool Drop at milestone
if (loadout.products.length > 0) {
  showToolDrop(loadout.products[0]);
}

// Track events
track('level_complete', { level: 5, score: 1000 });
```

## API

### `fetchLoadout(gameId: string): Promise<LoadoutConfig>`
Fetches game configuration from Supabase. Falls back to embedded config if offline.

### `initPromoEngine(config: LoadoutConfig): void`
Initializes the promo engine with the fetched config.

### `showToolDrop(product: Product): void`
Displays the Tool Drop UI for a specific product.

### `track(eventName: string, properties?: Record<string, any>): Promise<void>`
Tracks an analytics event to Supabase.

### `class ToolDropUI`
Full control over Tool Drop display:
- `show(product: Product)` - Display the UI
- `hide()` - Hide the UI

## Types

```typescript
interface Product {
  id: string;
  name: string;
  sku?: string;
  shopify_url: string;
  image_url?: string;
  category?: string;
}

interface LoadoutConfig {
  game_id: string;
  products: Product[];
  promo_banner?: PromoBanner;
  feature_flags: Record<string, boolean>;
}
```
