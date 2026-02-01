-- DMI Games Product Catalog Seed Data
-- Run after 001_products_table.sql migration

-- Clear existing products (for re-seeding)
DELETE FROM products;

-- ============================================================================
-- BLADES (7 products)
-- ============================================================================

INSERT INTO products (id, name, sku, shopify_url, image_url, category, description, price_cents, active) VALUES
(
  'blade-standard',
  'Standard Cured Concrete Blade',
  'DMI-BLD-STD',
  'https://dmitools.com/collections/diamond-blades/products/standard-cured-concrete-blade',
  'https://dmitools.com/cdn/shop/products/standard-blade.jpg',
  'blades',
  'Entry-level diamond blade for general concrete cutting. Ideal for DIY projects and light-duty applications.',
  15000,
  true
),
(
  'blade-segmented',
  'DMI Segmented Diamond Blade',
  'DMI-BLD-SEG',
  'https://dmitools.com/collections/diamond-blades/products/segmented-diamond-blade',
  'https://dmitools.com/cdn/shop/products/segmented-blade.jpg',
  'blades',
  'Segmented rim design for fast, aggressive cutting. Perfect for reinforced concrete and masonry.',
  29376,
  true
),
(
  'blade-turbo',
  'DMI Turbo Diamond Blade',
  'DMI-BLD-TRB',
  'https://dmitools.com/collections/diamond-blades/products/turbo-diamond-blade',
  'https://dmitools.com/cdn/shop/products/turbo-blade.jpg',
  'blades',
  'Continuous turbo rim for smooth, fast cuts. Reduced vibration and longer blade life.',
  35000,
  true
),
(
  'blade-continuous',
  'DMI Continuous Rim Blade',
  'DMI-BLD-CNT',
  'https://dmitools.com/collections/diamond-blades/products/continuous-rim-blade',
  'https://dmitools.com/cdn/shop/products/continuous-rim.jpg',
  'blades',
  'Ultra-smooth cutting for tile, marble, and delicate materials. Chip-free results every time.',
  42000,
  true
),
(
  'blade-high-hp',
  'High HP Slab Saw Blade',
  'DMI-BLD-HHP',
  'https://dmitools.com/collections/diamond-blades/products/high-hp-slab-saw-blade',
  'https://dmitools.com/cdn/shop/products/high-hp-blade.jpg',
  'blades',
  'Heavy-duty blade designed for high-horsepower slab saws. Maximum cutting speed for production work.',
  58608,
  true
),
(
  'blade-pro-series',
  'DMI Pro Series Diamond Blade',
  'DMI-BLD-PRO',
  'https://dmitools.com/collections/diamond-blades/products/pro-series-diamond-blade',
  'https://dmitools.com/cdn/shop/products/pro-series-blade.jpg',
  'blades',
  'Contractor-grade blade with premium diamond matrix. Extended life and superior performance.',
  75000,
  true
),
(
  'blade-master',
  'DMI Master Diamond Blade',
  'DMI-BLD-MST',
  'https://dmitools.com/collections/diamond-blades/products/master-diamond-blade',
  'https://dmitools.com/cdn/shop/products/master-blade.jpg',
  'blades',
  'The ultimate diamond blade. Legendary DMI craftsmanship for professionals who demand the best.',
  120000,
  true
);

-- ============================================================================
-- CORE BITS (4 products)
-- ============================================================================

INSERT INTO products (id, name, sku, shopify_url, image_url, category, description, price_cents, active) VALUES
(
  'bit-laser-welded',
  'Laser Welded Core Bit',
  'DMI-BIT-LW',
  'https://dmitools.com/collections/core-bits/products/laser-welded-core-bit',
  'https://dmitools.com/cdn/shop/products/laser-welded-bit.jpg',
  'core-bits',
  'Precision laser-welded segments for reliable performance. Available in standard diameters.',
  12000,
  true
),
(
  'bit-large-diameter',
  'Large Diameter Ultra-Lite Core Bit',
  'DMI-BIT-LD',
  'https://dmitools.com/collections/core-bits/products/large-diameter-ultra-lite',
  'https://dmitools.com/cdn/shop/products/large-diameter-bit.jpg',
  'core-bits',
  'Lightweight design reduces operator fatigue. Ideal for overhead and wall coring applications.',
  35000,
  true
),
(
  'bit-arix',
  'Arix Technology Core Bit',
  'DMI-BIT-ARX',
  'https://dmitools.com/collections/core-bits/products/arix-technology-core-bit',
  'https://dmitools.com/cdn/shop/products/arix-bit.jpg',
  'core-bits',
  'Revolutionary Arix diamond arrangement for maximum cutting speed and extended life.',
  50000,
  true
),
(
  'bit-heavy-duty',
  'Heavy Duty Core Bit',
  'DMI-BIT-HD',
  'https://dmitools.com/collections/core-bits/products/heavy-duty-core-bit',
  'https://dmitools.com/cdn/shop/products/heavy-duty-bit.jpg',
  'core-bits',
  'Built for the toughest jobs. Reinforced barrel and premium segments for extreme durability.',
  65000,
  true
);

-- ============================================================================
-- ACCESSORIES (5 products)
-- ============================================================================

