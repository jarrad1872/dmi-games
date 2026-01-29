# Core Drop v2 — Game Specification

**Status:** Ready to build
**Philosophy:** Quality over speed. Done when it's good.

---

## Concept

Catch falling concrete cores before they hit the ground. Authentic core drilling scenarios that pros recognize.

**Genre:** Arcade catch game (like Atari's Avalanche, 1978)
**Platform:** Mobile-first browser game
**Session length:** 30 seconds to 3 minutes
**Goal:** Shareable, addictive, drives traffic to DMI Tools

---

## Core Loop (10-second cycle)

```
DRILL CUTS → CORE FALLS → PLAYER CATCHES → SCORE + FEEDBACK → REPEAT
                ↓
           MISS = DAMAGE → TOO MANY = GAME OVER
```

---

## Authenticity — Real Drilling Scenarios

### Drilling Orientations (Unlockable Levels)

| Level | Orientation | Core Behavior | Difficulty |
|-------|-------------|---------------|------------|
| 1 | Floor drilling | Cores drop straight down | Easy |
| 2 | Wall drilling | Cores eject horizontally | Medium |
| 3 | Angled drilling | Cores arc diagonally | Hard |
| 4 | Overhead drilling | Cores fall toward you fast | Expert |

### Core Properties (Authentic Details)

- **Size:** 2" to 8" diameter — bigger = heavier = faster
- **Rebar content:** Cores with rebar are heavier, fall faster
- **Wetness:** Wet cores are slippery, shorter catch window
- **Length:** Deeper cuts = longer cores = harder to handle

### Environmental Hazards

- **Slurry drips** — Obscures vision temporarily
- **Debris** — Small chunks that aren't worth catching (distraction)
- **Rebar sparks** — Warning flash before heavy core drops

---

## Controls — One-Handed Mobile

**Primary:** Touch/drag to move catcher left-right
**Alternative:** Tilt device (accelerometer) for pros

**Feel:** 
- Zero lag between touch and movement
- Slight momentum (not instant stop)
- Satisfying "weight" to the catcher

---

## Feedback Loops (Dopamine Hits)

### Visual Feedback
- **Catch:** Core flashes gold, particle burst
- **Perfect catch (center):** Bigger burst, screen shake, combo text
- **Near miss:** Core glows warning red
- **Miss:** Screen flash red, catcher damaged visual

### Audio Feedback
- **Catch:** Satisfying "thunk" sound
- **Perfect catch:** Higher-pitched reward chime
- **Combo:** Ascending tones (C-E-G-C)
- **Miss:** Low thud + crack sound
- **Game over:** Dramatic crash

### Haptic Feedback (Mobile)
- **Catch:** Light vibration
- **Perfect:** Medium pulse
- **Miss:** Heavy rumble

---

## Scoring System

### Base Points
- Small core (2-3"): 10 points
- Medium core (4-5"): 25 points
- Large core (6"+): 50 points
- Rebar core: 2x multiplier

### Combo System
- Consecutive catches build combo: x2, x3, x4... x10 max
- Miss resets combo to x1
- Combo timeout: 3 seconds between catches

### Perfect Catch Bonus
- Center of catcher = "PERFECT" = 1.5x points
- Builds toward "Perfect Streak" bonus

---

## Progression System

### Per-Run Progression
- Cores fall faster over time
- Mix of sizes becomes more varied
- Environmental hazards increase

### Meta Progression (Persistent)

**Equipment Unlocks:**
| Item | Unlock Condition | Effect |
|------|------------------|--------|
| Better Gloves | 1,000 pts total | Wider catch zone |
| Core Catcher Net | 5,000 pts | Can catch 2 at once |
| Hard Hat | 10,000 pts | Survive one hit |
| DMI Pro Gloves | 25,000 pts | Perfect zone wider |
| Vacuum System | 50,000 pts | Slows cores briefly |

**Levels/Scenarios:**
| Scenario | Unlock | Description |
|----------|--------|-------------|
| Basement Job | Start | Floor drilling, easy |
| Commercial Build | 5,000 pts | Wall + floor mix |
| Parking Garage | 15,000 pts | Overhead angles |
| High-Rise | 50,000 pts | All orientations, fast |

---

## DMI Product Integration (Natural, Not Spammy)

### In-Game
- Equipment names match real DMI products
- Catcher uses DMI branding subtly
- "Powered by DMI Tools" in corner

### Post-Game
- "Get the real gear" CTA on game over
- Link to specific products based on score level
- Discount code unlock at 100,000 lifetime points

### Share Integration
- "I scored X on Core Drop by DMI Tools!"
- Custom share image with score and DMI branding

---

## Technical Requirements

### Stack
- Single HTML file (easy sharing)
- Vanilla JS (no framework overhead)
- Canvas for smooth 60fps rendering
- Web Audio API for sound
- localStorage for saves

### Performance Targets
- 60fps on mid-tier mobile (2021+ devices)
- First playable in <3 seconds
- Total file size <500KB

### Mobile Optimizations
- Touch events with proper handling
- No zoom on double-tap
- Landscape + portrait support
- iOS safe area handling

---

## Quality Checklist

### Before Launch
- [ ] 60fps smooth on iPhone SE, Pixel 4a
- [ ] No console errors
- [ ] Sound mute works and persists
- [ ] Save/load works perfectly
- [ ] Tutorial teaches mechanics in <30 seconds
- [ ] "One more try" factor — tested with 5 people
- [ ] DMI links work and track source
- [ ] Share creates proper preview image

### Authenticity Check
- [ ] Core drilling pros recognize scenarios
- [ ] Physics feel "right" (not floaty, not too fast)
- [ ] Equipment names match industry terms

---

## Visual Style

### Aesthetic
- Clean, modern, not cluttered
- Concrete grays + DMI orange accents
- Professional but fun

### Key Elements
- Construction site background (parallax layers)
- Core drill visible at top (shows where cores come from)
- Catcher is a gloved hand or catch net
- Score prominently displayed but not blocking action

---

## Sound Design

### Music
- Light industrial ambient (optional, off by default)
- Not annoying on repeat

### SFX Priority
1. Catch sounds (most important)
2. UI feedback
3. Ambient drill noise

---

## Development Phases

### Phase 1: Core Mechanic (Playable Prototype)
- Basic catch mechanic
- One level (floor drilling)
- Score display
- Game over

### Phase 2: Polish
- All visual effects
- Sound system
- Tutorial

### Phase 3: Meta Game
- Equipment unlocks
- Multiple scenarios
- Persistent progress

### Phase 4: Integration
- DMI product links
- Share functionality
- Analytics

---

## Inspiration Games to Study

1. **Avalanche (Atari)** — Original catch mechanic
2. **Fruit Ninja** — Satisfying slice feedback
3. **Crossy Road** — One-tap, endless, shareable
4. **Flappy Bird** — Frustrating but addictive
5. **Subway Surfers** — Endless runner feel, unlocks

---

## Questions for Jarrad

1. Any specific DMI products to feature as unlockables?
2. Real photos of equipment for loading screens?
3. Discount code to unlock at high scores?

---

*Spec complete. Ready to build Phase 1.*
