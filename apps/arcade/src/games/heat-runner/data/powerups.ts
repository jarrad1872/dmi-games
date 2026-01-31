/**
 * Power-Up Definitions
 * DMI-themed power-ups for the runner
 */

export interface PowerUpDefinition {
  id: string;
  name: string;
  dmiEquivalent: string;
  duration: number;
  color: string;
  effect: 'shield' | 'multiplier' | 'magnet' | 'boost' | 'jetpack';
  spawnWeight: number;
}

export const POWERUPS: PowerUpDefinition[] = [
  {
    id: 'hard_hat',
    name: 'Hard Hat Shield',
    dmiEquivalent: 'Safety Gear',
    duration: 0,
    color: '#FFD700',
    effect: 'shield',
    spawnWeight: 20,
  },
  {
    id: 'safety_vest',
    name: 'Safety Vest',
    dmiEquivalent: 'High-Vis Gear',
    duration: 10,
    color: '#FF6B00',
    effect: 'multiplier',
    spawnWeight: 25,
  },
  {
    id: 'tool_belt',
    name: 'Tool Belt Magnet',
    dmiEquivalent: 'Tool Belt',
    duration: 8,
    color: '#8B4513',
    effect: 'magnet',
    spawnWeight: 25,
  },
  {
    id: 'drill_boost',
    name: 'Drill Boost',
    dmiEquivalent: 'Core Drill',
    duration: 5,
    color: '#FF0000',
    effect: 'boost',
    spawnWeight: 15,
  },
  {
    id: 'jetpack',
    name: 'Jetpack',
    dmiEquivalent: 'Power Equipment',
    duration: 8,
    color: '#4682B4',
    effect: 'jetpack',
    spawnWeight: 15,
  },
];

export function getRandomPowerUp(): PowerUpDefinition {
  const totalWeight = POWERUPS.reduce((sum, p) => sum + p.spawnWeight, 0);
  let random = Math.random() * totalWeight;
  
  for (const powerup of POWERUPS) {
    random -= powerup.spawnWeight;
    if (random <= 0) return powerup;
  }
  
  return POWERUPS[0];
}
