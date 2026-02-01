/**
 * Idle System
 * Handles automated drilling from managers
 */

import { MANAGERS } from '../data/managers';
import { ProgressionSystem } from './ProgressionSystem';

export class IdleSystem {
  private progression: ProgressionSystem;
  private accumulator: number = 0;

  constructor(progression: ProgressionSystem) {
    this.progression = progression;
  }

  update(deltaTime: number): number {
    const ownedManagers = this.progression.getOwnedManagers();
    if (ownedManagers.length === 0) return 0;

    // Calculate total drills per second
    let drillsPerSecond = 0;
    for (const managerId of ownedManagers) {
      const manager = MANAGERS.find(m => m.id === managerId);
      if (manager) {
        drillsPerSecond += manager.drillsPerSecond;
      }
    }

    // Accumulate drills
    this.accumulator += (drillsPerSecond * deltaTime) / 1000;

    // Execute whole drills
    const drillsToExecute = Math.floor(this.accumulator);
    this.accumulator -= drillsToExecute;

    return drillsToExecute;
  }

  getTotalDrillsPerSecond(): number {
    const ownedManagers = this.progression.getOwnedManagers();
    let total = 0;
    for (const managerId of ownedManagers) {
      const manager = MANAGERS.find(m => m.id === managerId);
      if (manager) {
        total += manager.drillsPerSecond;
      }
    }
    return total;
  }
}
