# HEAT RUNNER - Visual Overhaul Spec

## Design Philosophy
Clean, intentional 2D with parallax depth. Not trying to be 3D - owning the 2D aesthetic.
Think: Alto's Adventure meets construction site.

## Color Palette (STRICT)
- Sky gradient: #87CEEB (top) → #FF8C00 (horizon) - sunset construction site
- Road: #2F2F2F with #FFD700 lane markers
- Player: #FF6B00 vest, #FFD700 hard hat, #2F2F2F body
- Obstacles: #4A4A4A (concrete), #8B4513 (wood), #FFD700 (caution tape)
- UI: #FF6B00 primary, #FFFFFF text, #2F2F2F backgrounds

## Parallax Layers (back to front)
1. Sky gradient (static)
2. City skyline silhouettes - dark gray (#1a1a1a) - slow scroll
3. Cranes and scaffolding silhouettes - medium gray (#333) - medium scroll
4. Background buildings - construction site details - faster scroll
5. Road with 3 lanes - main gameplay layer
6. Foreground dust particles - fastest

## Character Design (Simple but distinctive)
- Rounded rectangle body (32x48px)
- Circle head with hard hat (triangle on top)
- Orange vest rectangle overlay
- Simple limbs that animate
- Run: bob up/down, legs alternate
- Jump: arms up, legs tucked
- Slide: flatten horizontally

## Obstacles (Clean geometric shapes)
- Concrete barrier: Rounded rectangle with diagonal stripes
- Scaffold: Rectangle frame with X pattern
- Forklift: Simple vehicle shape with wheels
- Rebar: Bundle of circles
- Wet cement: Puddle with ripple effect

## Juice Effects
- Lane switch: Quick stretch/squash
- Jump: Trail particles
- Coin collect: Burst + screen number popup
- Near miss: Screen edge flash
- Speed increase: Motion blur lines
- Hit: Screen shake + red flash

## Menu Screen
- Full parallax background running
- Character running in place center-screen
- Title with construction stencil font style
- Pulsing "TAP TO PLAY" with glow
- High score displayed
- DMI logo bottom corner

## HUD (Minimal, clean)
- Top left: Pause button (gear icon)
- Top right: Coin count + score
- Bottom: Distance meter as progress bar
- Power-up icons slide in from left when active
