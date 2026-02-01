/**
 * Job Definitions
 */

export interface DirtPatch {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'light' | 'medium' | 'hard';
  health: number;
}

export interface JobDefinition {
  id: number;
  name: string;
  category: 'small' | 'vehicle' | 'site';
  bgColor: string;
  dirtPatches: Omit<DirtPatch, 'health'>[];
  coinReward: number;
  timeTarget: number; // seconds for 3 stars
}

export const JOBS: JobDefinition[] = [
  {
    id: 1,
    name: 'Dirty Shovel',
    category: 'small',
    bgColor: '#e8f4f8',
    dirtPatches: [
      { x: 150, y: 100, width: 80, height: 60, type: 'light' },
      { x: 250, y: 120, width: 70, height: 50, type: 'light' },
      { x: 180, y: 200, width: 60, height: 80, type: 'medium' },
    ],
    coinReward: 50,
    timeTarget: 15,
  },
  {
    id: 2,
    name: 'Muddy Wheelbarrow',
    category: 'small',
    bgColor: '#f0f8e8',
    dirtPatches: [
      { x: 100, y: 80, width: 100, height: 70, type: 'medium' },
      { x: 220, y: 100, width: 90, height: 80, type: 'medium' },
      { x: 150, y: 190, width: 80, height: 60, type: 'light' },
      { x: 280, y: 200, width: 70, height: 50, type: 'light' },
    ],
    coinReward: 75,
    timeTarget: 20,
  },
  {
    id: 3,
    name: 'Dusty Toolbox',
    category: 'small',
    bgColor: '#f8f0e8',
    dirtPatches: [
      { x: 120, y: 90, width: 90, height: 70, type: 'light' },
      { x: 230, y: 100, width: 80, height: 60, type: 'medium' },
      { x: 160, y: 180, width: 100, height: 80, type: 'hard' },
      { x: 290, y: 190, width: 60, height: 70, type: 'medium' },
    ],
    coinReward: 100,
    timeTarget: 25,
  },
  {
    id: 4,
    name: 'Grimy Concrete Mixer',
    category: 'vehicle',
    bgColor: '#e8f0f8',
    dirtPatches: [
      { x: 80, y: 60, width: 120, height: 100, type: 'hard' },
      { x: 220, y: 80, width: 110, height: 90, type: 'hard' },
      { x: 100, y: 180, width: 90, height: 80, type: 'medium' },
      { x: 210, y: 200, width: 100, height: 70, type: 'medium' },
      { x: 330, y: 120, width: 80, height: 100, type: 'hard' },
    ],
    coinReward: 150,
    timeTarget: 40,
  },
  {
    id: 5,
    name: 'Muddy Excavator Bucket',
    category: 'vehicle',
    bgColor: '#f8f4e8',
    dirtPatches: [
      { x: 90, y: 70, width: 130, height: 110, type: 'hard' },
      { x: 240, y: 90, width: 120, height: 100, type: 'hard' },
      { x: 110, y: 200, width: 100, height: 90, type: 'hard' },
      { x: 230, y: 210, width: 110, height: 80, type: 'medium' },
      { x: 360, y: 130, width: 90, height: 110, type: 'hard' },
      { x: 150, y: 310, width: 80, height: 70, type: 'medium' },
    ],
    coinReward: 200,
    timeTarget: 50,
  },
];
