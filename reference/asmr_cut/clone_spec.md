# ASMR CUT - Clone Specification

## Overview
**Reference**: ASMR Slicing / Soap Cutting Simulator
**Genre**: Casual / Satisfying / ASMR
**Session Length**: 2-5 minutes
**Difficulty Curve**: Very easy start, gradual complexity with harder materials

---

## Mechanics

### Primary Mechanic
**Input**: Touch and drag (swipe)
**Action**: Slice through objects along finger path
**Feedback**: Trail effect, particle burst, satisfying sound, object splits apart

### Secondary Mechanics
1. **Material Resistance**: Different objects require more/fewer swipes
2. **Hidden Hazards**: Rebar in concrete blocks damages blade
3. **Combo Slicing**: Multiple clean cuts = bonus multiplier

---

## Game Objects

### Player/Tool
- **Appearance**: Diamond cutting blade (DMI branded)
- **States**: Ready, Cutting, Damaged, Upgraded
- **Upgrades**: Standard → Segmented → Turbo → Premium Diamond

### Targets/Obstacles
- **Types**:
  - Soft: Soap, kinetic sand, foam
  - Medium: Rubber, wood, plastic
  - Hard: Concrete, brick, stone (DMI territory)
- **Behaviors**: Static, waiting to be sliced
- **Spawn Rules**: Progress-based unlocks

### Collectibles
- **Coins**: Earned per slice, used for upgrades
- **Stars**: 1-3 per object based on clean cuts
- **Blade Shards**: Rare drops for special unlocks

---

## Progression

### Level Structure
- **Level 1-5**: Soft materials, tutorial, one swipe each
- **Level 6-15**: Medium materials, multiple swipes needed
- **Level 16+**: Hard materials, hidden hazards, blade durability matters

### Unlock System
- **New Objects**: Every 3 levels
- **Blade Upgrades**: Coins in shop
- **Special Blades**: Blade shard collection

---

## DMI Integration

### Products Featured
| Product | Role in Game | Unlock Condition |
|---------|--------------|------------------|
| Standard Blade | Starter tool | Default |
| Segmented Blade | Faster cuts | Level 5 / 500 coins |
| Turbo Blade | Hardest materials | Level 15 / 2000 coins |
| Core Bit | Special drill mode | Level 25 / Collection |

### Tool Drop Config
- **Trigger**: After level 5, then every 10 levels
- **Product**: Contextual - blade if just upgraded, core bit if drilling
- **Context**: "Love that blade? Get the real thing."

---

## Technical Specs

### Target Performance
- **FPS**: 60
- **File Size**: < 2MB
- **Load Time**: < 3s

### Assets Needed
- **Sprites**: Blade, 15+ objects, particles
- **Audio**: Slice sounds, upgrade jingle, coin collect
- **Fonts**: Roboto, Roboto Slab

### Physics
- **Gravity**: 500 (for falling pieces)
- **Collision**: Simple AABB for pieces
- **Particles**: Spray on cut, burst on completion

---

## Frame-by-Frame Quality Targets

| Frame | Element | Target |
|-------|---------|--------|
| frame_001 | Object grid | Clean, inviting layout |
| frame_002 | Slice start | Blade appears on touch |
| frame_003 | Mid-slice | Trail follows finger exactly |
| frame_004 | Slice complete | Satisfying separation |
| frame_005 | Particles | Match reference explosion |
| frame_006 | Score popup | Clear, celebratory |
| frame_007 | Blade shop | DMI branding visible |
