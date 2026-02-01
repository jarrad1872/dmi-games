/**
 * PRECISION DEMO - Game Export
 *
 * A Teardown-inspired demolition puzzle game.
 * Part of the DMI Games Arcade.
 */

export { Game } from './Game';
export type { SceneName } from './Game';

// Re-export types for external use
export type { ToolDefinition } from './data/tools';
export type { StructureDefinition } from './data/structures';
export type { LevelData } from './data/levels';
export type { SaveData } from './systems/ProgressionSystem';
