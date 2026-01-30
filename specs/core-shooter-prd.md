# PRD: Core Shooter - Contra Style Platformer

## Overview

**Title:** Core Commando (or "Bit Blaster")
**Genre:** Run-and-gun platformer (Contra/Metal Slug style)
**Platform:** Mobile-first web (Phaser 3)
**Target:** DMI Tools promotional game

## Concept

You're a DMI field tech armed with a modified core drill that shoots diamond core bits as projectiles. Battle through construction sites, warehouses, and job sites, taking down rogue equipment and obstacles. Classic Contra-style gameplay with DMI tools as weapons.

## Core Mechanics

### Movement
- **D-pad/Arrow keys:** Move left/right
- **Up:** Aim upward (8-direction aiming like Contra)
- **Down:** Crouch (smaller hitbox, can shoot low)
- **Jump button:** Jump (tap = short, hold = high)
- **Mobile:** Virtual D-pad left side, A/B buttons right side

### Combat
- **Shoot button:** Fire core bits from drill
- **Fire rate:** 3 shots/second base
- **Ammo:** Unlimited basic cores
- **Spread pattern:** Single shot default, power-ups add spread

### Weapons (Power-ups)
| Weapon | Icon | Effect | DMI Product |
|--------|------|--------|-------------|
| **Standard** | 🔵 | Single core bit | Core Bits |
| **Spread** | 🔴 | 3-way spread shot | Diamond Blades |
| **Laser** | ⚡ | Piercing beam | Drill Motor |
| **Rapid** | 💨 | 2x fire rate | Slurry Ring |
| **Blast** | 💥 | Explosive cores | Segmented Blade |

## Visual Style

### Color Palette
```
DMI Red:     #A62022 (player accent, UI)
DMI Black:   #222222 (outlines, text)
Steel Gray:  #4A4A4A (equipment, platforms)
Concrete:    #8B8682 (backgrounds)
Safety Yellow: #FFD700 (hazards, power-ups)
Diamond Blue: #00D9FF (core bits, effects)
```

### Player Character
- Construction worker with hard hat (red DMI logo)
- Safety vest (yellow/orange)
- Carrying modified core drill as weapon
- Idle: drill at ready, slight bounce
- Run: drill forward, legs pumping
- Jump: tuck position, drill aimed
- Shoot: recoil animation, muzzle flash

### Enemies
1. **Rogue Jackhammer** - Hops toward player, 1 HP
2. **Concrete Mixer Bot** - Rolls, shoots cement globs, 3 HP
3. **Crane Arm** - Swings from above, environmental hazard
4. **Forklift Drone** - Drives at player, 2 HP
5. **BOSS: Mega Excavator** - Multi-phase, shoots rocks + swings bucket

### Environment
- **Level 1:** Construction Site - scaffolding, concrete barriers, cranes
- **Level 2:** Warehouse - shelving, forklifts, conveyor belts
- **Level 3:** Highway Job - traffic cones, barriers, heavy equipment

### Core Bit Projectiles
- Blue diamond cylinder shape
- Trail effect (sparkle particles)
- Impact: small diamond shatter
- Should look like actual core samples

## Game Flow

### Start Screen
```
┌─────────────────────────────────────┐
│                                     │
│         🔴 CORE COMMANDO 🔴         │
│                                     │
│     [DMI Tools Logo - Red]          │
│                                     │
│         ▶ START GAME                │
│         ⚙ OPTIONS                   │
│                                     │
│   "Diamond-Tipped Justice"          │
│                                     │
│   🇺🇸 Made in USA • dmitools.com    │
└─────────────────────────────────────┘
```

### HUD Layout
```
┌─────────────────────────────────────┐
│ ❤❤❤    SCORE: 12,450    💎 x23     │
│ [S]     LEVEL 1-2       LIVES: 3   │
├─────────────────────────────────────┤
│                                     │
│            GAME AREA                │
│                                     │
│    [Player]  >>>●●●   [Enemy]       │
│  ═══════════════════════════════    │
│                                     │
├─────────────────────────────────────┤
│  [D-PAD]              [B] [A]       │
│                       Jump  Shoot   │
└─────────────────────────────────────┘
```

