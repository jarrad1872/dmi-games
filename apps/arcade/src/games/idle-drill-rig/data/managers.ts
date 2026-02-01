/**
 * Manager Definitions
 * Automation managers that enable auto-drilling
 */

export interface Manager {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlockDepth: number;
  drillsPerSecond: number;
}

export const MANAGERS: Manager[] = [
  {
    id: 'rookie',
    name: 'Rookie Operator',
    description: 'Auto-drills 1x per second',
    cost: 1000,
    unlockDepth: 100,
    drillsPerSecond: 1,
  },
  {
    id: 'pro',
    name: 'Pro Operator',
    description: 'Auto-drills 5x per second',
    cost: 10000,
    unlockDepth: 300,
    drillsPerSecond: 5,
  },
  {
    id: 'master',
    name: 'Master Operator',
    description: 'Auto-drills 20x per second',
    cost: 100000,
    unlockDepth: 700,
    drillsPerSecond: 20,
  },
];
