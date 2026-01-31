/**
 * Progression System
 * Handles levels, coins, unlocks, and save data
 */

import { getBladeById, BladeDefinition, BLADES } from '../data/blades';
import { getObjectForLevel, ObjectDefinition } from '../data/objects';

export interface SaveData {
  coins: number;
  currentLevel: number;
  highestLevel: number;
  equippedBlade: string;
  ownedBlades: string[];
  totalCoinsEarned: number;
  totalSlices: number;
  perfectSlices: number;
  lastPlayedAt: number;
}

const STORAGE_KEY = 'asmr_cut_save';

const DEFAULT_SAVE: SaveData = {
  coins: 0,
  currentLevel: 1,
  highestLevel: 1,
  equippedBlade: 'standard',
  ownedBlades: ['standard'],
  totalCoinsEarned: 0,
  totalSlices: 0,
  perfectSlices: 0,
  lastPlayedAt: Date.now(),
};

export class ProgressionSystem {
  private saveData: SaveData;
  private equippedBladeData: BladeDefinition;

  constructor() {
    this.saveData = this.load();
    this.equippedBladeData = getBladeById(this.saveData.equippedBlade) || BLADES[0];
  }

  /**
   * Load save data from localStorage
   */
  private load(): SaveData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as Partial<SaveData>;
        return { ...DEFAULT_SAVE, ...data };
      }
    } catch (e) {
      console.warn('Failed to load save data:', e);
    }
    return { ...DEFAULT_SAVE };
  }

  /**
   * Save data to localStorage
   */
  private save(): void {
    try {
      this.saveData.lastPlayedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.saveData));
    } catch (e) {
      console.warn('Failed to save data:', e);
    }
  }

  /**
   * Get current save data (read-only)
   */
  getSaveData(): Readonly<SaveData> {
    return this.saveData;
  }

  /**
   * Get current level
   */
  getCurrentLevel(): number {
    return this.saveData.currentLevel;
  }

  /**
   * Get coins
   */
  getCoins(): number {
    return this.saveData.coins;
  }

  /**
   * Get equipped blade
   */
  getEquippedBlade(): BladeDefinition {
    return this.equippedBladeData;
  }

  /**
   * Get object for current level
   */
  getCurrentObject(): ObjectDefinition {
    return getObjectForLevel(this.saveData.currentLevel);
  }

  /**
   * Add coins with blade bonus
   */
  addCoins(baseCoins: number): number {
    const bonus = this.equippedBladeData.coinBonus;
    const finalCoins = Math.floor(baseCoins * bonus);

    this.saveData.coins += finalCoins;
    this.saveData.totalCoinsEarned += finalCoins;
    this.save();

    return finalCoins;
  }

  /**
   * Spend coins
   */
  spendCoins(amount: number): boolean {
    if (this.saveData.coins < amount) {
      return false;
    }

    this.saveData.coins -= amount;
    this.save();
    return true;
  }

  /**
   * Complete current level
   */
  completeLevel(stars: number): void {
    this.saveData.currentLevel++;

    if (this.saveData.currentLevel > this.saveData.highestLevel) {
      this.saveData.highestLevel = this.saveData.currentLevel;
    }

    this.save();
  }

  /**
   * Record a slice
   */
  recordSlice(precision: number): void {
    this.saveData.totalSlices++;

    if (precision > 0.9) {
      this.saveData.perfectSlices++;
    }

    this.save();
  }

  /**
   * Check if player owns a blade
   */
  ownsBlade(bladeId: string): boolean {
    return this.saveData.ownedBlades.includes(bladeId);
  }

  /**
   * Purchase a blade
   */
  purchaseBlade(bladeId: string): boolean {
    const blade = getBladeById(bladeId);

    if (!blade) {
      return false;
    }

    if (this.ownsBlade(bladeId)) {
      return false;
    }

    if (this.saveData.coins < blade.cost) {
      return false;
    }

    this.saveData.coins -= blade.cost;
    this.saveData.ownedBlades.push(bladeId);
    this.save();

    return true;
  }

  /**
   * Equip a blade
   */
  equipBlade(bladeId: string): boolean {
    if (!this.ownsBlade(bladeId)) {
      return false;
    }

    const blade = getBladeById(bladeId);
    if (!blade) {
      return false;
    }

    this.saveData.equippedBlade = bladeId;
    this.equippedBladeData = blade;
    this.save();

    return true;
  }

  /**
   * Calculate stars for a level based on performance
   */
  calculateStars(precision: number, swipeCount: number, requiredSwipes: number): number {
    // Base: 1 star for completion
    // 2 stars: precision > 0.6 or efficient cuts
    // 3 stars: precision > 0.8 and minimal cuts

    let stars = 1;

    if (precision > 0.6) {
      stars = 2;
    }

    if (precision > 0.8 && swipeCount <= requiredSwipes + 1) {
      stars = 3;
    }

    return stars;
  }

  /**
   * Get coin reward for level based on stars
   */
  calculateCoinReward(baseCoins: number, stars: number, precision: number): number {
    // Star multiplier: 1x, 1.5x, 2x
    const starMultiplier = [1, 1.5, 2][stars - 1] || 1;

    // Precision bonus: 0-50% extra
    const precisionBonus = precision * 0.5;

    // Blade bonus
    const bladeBonus = this.equippedBladeData.coinBonus;

    return Math.floor(baseCoins * starMultiplier * (1 + precisionBonus) * bladeBonus);
  }

  /**
   * Check if Tool Drop should show
   */
  shouldShowToolDrop(): boolean {
    const level = this.saveData.currentLevel;
    // Show at level 5, then every 10 levels
    return level === 5 || (level > 5 && level % 10 === 0);
  }

  /**
   * Reset progress (for testing)
   */
  reset(): void {
    this.saveData = { ...DEFAULT_SAVE };
    this.equippedBladeData = BLADES[0];
    this.save();
  }
}
