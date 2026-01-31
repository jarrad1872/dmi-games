/**
 * Sliceable Object
 * The main object that gets cut by the player
 */

import { ObjectDefinition } from '../data/objects';
import { BoundingBox } from '../systems/SliceSystem';

export class SliceableObject {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public definition: ObjectDefinition;
  public currentHealth: number;
  public maxHealth: number;
  public sliceProgress: number = 0; // Visual progress of current slice

  // Animation
  private shakeOffset = { x: 0, y: 0 };
  private shakeIntensity = 0;
  private pulseScale = 1;
  private pulsePhase = 0;

  constructor(x: number, y: number, width: number, height: number, definition: ObjectDefinition) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.definition = definition;
    this.maxHealth = definition.requiredSwipes;
    this.currentHealth = this.maxHealth;
  }

  /**
   * Get bounding box for collision detection
   */
  getBounds(): BoundingBox {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Apply damage from a slice
   */
  damage(amount: number = 1): boolean {
    this.currentHealth -= amount;
    this.shake(10);
    return this.currentHealth <= 0;
  }

  /**
   * Check if object is destroyed
   */
  isDestroyed(): boolean {
    return this.currentHealth <= 0;
  }

  /**
   * Start shake effect
   */
  shake(intensity: number): void {
    this.shakeIntensity = intensity;
  }

  /**
   * Update animations
   */
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    // Update shake
    if (this.shakeIntensity > 0) {
      this.shakeOffset.x = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeOffset.y = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.shakeIntensity *= 0.85;

      if (this.shakeIntensity < 0.5) {
        this.shakeIntensity = 0;
        this.shakeOffset.x = 0;
        this.shakeOffset.y = 0;
      }
    }

    // Update pulse animation
    this.pulsePhase += dt * 2;
    this.pulseScale = 1 + Math.sin(this.pulsePhase) * 0.02;
  }

  /**
   * Render the object
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Apply transforms
    ctx.translate(
      this.x + this.shakeOffset.x,
      this.y + this.shakeOffset.y
    );
    ctx.scale(this.pulseScale, this.pulseScale);

    const halfW = this.width / 2;
    const halfH = this.height / 2;

    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(5, halfH + 10, halfW * 0.8, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw main object body
    ctx.fillStyle = this.definition.color;
    this.drawRoundedRect(ctx, -halfW, -halfH, this.width, this.height, 10);
    ctx.fill();

    // Draw accent/highlight
    ctx.fillStyle = this.definition.accentColor;
    this.drawRoundedRect(ctx, -halfW + 10, -halfH + 10, this.width - 40, this.height / 3, 8);
    ctx.fill();

    // Draw damage indicator (cracks)
    if (this.currentHealth < this.maxHealth) {
      this.drawDamage(ctx, halfW, halfH);
    }

    // Draw health bar if multi-hit
    if (this.maxHealth > 1) {
      this.drawHealthBar(ctx, halfW);
    }

    ctx.restore();
  }

  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  private drawDamage(ctx: CanvasRenderingContext2D, halfW: number, halfH: number): void {
    const damageRatio = 1 - (this.currentHealth / this.maxHealth);
    const crackCount = Math.floor(damageRatio * 5) + 1;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;

    for (let i = 0; i < crackCount; i++) {
      ctx.beginPath();

      // Random crack starting position
      const startX = (Math.random() - 0.5) * this.width * 0.8;
      const startY = -halfH + Math.random() * this.height;

      ctx.moveTo(startX, startY);

      // Jagged crack line
      let x = startX;
      let y = startY;
      const segments = 3 + Math.floor(Math.random() * 3);

      for (let j = 0; j < segments; j++) {
        x += (Math.random() - 0.5) * 30;
        y += 10 + Math.random() * 20;

        if (y > halfH) break;

        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }

  private drawHealthBar(ctx: CanvasRenderingContext2D, halfW: number): void {
    const barWidth = this.width * 0.6;
    const barHeight = 8;
    const barY = -this.height / 2 - 20;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.drawRoundedRect(ctx, -barWidth / 2, barY, barWidth, barHeight, 4);
    ctx.fill();

    // Health fill
    const healthRatio = this.currentHealth / this.maxHealth;
    const fillWidth = barWidth * healthRatio;

    ctx.fillStyle = healthRatio > 0.5 ? '#4ade80' : healthRatio > 0.25 ? '#fbbf24' : '#ef4444';
    this.drawRoundedRect(ctx, -barWidth / 2, barY, fillWidth, barHeight, 4);
    ctx.fill();

    // Segments
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;

    for (let i = 1; i < this.maxHealth; i++) {
      const segX = -barWidth / 2 + (barWidth / this.maxHealth) * i;
      ctx.beginPath();
      ctx.moveTo(segX, barY);
      ctx.lineTo(segX, barY + barHeight);
      ctx.stroke();
    }
  }
}
