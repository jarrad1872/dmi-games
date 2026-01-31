/**
 * Blade Upgrade Definitions
 * DMI-branded cutting tools with various bonuses
 */

export interface BladeDefinition {
  id: string;
  name: string;
  description: string;
  cost: number;
  speedBonus: number;      // Multiplier for slice speed (1.0 = normal)
  precisionBonus: number;  // Multiplier for score from precision
  coinBonus: number;       // Multiplier for coins earned
  color: string;
  glowColor: string;
  unlockLevel: number;
  dmiProduct: boolean;     // Is this a DMI product?
}

export const BLADES: BladeDefinition[] = [
  {
    id: 'standard',
    name: 'Standard Blade',
    description: 'Basic cutting blade. Gets the job done.',
    cost: 0,
    speedBonus: 1.0,
    precisionBonus: 1.0,
    coinBonus: 1.0,
    color: '#888888',
    glowColor: '#666666',
    unlockLevel: 1,
    dmiProduct: false,
  },
  {
    id: 'utility',
    name: 'Utility Knife',
    description: 'Sharper edge for cleaner cuts.',
    cost: 200,
    speedBonus: 1.1,
    precisionBonus: 1.1,
    coinBonus: 1.0,
    color: '#ffcc00',
    glowColor: '#ffaa00',
    unlockLevel: 3,
    dmiProduct: false,
  },
  {
    id: 'dmi_segmented',
    name: 'DMI Segmented Blade',
    description: 'Snap-off segments for always-fresh edge. 20% faster cuts!',
    cost: 500,
    speedBonus: 1.2,
    precisionBonus: 1.15,
    coinBonus: 1.1,
    color: '#a61c00',
    glowColor: '#ff3311',
    unlockLevel: 5,
    dmiProduct: true,
  },
  {
    id: 'ceramic',
    name: 'Ceramic Cutter',
    description: 'Ultra-sharp ceramic edge. Precision bonus.',
    cost: 1000,
    speedBonus: 1.15,
    precisionBonus: 1.3,
    coinBonus: 1.1,
    color: '#ffffff',
    glowColor: '#aaddff',
    unlockLevel: 10,
    dmiProduct: false,
  },
  {
    id: 'dmi_turbo',
    name: 'DMI Turbo Blade',
    description: 'Reinforced blade for tough materials. 50% faster cuts!',
    cost: 2000,
    speedBonus: 1.5,
    precisionBonus: 1.2,
    coinBonus: 1.2,
    color: '#a61c00',
    glowColor: '#ff5533',
    unlockLevel: 15,
    dmiProduct: true,
  },
  {
    id: 'diamond',
    name: 'Diamond Edge',
    description: 'Industrial-grade diamond coating. Maximum precision.',
    cost: 3500,
    speedBonus: 1.3,
    precisionBonus: 1.5,
    coinBonus: 1.25,
    color: '#88ddff',
    glowColor: '#00ffff',
    unlockLevel: 20,
    dmiProduct: false,
  },
  {
    id: 'dmi_pro',
    name: 'DMI Pro Series',
    description: 'Contractor-grade. The ultimate cutting tool. +50% coins!',
    cost: 5000,
    speedBonus: 1.6,
    precisionBonus: 1.4,
    coinBonus: 1.5,
    color: '#a61c00',
    glowColor: '#ff7755',
    unlockLevel: 25,
    dmiProduct: true,
  },
  {
    id: 'dmi_master',
    name: 'DMI Master Blade',
    description: 'Legendary DMI craftsmanship. Cuts through anything.',
    cost: 10000,
    speedBonus: 2.0,
    precisionBonus: 1.6,
    coinBonus: 2.0,
    color: '#ffd700',
    glowColor: '#ffaa00',
    unlockLevel: 30,
    dmiProduct: true,
  },
];

/**
 * Get blade by ID
 */
export function getBladeById(id: string): BladeDefinition | undefined {
  return BLADES.find(blade => blade.id === id);
}

/**
 * Get blades available at or before given level
 */
export function getAvailableBlades(level: number): BladeDefinition[] {
  return BLADES.filter(blade => blade.unlockLevel <= level);
}

/**
 * Get DMI-branded blades only
 */
export function getDMIBlades(): BladeDefinition[] {
  return BLADES.filter(blade => blade.dmiProduct);
}

/**
 * Get next blade to unlock (for progression hints)
 */
export function getNextBladeToUnlock(level: number): BladeDefinition | undefined {
  return BLADES.find(blade => blade.unlockLevel > level);
}
