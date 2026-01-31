/**
 * HEAT RUNNER - Game Export
 *
 * An endless runner game inspired by Subway Surfers.
 * Part of the DMI Games Arcade.
 */

export { Game } from './Game';
export type { SceneName } from './Game';

// Re-export types for external use
export type { ObstacleDefinition } from './data/obstacles';
export type { PowerUpDefinition } from './data/powerups';
export type { SaveData } from './systems/ProgressionSystem';
