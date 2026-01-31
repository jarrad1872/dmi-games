/**
 * Obstacle Definitions
 * Different types of obstacles for the runner
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
    id: 'concrete_barrier',
    name: 'Concrete Barrier',
    width: 80,
    height: 100,
    color: '#808080',
    avoidMethod: 'lane',
    lanes: 1,
    spawnWeight: 30,
  },
  {
    id: 'low_scaffold',
    name: 'Low Scaffold',
    width: 120,
    height: 40,
    color: '#8B4513',
    avoidMethod: 'jump',
    lanes: 2,
    spawnWeight: 25,
  },
  {
    id: 'high_barrier',
    name: 'High Barrier',
    width: 100,
    height: 120,
    color: '#FFD700',
    avoidMethod: 'slide',
    lanes: 1,
    spawnWeight: 20,
  },
  {
    id: 'forklift',
    name: 'Forklift',
    width: 90,
    height: 110,
    color: '#FF6B00',
    avoidMethod: 'lane',
    lanes: 1,
    spawnWeight: 15,
  },
  {
    id: 'rebar_stack',
    name: 'Rebar Stack',
    width: 100,
    height: 60,
    color: '#4A4A4A',
    avoidMethod: 'any',
    lanes: 2,
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
