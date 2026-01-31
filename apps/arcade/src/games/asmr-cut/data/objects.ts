/**
 * Sliceable Object Definitions
 * Each object has material properties that affect how it's cut
 */

export interface ObjectDefinition {
  id: string;
  name: string;
  material: 'soft' | 'medium' | 'hard';
  color: string;
  accentColor: string;
  requiredSwipes: number;
  baseCoins: number;
  unlockLevel: number;
  particleColor: string;
  satisfactionMultiplier: number;
}

export const OBJECTS: ObjectDefinition[] = [
  // Soft materials (1 swipe) - Levels 1-5
  {
    id: 'soap',
    name: 'Soap Bar',
    material: 'soft',
    color: '#b8e0d2',
    accentColor: '#95cdbf',
    requiredSwipes: 1,
    baseCoins: 10,
    unlockLevel: 1,
    particleColor: '#d4f0e7',
    satisfactionMultiplier: 1.0,
  },
  {
    id: 'kinetic_sand',
    name: 'Kinetic Sand',
    material: 'soft',
    color: '#e8c98d',
    accentColor: '#d4b06b',
    requiredSwipes: 1,
    baseCoins: 15,
    unlockLevel: 2,
    particleColor: '#f5e6c3',
    satisfactionMultiplier: 1.1,
  },
  {
    id: 'clay',
    name: 'Modeling Clay',
    material: 'soft',
    color: '#d68c45',
    accentColor: '#c47a35',
    requiredSwipes: 1,
    baseCoins: 20,
    unlockLevel: 3,
    particleColor: '#e8a868',
    satisfactionMultiplier: 1.2,
  },

  // Medium materials (2-3 swipes) - Levels 6-15
  {
    id: 'rubber',
    name: 'Rubber Block',
    material: 'medium',
    color: '#4a4a4a',
    accentColor: '#333333',
    requiredSwipes: 2,
    baseCoins: 25,
    unlockLevel: 6,
    particleColor: '#666666',
    satisfactionMultiplier: 1.3,
  },
  {
    id: 'foam',
    name: 'Dense Foam',
    material: 'medium',
    color: '#ff9999',
    accentColor: '#ff7777',
    requiredSwipes: 2,
    baseCoins: 30,
    unlockLevel: 8,
    particleColor: '#ffcccc',
    satisfactionMultiplier: 1.4,
  },
  {
    id: 'wax',
    name: 'Candle Wax',
    material: 'medium',
    color: '#f5e6c3',
    accentColor: '#e8d4a8',
    requiredSwipes: 2,
    baseCoins: 35,
    unlockLevel: 10,
    particleColor: '#fff8e8',
    satisfactionMultiplier: 1.5,
  },
  {
    id: 'wood',
    name: 'Balsa Wood',
    material: 'medium',
    color: '#c9a86c',
    accentColor: '#b89555',
    requiredSwipes: 3,
    baseCoins: 40,
    unlockLevel: 12,
    particleColor: '#d4b88a',
    satisfactionMultiplier: 1.6,
  },

  // Hard materials (4+ swipes) - Levels 16+ (DMI Territory)
  {
    id: 'concrete',
    name: 'Concrete Block',
    material: 'hard',
    color: '#888888',
    accentColor: '#666666',
    requiredSwipes: 4,
    baseCoins: 50,
    unlockLevel: 16,
    particleColor: '#aaaaaa',
    satisfactionMultiplier: 1.8,
  },
  {
    id: 'tile',
    name: 'Ceramic Tile',
    material: 'hard',
    color: '#e8e8e8',
    accentColor: '#cccccc',
    requiredSwipes: 4,
    baseCoins: 60,
    unlockLevel: 20,
    particleColor: '#f5f5f5',
    satisfactionMultiplier: 2.0,
  },
  {
    id: 'brick',
    name: 'Red Brick',
    material: 'hard',
    color: '#a61c00',
    accentColor: '#8a1700',
    requiredSwipes: 5,
    baseCoins: 75,
    unlockLevel: 25,
    particleColor: '#c74a33',
    satisfactionMultiplier: 2.2,
  },
  {
    id: 'steel',
    name: 'Steel Plate',
    material: 'hard',
    color: '#8899aa',
    accentColor: '#667788',
    requiredSwipes: 6,
    baseCoins: 100,
    unlockLevel: 30,
    particleColor: '#aabbcc',
    satisfactionMultiplier: 2.5,
  },
];

/**
 * Get object by ID
 */
export function getObjectById(id: string): ObjectDefinition | undefined {
  return OBJECTS.find(obj => obj.id === id);
}

/**
 * Get objects unlocked at or before given level
 */
export function getUnlockedObjects(level: number): ObjectDefinition[] {
  return OBJECTS.filter(obj => obj.unlockLevel <= level);
}

/**
 * Get object for specific level
 */
export function getObjectForLevel(level: number): ObjectDefinition {
  // Cycle through unlocked objects as levels progress
  const unlocked = getUnlockedObjects(level);
  if (unlocked.length === 0) return OBJECTS[0];

  // Use level to pick from available objects with some variety
  const index = (level - 1) % unlocked.length;
  return unlocked[Math.min(index, unlocked.length - 1)];
}
