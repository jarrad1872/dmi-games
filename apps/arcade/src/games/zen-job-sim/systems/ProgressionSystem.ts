/**
 * Progression System - Save/load player progress
 */

export interface SaveData {
  completedJobs: number[];
  unlockedTools: string[];
  coins: number;
  stars: number;
  currentJob: number;
}

const STORAGE_KEY = 'zen_job_sim_save';

export class ProgressionSystem {
  private data: SaveData;

  constructor() {
    this.data = this.load();
  }

  private getDefaultData(): SaveData {
    return {
      completedJobs: [],
      unlockedTools: ['basic'],
      coins: 0,
      stars: 0,
      currentJob: 1,
    };
  }

  private load(): SaveData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...this.getDefaultData(), ...JSON.parse(saved) };
      }
    } catch (err) {
      console.error('Failed to load save data:', err);
    }
    return this.getDefaultData();
  }

  save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (err) {
      console.error('Failed to save data:', err);
    }
  }

  completeJob(jobId: number, stars: number, coins: number): void {
    if (!this.data.completedJobs.includes(jobId)) {
      this.data.completedJobs.push(jobId);
    }
    this.data.stars += stars;
    this.data.coins += coins;
    this.data.currentJob = Math.max(this.data.currentJob, jobId + 1);
    this.save();
  }

  unlockTool(toolId: string): void {
    if (!this.data.unlockedTools.includes(toolId)) {
      this.data.unlockedTools.push(toolId);
      this.save();
    }
  }

  spendCoins(amount: number): boolean {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  hasCompletedJob(jobId: number): boolean {
    return this.data.completedJobs.includes(jobId);
  }

  hasUnlockedTool(toolId: string): boolean {
    return this.data.unlockedTools.includes(toolId);
  }

  getData(): SaveData {
    return { ...this.data };
  }

  reset(): void {
    this.data = this.getDefaultData();
    this.save();
  }
}
