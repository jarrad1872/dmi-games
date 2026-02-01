/**
 * Tool Definitions
 */

export interface ToolDefinition {
  id: string;
  name: string;
  power: number; // damage per frame
  range: number; // spray radius
  canClean: ('light' | 'medium' | 'hard')[];
  cost: number; // coin cost
  unlockJob: number; // job must be completed to unlock
  dmiProduct?: string; // DMI product name for tool drop
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'basic',
    name: 'Basic Washer',
    power: 2,
    range: 30,
    canClean: ['light', 'medium'],
    cost: 0,
    unlockJob: 0,
    dmiProduct: 'PowerWash 2000',
  },
  {
    id: 'turbo',
    name: 'Turbo Nozzle',
    power: 4,
    range: 25,
    canClean: ['light', 'medium', 'hard'],
    cost: 200,
    unlockJob: 3,
    dmiProduct: 'TurboClean Pro',
  },
  {
    id: 'surface',
    name: 'Surface Cleaner',
    power: 3,
    range: 50,
    canClean: ['light', 'medium'],
    cost: 300,
    unlockJob: 5,
    dmiProduct: 'SurfaceBlast 3000',
  },
];
