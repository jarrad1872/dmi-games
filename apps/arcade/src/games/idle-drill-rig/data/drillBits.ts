/**
 * IDLE DRILL RIG - Drill Bit Data
 * DMI-branded drill bits with upgrade progression
 */

export interface DrillBitData {
  id: string;
  name: string;
  description: string;
  basePower: number;
  baseSpeed: number;
  cost: number;
  unlockDepth: number;
  color: string;
  tier: number;
  shopifyUrl?: string;
}

export const DRILL_BITS: DrillBitData[] = [
  {
    id: 'standard',
    name: 'DMI Standard Core Bit',
    description: 'Reliable starter bit for basic drilling',
    basePower: 1,
    baseSpeed: 1,
    cost: 0,
    unlockDepth: 0,
    color: '#666666',
    tier: 1,
    shopifyUrl: 'https://dmitools.com/standard-core-bit',
  },
  {
    id: 'carbide',
    name: 'DMI Carbide Tipped',
    description: '2x drilling power with carbide tips',
    basePower: 2,
    baseSpeed: 1.2,
    cost: 500,
    unlockDepth: 50,
    color: '#888888',
    tier: 2,
    shopifyUrl: 'https://dmitools.com/carbide-bit',
  },
  {
    id: 'segmented',
    name: 'DMI Segmented Bit',
    description: 'Faster drilling with segmented design',
    basePower: 4,
    baseSpeed: 1.5,
    cost: 2500,
    unlockDepth: 100,
    color: '#A0A0A0',
    tier: 3,
    shopifyUrl: 'https://dmitools.com/segmented-bit',
  },
  {
    id: 'turbo',
    name: 'DMI Turbo Bit',
    description: 'High-speed drilling for professionals',
    basePower: 10,
    baseSpeed: 2.0,
    cost: 15000,
    unlockDepth: 500,
    color: '#C0C0C0',
    tier: 4,
    shopifyUrl: 'https://dmitools.com/turbo-bit',
  },
  {
    id: 'diamond',
    name: 'DMI Diamond Core',
    description: 'Diamond-tipped for extreme hardness',
    basePower: 25,
    baseSpeed: 2.5,
    cost: 100000,
    unlockDepth: 1200,
    color: '#00BFFF',
    tier: 5,
    shopifyUrl: 'https://dmitools.com/diamond-core',
  },
  {
    id: 'plasma',
    name: 'DMI Plasma Cutter',
    description: 'Plasma-enhanced drilling technology',
    basePower: 75,
    baseSpeed: 3.0,
    cost: 750000,
    unlockDepth: 2000,
    color: '#FF6B00',
    tier: 6,
    shopifyUrl: 'https://dmitools.com/plasma-cutter',
  },
  {
    id: 'fusion',
    name: 'DMI Fusion Drill',
    description: 'Experimental fusion-powered drilling',
    basePower: 200,
    baseSpeed: 4.0,
    cost: 5000000,
    unlockDepth: 3500,
    color: '#9932CC',
    tier: 7,
    shopifyUrl: 'https://dmitools.com/fusion-drill',
  },
  {
    id: 'quantum',
    name: 'DMI Quantum Bore',
    description: 'Quantum tunneling for impossible depths',
    basePower: 600,
    baseSpeed: 5.0,
    cost: 50000000,
    unlockDepth: 5000,
    color: '#00FF88',
    tier: 8,
    shopifyUrl: 'https://dmitools.com/quantum-bore',
  },
];

/**
 * Get available drill bits at current depth
 */
export function getAvailableBits(depth: number): DrillBitData[] {
  return DRILL_BITS.filter(bit => depth >= bit.unlockDepth);
}

/**
 * Get next unlockable bit
 */
export function getNextBit(currentBitId: string): DrillBitData | null {
  const currentIndex = DRILL_BITS.findIndex(b => b.id === currentBitId);
  if (currentIndex === -1 || currentIndex >= DRILL_BITS.length - 1) {
    return null;
  }
  return DRILL_BITS[currentIndex + 1];
}

/**
 * Get bit by ID
 */
export function getBitById(id: string): DrillBitData | undefined {
  return DRILL_BITS.find(b => b.id === id);
}
