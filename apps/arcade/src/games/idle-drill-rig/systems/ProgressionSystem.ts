/**
 * Progression System
 * Handles save/load, upgrades, and progression
 */

import { DRILL_BITS, DrillBit } from '../data/drills';
import { MANAGERS, Manager } from '../data/managers';

export interface SaveData {
  depth: number;
  maxDepth: number;
  cores: number;
  currentDrillId: string;
  ownedDrills: string[];
  ownedManagers: string[];
  prestigeLevel: number;
  prestigeMultiplier: number;
  totalDrills: number; // Track total drills for achievements
}

const STORAGE_KEY = 'idle_drill_rig_save';

export class ProgressionSystem {
  private data: SaveData;

  constructor() {
    this.data = this.load();
  }

  private getDefaultSave(): SaveData {
    return {
      depth: 0,
      maxDepth: 0,
      cores: 0,
      currentDrillId: 'standard',
      ownedDrills: ['standard'],
      ownedManagers: [],
      prestigeLevel: 0,
      prestigeMultiplier: 1,
      totalDrills: 0,
    };
  }

  load(): SaveData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...this.getDefaultSave(), ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load save:', e);
    }
    return this.getDefaultSave();
  }

  save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  }

  // Getters
  getDepth(): number { return this.data.depth; }
  getMaxDepth(): number { return this.data.maxDepth; }
  getCores(): number { return this.data.cores; }
  getCurrentDrill(): DrillBit | undefined {
    return DRILL_BITS.find(d => d.id === this.data.currentDrillId);
  }
  getOwnedDrills(): string[] { return this.data.ownedDrills; }
  getOwnedManagers(): string[] { return this.data.ownedManagers; }
  getPrestigeLevel(): number { return this.data.prestigeLevel; }
  getPrestigeMultiplier(): number { return this.data.prestigeMultiplier; }
  getTotalDrills(): number { return this.data.totalDrills; }

  // Setters
  addDepth(meters: number): void {
    this.data.depth += meters;
    if (this.data.depth > this.data.maxDepth) {
      this.data.maxDepth = this.data.depth;
    }
    this.save();
  }

  addCores(amount: number): void {
    this.data.cores += Math.floor(amount * this.data.prestigeMultiplier);
    this.save();
  }

  spendCores(amount: number): boolean {
    if (this.data.cores >= amount) {
      this.data.cores -= amount;
      this.save();
      return true;
    }
    return false;
  }

  incrementDrills(): void {
    this.data.totalDrills++;
  }

  // Purchases
  buyDrill(drillId: string): boolean {
    const drill = DRILL_BITS.find(d => d.id === drillId);
    if (!drill || this.data.ownedDrills.includes(drillId)) return false;
    
    if (this.spendCores(drill.cost)) {
      this.data.ownedDrills.push(drillId);
      this.data.currentDrillId = drillId;
      this.save();
      return true;
    }
    return false;
  }

  buyManager(managerId: string): boolean {
    const manager = MANAGERS.find(m => m.id === managerId);
    if (!manager || this.data.ownedManagers.includes(managerId)) return false;
    
    if (this.spendCores(manager.cost)) {
      this.data.ownedManagers.push(managerId);
      this.save();
      return true;
    }
    return false;
  }

  switchDrill(drillId: string): boolean {
    if (this.data.ownedDrills.includes(drillId)) {
      this.data.currentDrillId = drillId;
      this.save();
      return true;
    }
    return false;
  }

  // Prestige
  canPrestige(): boolean {
    return this.data.maxDepth >= 1000;
  }

  prestige(): void {
    if (!this.canPrestige()) return;

    // Calculate prestige bonus (10% per prestige)
    this.data.prestigeLevel++;
    this.data.prestigeMultiplier = 1 + (this.data.prestigeLevel * 0.1);

    // Reset progress
    this.data.depth = 0;
    this.data.maxDepth = 0;
    this.data.cores = 0;
    this.data.currentDrillId = 'standard';
    this.data.ownedDrills = ['standard'];
    this.data.ownedManagers = [];

    this.save();
  }

  // Check unlocks
  isUnlocked(unlockDepth: number): boolean {
    return this.data.maxDepth >= unlockDepth;
  }
}
