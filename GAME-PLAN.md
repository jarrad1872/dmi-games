# DMI Games v2 - Quality Build Plan

**Philosophy:** Quality over speed. If the quality version takes 15 hours vs 5 minutes, take the 15 hours. 10% better is worth 100x more time.

---

## Game 1: Core Drop v2

### Concept
Catch falling concrete cores before they hit the ground and cause damage. Inspired by real core drilling where catching cores is critical.

### Authentic Details (from RESEARCH.md)
- Different drilling angles affect core trajectory
- Overhead drilling = cores fall toward you (hardest)
- Wall drilling = cores eject horizontally
- Floor drilling = cores drop straight down
- Rebar inside cores = heavier, faster fall
- Water/slurry on cores = slippery, harder to catch
- Core sizes vary (2" to 24"+)

### Game Mechanics
- [ ] Multiple drilling scenarios (floor, wall, overhead)
- [ ] Core physics based on size, rebar content, wetness
- [ ] Difficulty progression through job sites
- [ ] Equipment upgrades (better gloves, core catchers, vacuum systems)
- [ ] Realistic sound effects
- [ ] DMI product placements (natural, not spammy)

### Success Criteria
- Actually fun to play for 10+ minutes
- Professionals recognize the authenticity
- Non-professionals learn something about the trade
- DMI branding feels natural, not forced

---

## Game 2: Drill Tycoon v2

### Concept
Idle/clicker game where you build a core drilling business. Start with one rig, grow to a fleet.

### Authentic Details (from RESEARCH.md)
- Bit selection matters (wrong bit = slow, expensive)
- Water management is constant challenge
- Containment setup takes time but prevents callbacks
- Overhead jobs pay more but take 5x longer
- Equipment maintenance is ongoing cost

### Game Mechanics
- [ ] Start with basic rig, upgrade over time
- [ ] Job types with realistic tradeoffs (easy/low pay vs hard/high pay)
- [ ] Employee hiring and training
- [ ] Equipment purchasing (bits, motors, stands, vacuums)
- [ ] Reputation system (quality work = better jobs)
- [ ] Random events (hit rebar, water line issues, callbacks)
- [ ] Prestige system (sell company, start over with bonuses)

### Success Criteria
- Satisfying progression loop
- Realistic business decisions
- Educational about the trade
- Hours of engagement potential

---

## Technical Approach

### Stack
- Single HTML file per game (easy to host/share)
- Vanilla JS (no frameworks, no build step)
- CSS animations for polish
- localStorage for save games

### Quality Checklist (both games)
- [ ] No console errors
- [ ] Works on mobile
- [ ] Save/load works perfectly
- [ ] Sound can be muted
- [ ] Smooth 60fps animations
- [ ] Clear tutorial/onboarding
- [ ] Satisfying feedback loops
- [ ] Tested for 30+ minutes of gameplay

---

## Timeline

**No deadline. Done when it's good.**

Build one game at a time. Get it right before moving to the next.

---

## Notes from Jarrad

*(Add any specific requests, feedback, or ideas here)*

---

*Created: 2026-01-29*
*Status: Planning*
