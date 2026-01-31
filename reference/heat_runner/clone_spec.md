# HEAT RUNNER - Clone Specification

## Game Overview

**Title**: HEAT RUNNER  
**Genre**: Endless Runner (Subway Surfers clone)  
**Theme**: Construction site escape  
**Target**: Mobile-first, touch controls  

## Core Loop

1. Player runs automatically forward
2. Swipe to dodge obstacles (left/right/up/down)
3. Collect coins and power-ups
4. Survive as long as possible
5. Tool Drop appears at score milestones
6. Game over on collision → show score + Tool Drop CTA

## Visual Style

### Color Palette
- **Primary**: DMI Orange (#FF6B00), Safety Yellow (#FFD700)
- **Secondary**: Concrete Gray (#808080), Steel Blue (#4682B4)
- **Accent**: Warning Red (#FF0000), Caution stripes

### Environment
- Construction site with 3 lanes
- Scaffolding, cranes, buildings in background
- Parallax scrolling (3-4 layers)
- Day/night cycle as player progresses

### Character
- Construction worker in orange vest + hard hat
- Run animation: 8 frames
- Jump animation: 6 frames
- Slide animation: 4 frames
- Hit animation: 4 frames

## Controls

### Touch (Primary)
- Swipe Left: Move to left lane
- Swipe Right: Move to right lane
- Swipe Up: Jump
- Swipe Down: Slide/Roll

### Keyboard (Desktop fallback)
- A/D or Left/Right: Lane switch
- W or Space: Jump
- S or Down: Slide

## Game Mechanics

### Lane System
- 3 parallel lanes (left, center, right)
- Instant lane switch (no tween, immediate)
- Can switch lanes mid-jump

### Speed Progression
- Start: 8 units/sec
- Max: 20 units/sec
- Increase: +0.5 units every 500m

### Obstacles

| Type | Lanes | Avoid Method |
|------|-------|-------------|
| Concrete Barrier | 1-2 | Lane switch |
| Low Scaffold | 1-3 | Jump |
| High Barrier | 1-2 | Slide |
| Forklift | 1 | Lane switch |
| Rebar Stack | 2 | Jump or lane |
| Wet Cement | 1 | Any (slows) |

### Collectibles

| Item | Points | Effect |
|------|--------|--------|
| Coin | 1 | Currency |
| Diamond Bit | 50 | Bonus points |
| Mystery Box | - | Random power-up |

### Power-Ups

| Power-Up | Duration | Effect | DMI Equivalent |
|----------|----------|--------|----------------|
| Hard Hat Shield | 1 hit | Crash protection | Safety gear |
| Safety Vest | 10s | 2x Score | Visibility |
| Magnet Belt | 8s | Attract coins | Tool belt |
| Drill Boost | 5s | Speed + invincible | Core drill |
| Jetpack | 8s | Fly above track | - |

## Scoring

- Distance: 1 point per meter
- Coins: 1 point each (+ currency)
- Diamond Bits: 50 points
- Near misses: +10 bonus
- Power-up collection: +25

### Milestones (Tool Drop triggers)
- 500 points: First Tool Drop hint
- 2000 points: Tool Drop with 10% off
- 5000 points: Tool Drop with 15% off
- 10000 points: Tool Drop with 20% off

## Audio

### Music
- Upbeat electronic/industrial loop
- Tempo increases with speed

### SFX
- Lane switch: Whoosh
- Jump: Spring/boing
- Slide: Swoosh
- Coin: Bling
- Power-up: Power chord
- Collision: Crash/thud
- Tool Drop: Celebration jingle

## UI Layout

### HUD (During gameplay)
```
[Pause]                    [Coins: 000]
                           [Score: 00000]



         [GAME AREA]



[Power-up slots x3]        [Distance: 000m]
```

### Game Over Screen
```
     GAME OVER!
     
     Score: 12,450
     Best: 18,200
     Distance: 1,247m
     Coins: 89
     
     [TOOL DROP BANNER]
     "Power through any job"
     [Shop DMI Tools →]
     
     [Play Again]  [Menu]
```

## Technical Specs

- **Engine**: Phaser 3 (or vanilla Canvas)
- **Resolution**: 720x1280 (portrait)
- **FPS Target**: 60fps
- **Build Size**: <500KB (single HTML)
- **Load Time**: <2s on 3G

## Quality Gate Checklist

- [ ] Smooth 60fps on mobile
- [ ] Instant control response (<16ms)
- [ ] 3-lane switching works flawlessly
- [ ] All 5 power-ups functional
- [ ] Tool Drop appears at milestones
- [ ] Score persists to localStorage
- [ ] Audio plays correctly
- [ ] Game over flow complete
- [ ] 90% visual match to reference
