# Core Commando - Session 1: Movement

## Status: ✅ Movement Complete

### What's Built
- ✅ Player character (construction worker with DMI hard hat)
- ✅ Responsive left/right movement with slight momentum
- ✅ Jump with hold-duration arc control
- ✅ Coyote time (90ms grace period after leaving platform)
- ✅ Landing impact effects (dust particles + screen shake)
- ✅ Mobile virtual controls (D-pad + jump button)
- ✅ Multiple platforms for testing

### Controls
**Keyboard:**
- Arrow Keys / A+D = Move left/right
- SPACE / W / Up Arrow = Jump (hold for higher jump)

**Mobile:**
- Left D-pad = Move
- Right button (A) = Jump

### Technical Details
**Movement Feel:**
- Instant start: 2000 acceleration (zero delay)
- Slight deceleration: 1800 drag (2-3 frame slide)
- Jump force: -450 initial velocity
- Jump hold bonus: -150 velocity added while holding (200ms max)
- Coyote time: 90ms grace period for jumps after leaving platform
- Gravity: 1000

**Visual Feedback:**
- Landing creates dust particles
- Landing triggers brief camera shake (100ms, 0.002 intensity)
- Player squashes on landing
- Legs animate when running
- Player tilts slightly in air based on horizontal velocity

### Testing
1. Open `index.html` in browser (serve with local server for best results)
2. Test movement feel:
   - Does it respond instantly? ✓
   - Does it have slight momentum? ✓
   - Can you jump after running off platform? ✓ (coyote time)
   - Does holding jump make you go higher? ✓
3. Test mobile (Chrome DevTools):
   - Toggle device toolbar (Ctrl+Shift+M)
   - Touch controls should appear automatically

### Local Server
```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node
npx http-server -p 8000

# Then open: http://localhost:8000
```

### Next Session
- Session 2: Shooting mechanics
- Session 3: Enemies and collision
- Session 4: Polish and juice
- Session 5: Mobile optimization and CTA

### DMI Branding
- Player hard hat: DMI Red (#A62022)
- Diamond logo on hat: Diamond Blue (#00D9FF)
- Safety vest: Yellow/orange (#FFD700)
