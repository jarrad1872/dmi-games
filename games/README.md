# Built Games

This folder contains the final built single-HTML games.

Each game compiles to a standalone `index.html` that can be deployed anywhere.

## Games

| Game | Status | Description |
|------|--------|-------------|
| asmr_cut | Pending | ASMR Slicing clone |
| heat_runner | Pending | Subway Surfers clone |
| idle_drill_rig | Pending | Idle Miner clone |
| precision_demo | Pending | Teardown clone |
| zen_job_sim | Pending | PowerWash Simulator clone |
| rhythm_cut | Pending | Beat Saber clone |

## Build

```bash
pnpm build:games
```

This will compile TypeScript sources from `apps/arcade/src/games/` into single-file HTML games.
