# DMI Games 🎮

Arcade games for DMI Tools Corp. Built with Phaser 3, powered by Claude Code.

**Live at:** [games.dmitools.com](https://games.dmitools.com)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/jarrad1872/dmi-games.git
cd dmi-games

# Install dependencies
npm install

# Start dev server with hot reload
npm run dev
```

Open http://localhost:3000 to play games locally.

## Development with Claude Code

This repo is designed to work with Claude Code CLI (uses your Max subscription):

```bash
cd dmi-games
claude
```

Claude knows how to:
- Create new games from templates
- Modify existing games
- Add features, power-ups, themes
- Fix bugs and optimize performance

See `CLAUDE.md` for detailed instructions.

## Project Structure

```
dmi-games/
├── templates/           # Base game templates
│   ├── runner/         # Endless runner
│   ├── match3/         # Match-3 puzzle
│   └── flappy/         # Flappy-style
├── games/              # Built games (deployed)
│   ├── core-drop/
│   ├── drill-tycoon/
│   └── ...
├── scripts/
│   ├── dev.js          # Dev server with hot reload
│   └── build.js        # Build & validate games
├── index.html          # Arcade portal
├── CLAUDE.md           # Instructions for Claude Code
└── package.json
```

## Workflow

1. **Create** - Copy template or start from scratch
2. **Develop** - Edit with Claude Code, test locally
3. **Push** - `git push` auto-deploys to games.dmitools.com

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Validate games, generate manifest
npm run serve    # Simple static server
```

## Games

| Game | Type | Status |
|------|------|--------|
| Core Fit | Puzzle | ✅ Live |
| Core Drop | Flappy | ✅ Live |
| Drill Tycoon | Idle | ✅ Live |
| Clean Cut | Simulation | ✅ Live |
| Drill Empire | Merge | ✅ Live |
| Core Drop V2 | Flappy | ✅ Live |
| Drill Tycoon V2 | Idle | ✅ Live |

## License

MIT - DMI Tools Corp
