-- DMI Games Product Catalog
-- Migration 001: Create products table

-- Products table: Master catalog of DMI products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,                    -- Slug-based ID: 'blade-turbo'
  name TEXT NOT NULL,                     -- Display name: 'DMI Turbo Diamond Blade'
  sku TEXT UNIQUE,                        -- Optional SKU from Shopify
  shopify_url TEXT NOT NULL,              -- Link to dmitools.com product page
  image_url TEXT,                         -- Product image URL
  category TEXT NOT NULL,                 -- 'blades' | 'core-bits' | 'accessories' | 'equipment'
  description TEXT,                       -- Marketing description
  price_cents INTEGER,                    -- Price in cents (e.g., 35000 = $350.00)
  active BOOLEAN DEFAULT true,            -- Soft delete / hide from catalog
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Index for active products
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active) WHERE active = true;

-- Update existing loadouts table structure (if needed)
-- The loadouts.products JSONB column now stores GameProductConfig objects:
-- {
--   "product_id": "blade-turbo",     -- References products.id
--   "tier": 2,                        -- Game-specific tier
--   "game_cost": 2000,               -- In-game currency cost
--   "stats": { "cutting_speed": 1.5 }, -- Game-specific stats
--   "game_effect": "Cuts 50% faster"  -- Display text
-- }

-- Note: loadouts table already exists per CLAUDE.md schema
-- This migration only adds the products table

COMMENT ON TABLE products IS 'Master catalog of DMI products for all games';
COMMENT ON COLUMN products.id IS 'Slug-based unique identifier';
COMMENT ON COLUMN products.category IS 'Product category: blades, core-bits, accessories, equipment';
COMMENT ON COLUMN products.price_cents IS 'Real-world price in cents for display purposes';
