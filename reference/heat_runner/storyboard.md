# HEAT RUNNER - Storyboard

## Reference Game
**Name**: Subway Surfers
**Platform**: Mobile
**Why This Reference**: Best-in-class endless runner, intuitive controls, satisfying progression

---

## Core Loop

### 1. Entry Point
**Frame**: frame_001.png
**Description**: Title screen with character on job site
**Key Elements**:
- Run button
- Character customization
- Daily missions

### 2. Main Gameplay
**Frame**: frame_002.png - frame_005.png
**Description**: Endless running through construction zones
**Key Elements**:
- Three lanes
- Obstacles (barriers, equipment)
- Collectibles (coins, power-ups)
- DMI gear pickups

### 3. Reward/Feedback
**Frame**: frame_006.png
**Description**: Game over with score recap
**Key Elements**:
- Distance traveled
- Coins collected
- High score comparison
- Continue option

### 4. Progression
**Frame**: frame_007.png
**Description**: Unlock new characters and gear
**Key Elements**:
- Character roster
- Equipment upgrades
- Milestone rewards

---

## DMI Integration Points

### Natural Product Placement
- DMI hard hat as starting gear
- Safety glasses power-up
- Tool belt upgrade increases coin magnet

### Tool Drop Triggers
- After first death (tutorial complete)
- Every 1000m milestone
- On gear unlock

### Upgrade System
- Basic gear → DMI Safety Kit → Full DMI Loadout

---

## Feel Targets

### Visual
- Fast, smooth scrolling
- Vibrant construction site colors
- Dynamic obstacle patterns
- Speed lines during power-ups

### Audio
- Upbeat running music
- Satisfying coin collection
- Warning sounds for obstacles

### Haptic
- Light tap on lane change
- Strong buzz on collision

---

## Quality Checklist (90% Gate)

- [ ] Swipe controls feel snappy
- [ ] 60fps during full speed
- [ ] Obstacle timing fair
- [ ] Power-ups feel impactful
- [ ] Death feels earned, not cheap
- [ ] Continue prompt not too aggressive
- [ ] DMI gear visible and natural
- [ ] Tool Drop timing doesn't interrupt flow