### Scoring
- Basic enemy: 100 pts
- Tough enemy: 250 pts
- Boss: 5000 pts
- Diamond collectible: 50 pts
- No-damage bonus: 1000 pts/level
- Time bonus: remaining seconds x 10

## Technical Specs

### Canvas Size
- 800x600 base (scales to fit)
- 60 FPS target

### Scene Structure
```javascript
// Scenes
- BootScene (load assets)
- MenuScene (title screen)
- GameScene (main gameplay)
- BossScene (boss fights)
- GameOverScene (score, retry, CTA)
```

### Key Config Object
```javascript
const CONFIG = {
  // Player
  playerSpeed: 200,
  jumpForce: -450,
  gravity: 1000,
  
  // Combat
  fireRate: 300, // ms between shots
  bulletSpeed: 500,
  bulletDamage: 1,
  
  // Enemies
  enemySpawnRate: 2000,
  enemySpeed: 100,
  
  // Game
  startLives: 3,
  levelTime: 120, // seconds
  
  // DMI Branding
  primaryColor: 0xA62022,
  accentColor: 0x00D9FF,
};
```

### Controls Mapping
```javascript
// Keyboard
const keys = {
  left: ['LEFT', 'A'],
  right: ['RIGHT', 'D'],
  up: ['UP', 'W'],
  down: ['DOWN', 'S'],
  jump: ['SPACE', 'Z'],
  shoot: ['X', 'CTRL'],
};

// Touch (virtual gamepad)
// Left side: D-pad for movement
// Right side: A (jump), B (shoot)
```

## DMI Integration

### Products Featured
1. **Core Bits** - Main ammo (blue diamond cylinders)
2. **Diamond Blades** - Spread shot power-up
3. **Drill Motors** - Laser weapon (powered by motor)
4. **Slurry Rings** - Rapid fire (smooth operation)

### Promo Code Integration
- Game Over screen: "Get 15% off with code CORECOMMANDO"
- Shop button links to dmitools.com/core-bits

### Branding Requirements
- DMI logo on player's hard hat
- DMI logo in corner of HUD
- "Made in USA" badge on menus
- Red (#A62022) as primary accent throughout
- End screen: "Powered by DMI Tools - dmitools.com"

## Audio (Optional)

- Retro 8-bit style
- Drill whirring when shooting
- Impact sounds for hits
- Upbeat action music loop
- Victory jingle on level complete

## Success Metrics

- Complete Level 1 in single session
- Mobile touch controls feel responsive
- Clear DMI branding visible throughout
- CTA button gets clicks

## Reference Games

- **Contra (NES)** - 8-direction aiming, run-and-gun
- **Metal Slug** - Character style, humor
- **Gunstar Heroes** - Weapon combinations
- **Cuphead** - Boss patterns (simplified)

## MVP Scope

### Phase 1 (Build First)
- [x] Player movement + jump
- [x] 8-direction aiming
- [x] Basic shooting (core bits)
- [x] 2 enemy types
- [x] 1 level (construction site)
- [x] Score system
- [x] Mobile controls
- [x] DMI branding
- [x] Game over + CTA

### Phase 2 (If Time)
- [ ] Power-up weapons
- [ ] Boss fight
- [ ] Level 2
- [ ] Sound effects
- [ ] High score save

---

## For Claude Code

When building this game:

1. Start with player movement and physics
2. Add shooting mechanic with core bit visuals
3. Implement basic enemy that walks toward player
4. Add collision detection (player hit = lose life, bullet hit = kill enemy)
5. Build HUD with score, lives, DMI branding
6. Add mobile touch controls (virtual D-pad + buttons)
7. Create game over screen with CTA to dmitools.com
8. Polish with particle effects on hits

**Key visual requirement:** The core bits should look like actual cylindrical concrete cores with diamond-blue coloring - this is the main DMI product tie-in.

**Branding checklist:**
- [ ] Red #A62022 used as primary accent
- [ ] DMI logo visible on player or HUD
- [ ] "Made in USA" somewhere on screen
- [ ] End screen has dmitools.com link
- [ ] Promo code displayed on game over
