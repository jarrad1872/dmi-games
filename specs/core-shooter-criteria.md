# Core Shooter — Kill / Ship Criteria

**Created:** 2026-02-03
**Decision Date:** Friday 2026-02-07 EOD

---

## Kill Conditions

**Stop work and move to next concept if ANY of these are true Friday morning:**

- [ ] Game doesn't load on mobile browser
- [ ] Core mechanic (shooting) is fundamentally broken
- [ ] Player cannot complete 30 seconds of gameplay
- [ ] Mobile touch controls are unusable

---

## Ship Conditions

**Push to production if ALL of these are true:**

- [ ] Game loads on mobile Chrome/Safari
- [ ] Player can move left/right
- [ ] Player can jump
- [ ] Player can shoot (core bits visible)
- [ ] At least one enemy type that can kill player
- [ ] Player death → game over state
- [ ] Score displays and increments
- [ ] DMI branding visible (logo, red #A62022)
- [ ] "Made in USA" badge somewhere on screen
- [ ] End screen has dmitools.com link
- [ ] CTA button is clickable

---

## Learning Goals

**What we want to know from this build:**

1. **Time accuracy:** How long did each session actually take vs. planned 2h?
2. **Claude Code quality:** With detailed PRD + sensory checklists, does output meet spec?
3. **Feel emergence:** Did "punchy shooting" emerge from spec, or need iteration?
4. **Blocker identification:** What slowed us down that we didn't anticipate?
5. **Human validation:** What did playtesters notice that we missed?

---

## Quality Bar (NOT Required for Ship)

These are nice-to-have, not blockers:

- [ ] Shooting feels "punchy" (screen shake, impact effects)
- [ ] Power-ups implemented
- [ ] Sound effects
- [ ] Multiple enemy types
- [ ] Boss fight
- [ ] High score persistence
- [ ] Particle effects on death

**Don't let perfection block shipping.**

---

## Playtest Requirements

- **Minimum:** 2 people (Jarrad + one other)
- **Method:** Send Vercel preview URL Wednesday evening
- **Feedback needed by:** Thursday EOD
- **Questions to answer:**
  1. Did you understand what to do immediately?
  2. Did shooting feel satisfying?
  3. Did you want to try again after dying?
  4. Did you notice the DMI branding?
  5. Would you show this to a coworker?

---

## Decision Framework

**Friday EOD decision tree:**

```
Does it meet all Ship Conditions?
├── NO → Kill or fix critical bugs only (1 more day max)
└── YES → Ship to production
         │
         Does it meet Learning Goals?
         ├── NO → Post-mortem focuses on process gaps
         └── YES → Post-mortem focuses on game quality
```

**The goal is learning, not perfection.**
