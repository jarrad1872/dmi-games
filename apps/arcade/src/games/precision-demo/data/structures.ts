export interface StructureDefinition {
  id: string;
  name: string;
  material: 'wood' | 'brick' | 'concrete';
  durability: number;
  color: string;
  scoreValue: number;
}

export const STRUCTURES: Record<string, StructureDefinition> = {
  wood: {
    id: 'wood',
    name: 'Wood Structure',
    material: 'wood',
    durability: 10,
    color: '#8b4513',
    scoreValue: 10,
  },
  brick: {
    id: 'brick',
    name: 'Brick Building',
    material: 'brick',
    durability: 20,
    color: '#b22222',
    scoreValue: 25,
  },
  concrete: {
    id: 'concrete',
    name: 'Concrete Fortress',
    material: 'concrete',
    durability: 30,
    color: '#808080',
    scoreValue: 50,
  },
};
