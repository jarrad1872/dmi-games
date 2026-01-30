# CLAUDE.md - DMI Games Development Guide

This repo contains arcade games for DMI Tools Corp. You're helping build and modify games using Phaser 3.

## Project Structure

```
dmi-games/
├── templates/           # Base game templates (start here for new games)
│   ├── runner/         # Endless runner template
│   ├── match3/         # Match-3 puzzle template
│   └── flappy/         # Flappy-style template
├── games/              # Finished/customized games (deployed to games.dmitools.com)
│   ├── core-drop/      # Core drilling game
│   ├── drill-tycoon/   # Idle clicker
│   └── ...
├── scripts/            # Dev tools
├── public/             # Shared assets
└── index.html          # Arcade portal (games.dmitools.com homepage)
```

## Development Workflow

### 1. Start Dev Server
```bash
npm run dev
# Opens http://localhost:3000
```

### 2. Create New Game
```bash
# Copy a template
cp -r templates/runner games/my-new-game

# Edit games/my-new-game/index.html
```

### 3. Test Locally
- Visit http://localhost:3000/games/my-new-game/
- Changes auto-reload

### 4. Deploy
```bash
git add .
git commit -m "Add my-new-game"
git push
# Auto-deploys to games.dmitools.com via Vercel
```

## Game Requirements

### All games MUST have:
- **DMI branding** - Red (#A62022), logo, "Made in USA"
- **Mobile-first** - Touch controls, responsive canvas
- **Single HTML file** - Self-contained, no external dependencies except Phaser CDN
- **Promo integration** - CTA button linking to dmitools.com products
- **Score system** - Leaderboard-ready (localStorage for now)

### Standard Structure (per game)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Game Name - DMI Tools</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
</head>
<body>
  <div id="game-container"></div>
  <script>
    // Game CONFIG at top for easy tweaking
    const CONFIG = {
      difficulty: 1,
      playerSpeed: 200,
      spawnRate: 2000,
      // ... all tunable values here
    };
    
    // Phaser game code...
  </script>
</body>
</html>
```

## DMI Brand Guidelines

### Colors
- **Primary Red:** #A62022
- **Black:** #222222
- **White:** #FFFFFF
- **Accent Gold:** #FFD700

### Products to Feature
- Core Bits (drilling)
- Diamond Blades (cutting)
- Slurry Rings (accessories)
- Drill Motors (equipment)

### CTA Examples
- "Shop Core Bits → dmitools.com"
- "Use code GAME15 for 15% off!"

## Common Tasks

### "Make it faster/harder"
Modify the CONFIG object at the top of the game file:
```javascript
const CONFIG = {
  playerSpeed: 300,    // was 200
  spawnRate: 1500,     // was 2000 (lower = more frequent)
  gravity: 1000,       // was 800
};
```

### "Add a power-up"
1. Create texture in preload()
2. Add to spawn system
3. Handle collision with player
4. Apply effect (speed boost, invincibility, etc.)

### "Change the theme"
1. Update color constants
2. Modify preload() textures
3. Update background in create()

### "Add mobile controls"
```javascript
// Touch anywhere to jump
this.input.on('pointerdown', () => this.jump());

// Swipe detection
let startX, startY;
this.input.on('pointerdown', (p) => { startX = p.x; startY = p.y; });
this.input.on('pointerup', (p) => {
  const dx = p.x - startX;
  const dy = p.y - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    dx > 0 ? this.moveRight() : this.moveLeft();
  } else {
    dy < 0 ? this.jump() : this.duck();
  }
});
```

## Testing Checklist

Before pushing a game:
- [ ] Works on mobile (test with Chrome DevTools device mode)
- [ ] Touch controls work
- [ ] Score saves to localStorage
- [ ] DMI branding visible
- [ ] CTA button works
- [ ] No console errors
- [ ] Loads in < 3 seconds

## Deployment

- **games.dmitools.com** - Auto-deploys from `main` branch via Vercel
- **factory.dmitools.com** - Pulls templates for the game builder UI

Push to main = live in ~60 seconds.

## Resources

- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [DMI Tools Website](https://dmitools.com)
