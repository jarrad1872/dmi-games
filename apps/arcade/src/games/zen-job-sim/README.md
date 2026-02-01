# ZEN JOB SIM

A satisfying PowerWash Simulator-inspired cleaning game for the DMI Games Arcade.

## Overview

**Genre**: Zen / Simulation / Satisfying
**Session Length**: 3-10 minutes per job
**Platform**: Web (Canvas-based)

## Core Mechanics

### Touch & Drag Cleaning
- Touch/click and drag to spray water
- Dirt layers fade smoothly on contact
- Satisfying particle effects
- Visual progress feedback

### Dirt System
- **Light Dirt**: Quick to clean, basic washer works
- **Medium Dirt**: Requires more time/better tools
- **Hard Dirt**: Needs special turbo nozzle
- Each dirt patch has health that depletes under spray

### Progression
- **5 Jobs** included:
  1. Dirty Shovel (small items)
  2. Muddy Wheelbarrow (small items)
  3. Dusty Toolbox (small items)
  4. Grimy Concrete Mixer (vehicles)
  5. Muddy Excavator Bucket (vehicles)

### Star Rating System
- 3 stars: Complete within target time
- 2 stars: Complete within 1.5x target time
- 1 star: Job complete (any time)

### Tools & Upgrades
- **Basic Washer** (starting tool)
  - Power: 2
  - Range: 30px
  - Can clean: light, medium

- **Turbo Nozzle** (unlocks at job 3)
  - Power: 4
  - Range: 25px
  - Can clean: all dirt types
  - Cost: 200 coins

- **Surface Cleaner** (unlocks at job 5)
  - Power: 3
  - Range: 50px
  - Can clean: light, medium
  - Cost: 300 coins

## DMI Integration

### Tool Drop System
- Triggers when unlocking new tools
- Shows DMI product information
- Products featured:
  - PowerWash 2000 (Basic Washer)
  - TurboClean Pro (Turbo Nozzle)
  - SurfaceBlast 3000 (Surface Cleaner)

### Game SDK Features
- Progress tracking via Supabase
- Promo engine integration
- Analytics via trackGameStart()

## Visual Design

### Aesthetic
- Clean, zen, calming colors
- Smooth animations (60 FPS target)
- Satisfying before/after reveals
- Minimal UI, focus on gameplay

### Color Palette
- Backgrounds: Soft pastels (blues, greens, beiges)
- Dirt: Browns with alpha transparency
- Water: Light blue particles
- UI: Clean grays and greens

## Technical Details

### Architecture
- **Engine**: Custom canvas-based
- **Scenes**: Menu, Job
- **Systems**: Input, Progression
- **Data-driven**: Jobs and tools defined in data files

### Performance Targets
- 60 FPS gameplay
- < 2MB bundle size
- < 3s load time

### Input
- Touch-optimized (mobile-first)
- Mouse support (desktop)
- Drag to spray mechanic

## File Structure

```
zen-job-sim/
├── Game.ts                 # Main game loop & scene manager
├── index.ts                # Public exports
├── data/
│   ├── jobs.ts            # Job definitions
│   └── tools.ts           # Tool definitions
├── scenes/
│   ├── Scene.ts           # Base scene class
│   ├── MenuScene.ts       # Job selection
│   └── JobScene.ts        # Cleaning gameplay
└── systems/
    ├── InputHandler.ts    # Touch/mouse input
    └── ProgressionSystem.ts # Save/load, unlocks
```

## Future Enhancements

- More job sites (10+ jobs)
- Full job sites category
- Sound effects (spray, completion)
- Music (calm, zen background)
- Achievements system
- Leaderboards
- Custom skins for tools
- Timed challenges

## Development

### Run Locally
```bash
cd apps/arcade
pnpm dev
```

### Build
```bash
pnpm build
```

### Change Active Game
Edit `apps/arcade/src/main.ts` and set:
```typescript
const ACTIVE_GAME = 'zen-job-sim';
```

## Credits

**Inspired by**: PowerWash Simulator
**Built for**: DMI Games Arcade
**Game SDK**: @dmi-games/game-sdk
