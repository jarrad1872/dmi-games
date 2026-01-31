# DMI Tools Arcade - Product Requirements Document

## Vision
A premium HTML5 arcade that showcases DMI Tools products through addictive, satisfying games. Each game is a marketing vehicle that naturally integrates product discovery without feeling like advertising.

## Target Users
- **Primary**: Contractors, tradespeople browsing on mobile during breaks
- **Secondary**: DIY enthusiasts looking for entertainment
- **Tertiary**: Marketing team using Factory to manage promotions

## Success Metrics
| Metric | Target |
|--------|--------|
| Avg session duration | > 5 min |
| Games per session | > 1.5 |
| Tool Drop click-through | > 3% |
| Mobile 60fps | 100% of games |
| Lighthouse mobile | > 85 |

---

## Core Product Requirements

### Games (6 Total)
Each game must:
1. Hit 90% quality gate vs reference implementation
2. Run at 60fps on mid-tier mobile (Pixel 4a, iPhone SE 2)
3. Include natural DMI product integration
4. Support Tool Drop promotional system
5. Build to single self-contained HTML file

#### Game Roster
| Game | Reference | DMI Integration |
|------|-----------|-----------------|
| ASMR CUT | ASMR Slicing | Upgrade blades, hidden rebar hazard |
| HEAT RUNNER | Subway Surfers | Dodge obstacles with DMI gear |
| IDLE DRILL RIG | Idle Miner Tycoon | Drill upgrades, core sample collection |
| PRECISION DEMO | Teardown | Controlled demolition with DMI tools |
| ZEN JOB SIM | PowerWash Simulator | Clean job sites, unlock tool loadouts |
| RHYTHM CUT | Beat Saber | Slice to beat with DMI blades |

### Factory (Admin Dashboard)
- Manage product catalog (sync from Shopify)
- Create/edit game loadouts (which products appear)
- Configure promotional banners
- View analytics dashboard
- Preview changes before publish

### Arcade Portal
- Responsive grid of game cards
- Search/filter by category
- Play tracking per user session
- Featured game rotation

---

## Technical Requirements

### Build System
- **Dev**: TypeScript + Vite + game-sdk package
- **Prod**: Single HTML file per game (no external deps except CDN)
- **Deploy**: Vercel auto-deploy on push to main

### Game SDK
Core library shared across all games:
```typescript
fetchLoadout(gameId: string): Promise<LoadoutConfig>
initPromoEngine(config: LoadoutConfig): void
showToolDrop(product: Product): void
track(event: string, properties?: Record<string, any>): void
```

### Supabase Backend
- Products table (synced from Shopify)
- Loadouts table (game configs)
- Events table (analytics)
- Games table (catalog)

---

## Brand Requirements

### Colors
- **Primary**: Red #a61c00, Black #000000, White #ffffff, Blue #0033A0
- **Secondary**: Light Gray #efefef, Middle Gray #b7b7b7, Dark Gray #666666

### Typography
- **Titles**: Roboto Slab
- **Body**: Roboto

### Tone
Funny, edgy, contractor-forward. These are games for people who work with their hands.

---

## Constraints
- No user accounts required for gameplay
- Must work offline (with cached loadout fallback)
- Touch-first, keyboard optional
- < 2MB per game (after compression)
- No external tracking (Supabase only)

---

## Out of Scope (v1)
- Multiplayer/leaderboards
- User-generated content
- Native app wrappers
- Achievements system
- Social sharing
