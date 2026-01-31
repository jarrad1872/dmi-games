# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Overview

Premium HTML5 arcade for DMI Tools Corp. Features 6 reference-quality games with integrated product marketing via the Tool Drop system. Uses a hybrid architecture: TypeScript development with single-file HTML deployment.

## Architecture

```
/apps
  /arcade              # Vite SPA - game portal + routes
  /factory             # Next.js - admin dashboard for loadouts
/packages
  /game-sdk            # Shared TS: loadout, promo engine, Tool Drop UI
/reference
  /{game_name}/        # Clone Pack per game (sources, frames, specs)
/games                 # Built games (single HTML each)
/docs                  # PRD, TASKS, PROGRESS_LOG, CHECKPOINT, DECISIONS
```

## Commands

```bash
pnpm dev              # Start arcade dev server
pnpm dev:factory      # Start factory admin dev server
pnpm build            # Build all packages
pnpm build:games      # Compile games to single-file HTML

# Legacy (for old workflow)
pnpm legacy:dev       # Old Phaser dev server
pnpm legacy:build     # Old game validation
```

## Development Workflow

1. **Reference First**: Before building a game, gather reference frames in `reference/{game}/frames/`
2. **Clone Spec**: Define mechanics and DMI integration in `clone_spec.md`
3. **Build Game**: Implement in TypeScript using game-sdk
4. **Quality Gate**: Compare against reference frames (90% match required)
5. **Deploy**: Build to single HTML, auto-deploys to games.dmitools.com

## Game SDK Usage

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

// At milestone
showToolDrop(loadout.products[0]);

// Analytics
track('level_complete', { level: 5, score: 1000 });
```

## Brand Requirements

### Colors
- **Primary**: Red #a61c00, Black #000000, White #ffffff, Blue #0033A0
- **Secondary**: Light Gray #efefef, Middle Gray #b7b7b7, Dark Gray #666666

### Typography
- **Titles**: Roboto Slab
- **Body**: Roboto

### Tone
Funny, edgy, contractor-forward.

## Quality Gates

Every game must:
1. Hit 90% match vs reference frames
2. Run at 60fps on mid-tier mobile
3. Include natural DMI product integration
4. Support Tool Drop promotional system
5. Build to < 2MB single HTML file

## Session Management

Before starting work:
1. Read `docs/CHECKPOINT.md` for current state
2. Check `docs/TASKS.md` for next actions
3. Review relevant `reference/{game}/` materials

After completing work:
1. Update `docs/CHECKPOINT.md` with current state
2. Mark completed items in `docs/TASKS.md`
3. Append to `docs/PROGRESS_LOG.md`
4. Log decisions in `docs/DECISIONS.md`

## Game Roster

| Game | Reference | Status |
|------|-----------|--------|
| ASMR CUT | ASMR Slicing | Reference gathering |
| HEAT RUNNER | Subway Surfers | Pending |
| IDLE DRILL RIG | Idle Miner Tycoon | Pending |
| PRECISION DEMO | Teardown | Pending |
| ZEN JOB SIM | PowerWash Simulator | Pending |
| RHYTHM CUT | Beat Saber | Pending |

## Supabase Schema

```sql
-- Products (synced from Shopify)
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  shopify_url TEXT NOT NULL,
  image_url TEXT,
  category TEXT
);

-- Game loadouts
CREATE TABLE loadouts (
  id UUID PRIMARY KEY,
  game_id TEXT NOT NULL UNIQUE,
  products JSONB DEFAULT '[]',
  promo_banner JSONB,
  feature_flags JSONB DEFAULT '{}'
);

-- Analytics events
CREATE TABLE events (
  id UUID PRIMARY KEY,
  game_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Game catalog
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  status TEXT DEFAULT 'draft'
);
```

## Deployment

Push to `main` auto-deploys to games.dmitools.com via Vercel.

## Phase Tracking

Current: **Phase 0 - Foundation**

See `docs/TASKS.md` for detailed phase breakdown.
