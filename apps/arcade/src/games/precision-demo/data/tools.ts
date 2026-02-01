export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  power: number;
  radius: number;
  unlockLevel: number;
  dmiProduct: string;
  color: string;
}

export const TOOLS: Record<string, ToolDefinition> = {
  hammer: {
    id: 'hammer',
    name: 'Demo Hammer',
    description: 'Basic demolition tool',
    power: 10,
    radius: 30,
    unlockLevel: 1,
    dmiProduct: 'Demo Hammer',
    color: '#ff6b6b',
  },
  drill: {
    id: 'drill',
    name: 'Core Drill',
    description: 'Precision holes in hard materials',
    power: 15,
    radius: 20,
    unlockLevel: 5,
    dmiProduct: 'Core Drill',
    color: '#4ecdc4',
  },
  blade: {
    id: 'blade',
    name: 'Diamond Blade',
    description: 'Clean cuts through anything',
    power: 20,
    radius: 40,
    unlockLevel: 10,
    dmiProduct: 'Diamond Blade',
    color: '#ffe66d',
  },
  breaker: {
    id: 'breaker',
    name: 'Breaker',
    description: 'Heavy demolition power',
    power: 30,
    radius: 50,
    unlockLevel: 15,
    dmiProduct: 'Breaker',
    color: '#ff4757',
  },
};
