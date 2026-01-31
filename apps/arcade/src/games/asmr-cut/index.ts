/**
 * ASMR CUT - Game Export
 *
 * A satisfying slicing game inspired by ASMR Slicing/Soap Cutting.
 * Part of the DMI Games Arcade.
 */

export { Game } from './Game';
export type { SceneName } from './Game';

// Re-export types for external use
export type { ObjectDefinition } from './data/objects';
export type { BladeDefinition } from './data/blades';
export type { SaveData } from './systems/ProgressionSystem';
