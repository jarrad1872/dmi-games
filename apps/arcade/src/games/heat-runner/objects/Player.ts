/**
 * Player - Animated construction worker character
 * Clean 2D design with smooth animations
 */

import type { PowerUpDefinition } from '../data/powerups';

export type PlayerState = 'running' | 'jumping' | 'sliding' | 'hit';
export type ActiveEffect = 'shield' | 'multiplier' | 'magnet' | 'boost' | 'jetpack' | null;

export class Player {
  // Position
  x: number;
  y: number;
  groundY: number;
  baseX: number;

  // Lane system
  lane: number = 1;
  targetLane: number = 1;
  static readonly LANES = [-120, 0, 120];
  private laneTransition: number = 0;

  // Dimensions
  width: number = 50;
  height: number = 80;

  // State
  state: PlayerState = 'running';
  isInvincible: boolean = false;

  // Active power-up
  activeEffect: ActiveEffect = null;
  effectTimer: number = 0;
  effectColor: string = '';
  scoreMultiplier: number = 1;
  magnetActive: boolean = false;
  boostActive: boolean = false;

  // Jump physics
  velocityY: number = 0;
  private readonly GRAVITY = 2200;
  private readonly JUMP_FORCE = -750;
  
  // Slide
  slideTimer: number = 0;
  private readonly SLIDE_DURATION = 600;
  
  // Animation
  private runCycle: number = 0;
  private bobOffset: number = 0;
  private squashStretch: number = 1;
  private targetSquash: number = 1;
  private armSwing: number = 0;
  private legPhase: number = 0;
  
  // Juice
  private hitFlash: number = 0;
  
  constructor(groundY: number, centerX: number) {
    this.groundY = groundY;
    this.y = groundY;
    this.baseX = centerX;
    this.x = centerX;
  }
  
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    
    // Smooth lane transition
    const targetX = this.baseX + Player.LANES[this.lane];
    const laneSpeed = 800;
    const dx = targetX - this.x;
    if (Math.abs(dx) > 1) {
      this.x += Math.sign(dx) * Math.min(Math.abs(dx), laneSpeed * dt);
      this.laneTransition = Math.min(1, Math.abs(dx) / 60); // For lean effect
    } else {
      this.x = targetX;
      this.laneTransition = 0;
    }
    
