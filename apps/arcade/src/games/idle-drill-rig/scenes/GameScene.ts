/**
 * Game Scene - Main drilling gameplay
 */

import { Scene } from './Scene';
import type { Game } from '../Game';
import { getLayerAtDepth } from '../data/layers';
import { ParticleSystem } from '../systems/ParticleSystem';
import { IdleSystem } from '../systems/IdleSystem';
import { formatNumber, drawText, renderButton, isPointInButton, Button } from '../ui/helpers';
import { trackToolDrop } from '@dmi-games/game-sdk';

export class GameScene extends Scene {
  private particles: ParticleSystem;
  private idle: IdleSystem;
  
  // Drill animation
  private drilling: boolean = false;
  private drillProgress: number = 0;
  private drillAnimTime: number = 0;

  // UI buttons
  private shopButton: Button;
  private prestigeButton: Button;

  constructor(game: Game) {
    super(game);
    
    this.particles = new ParticleSystem();
    this.idle = new IdleSystem(game.getProgression());

    const canvas = game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    this.shopButton = {
      x: w - 120,
      y: 20,
      width: 100,
      height: 40,
      text: 'Shop',
      enabled: true,
      color: '#2196F3',
    };

    this.prestigeButton = {
      x: 20,
      y: h - 60,
      width: 150,
      height: 40,
      text: 'Prestige',
      enabled: false,
      color: '#9C27B0',
    };
  }

  enter(): void {
    console.log('[Idle Drill Rig] Entered game scene');
  }

  exit(): void {
    this.particles.clear();
  }

  update(deltaTime: number): void {
    const progression = this.game.getProgression();

    // Update particles
    this.particles.update(deltaTime);

    // Idle drilling
    const idleDrills = this.idle.update(deltaTime);
    if (idleDrills > 0) {
      this.executeDrill(idleDrills);
    }

    // Drill animation
    if (this.drilling) {
      this.drillAnimTime += deltaTime;
      this.drillProgress += deltaTime / 500; // 500ms per drill
      
      if (this.drillProgress >= 1) {
        this.drillProgress = 0;
        this.drilling = false;
      }
    }

    // Update prestige button
    this.prestigeButton.enabled = progression.canPrestige();
  }

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const progression = this.game.getProgression();
    const depth = progression.getDepth();
    const cores = progression.getCores();
    const currentDrill = progression.getCurrentDrill();
    const layer = getLayerAtDepth(depth);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f1e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Layer visualization (depth meter)
    this.renderDepthMeter(ctx, w, h, depth);

    // Drill rig
    this.renderDrillRig(ctx, w, h);

    // Particles
    this.particles.render(ctx);

    // Stats
    drawText(ctx, `Depth: ${formatNumber(depth)}m`, 20, 20, {
      font: 'bold 24px sans-serif',
      color: '#fff',
      shadow: true,
    });

    drawText(ctx, `Cores: ${formatNumber(cores)}`, 20, 55, {
      font: 'bold 20px sans-serif',
      color: '#FFD700',
      shadow: true,
    });

    drawText(ctx, `Layer: ${layer.name}`, 20, 85, {
      font: '16px sans-serif',
      color: layer.color,
    });

    if (currentDrill) {
      drawText(ctx, `Bit: ${currentDrill.name}`, 20, 110, {
        font: '16px sans-serif',
        color: currentDrill.color,
      });
    }

    const dps = this.idle.getTotalDrillsPerSecond();
    if (dps > 0) {
      drawText(ctx, `Auto: ${formatNumber(dps)}/s`, 20, 135, {
        font: '16px sans-serif',
        color: '#4CAF50',
      });
    }

    // Prestige info
    const prestigeLevel = progression.getPrestigeLevel();
    if (prestigeLevel > 0) {
      drawText(ctx, `Prestige: ${prestigeLevel} (${Math.floor((progression.getPrestigeMultiplier() - 1) * 100)}% bonus)`, 20, 160, {
        font: '14px sans-serif',
        color: '#9C27B0',
      });
    }

    // Tap to drill prompt
    drawText(ctx, 'TAP TO DRILL', w / 2, h - 100, {
      font: 'bold 32px sans-serif',
      color: this.drilling ? '#4CAF50' : '#fff',
      align: 'center',
      shadow: true,
    });

