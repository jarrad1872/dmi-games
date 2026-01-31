/**
 * Progression System
 * Handles score, coins, high scores, and Tool Drop triggers
 */

export interface SaveData {
  highScore: number;
  highDistance: number;
  totalCoins: number;
  totalRuns: number;
  toolDropsShown: number;
}

const STORAGE_KEY = 'heat_runner_save';

const TOOL_DROP_MILESTONES = [500, 2000, 5000, 10000];

export class ProgressionSystem {
  private saveData: SaveData;
  private currentScore: number = 0;
  private currentDistance: number = 0;
  private currentCoins: number = 0;
  private lastToolDropMilestone: number = 0;
  
  constructor() {
    this.saveData = this.loadSaveData();
  }
  
  private loadSaveData(): SaveData {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load save data', e);
    }
    
    return {
      highScore: 0,
      highDistance: 0,
      totalCoins: 0,
      totalRuns: 0,
      toolDropsShown: 0,
    };
  }
  
  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.saveData));
    } catch (e) {
      console.warn('Failed to save data', e);
    }
  }
  
  startRun(): void {
    this.currentScore = 0;
    this.currentDistance = 0;
    this.currentCoins = 0;
    this.lastToolDropMilestone = 0;
  }
  
  addScore(points: number): void {
    this.currentScore += points;
  }
  
  addDistance(meters: number): void {
    this.currentDistance += meters;
    this.currentScore += Math.floor(meters);
  }
  
  addCoins(amount: number): void {
    this.currentCoins += amount;
  }
  
  endRun(): { newHighScore: boolean; newHighDistance: boolean } {
    const newHighScore = this.currentScore > this.saveData.highScore;
    const newHighDistance = this.currentDistance > this.saveData.highDistance;
    
    if (newHighScore) {
      this.saveData.highScore = this.currentScore;
    }
    if (newHighDistance) {
      this.saveData.highDistance = this.currentDistance;
    }
    
    this.saveData.totalCoins += this.currentCoins;
    this.saveData.totalRuns++;
    this.save();
    
    return { newHighScore, newHighDistance };
  }
  
  shouldShowToolDrop(): boolean {
    for (const milestone of TOOL_DROP_MILESTONES) {
      if (this.currentScore >= milestone && this.lastToolDropMilestone < milestone) {
        this.lastToolDropMilestone = milestone;
        this.saveData.toolDropsShown++;
        this.save();
        return true;
      }
    }
    return false;
  }
  
  getToolDropDiscount(): number {
    if (this.currentScore >= 10000) return 20;
    if (this.currentScore >= 5000) return 15;
    if (this.currentScore >= 2000) return 10;
    return 5;
  }
  
  getCurrentScore(): number { return this.currentScore; }
  getCurrentDistance(): number { return this.currentDistance; }
  getCurrentCoins(): number { return this.currentCoins; }
  getHighScore(): number { return this.saveData.highScore; }
  getHighDistance(): number { return this.saveData.highDistance; }
  getTotalCoins(): number { return this.saveData.totalCoins; }
  getTotalRuns(): number { return this.saveData.totalRuns; }
}