    // Jump physics
    if (this.state === 'jumping') {
      this.velocityY += this.GRAVITY * dt;
      this.y += this.velocityY * dt;
      
      // Squash/stretch based on velocity
      if (this.velocityY < 0) {
        this.targetSquash = 1.2; // Stretch going up
      } else {
        this.targetSquash = 0.9; // Squash coming down
      }
      
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
        this.state = 'running';
        this.targetSquash = 0.7; // Landing squash
        setTimeout(() => { this.targetSquash = 1; }, 100);
      }
    }
    
    // Slide timer
    if (this.state === 'sliding') {
      this.slideTimer -= deltaTime;
      if (this.slideTimer <= 0) {
        this.state = 'running';
      }
    }
    
    // Running animation
    if (this.state === 'running') {
      this.runCycle += deltaTime * 0.015;
      this.bobOffset = Math.sin(this.runCycle * 2) * 3;
      this.armSwing = Math.sin(this.runCycle * 2) * 0.4;
      this.legPhase = this.runCycle * 2;
      this.targetSquash = 1;
    } else if (this.state === 'sliding') {
      this.bobOffset = 0;
    }
    
    // Smooth squash/stretch
    this.squashStretch += (this.targetSquash - this.squashStretch) * 0.2;
    
    // Hit flash decay
    if (this.hitFlash > 0) {
      this.hitFlash -= deltaTime;
    }

    // Update power-up effect
    this.updateEffect(deltaTime);
  }
  
  jump(): void {
    if (this.state === 'running' || this.state === 'sliding') {
      this.state = 'jumping';
      this.velocityY = this.JUMP_FORCE;
      this.slideTimer = 0;
      this.targetSquash = 0.8;
    }
  }
  
  slide(): void {
    if (this.state === 'running') {
      this.state = 'sliding';
      this.slideTimer = this.SLIDE_DURATION;
    }
  }
  
  moveLeft(): void {
    if (this.lane > 0) {
      this.lane--;
    }
  }
  
  moveRight(): void {
    if (this.lane < 2) {
      this.lane++;
    }
  }
  
  hit(): void {
    if (!this.isInvincible) {
      this.state = 'hit';
      this.hitFlash = 500;
    }
  }
  
  reset(): void {
    this.lane = 1;
    this.y = this.groundY;
    this.x = this.baseX;
    this.velocityY = 0;
    this.state = 'running';
    this.isInvincible = false;
    this.slideTimer = 0;
    this.squashStretch = 1;
    this.clearEffect();
  }

  activatePowerUp(powerUp: PowerUpDefinition): void {
    this.activeEffect = powerUp.effect;
    this.effectTimer = powerUp.duration * 1000;
    this.effectColor = powerUp.color;

    switch (powerUp.effect) {
      case 'shield':
        this.isInvincible = true;
        this.effectTimer = 5000;
        break;
      case 'multiplier':
        this.scoreMultiplier = 2;
        break;
      case 'magnet':
        this.magnetActive = true;
        break;
      case 'boost':
        this.boostActive = true;
        break;
    }
  }

  updateEffect(deltaTime: number): void {
    if (this.activeEffect && this.effectTimer > 0) {
      this.effectTimer -= deltaTime;
      if (this.effectTimer <= 0) {
        this.clearEffect();
      }
    }
  }

  clearEffect(): void {
    this.activeEffect = null;
    this.effectTimer = 0;
    this.effectColor = '';
    this.scoreMultiplier = 1;
    this.magnetActive = false;
    this.boostActive = false;
    this.isInvincible = false;
  }
  
  getBounds(): { x: number; y: number; width: number; height: number } {
    const height = this.state === 'sliding' ? 35 : this.height;
    const yOffset = this.state === 'sliding' ? this.height - 35 : 0;
    return {
      x: this.x - this.width / 2 + 5,
      y: this.y - height + yOffset + 5,
      width: this.width - 10,
      height: height - 10,
    };
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    const drawX = this.x;
    const drawY = this.y - this.bobOffset;
    
    // Draw effect aura if active
    if (this.activeEffect && this.effectColor) {
      this.renderAura(ctx, drawX, drawY);
    }
    
    // Hit flash
    if (this.hitFlash > 0 && Math.floor(this.hitFlash / 50) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }
    
    // Apply squash/stretch transform
    ctx.translate(drawX, drawY);
    ctx.scale(2 - this.squashStretch, this.squashStretch);
    ctx.translate(-drawX, -drawY);
    
    if (this.state === 'sliding') {
      this.renderSliding(ctx, drawX, drawY);
    } else {
      this.renderStanding(ctx, drawX, drawY);
    }
    
    ctx.restore();
  }
  
  private renderAura(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const pulse = (Math.sin(Date.now() / 150) + 1) / 2;
    const auraRadius = 55 + pulse * 15;
    const centerY = y - this.height / 2;

    const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, auraRadius);
    gradient.addColorStop(0, this.effectColor + '40');
    gradient.addColorStop(0.6, this.effectColor + '20');
    gradient.addColorStop(1, this.effectColor + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, centerY, auraRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  private renderStanding(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const bodyColor = this.isInvincible ? '#FFD700' : '#FF6B00';
    const pantsColor = '#2F4F4F';
    const skinColor = '#E8B89D';
    const hatColor = '#FFD700';
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 25, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Legs (animated)
    const legOffset = Math.sin(this.legPhase) * 12;
    ctx.fillStyle = pantsColor;
    
    // Left leg
    ctx.save();
    ctx.translate(x - 10, y - 30);
    ctx.rotate(legOffset * 0.03);
    this.roundRect(ctx, -7, 0, 14, 35, 4);
    ctx.fillStyle = '#1a1a1a'; // Boot
    this.roundRect(ctx, -8, 28, 16, 10, 3);
    ctx.restore();
    
    // Right leg
    ctx.save();
    ctx.translate(x + 10, y - 30);
    ctx.rotate(-legOffset * 0.03);
    ctx.fillStyle = pantsColor;
    this.roundRect(ctx, -7, 0, 14, 35, 4);
    ctx.fillStyle = '#1a1a1a'; // Boot
    this.roundRect(ctx, -8, 28, 16, 10, 3);
    ctx.restore();
    
    // Body/Torso
    ctx.fillStyle = bodyColor;
    this.roundRect(ctx, x - 18, y - 65, 36, 40, 6);
    
    // Reflective stripes on vest
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(x - 15, y - 55, 30, 4);
    ctx.fillRect(x - 15, y - 45, 30, 4);
    
    // Arms (animated)
    ctx.fillStyle = bodyColor;
    
    // Left arm
    ctx.save();
    ctx.translate(x - 20, y - 60);
    ctx.rotate(-this.armSwing);
    this.roundRect(ctx, -6, 0, 12, 30, 4);
    // Hand
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(0, 32, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Right arm
    ctx.save();
    ctx.translate(x + 20, y - 60);
    ctx.rotate(this.armSwing);
    ctx.fillStyle = bodyColor;
    this.roundRect(ctx, -6, 0, 12, 30, 4);
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(0, 32, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Head
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(x, y - 78, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Face
    ctx.fillStyle = '#1a1a1a';
    // Eyes
    ctx.beginPath();
    ctx.arc(x - 5, y - 80, 2, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 80, 2, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.beginPath();
    ctx.arc(x, y - 74, 4, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    
    // Hard hat
    ctx.fillStyle = hatColor;
    // Hat dome
    ctx.beginPath();
    ctx.ellipse(x, y - 90, 20, 12, 0, Math.PI, 0);
    ctx.fill();
    // Hat brim
    ctx.fillRect(x - 22, y - 90, 44, 5);
    // Hat ridge
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(x - 3, y - 102, 6, 12);
  }
  
  private renderSliding(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const bodyColor = this.isInvincible ? '#FFD700' : '#FF6B00';
    const pantsColor = '#2F4F4F';
    const skinColor = '#E8B89D';
    const hatColor = '#FFD700';
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 35, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Sliding body (horizontal)
    ctx.save();
    ctx.translate(x, y - 15);
    
    // Legs stretched forward
    ctx.fillStyle = pantsColor;
    this.roundRect(ctx, 10, -8, 35, 16, 4);
    // Boots
    ctx.fillStyle = '#1a1a1a';
    this.roundRect(ctx, 40, -10, 15, 20, 5);
    
    // Torso
    ctx.fillStyle = bodyColor;
    this.roundRect(ctx, -25, -12, 40, 24, 6);
    
    // Reflective stripes
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(-20, -6, 30, 3);
    ctx.fillRect(-20, 2, 30, 3);
    
    // Head (tilted back)
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(-35, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    
    // Hard hat
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.ellipse(-35, -8, 16, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }
  
  // For menu scene - render running in place
  renderMenuPose(ctx: CanvasRenderingContext2D, x: number, y: number, time: number): void {
    ctx.save();
    
    // Simulate running animation
    this.runCycle = time * 0.008;
    this.bobOffset = Math.sin(this.runCycle * 2) * 4;
    this.armSwing = Math.sin(this.runCycle * 2) * 0.5;
    this.legPhase = this.runCycle * 2;
    
    const drawY = y - this.bobOffset;
    
    ctx.translate(x, drawY);
    ctx.translate(-x, -drawY);
    
    this.renderStanding(ctx, x, drawY);
    
    ctx.restore();
  }
}
