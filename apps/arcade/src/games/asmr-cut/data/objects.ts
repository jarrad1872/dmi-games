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
  hasRebar?: boolean;        // Hidden rebar hazard (damages blade)
  rebarChance?: number;      // Probability of rebar (0-1)
}

export const OBJECTS: ObjectDefinition[] = [
  // CONSTRUCTION MATERIALS (1 swipe) - Levels 1-5 (Easy cutting demo materials)
  {
    id: 'drywall',
    name: 'Drywall Panel',
    material: 'soft',
    color: '#f5f5f0', // Off-white/cream
    accentColor: '#e8e8e0',
    requiredSwipes: 1,
    baseCoins: 10,
    unlockLevel: 1,
    particleColor: '#ffffff',
    satisfactionMultiplier: 1.0,
  },
  {
    id: 'cement_board',
    name: 'Cement Board',
    material: 'soft',
    color: '#9e9e9e', // Gray
    accentColor: '#8a8a8a',
    requiredSwipes: 1,
    baseCoins: 12,
    unlockLevel: 1,
    particleColor: '#b0b0b0',
    satisfactionMultiplier: 1.1,
  },
  {
    id: 'asphalt_patch',
    name: 'Asphalt Patch',
    material: 'soft',
    color: '#3a3a3a', // Dark black/gray
    accentColor: '#2a2a2a',
    requiredSwipes: 1,
    baseCoins: 15,
    unlockLevel: 2,
    particleColor: '#4a4a4a',
    satisfactionMultiplier: 1.15,
  },
  {
    id: 'mortar_block',
    name: 'Mortar Block',
    material: 'soft',
    color: '#a0a0a0', // Sandy gray
    accentColor: '#909090',
    requiredSwipes: 1,
    baseCoins: 18,
    unlockLevel: 3,
    particleColor: '#b8b8b8',
    satisfactionMultiplier: 1.2,
  },
  {
    id: 'thinset_tile',
    name: 'Thin-Set Tile',
    material: 'soft',
    color: '#e0dcd0', // Off-white with grooves
    accentColor: '#d0ccc0',
    requiredSwipes: 1,
    baseCoins: 20,
    unlockLevel: 4,
    particleColor: '#f0ece0',
    satisfactionMultiplier: 1.25,
  },
  {
    id: 'fiber_cement',
    name: 'Fiber Cement',
    material: 'soft',
    color: '#808080', // Gray with visible fibers
    accentColor: '#707070',
    requiredSwipes: 1,
    baseCoins: 22,
    unlockLevel: 5,
    particleColor: '#9a9a9a',
    satisfactionMultiplier: 1.3,
  },

  // MEDIUM MATERIALS (2-3 swipes) - Levels 6-15
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
    satisfactionMultiplier: 1.35,
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

  // HARD MATERIALS (4+ swipes) - Levels 16+ (DMI Territory - Concrete Cutting!)
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
    hasRebar: true,
    rebarChance: 0.3,  // 30% chance of hidden rebar
  },
  {
    id: 'stone',
    name: 'Natural Stone',
    material: 'hard',
    color: '#9e9e9e',
    accentColor: '#757575',
    requiredSwipes: 4,
    baseCoins: 60,
    unlockLevel: 18,
    particleColor: '#bdbdbd',
    satisfactionMultiplier: 1.9,
  },
  {
    id: 'tile',
    name: 'Ceramic Tile',
    material: 'hard',
    color: '#e8e8e8',
    accentColor: '#cccccc',
    requiredSwipes: 4,
    baseCoins: 65,
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
    unlockLevel: 22,
    particleColor: '#c74a33',
    satisfactionMultiplier: 2.1,
    hasRebar: true,
    rebarChance: 0.4,  // 40% chance of hidden rebar
  },
  {
    id: 'reinforced_concrete',
    name: 'Reinforced Concrete',
    material: 'hard',
    color: '#707070',
    accentColor: '#505050',
    requiredSwipes: 6,
    baseCoins: 100,
    unlockLevel: 25,
    particleColor: '#909090',
    satisfactionMultiplier: 2.3,
    hasRebar: true,
    rebarChance: 0.8,  // 80% chance - almost always has rebar
  },
  {
    id: 'granite',
    name: 'Granite Slab',
    material: 'hard',
    color: '#4a4a4a',
    accentColor: '#333333',
    requiredSwipes: 6,
    baseCoins: 120,
    unlockLevel: 28,
    particleColor: '#666666',
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
