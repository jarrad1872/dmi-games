/**
 * PowerUp - Collectible power-up class
 */

import { PowerUpDefinition } from '../data/powerups';
import { Player } from './Player';

export class PowerUp {
  x: number;
  y: number;
  width: number = 50;
  height: number = 50;
  color: string;
  lane: number;
  active: boolean = true;
  collected: boolean = false;
  definition: PowerUpDefinition;

  // Animation
  private bobOffset: number = 0;
  private bobTimer: number = 0;
  private glowIntensity: number = 0;

  constructor(definition: PowerUpDefinition, lane: number, startY: number, baseX: number) {
    this.definition = definition;
    this.color = definition.color;
    this.lane = lane;
    this.y = startY;
    this.x = baseX + Player.LANES[lane];
  }

  update(speed: number, deltaTime: number): void {
    // Move toward player (down the screen)
    this.y += speed * (deltaTime / 1000);

    // Bob animation
    this.bobTimer += deltaTime;
    this.bobOffset = Math.sin(this.bobTimer / 200) * 8;

    // Glow pulse
    this.glowIntensity = (Math.sin(this.bobTimer / 150) + 1) / 2;
  }

  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height + this.bobOffset,
      width: this.width,
      height: this.height,
    };
  }

  checkCollision(player: Player): boolean {
    if (!this.active || this.collected) return false;

    const pBounds = player.getBounds();
    const bounds = this.getBounds();

    // AABB collision with generous hitbox
    const collides = (
      pBounds.x < bounds.x + bounds.width + 10 &&
      pBounds.x + pBounds.width > bounds.x - 10 &&
      pBounds.y < bounds.y + bounds.height + 10 &&
      pBounds.y + pBounds.height > bounds.y - 10
    );

    return collides;
  }

  collect(): void {
    this.collected = true;
    this.active = false;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.collected) return;

    const bounds = this.getBounds();
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    ctx.save();

    // ENHANCED: Bigger, brighter glow
    const glowRadius = 40 + this.glowIntensity * 20;
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, glowRadius
    );
    gradient.addColorStop(0, this.color + 'AA'); // Brighter glow
    gradient.addColorStop(1, this.color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(
      centerX - glowRadius,
      centerY - glowRadius,
      glowRadius * 2,
      glowRadius * 2
    );

    // ENHANCED: Pulsing hexagon for power-ups
    const sizePulse = 1 + this.glowIntensity * 0.15; // Pulse size
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6 - Math.PI / 2;
      const radius = (this.width / 2 - 5) * sizePulse;
      const px = centerX + Math.cos(angle) * radius;
      const py = centerY + Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();

    // ENHANCED: Thicker, glowing border
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Icon based on effect type
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let icon = '★';
    switch (this.definition.effect) {
      case 'shield': icon = '🛡'; break;
      case 'multiplier': icon = '×2'; break;
      case 'magnet': icon = '🧲'; break;
      case 'boost': icon = '⚡'; break;
      case 'jetpack': icon = '🚀'; break;
    }
    ctx.fillText(icon, centerX, centerY);

    ctx.restore();
  }
}



