# HEAT RUNNER - Clone Specification

## Overview
**Reference**: Subway Surfers
**Genre**: Endless Runner
**Session Length**: 1-3 minutes per run
**Difficulty Curve**: Gradual speed increase, pattern complexity grows

---

## Mechanics

### Primary Mechanic
**Input**: Swipe left/right/up/down
**Action**: Lane change (L/R), Jump (up), Slide (down)
**Feedback**: Instant animation, lane snap, jump arc

### Secondary Mechanics
1. **Magnet**: Pulls coins to player
2. **Jetpack**: Fly above obstacles
3. **Multiplier**: 2x coins for duration

---

## Game Objects

### Player/Tool
- **Appearance**: Construction worker with DMI gear
- **States**: Running, Jumping, Sliding, Crashed
- **Upgrades**: Gear cosmetics, power-up duration

### Targets/Obstacles
- **Types**:
  - Static: Barriers, cones, scaffolding
  - Moving: Forklifts, cranes
  - Gaps: Trenches, holes
- **Behaviors**: Pattern-based placement
- **Spawn Rules**: Speed-based difficulty scaling

### Collectibles
- **Coins**: Currency for upgrades
- **Power-ups**: Magnet, Jetpack, Multiplier
- **Special**: Blueprint pieces for unlocks

---

## Progression

### Level Structure
- **0-500m**: Tutorial, slow speed
- **500-2000m**: Normal patterns
- **2000m+**: High speed, complex combos

### Unlock System
- **Characters**: Coin purchases
- **Gear**: Blueprint collection
- **Power-ups**: Upgrade shop

---

## DMI Integration

### Products Featured
| Product | Role in Game | Unlock Condition |
|---------|--------------|------------------|
| Hard Hat | Starting gear | Default |
| Safety Glasses | Obstacle preview | 500m milestone |
| Tool Belt | Coin magnet boost | 1000 coins |
| Hi-Vis Vest | Extra life | 2000m milestone |

### Tool Drop Config
- **Trigger**: Every 1000m, on death
- **Product**: Gear just used/unlocked
- **Context**: "Your gear saved you! Get it for real."

---

## Technical Specs

### Target Performance
- **FPS**: 60
- **File Size**: < 2MB
- **Load Time**: < 3s

### Assets Needed
- **Sprites**: Character, obstacles, coins, power-ups
- **Audio**: Run sounds, collect, crash, music
- **Fonts**: Roboto, Roboto Slab

### Physics
- **Gravity**: 1200 (quick jumps)
- **Collision**: Lane-based hitboxes
- **Particles**: Coin trail, crash effects

---

## Frame-by-Frame Quality Targets

| Frame | Element | Target |
|-------|---------|--------|
| frame_001 | Title screen | Clear start action |
| frame_002 | Running gameplay | Smooth 60fps |
| frame_003 | Lane change | Instant response |
| frame_004 | Jump over obstacle | Clear arc |
| frame_005 | Power-up active | Visual effect |
| frame_006 | Crash sequence | Not jarring |
| frame_007 | Score screen | Clear stats |
