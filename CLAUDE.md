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

## MANDATORY: DMI Integration Checklist

**CRITICAL**: Every game MUST integrate DMI Tools branding. This is a marketing platform, not a generic game site. Before marking any game complete, verify ALL items:

### Branding (Required)
- [ ] Title screen shows "by DMI TOOLS" or DMI branding
- [ ] DMI red (#a61c00) used as primary accent color
- [ ] dmitools.com link visible on menu/title screen
- [ ] Contractor-forward tone (edgy, professional, trades-focused)
- [ ] NO generic themes (no random fruits, animals, etc. unless spec explicitly requires)

### Tool Drop (Required)
- [ ] showToolDrop() called at milestones (level 5, then every 10 levels)
- [ ] Fallback products defined for offline mode
- [ ] Links point to dmitools.com product pages
- [ ] "Love that blade? Get the real thing." or similar CTA

### In-Game Products (Required)
- [ ] Upgrades/tools named after real DMI products
- [ ] DMI product categories featured (blades, core bits, etc.)
- [ ] Shop/upgrade items marked as "DMI OFFICIAL" where applicable

### Game Theme Connection (Required)
Each game must connect to DMI's concrete cutting business:
- ASMR CUT: Diamond blades cutting through construction materials
- HEAT RUNNER: Construction worker with safety gear, job site obstacles
- IDLE DRILL RIG: Core drilling equipment and drill bits
- PRECISION DEMO: Demolition with DMI cutting tools
- ZEN JOB SIM: Job site cleaning with DMI equipment
- RHYTHM CUT: Slicing beats with DMI blades

### What NOT To Do
- NO generic ASMR content (fruits, random objects)
- NO unbranded tools or upgrades
- NO missing Tool Drop integration
- NO games that could belong to any random company
- NO skipping the clone_spec.md DMI Integration section

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

| Game | Reference | Status | DMI Integration |
|------|-----------|--------|-----------------|
| ASMR CUT | ASMR Slicing | **Complete** | Diamond blades, concrete/brick, rebar hazard |
| HEAT RUNNER | Subway Surfers | Core done | Safety gear, job site theme |
| IDLE DRILL RIG | Idle Miner Tycoon | Pending | Core bits, drill upgrades |
| PRECISION DEMO | Teardown | Pending | Demolition tools |
| ZEN JOB SIM | PowerWash Simulator | Pending | Job site cleaning |
| RHYTHM CUT | Beat Saber | Pending | DMI blade themes |

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

Current: **Phase 5 - HEAT RUNNER** (ASMR CUT complete)

See `docs/TASKS.md` for detailed phase breakdown.
