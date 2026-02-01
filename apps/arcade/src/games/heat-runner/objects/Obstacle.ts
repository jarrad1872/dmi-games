/**
 * Obstacle - ENHANCED with glowing outlines and better visibility
 * Clean geometric designs with maximum visual punch
 */

import { ObstacleDefinition, AvoidMethod } from '../data/obstacles';
import { Player } from './Player';

export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  avoidMethod: AvoidMethod;
  lane: number;
  active: boolean = true;
  definition: ObstacleDefinition;
  
  // Animation
  private wobble: number = 0;
  private spawnTime: number;
  private glowPulse: number = 0;
  
  constructor(definition: ObstacleDefinition, lane: number, startY: number, baseX: number) {
    this.definition = definition;
    this.width = definition.width;
    this.height = definition.height;
    this.color = definition.color;
    this.avoidMethod = definition.avoidMethod;
    this.lane = lane;
    this.y = startY;
    this.x = baseX + Player.LANES[lane];
    this.spawnTime = Date.now();
    this.wobble = Math.random() * Math.PI * 2;
  }
  
  update(speed: number, deltaTime: number): void {
    this.y += speed * (deltaTime / 1000);
    this.wobble += deltaTime * 0.005;
    this.glowPulse += deltaTime * 0.003;
  }
  
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height,
      width: this.width,
      height: this.height,
    };
  }
  
  checkCollision(player: Player): boolean {
    if (!this.active) return false;
    
    const pBounds = player.getBounds();
    const oBounds = this.getBounds();
    
    const collides = (
      pBounds.x < oBounds.x + oBounds.width &&
      pBounds.x + pBounds.width > oBounds.x &&
      pBounds.y < oBounds.y + oBounds.height &&
      pBounds.y + pBounds.height > oBounds.y
    );
    
    if (!collides) return false;
    if (player.isInvincible) return false;
    
    switch (this.avoidMethod) {
      case 'jump':
        if (player.state === 'jumping' && player.y < player.groundY - 50) {
          return false;
        }
        break;
      case 'slide':
        if (player.state === 'sliding') {
          return false;
        }
        break;
      case 'lane':
        if (player.lane !== this.lane) {
          return false;
        }
        break;
      case 'any':
        if (player.state === 'jumping' || player.state === 'sliding' || player.lane !== this.lane) {
          return false;
        }
        break;
    }
    
    return true;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const bounds = this.getBounds();
    
    ctx.save();
    
    // ENHANCED: Pulsing glow for high visibility
    const glowIntensity = 0.7 + Math.sin(this.glowPulse) * 0.3;
    ctx.shadowColor = this.definition.id === 'forklift' ? '#FFD700' : '#FF6B00';
    ctx.shadowBlur = 20 * glowIntensity;
    
    // Shadow on ground
    ctx.shadowBlur = 0; // Reset for shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 5, this.width / 2 + 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Restore glow for obstacle
    ctx.shadowColor = this.definition.id === 'forklift' ? '#FFD700' : '#FF6B00';
    ctx.shadowBlur = 20 * glowIntensity;
    
    // Render based on type
    switch (this.definition.id) {
      case 'barrier':
        this.renderBarrier(ctx, bounds);
        break;
      case 'scaffold':
        this.renderScaffold(ctx, bounds);
        break;
      case 'forklift':
        this.renderForklift(ctx, bounds);
        break;
      case 'rebar':
        this.renderRebar(ctx, bounds);
        break;
      case 'wet_cement':
        this.renderWetCement(ctx, bounds);
        break;
      default:
        this.renderGeneric(ctx, bounds);
    }
    
    // ENHANCED: Bright outline for all obstacles
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    this.roundRect(ctx, bounds.x - 2, bounds.y - 2, bounds.width + 4, bounds.height + 4, 10);
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    ctx.restore();
  }  
  private renderBarrier(ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }): void {
    // Concrete barrier with BRIGHT orange/white stripes
    ctx.fillStyle = '#4A4A4A';
    this.roundRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height, 8);
    
    // Diagonal hazard stripes - BRIGHTER
    ctx.save();
    ctx.beginPath();
    this.roundRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height, 8);
    ctx.clip();
    
    const stripeWidth = 15;
    ctx.fillStyle = '#FF8800'; // Brighter orange
    for (let i = -bounds.height; i < bounds.width + bounds.height; i += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(bounds.x + i, bounds.y + bounds.height);
      ctx.lineTo(bounds.x + i + stripeWidth, bounds.y + bounds.height);
      ctx.lineTo(bounds.x + i + bounds.height + stripeWidth, bounds.y);
      ctx.lineTo(bounds.x + i + bounds.height, bounds.y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    
    // Top edge highlight
    ctx.fillStyle = '#6A6A6A';
    this.roundRect(ctx, bounds.x + 2, bounds.y, bounds.width - 4, 8, 4);
  }
  
  private renderScaffold(ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }): void {
    const poleColor = '#888888'; // Brighter
    const platformColor = '#A0522D'; // Brighter brown
    
    // Vertical poles
    ctx.fillStyle = poleColor;
    ctx.fillRect(bounds.x + 5, bounds.y, 8, bounds.height);
    ctx.fillRect(bounds.x + bounds.width - 13, bounds.y, 8, bounds.height);
    
    // Horizontal platforms
    ctx.fillStyle = platformColor;
    ctx.fillRect(bounds.x, bounds.y + 10, bounds.width, 8);
    ctx.fillRect(bounds.x, bounds.y + bounds.height - 15, bounds.width, 8);
    
    // Cross bracing
    ctx.strokeStyle = poleColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bounds.x + 9, bounds.y + 18);
    ctx.lineTo(bounds.x + bounds.width - 9, bounds.y + bounds.height - 15);
    ctx.moveTo(bounds.x + bounds.width - 9, bounds.y + 18);
    ctx.lineTo(bounds.x + 9, bounds.y + bounds.height - 15);
    ctx.stroke();
    
    // ENHANCED: Brighter caution tape
    ctx.fillStyle = '#FFDD00';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFDD00';
    ctx.fillRect(bounds.x - 5, bounds.y + bounds.height / 2 - 3, bounds.width + 10, 7);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    for (let i = 0; i < bounds.width + 10; i += 12) {
      ctx.fillRect(bounds.x - 5 + i, bounds.y + bounds.height / 2 - 3, 6, 7);
    }
  }
  
  private renderForklift(ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }): void {
    // Main body - BRIGHTER yellow
    ctx.fillStyle = '#FFDD00';
    this.roundRect(ctx, bounds.x + 10, bounds.y + 20, bounds.width - 20, bounds.height - 35, 5);
    
    // Cab
    ctx.fillStyle = '#444444';
    this.roundRect(ctx, bounds.x + 20, bounds.y + 5, bounds.width - 40, 25, 4);
    
    // Window - BRIGHTER
    ctx.fillStyle = '#9DD9FF';
    ctx.fillRect(bounds.x + 25, bounds.y + 10, bounds.width - 50, 15);
    
    // Forks
    ctx.fillStyle = '#777777';
    ctx.fillRect(bounds.x, bounds.y + bounds.height - 25, 8, 25);
    ctx.fillRect(bounds.x + bounds.width - 8, bounds.y + bounds.height - 25, 8, 25);
    ctx.fillRect(bounds.x, bounds.y + bounds.height - 8, bounds.width, 8);
    
    // Wheels
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.arc(bounds.x + 20, bounds.y + bounds.height, 12, 0, Math.PI * 2);
    ctx.arc(bounds.x + bounds.width - 20, bounds.y + bounds.height, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // ENHANCED: Brighter warning light
    const flash = Math.sin(this.wobble * 3) > 0;
    if (flash) {
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#FF4500';
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.arc(bounds.x + bounds.width / 2, bounds.y + 5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Larger glow
      ctx.fillStyle = 'rgba(255, 69, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(bounds.x + bounds.width / 2, bounds.y + 5, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  private renderRebar(ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }): void {
    // Bundle of rebar sticks
    const rebarColor = '#A0522D'; // Brighter
    const rustColor = '#CD853F'; // Brighter rust
    
    // Ground bundle base
    ctx.fillStyle = '#6D4C41';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - 5, bounds.width / 2, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Individual rebar rods
    const numRods = 7;
    for (let i = 0; i < numRods; i++) {
      const angle = (i / numRods) * Math.PI - Math.PI / 2;
      const rodX = this.x + Math.cos(angle) * 20;
      const spread = Math.sin(angle) * 15;
      
      ctx.fillStyle = i % 2 === 0 ? rebarColor : rustColor;
      ctx.beginPath();
      ctx.moveTo(rodX - 4, this.y - 5);
      ctx.lineTo(rodX + spread - 3, bounds.y);
      ctx.lineTo(rodX + spread + 3, bounds.y);
      ctx.lineTo(rodX + 4, this.y - 5);
      ctx.closePath();
      ctx.fill();
      
      // Rod tip
      ctx.beginPath();
      ctx.arc(rodX + spread, bounds.y + 3, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  private renderWetCement(ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }): void {
    // Wet cement puddle - brighter
    ctx.fillStyle = '#999999';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - 8, bounds.width / 2 + 10, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner lighter area
    ctx.fillStyle = '#AAAAAA';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - 10, bounds.width / 2, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Animated ripples
    const ripplePhase = this.wobble;
    ctx.strokeStyle = '#BBBBBB';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const rippleRadius = 15 + ((ripplePhase + i * 2) % 6) * 8;
      const alpha = 1 - ((ripplePhase + i * 2) % 6) / 6;
      ctx.globalAlpha = alpha * 0.5;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y - 10, rippleRadius, rippleRadius * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // ENHANCED: Brighter caution sign
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFDD00';
    ctx.fillStyle = '#FFDD00';
    ctx.beginPath();
    ctx.moveTo(this.x, bounds.y);
    ctx.lineTo(this.x - 15, bounds.y + 25);
    ctx.lineTo(this.x + 15, bounds.y + 25);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', this.x, bounds.y + 20);
  }
  
  private renderGeneric(ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }): void {
    ctx.fillStyle = this.color;
    this.roundRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height, 5);
    
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    ctx.stroke();
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
}
