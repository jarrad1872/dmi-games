/**
 * Menu Scene - Job selection
 */

import { Scene } from './Scene';
import { Game } from '../Game';
import { JOBS } from '../data/jobs';

export class MenuScene extends Scene {
  private selectedJob: number = 1;
  private buttonY: number = 0;
  private buttonHeight: number = 60;

  enter(): void {
    const saveData = this.game.getProgression().getData();
    this.selectedJob = saveData.currentJob;
  }

  exit(): void {}

  update(_deltaTime: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 48px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('ZEN JOB SIM', w / 2, 40);

    // Subtitle
    ctx.font = '20px Roboto, sans-serif';
    ctx.fillStyle = '#7f8c8d';
    ctx.fillText('Select a Job', w / 2, 100);

    // Stats
    const saveData = this.game.getProgression().getData();
    ctx.font = '18px Roboto, sans-serif';
    ctx.fillText(`Coins: ${saveData.coins} | Stars: ${saveData.stars}`, w / 2, 140);

    // Job list
    const startY = 180;
    const jobHeight = 80;
    JOBS.forEach((job, i) => {
      const y = startY + i * jobHeight;
      const isUnlocked = i === 0 || saveData.completedJobs.includes(i);
      const isSelected = this.selectedJob === job.id;

      // Job card
      ctx.fillStyle = isSelected ? '#3498db' : (isUnlocked ? '#ecf0f1' : '#bdc3c7');
      ctx.fillRect(50, y, w - 100, 70);

      // Border
      ctx.strokeStyle = isSelected ? '#2980b9' : '#95a5a6';
      ctx.lineWidth = 2;
      ctx.strokeRect(50, y, w - 100, 70);

      // Text
      ctx.fillStyle = isUnlocked ? '#2c3e50' : '#7f8c8d';
      ctx.font = 'bold 24px Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(isUnlocked ? job.name : '🔒 Locked', 70, y + 25);

      if (isUnlocked) {
        ctx.font = '16px Roboto, sans-serif';
        ctx.fillStyle = '#7f8c8d';
        ctx.fillText(`${job.category.toUpperCase()} | ${job.coinReward} coins`, 70, y + 50);
      }
    });

    // Start button
    this.buttonY = h - 100;
    const isJobUnlocked = this.selectedJob === 1 || saveData.completedJobs.includes(this.selectedJob - 1);
    ctx.fillStyle = isJobUnlocked ? '#27ae60' : '#95a5a6';
    ctx.fillRect(w / 2 - 100, this.buttonY, 200, this.buttonHeight);
    ctx.strokeStyle = isJobUnlocked ? '#229954' : '#7f8c8d';
    ctx.lineWidth = 3;
    ctx.strokeRect(w / 2 - 100, this.buttonY, 200, this.buttonHeight);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isJobUnlocked ? 'START JOB' : 'LOCKED', w / 2, this.buttonY + this.buttonHeight / 2);
  }

  onPointerDown(x: number, y: number): void {
    const canvas = this.game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Check job selection
    const startY = 180;
    const jobHeight = 80;
    const saveData = this.game.getProgression().getData();
    JOBS.forEach((job, i) => {
      const y = startY + i * jobHeight;
      if (x >= 50 && x <= w - 50 && y >= y && y <= y + 70) {
        const isUnlocked = i === 0 || saveData.completedJobs.includes(i);
        if (isUnlocked) {
          this.selectedJob = job.id;
        }
      }
    });

    // Check start button
    if (
      x >= w / 2 - 100 &&
      x <= w / 2 + 100 &&
      y >= this.buttonY &&
      y <= this.buttonY + this.buttonHeight
    ) {
      const isJobUnlocked = this.selectedJob === 1 || saveData.completedJobs.includes(this.selectedJob - 1);
      if (isJobUnlocked) {
        (this.game.getCanvas().parentElement?.querySelector('.job-scene') as any)?.setJob?.(this.selectedJob);
        this.game.changeScene('job');
      }
    }
  }
}
