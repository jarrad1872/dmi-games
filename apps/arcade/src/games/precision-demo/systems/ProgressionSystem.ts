export interface SaveData {
  currentLevel: number;
  unlockedLevels: number[];
  unlockedTools: string[];
  levelStars: Record<number, number>;
  toolPoints: number;
}

export class ProgressionSystem {
  private saveData: SaveData;
  private storageKey = 'precision_demo_save';

  constructor() {
    this.saveData = this.load();
  }

  private load(): SaveData {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load save data:', e);
    }
    return {
      currentLevel: 1,
      unlockedLevels: [1],
      unlockedTools: ['hammer'],
      levelStars: {},
      toolPoints: 0,
    };
  }

  private save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.saveData));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  getCurrentLevel(): number { return this.saveData.currentLevel; }
  getUnlockedLevels(): number[] { return this.saveData.unlockedLevels; }
  getUnlockedTools(): string[] { return this.saveData.unlockedTools; }
  getToolPoints(): number { return this.saveData.toolPoints; }
  getLevelStars(level: number): number { return this.saveData.levelStars[level] || 0; }

  completeLevel(level: number, stars: number): void {
    const currentStars = this.getLevelStars(level);
    if (stars > currentStars) {
      this.saveData.levelStars[level] = stars;
      this.saveData.toolPoints += (stars - currentStars) * 10;
    }
    const nextLevel = level + 1;
    if (!this.saveData.unlockedLevels.includes(nextLevel)) {
      this.saveData.unlockedLevels.push(nextLevel);
    }
    this.save();
  }

  unlockTool(toolId: string): void {
    if (!this.saveData.unlockedTools.includes(toolId)) {
      this.saveData.unlockedTools.push(toolId);
      this.save();
    }
  }

  getSaveData(): SaveData { return this.saveData; }
}
