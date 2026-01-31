# PRECISION DEMO - Clone Specification

## Overview
**Reference**: Teardown (simplified for mobile)
**Genre**: Physics Puzzle / Destruction
**Session Length**: 2-5 minutes per level
**Difficulty Curve**: Simple structures → complex multi-stage demos

---

## Mechanics

### Primary Mechanic
**Input**: Tap to place tool, swipe to activate
**Action**: Tool damages structure, physics react
**Feedback**: Particles, structure deformation, collapse

### Secondary Mechanics
1. **Weak Points**: Identify structural vulnerabilities
2. **Chain Reactions**: Strategic tool placement
3. **Efficiency Scoring**: Fewer tools = higher score

---

## Game Objects

### Player/Tool
- **Appearance**: Various DMI tools
- **States**: Selected, Placed, Active, Exhausted
- **Upgrades**: More powerful versions

### Targets/Obstacles
- **Types**:
  - Wood structures (easy)
  - Brick buildings (medium)
  - Concrete/steel (hard)
- **Behaviors**: Physics-based reaction
- **Spawn Rules**: Level-based

### Collectibles
- **Stars**: 1-3 based on efficiency
- **Tool Points**: Currency for upgrades
- **Blueprints**: Special tool unlocks

---

## Progression

### Level Structure
- **Level 1-10**: Single-structure demos
- **Level 11-20**: Multi-structure chains
- **Level 21+**: Precision challenges

### Unlock System
- **Tools**: Star collection
- **Levels**: Previous level completion
- **Modes**: Challenge unlock at 3-star

---

## DMI Integration

### Products Featured
| Product | Role in Game | Unlock Condition |
|---------|--------------|------------------|
| Demo Hammer | Starting tool | Default |
| Core Drill | Precision holes | Level 5 |
| Diamond Blade | Clean cuts | Level 10 |
| Breaker | Heavy demolition | Level 15 |

### Tool Drop Config
- **Trigger**: 3-star levels, tool unlocks
- **Product**: Featured tool from level
- **Context**: "Master demolition. Get the real tools."

---

## Technical Specs

### Target Performance
- **FPS**: 60 (30 minimum during collapse)
- **File Size**: < 2MB
- **Load Time**: < 3s

### Assets Needed
- **Sprites**: Buildings, tools, debris
- **Audio**: Destruction sounds, tool sounds
- **Fonts**: Roboto, Roboto Slab

### Physics
- **Gravity**: 800
- **Collision**: Box2D-style joints
- **Particles**: Dust, sparks, debris

---

## Frame-by-Frame Quality Targets

| Frame | Element | Target |
|-------|---------|--------|
| frame_001 | Level overview | Clear target zones |
| frame_002 | Tool selection | Clear options |
| frame_003 | Tool placement | Intuitive interface |
| frame_004 | Impact moment | Satisfying hit |
| frame_005 | Chain reaction | Physics visible |
| frame_006 | Collapse | Smooth animation |
| frame_007 | Score screen | Clear efficiency |
