/**
 * Drill Bit Definitions
 * DMI-branded drill bits with progressive power levels
 */

export interface DrillBit {
  id: string;
  name: string;
  description: string;
  baseSpeed: number; // Meters per second
  cost: number;
  unlockDepth: number;
  color: string;
}

export const DRILL_BITS: DrillBit[] = [
  {
    id: 'standard',
    name: 'Standard Core Bit',
    description: 'Basic DMI drill bit',
    baseSpeed: 1,
    cost: 0,
    unlockDepth: 0,
    color: '#888888',
  },
  {
    id: 'segmented',
    name: 'Segmented Bit',
    description: '2x faster drilling',
    baseSpeed: 2,
    cost: 500,
    unlockDepth: 100,
    color: '#4a9eff',
  },
  {
    id: 'turbo',
    name: 'Turbo Bit',
    description: '5x faster drilling',
    baseSpeed: 5,
    cost: 5000,
    unlockDepth: 500,
    color: '#ff6b35',
  },
  {
    id: 'diamond',
    name: 'Diamond Core',
    description: '10x faster drilling',
    baseSpeed: 10,
    cost: 50000,
    unlockDepth: 1000,
    color: '#00d4ff',
  },
];