INSERT INTO products (id, name, sku, shopify_url, image_url, category, description, price_cents, active) VALUES
(
  'acc-extension',
  'Core Drill Bit Extension',
  'DMI-ACC-EXT',
  'https://dmitools.com/collections/accessories/products/core-drill-bit-extension',
  'https://dmitools.com/cdn/shop/products/extension-rod.jpg',
  'accessories',
  'Extend your reach for deep coring applications. Multiple lengths available.',
  11340,
  true
),
(
  'acc-slurry-ring',
  'DMI Slurry Control Ring',
  'DMI-ACC-SLR',
  'https://dmitools.com/collections/accessories/products/slurry-control-ring',
  'https://dmitools.com/cdn/shop/products/slurry-ring.jpg',
  'accessories',
  'Keep your job site clean. Contains slurry during wet coring operations.',
  16200,
  true
),
(
  'acc-sharpening',
  'Diamond Sharpening Block',
  'DMI-ACC-SHP',
  'https://dmitools.com/collections/accessories/products/diamond-sharpening-block',
  'https://dmitools.com/cdn/shop/products/sharpening-block.jpg',
  'accessories',
  'Restore cutting performance to dull blades. Essential for blade maintenance.',
  12000,
  true
),
(
  'acc-reducer',
  'Thread Reducer Adapter',
  'DMI-ACC-RED',
  'https://dmitools.com/collections/accessories/products/thread-reducer-adapter',
  'https://dmitools.com/cdn/shop/products/reducer-adapter.jpg',
  'accessories',
  'Convert between arbor sizes. Compatible with most saw models.',
  3150,
  true
),
(
  'acc-anchor',
  'Anchor Setting Tool',
  'DMI-ACC-ANC',
  'https://dmitools.com/collections/accessories/products/anchor-setting-tool',
  'https://dmitools.com/cdn/shop/products/anchor-tool.jpg',
  'accessories',
  'Professional-grade anchor setting tool. Ensures proper installation every time.',
  756,
  true
);

-- ============================================================================
-- EQUIPMENT (3 products)
-- ============================================================================

INSERT INTO products (id, name, sku, shopify_url, image_url, category, description, price_cents, active) VALUES
(
  'eq-wolverine',
  'Wolverine Hydraulic Handsaw',
  'DMI-EQ-WLV',
  'https://dmitools.com/collections/equipment/products/wolverine-hydraulic-handsaw',
  'https://dmitools.com/cdn/shop/products/wolverine-handsaw.jpg',
  'equipment',
  'Powerful hydraulic handsaw for deep cutting applications. Industry-leading power-to-weight ratio.',
  250000,
  true
),
(
  'eq-balloon-light',
  'LED Construction Balloon Light',
  'DMI-EQ-LED',
  'https://dmitools.com/collections/equipment/products/led-balloon-light',
  'https://dmitools.com/cdn/shop/products/balloon-light.jpg',
  'equipment',
  'Illuminate large work areas with 360-degree coverage. Portable and durable for job sites.',
  85000,
  true
),
(
  'eq-water-tank',
  'Pressurized Water Tank',
  'DMI-EQ-WTR',
  'https://dmitools.com/collections/equipment/products/pressurized-water-tank',
  'https://dmitools.com/cdn/shop/products/water-tank.jpg',
  'equipment',
  'Portable water supply for wet cutting. Maintains consistent pressure throughout the job.',
  45000,
  true
);

-- ============================================================================
-- SAMPLE LOADOUT FOR ASMR CUT
-- ============================================================================

-- Ensure the loadouts table has an entry for asmr_cut with product references
INSERT INTO loadouts (id, game_id, products, promo_banner, feature_flags)
VALUES (
  gen_random_uuid(),
  'asmr_cut',
  '[
    {"product_id": "blade-standard", "tier": 1, "game_cost": 0, "stats": {"cutting_speed": 1.0, "precision": 1.0, "coin_bonus": 1.0}, "game_effect": "Basic blade. Gets the job done."},
    {"product_id": "blade-segmented", "tier": 2, "game_cost": 500, "stats": {"cutting_speed": 1.2, "precision": 1.15, "coin_bonus": 1.1}, "game_effect": "20% faster cuts!"},
    {"product_id": "blade-turbo", "tier": 3, "game_cost": 2000, "stats": {"cutting_speed": 1.5, "precision": 1.2, "coin_bonus": 1.2}, "game_effect": "50% faster cuts! Slices through rebar."},
    {"product_id": "blade-continuous", "tier": 3, "game_cost": 2500, "stats": {"cutting_speed": 1.15, "precision": 1.5, "coin_bonus": 1.1}, "game_effect": "Precision master. Perfect slices every time."},
    {"product_id": "blade-pro-series", "tier": 4, "game_cost": 5000, "stats": {"cutting_speed": 1.6, "precision": 1.4, "coin_bonus": 1.5}, "game_effect": "Contractor-grade. +50% coins!"},
    {"product_id": "blade-master", "tier": 5, "game_cost": 10000, "stats": {"cutting_speed": 2.0, "precision": 1.6, "coin_bonus": 2.0}, "game_effect": "Legendary blade. Cuts through anything."}
  ]'::jsonb,
  '{"enabled": true, "title": "Love that blade?", "subtitle": "Get the real thing at DMI Tools", "cta_text": "Shop DMI", "cta_url": "https://dmitools.com/collections/diamond-blades"}'::jsonb,
  '{"tool_drop_enabled": true, "show_prices": false}'::jsonb
)
ON CONFLICT (game_id) DO UPDATE SET
  products = EXCLUDED.products,
  promo_banner = EXCLUDED.promo_banner,
  feature_flags = EXCLUDED.feature_flags;

-- Verify seed data
SELECT
  category,
  COUNT(*) as count,
  MIN(price_cents) as min_price,
  MAX(price_cents) as max_price
FROM products
GROUP BY category
ORDER BY category;
