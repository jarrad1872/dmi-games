/**
 * Obstacle Definitions
 * Construction site obstacles with visual variety
 */

export type AvoidMethod = 'lane' | 'jump' | 'slide' | 'any';

export interface ObstacleDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  color: string;
  avoidMethod: AvoidMethod;
  lanes: number;
  spawnWeight: number;
}

export const OBSTACLES: ObstacleDefinition[] = [
  {
    id: 'barrier',
    name: 'Concrete Barrier',
    width: 70,
    height: 50,
    color: '#4A4A4A',
    avoidMethod: 'jump',
    lanes: 1,
    spawnWeight: 30,
  },
  {
    id: 'scaffold',
    name: 'Scaffold Frame',
    width: 80,
    height: 120,
    color: '#666666',
    avoidMethod: 'slide',
    lanes: 1,
    spawnWeight: 25,
  },
  {
    id: 'forklift',
    name: 'Forklift',
    width: 75,
    height: 90,
    color: '#FFD700',
    avoidMethod: 'lane',
    lanes: 1,
    spawnWeight: 20,
  },
  {
    id: 'rebar',
    name: 'Rebar Bundle',
    width: 60,
    height: 80,
    color: '#8B4513',
    avoidMethod: 'jump',
    lanes: 1,
    spawnWeight: 15,
  },
  {
    id: 'wet_cement',
    name: 'Wet Cement',
    width: 90,
    height: 30,
    color: '#808080',
    avoidMethod: 'jump',
    lanes: 1,
    spawnWeight: 10,
  },
];

export function getRandomObstacle(): ObstacleDefinition {
  const totalWeight = OBSTACLES.reduce((sum, o) => sum + o.spawnWeight, 0);
  let random = Math.random() * totalWeight;
  
  for (const obstacle of OBSTACLES) {
    random -= obstacle.spawnWeight;
    if (random <= 0) return obstacle;
  }
  
  return OBSTACLES[0];
}
