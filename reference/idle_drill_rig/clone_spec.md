# IDLE DRILL RIG - Clone Specification

## Overview
**Reference**: Idle Miner Tycoon
**Genre**: Idle/Incremental
**Session Length**: 30s - 10min (check-ins)
**Difficulty Curve**: Exponential growth, prestige resets

---

## Mechanics

### Primary Mechanic
**Input**: Tap to drill (early), passive (late)
**Action**: Drill depth increases, cores collected
**Feedback**: Counter animations, particle effects

### Secondary Mechanics
1. **Automation**: Buy managers to auto-drill
2. **Prestige**: Reset for permanent multipliers
3. **Core Collection**: Rare samples = big bonuses

---

## Game Objects

### Player/Tool
- **Appearance**: Drill rig with DMI branding
- **States**: Idle, Drilling, Upgrading, Prestige
- **Upgrades**: Drill speed, depth capacity, automation

### Targets/Obstacles
- **Layers**: Topsoil → Rock → Granite → Core
- **Behaviors**: Each layer harder/more valuable
- **Spawn Rules**: Depth-based progression

### Collectibles
- **Cores**: Currency (common, rare, legendary)
- **Gems**: Premium currency
- **Blueprints**: Unlock special bits

---

## Progression

### Level Structure
- **0-100m**: Tutorial, manual tapping
- **100-500m**: First automations
- **500m+**: Prestige becomes worthwhile

### Unlock System
- **Drill Bits**: Core purchases
- **Managers**: Automation unlock
- **Rigs**: Prestige unlocks

---

## DMI Integration

### Products Featured
| Product | Role in Game | Unlock Condition |
|---------|--------------|------------------|
| Standard Core Bit | Starting tool | Default |
| Segmented Bit | 2x speed | 100m depth |
| Turbo Bit | 5x speed | 500m depth |
| Diamond Core | 10x speed | Prestige 1 |

### Tool Drop Config
- **Trigger**: Depth milestones, rare cores
- **Product**: Current best drill bit
- **Context**: "Your rig uses DMI bits. Get yours."

---

## Technical Specs

### Target Performance
- **FPS**: 60
- **File Size**: < 2MB
- **Load Time**: < 3s

### Assets Needed
- **Sprites**: Rig, bits, cores, managers
- **Audio**: Drill sounds, upgrade chimes
- **Fonts**: Roboto, Roboto Slab

### Physics
- **Gravity**: N/A (2D vertical)
- **Collision**: Layer transitions
- **Particles**: Drilling debris

---

## Frame-by-Frame Quality Targets

| Frame | Element | Target |
|-------|---------|--------|
| frame_001 | Rig overview | Clear depth display |
| frame_002 | Drilling animation | Smooth particle effects |
| frame_003 | Core discovery | Exciting moment |
| frame_004 | Upgrade menu | Clear progression |
| frame_005 | Manager screen | Automation visible |
| frame_006 | Prestige screen | Worth understanding |
