/**
 * ZEN JOB SIM - Game Export
 *
 * A satisfying PowerWash Simulator-inspired cleaning game.
 * Part of the DMI Games Arcade.
 */

export { Game } from './Game';
export type { SceneName } from './Game';

// Re-export types for external use
export type { JobDefinition } from './data/jobs';
export type { ToolDefinition } from './data/tools';
export type { SaveData } from './systems/ProgressionSystem';
