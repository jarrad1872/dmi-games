/**
 * Object Factory
 * Creates sliceable objects for each level
 */

import { ObjectDefinition, getObjectForLevel, OBJECTS } from '../data/objects';
import { SliceableObject } from './SliceableObject';

export interface ObjectSpawnConfig {
  canvasWidth: number;
  canvasHeight: number;
  level: number;
  objectScale?: number;
}

export class ObjectFactory {
  /**
   * Create an object for the current level
   */
  createForLevel(config: ObjectSpawnConfig): SliceableObject {
    const definition = getObjectForLevel(config.level);
    return this.createObject(definition, config);
  }

  /**
   * Create an object with specific definition
   */
  createObject(definition: ObjectDefinition, config: ObjectSpawnConfig): SliceableObject {
    const scale = config.objectScale || 1;

    // Calculate object size based on canvas and material
    const baseSize = Math.min(config.canvasWidth, config.canvasHeight) * 0.35;

    let width: number;
    let height: number;

    // Different aspect ratios for different materials
    switch (definition.material) {
      case 'soft':
        // More square/chunky for soft materials
        width = baseSize * scale;
        height = baseSize * 0.8 * scale;
        break;
      case 'medium':
        // Slightly rectangular
        width = baseSize * 0.9 * scale;
        height = baseSize * scale;
        break;
      case 'hard':
        // More brick-like for hard materials
        width = baseSize * 1.1 * scale;
        height = baseSize * 0.7 * scale;
        break;
      default:
        width = baseSize * scale;
        height = baseSize * scale;
    }

    // Center position
    const x = config.canvasWidth / 2;
    const y = config.canvasHeight / 2 - 50; // Slightly above center

    return new SliceableObject(x, y, width, height, definition);
  }

  /**
   * Get all object definitions for menu display
   */
  getAllObjects(): ObjectDefinition[] {
    return OBJECTS;
  }

  /**
   * Get unlocked objects for menu
   */
  getUnlockedObjects(highestLevel: number): ObjectDefinition[] {
    return OBJECTS.filter(obj => obj.unlockLevel <= highestLevel);
  }
}
