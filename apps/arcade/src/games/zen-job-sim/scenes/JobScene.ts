/**
 * Job Scene - The actual cleaning gameplay
 */

import { Scene } from './Scene';
import { Game } from '../Game';
import { JOBS, JobDefinition, DirtPatch } from '../data/jobs';
import { TOOLS } from '../data/tools';
import { showToolDrop } from '@dmi-games/game-sdk';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export class JobScene extends Scene {
  private job: JobDefinition | null = null;
  private dirtPatches: DirtPatch[] = [];
  private currentTool = TOOLS[0];
  private spraying = false;
  private sprayX = 0;
  private sprayY = 0;
  private particles: Particle[] = [];
  private startTime = 0;
  private elapsedTime = 0;
  private jobComplete = false;
  private showingResults = false;
  private completionAlpha = 0;

  enter(): void {
    this.spraying = false;
    this.particles = [];
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.jobComplete = false;
    this.showingResults = false;
    this.completionAlpha = 0;
  }

  exit(): void {}

  setJob(jobId: number): void {
    const job = JOBS.find((j) => j.id === jobId);
    if (!job) return;

    this.job = job;
    this.dirtPatches = job.dirtPatches.map((patch) => ({
      ...patch,
      health: this.getDirtHealth(patch.type),
    }));
  }

  private getDirtHealth(type: string): number {
    switch (type) {
      case 'light':
        return 50;
      case 'medium':
        return 100;
      case 'hard':
        return 200;
      default:
        return 50;
    }
  }

  private getDirtColor(type: string, healthPercent: number): string {
    const alpha = healthPercent;
    switch (type) {
      case 'light':
        return `rgba(139, 115, 85, ${alpha})`;
      case 'medium':
        return `rgba(101, 67, 33, ${alpha})`;
      case 'hard':
        return `rgba(61, 43, 31, ${alpha})`;
      default:
        return `rgba(139, 115, 85, ${alpha})`;
    }
  }

  update(deltaTime: number): void {
    if (!this.job || this.showingResults) return;

    // Update time
    if (!this.jobComplete) {
      this.elapsedTime = (Date.now() - this.startTime) / 1000;
    }

    // Clean dirt if spraying
    if (this.spraying) {
      this.cleanDirt(this.sprayX, this.sprayY, deltaTime);
      this.spawnParticles(this.sprayX, this.sprayY);
    }

    // Update particles
    this.updateParticles(deltaTime);

    // Check completion
    if (!this.jobComplete && this.getCleanPercent() >= 100) {
      this.completeJob();
    }

    // Fade in completion screen
    if (this.jobComplete && !this.showingResults) {
      this.completionAlpha = Math.min(1, this.completionAlpha + deltaTime / 500);
      if (this.completionAlpha >= 1) {
        this.showingResults = true;
      }
    }
  }

  private cleanDirt(x: number, y: number, deltaTime: number): void {
    const range = this.currentTool.range;
    const power = this.currentTool.power * (deltaTime / 16.67); // Normalize to ~60fps

    this.dirtPatches.forEach((patch) => {
      if (patch.health <= 0) return;
      if (!this.currentTool.canClean.includes(patch.type)) return;

      // Check if spray overlaps dirt patch
      const dx = Math.max(patch.x, Math.min(x, patch.x + patch.width)) - x;
      const dy = Math.max(patch.y, Math.min(y, patch.y + patch.height)) - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < range) {
        patch.health = Math.max(0, patch.health - power);
      }
    });
  }

  private spawnParticles(x: number, y: number): void {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 500,
        maxLife: 500,
      });
    }
    if (this.particles.length > 200) {
      this.particles = this.particles.slice(-200);
    }
  }

  private updateParticles(deltaTime: number): void {
    this.particles = this.particles.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= deltaTime;
      return p.life > 0;
    });
  }

  private getCleanPercent(): number {
    if (!this.job) return 0;
    const totalHealth = this.job.dirtPatches.reduce(
      (sum, p) => sum + this.getDirtHealth(p.type),
      0
    );
    const currentHealth = this.dirtPatches.reduce((sum, p) => sum + p.health, 0);
    return ((totalHealth - currentHealth) / totalHealth) * 100;
  }

  private getStars(): number {
    if (!this.job) return 0;
    const timeRatio = this.elapsedTime / this.job.timeTarget;
    if (timeRatio <= 1) return 3;
    if (timeRatio <= 1.5) return 2;
    return 1;
  }

  private completeJob(): void {
    if (!this.job) return;
    this.jobComplete = true;
    const stars = this.getStars();
    this.game.getProgression().completeJob(this.job.id, stars, this.job.coinReward);

    // Check if tool unlocked
    const newTool = TOOLS.find(
      (t) => t.unlockJob === this.job!.id && !this.game.getProgression().hasUnlockedTool(t.id)
    );
    if (newTool && newTool.dmiProduct) {
      setTimeout(() => {
        showToolDrop({
          title: `${newTool.name} Unlocked!`,
          description: newTool.dmiProduct,
          cta: 'Check It Out',
          imageUrl: '',
        });
      }, 2000);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.job) return;

    const canvas = this.game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Background
    ctx.fillStyle = this.job.bgColor;
    ctx.fillRect(0, 0, w, h);

    // Dirt patches
    this.dirtPatches.forEach((patch) => {
      if (patch.health <= 0) return;
      const maxHealth = this.getDirtHealth(patch.type);
      const healthPercent = patch.health / maxHealth;
      ctx.fillStyle = this.getDirtColor(patch.type, healthPercent);
      ctx.fillRect(patch.x, patch.y, patch.width, patch.height);
    });

    // Spray particles
    this.particles.forEach((p) => {
      const alpha = p.life / p.maxLife;
      ctx.fillStyle = `rgba(100, 150, 255, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Spray effect when spraying
    if (this.spraying) {
      const range = this.currentTool.range;
      ctx.fillStyle = 'rgba(100, 150, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(this.sprayX, this.sprayY, range, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // UI
    this.renderUI(ctx, w, h);

    // Completion overlay
    if (this.jobComplete) {
      this.renderCompletion(ctx, w, h);
    }
  }

  private renderUI(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // Progress bar
    const barWidth = w - 40;
    const barHeight = 30;
    const barX = 20;
    const barY = 20;

    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    const percent = this.getCleanPercent();
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(barX, barY, (barWidth * percent) / 100, barHeight);

    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 18px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.floor(percent)}% Clean`, w / 2, barY + barHeight / 2);

    // Time
    ctx.font = '16px Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Time: ${Math.floor(this.elapsedTime)}s`, 20, 65);

    // Tool name
    ctx.textAlign = 'right';
    ctx.fillText(this.currentTool.name, w - 20, 65);
  }

  private renderCompletion(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = `rgba(0, 0, 0, ${this.completionAlpha * 0.7})`;
    ctx.fillRect(0, 0, w, h);

    if (this.showingResults) {
      const stars = this.getStars();

      // Title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('JOB COMPLETE!', w / 2, h / 2 - 100);

      // Stars
      ctx.font = '64px sans-serif';
      const starY = h / 2;
      for (let i = 0; i < 3; i++) {
        const starX = w / 2 - 80 + i * 80;
        ctx.fillText(i < stars ? '⭐' : '☆', starX, starY);
      }

      // Stats
      ctx.font = '24px Roboto, sans-serif';
      ctx.fillText(`Time: ${Math.floor(this.elapsedTime)}s`, w / 2, h / 2 + 60);
      ctx.fillText(`Earned: ${this.job?.coinReward} coins`, w / 2, h / 2 + 95);

      // Continue button
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(w / 2 - 100, h / 2 + 140, 200, 60);
      ctx.strokeStyle = '#229954';
      ctx.lineWidth = 3;
      ctx.strokeRect(w / 2 - 100, h / 2 + 140, 200, 60);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Roboto, sans-serif';
      ctx.fillText('CONTINUE', w / 2, h / 2 + 170);
    }
  }

  onPointerDown(x: number, y: number): void {
    if (this.showingResults) {
      const canvas = this.game.getCanvas();
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Check continue button
      if (
        x >= w / 2 - 100 &&
        x <= w / 2 + 100 &&
        y >= h / 2 + 140 &&
        y <= h / 2 + 200
      ) {
        this.game.changeScene('menu');
      }
    } else {
      this.spraying = true;
      this.sprayX = x;
      this.sprayY = y;
    }
  }

  onPointerMove(x: number, y: number): void {
    if (this.spraying && !this.showingResults) {
      this.sprayX = x;
      this.sprayY = y;
    }
  }

  onPointerUp(): void {
    this.spraying = false;
  }
}
