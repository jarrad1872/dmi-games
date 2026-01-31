# RHYTHM CUT - Clone Specification

## Overview
**Reference**: Beat Saber (mobile adaptation)
**Genre**: Rhythm / Action
**Session Length**: 1-4 minutes per song
**Difficulty Curve**: Easy/Normal/Hard/Expert per song

---

## Mechanics

### Primary Mechanic
**Input**: Swipe in direction shown on note
**Action**: Slice note, score based on timing
**Feedback**: Slice effect, sound, combo increase

### Secondary Mechanics
1. **Directional Slicing**: Swipe direction matters
2. **Combo System**: Consecutive hits = multiplier
3. **Hold Notes**: Long press for sustained notes

---

## Game Objects

### Player/Tool
- **Appearance**: DMI blade (various skins)
- **States**: Ready, Slicing, Miss
- **Upgrades**: Blade appearance, trail effects

### Targets/Obstacles
- **Types**:
  - Standard notes (directional)
  - Hold notes (sustained)
  - Bombs (avoid)
- **Behaviors**: Approach on beat grid
- **Spawn Rules**: Music-synced patterns

### Collectibles
- **Score**: Per-note points
- **Combo**: Multiplier currency
- **Stars**: Song completion rating

---

## Progression

### Level Structure
- **Easy**: Simple patterns, slow
- **Normal**: Mixed patterns, normal speed
- **Hard**: Complex patterns, fast
- **Expert**: Full challenge

### Unlock System
- **Songs**: Star collection
- **Blades**: Score milestones
- **Trails**: Achievement badges

---

## DMI Integration

### Products Featured
| Product | Role in Game | Unlock Condition |
|---------|--------------|------------------|
| Standard Blade | Starting tool | Default |
| Segmented Blade | First unlock | 1000 points |
| Turbo Blade | Premium look | First S-rank |
| Diamond Elite | Ultimate blade | All S-rank |

### Tool Drop Config
- **Trigger**: S-rank, blade unlock, 100-combo
- **Product**: Current blade as real product
- **Context**: "Cut with precision. Get the blade."

---

## Technical Specs

### Target Performance
- **FPS**: 60 (critical for rhythm)
- **File Size**: < 2MB
- **Load Time**: < 3s

### Assets Needed
- **Sprites**: Notes, blades, effects
- **Audio**: Music tracks, slice sounds
- **Fonts**: Roboto, Roboto Slab

### Physics
- **Gravity**: N/A
- **Collision**: Swipe detection
- **Particles**: Slice trails, hit bursts

---

## Frame-by-Frame Quality Targets

| Frame | Element | Target |
|-------|---------|--------|
| frame_001 | Song select | Clear difficulty options |
| frame_002 | Gameplay start | Notes visible on grid |
| frame_003 | Mid-song | Combo visible |
| frame_004 | Perfect hit | Satisfying effect |
| frame_005 | Hold note | Clear visual |
| frame_006 | Song complete | Grade prominent |
| frame_007 | Blade unlock | Exciting reveal |
