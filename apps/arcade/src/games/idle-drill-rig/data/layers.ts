/**
 * Ground Layer Definitions
 */

export interface GroundLayer {
  id: string;
  name: string;
  startDepth: number;
  endDepth: number;
  color: string;
  hardness: number; // Multiplier on drill speed (lower = faster)
  coreValue: number; // Base cores per meter
}

export const GROUND_LAYERS: GroundLayer[] = [
  {
    id: 'topsoil',
    name: 'Topsoil',
    startDepth: 0,
    endDepth: 50,
    color: '#8B4513',
    hardness: 1.0,
    coreValue: 1,
  },
  {
    id: 'rock',
    name: 'Rock',
    startDepth: 50,
    endDepth: 200,
    color: '#696969',
    hardness: 1.5,
    coreValue: 3,
  },
  {
    id: 'granite',
    name: 'Granite',
    startDepth: 200,
    endDepth: 500,
    color: '#2F4F4F',
    hardness: 2.5,
    coreValue: 10,
  },
  {
    id: 'core',
    name: 'Earth\'s Core',
    startDepth: 500,
    endDepth: Infinity,
    color: '#FF4500',
    hardness: 5.0,
    coreValue: 50,
  },
];

export function getLayerAtDepth(depth: number): GroundLayer {
  for (const layer of GROUND_LAYERS) {
    if (depth >= layer.startDepth && depth < layer.endDepth) {
      return layer;
    }
  }
  return GROUND_LAYERS[GROUND_LAYERS.length - 1];
}
