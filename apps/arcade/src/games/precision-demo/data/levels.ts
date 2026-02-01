export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  material: 'wood' | 'brick' | 'concrete';
}

export interface LevelData {
  id: number;
  name: string;
  blocks: Block[];
  targetDestruction: number;
  toolLimit: number;
  stars: { 1: number; 2: number; 3: number };
}

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'First Strike',
    blocks: [
      { x: 200, y: 400, width: 100, height: 100, material: 'wood' },
      { x: 200, y: 300, width: 100, height: 100, material: 'wood' },
      { x: 200, y: 200, width: 100, height: 100, material: 'wood' },
    ],
    targetDestruction: 80,
    toolLimit: 5,
    stars: { 1: 5, 2: 3, 3: 1 },
  },
  {
    id: 2,
    name: 'Tower Drop',
    blocks: [
      { x: 180, y: 450, width: 120, height: 50, material: 'wood' },
      { x: 200, y: 400, width: 80, height: 50, material: 'wood' },
      { x: 180, y: 350, width: 120, height: 50, material: 'wood' },
      { x: 200, y: 300, width: 80, height: 50, material: 'brick' },
      { x: 180, y: 250, width: 120, height: 50, material: 'wood' },
    ],
    targetDestruction: 90,
    toolLimit: 4,
    stars: { 1: 4, 2: 3, 3: 2 },
  },
];