    // Buttons
    renderButton(ctx, this.shopButton);
    renderButton(ctx, this.prestigeButton);
  }

  private renderDepthMeter(ctx: CanvasRenderingContext2D, w: number, h: number, depth: number): void {
    const meterX = w - 60;
    const meterY = 100;
    const meterWidth = 40;
    const meterHeight = h - 200;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

    // Layers (visual representation)
    const layers = [
      { start: 0, end: 50, color: '#8B4513' },
      { start: 50, end: 200, color: '#696969' },
      { start: 200, end: 500, color: '#2F4F4F' },
      { start: 500, end: 1000, color: '#FF4500' },
    ];

    for (const layer of layers) {
      const startY = meterY + (layer.start / 1000) * meterHeight;
      const endY = meterY + (Math.min(layer.end, 1000) / 1000) * meterHeight;
      
      ctx.fillStyle = layer.color;
      ctx.fillRect(meterX, startY, meterWidth, endY - startY);
    }

    // Current depth indicator
    const depthY = meterY + Math.min(depth / 1000, 1) * meterHeight;
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(meterX - 5, depthY - 2, meterWidth + 10, 4);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
  }

  private renderDrillRig(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const centerX = w / 2;
    const centerY = h / 2;
    const progression = this.game.getProgression();
    const currentDrill = progression.getCurrentDrill();

    // Rig body
    ctx.fillStyle = '#555';
    ctx.fillRect(centerX - 40, centerY - 60, 80, 40);

    // DMI branding
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DMI', centerX, centerY - 35);

    // Drill bit (animated)
    const drillY = centerY - 20 + (this.drilling ? Math.sin(this.drillAnimTime * 0.02) * 5 : 0);
    ctx.fillStyle = currentDrill?.color || '#888';
    ctx.beginPath();
    ctx.moveTo(centerX, drillY);
    ctx.lineTo(centerX - 15, drillY + 40);
    ctx.lineTo(centerX + 15, drillY + 40);
    ctx.closePath();
    ctx.fill();

    // Drill tip
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(centerX, drillY + 50);
    ctx.lineTo(centerX - 10, drillY + 40);
    ctx.lineTo(centerX + 10, drillY + 40);
    ctx.closePath();
    ctx.fill();
  }

  onTap(x: number, y: number): void {
    // Check buttons first
    if (isPointInButton(x, y, this.shopButton)) {
      this.game.changeScene('shop');
      return;
    }

    if (isPointInButton(x, y, this.prestigeButton) && this.prestigeButton.enabled) {
      const progression = this.game.getProgression();
      if (confirm('Prestige? This will reset your progress but give a permanent +10% cores bonus.')) {
        progression.prestige();
      }
      return;
    }

    // Drill
    this.executeDrill(1);
    this.drilling = true;
    this.drillAnimTime = 0;
  }

  private executeDrill(count: number = 1): void {
    const progression = this.game.getProgression();
    const currentDrill = progression.getCurrentDrill();
    const depth = progression.getDepth();
    const layer = getLayerAtDepth(depth);

    if (!currentDrill) return;

    // Calculate depth gain
    const speed = currentDrill.baseSpeed / layer.hardness;
    const depthGain = speed * count;
    
    // Calculate core gain
    const coreGain = layer.coreValue * count;

    // Apply
    progression.addDepth(depthGain);
    progression.addCores(coreGain);
    progression.incrementDrills();

    // Particles
    const canvas = this.game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    this.particles.spawn(w / 2, h / 2 + 50, 5, layer.color);

    // Check for tool drop trigger (every 100m milestone)
    const newDepth = progression.getDepth();
    if (Math.floor(newDepth / 100) > Math.floor(depth / 100)) {
      this.triggerToolDrop();
    }
  }

  private triggerToolDrop(): void {
    const progression = this.game.getProgression();
    const currentDrill = progression.getCurrentDrill();
    
    if (currentDrill) {
      trackToolDrop({
        productName: currentDrill.name,
        context: `Reached ${Math.floor(progression.getDepth())}m depth. Your rig uses DMI bits.`,
      });
    }
  }
}
