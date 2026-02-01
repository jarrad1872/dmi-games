/**
 * IDLE DRILL RIG - Game Export
 *
 * An addictive idle/incremental drilling game inspired by Idle Miner Tycoon.
 * Drill deep, upgrade your rig, hire managers, and prestige for massive bonuses.
 * Part of the DMI Games Arcade.
 */

export { Game } from './Game';
export type { SceneName } from './Game';

// Re-export types for external use
export type { DrillBit } from './data/drills';
export type { GroundLayer } from './data/layers';
export type { Manager } from './data/managers';
export type { SaveData } from './systems/ProgressionSystem';
