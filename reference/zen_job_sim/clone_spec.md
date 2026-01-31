# ZEN JOB SIM - Clone Specification

## Overview
**Reference**: PowerWash Simulator
**Genre**: Satisfying / Zen / Simulation
**Session Length**: 3-10 minutes per job
**Difficulty Curve**: Small areas → large complex sites

---

## Mechanics

### Primary Mechanic
**Input**: Touch and drag to spray
**Action**: Clean surface under spray area
**Feedback**: Dirt removal animation, progress bar

### Secondary Mechanics
1. **Tool Switching**: Different nozzles for different dirt
2. **Efficiency Bonus**: Clean in optimal order
3. **Hidden Spots**: Find all dirty areas

---

## Game Objects

### Player/Tool
- **Appearance**: Pressure washer with nozzle
- **States**: Idle, Spraying, Recharging
- **Upgrades**: Pressure, range, nozzle types

### Targets/Obstacles
- **Types**:
  - Light dirt (quick clean)
  - Mud/grime (medium)
  - Rust/stain (hard, needs special nozzle)
- **Behaviors**: Fade on contact with spray
- **Spawn Rules**: Job-based layouts

### Collectibles
- **Stars**: 1-3 based on efficiency
- **Coins**: Payment for job
- **Tool Parts**: Upgrade materials

---

## Progression

### Level Structure
- **Jobs 1-5**: Small items (tools, equipment)
- **Jobs 6-15**: Vehicles and machinery
- **Jobs 16+**: Full job sites

### Unlock System
- **Tools**: Coin purchases
- **Jobs**: Previous job completion
- **Nozzles**: Star collection

---

## DMI Integration

### Products Featured
| Product | Role in Game | Unlock Condition |
|---------|--------------|------------------|
| Basic Washer | Starting tool | Default |
| Turbo Nozzle | Faster cleaning | Job 5 |
| Surface Cleaner | Large areas | Job 10 |
| Pro Unit | Premium power | Job 20 |

### Tool Drop Config
- **Trigger**: Job completion, tool unlock
- **Product**: Featured washer/accessory
- **Context**: "Keep your real job site this clean."

---

## Technical Specs

### Target Performance
- **FPS**: 60
- **File Size**: < 2MB
- **Load Time**: < 3s

### Assets Needed
- **Sprites**: Job sites, tools, dirt layers
- **Audio**: Spray sounds, completion chimes
- **Fonts**: Roboto, Roboto Slab

### Physics
- **Gravity**: N/A
- **Collision**: Spray radius detection
- **Particles**: Water spray, dirt particles

---

## Frame-by-Frame Quality Targets

| Frame | Element | Target |
|-------|---------|--------|
| frame_001 | Dirty job site | Clearly needs cleaning |
| frame_002 | Tool selection | Intuitive options |
| frame_003 | Spray in action | Visible cleaning |
| frame_004 | Progress indicator | Clear percentage |
| frame_005 | Area complete | Satisfying reveal |
| frame_006 | Before/after | Dramatic comparison |
| frame_007 | Payment screen | Rewarding feedback |
