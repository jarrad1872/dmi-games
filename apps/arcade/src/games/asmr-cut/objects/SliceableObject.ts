/**
 * Sliceable Object
 * Realistic 3D-style object rendering matching ASMR Slicing reference
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
  public sliceProgress: number = 0;

  // Animation
  private shakeOffset = { x: 0, y: 0 };
  private shakeIntensity = 0;
  private pulseScale = 1;
  private pulsePhase = 0;
  private entryAnimation = 0; // 0 to 1 for spawn animation
  private wobblePhase = 0;

  constructor(x: number, y: number, width: number, height: number, definition: ObjectDefinition) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.definition = definition;
    this.maxHealth = definition.requiredSwipes;
    this.currentHealth = this.maxHealth;
  }

  getBounds(): BoundingBox {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  damage(amount: number = 1): boolean {
    this.currentHealth -= amount;
    this.shake(15);
    return this.currentHealth <= 0;
  }

  isDestroyed(): boolean {
    return this.currentHealth <= 0;
  }

  shake(intensity: number): void {
    this.shakeIntensity = intensity;
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    // Entry animation
    if (this.entryAnimation < 1) {
      this.entryAnimation += dt * 3;
      if (this.entryAnimation > 1) this.entryAnimation = 1;
    }

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

    // Gentle idle wobble
    this.wobblePhase += dt * 2;
    this.pulsePhase += dt * 1.5;
    this.pulseScale = 1 + Math.sin(this.pulsePhase) * 0.015;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Entry animation (scale up and bounce)
    const entryScale = this.easeOutBack(this.entryAnimation);

    ctx.translate(
      this.x + this.shakeOffset.x,
      this.y + this.shakeOffset.y + Math.sin(this.wobblePhase) * 2
    );
    ctx.scale(this.pulseScale * entryScale, this.pulseScale * entryScale);

    // Dispatch to specific renderer based on object type
    switch (this.definition.id) {
      case 'kiwi':
        this.renderKiwi(ctx);
        break;
      case 'strawberry':
        this.renderStrawberry(ctx);
        break;
      case 'apple':
        this.renderApple(ctx);
        break;
      case 'soap':
        this.renderSoap(ctx);
        break;
      case 'kinetic_sand':
        this.renderKineticSand(ctx);
        break;
      case 'clay':
        this.renderClay(ctx);
        break;
      default:
        this.renderGeneric(ctx);
    }

    ctx.restore();
  }

  private renderKiwi(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 15, w * 0.4, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer brown fuzzy skin (cylinder shape)
    const skinGradient = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    skinGradient.addColorStop(0, '#8B6914');
    skinGradient.addColorStop(0.3, '#A67C00');
    skinGradient.addColorStop(0.5, '#C4A35A');
    skinGradient.addColorStop(0.7, '#A67C00');
    skinGradient.addColorStop(1, '#8B6914');

    ctx.fillStyle = skinGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fuzzy texture dots
    ctx.fillStyle = 'rgba(139, 90, 43, 0.4)';
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * w * 0.4;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r * (h / w);
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top cut face showing green interior
    const cutY = -h / 2 + 10;
    ctx.save();
    ctx.translate(0, cutY);

    // Green flesh gradient
    const greenGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.4);
    greenGradient.addColorStop(0, '#CCFF90');
    greenGradient.addColorStop(0.3, '#AED581');
    greenGradient.addColorStop(0.7, '#8BC34A');
    greenGradient.addColorStop(1, '#689F38');

    ctx.fillStyle = greenGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.42, h * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // White center
    ctx.fillStyle = '#F5F5DC';
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.1, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();

    // Seeds radiating from center
    ctx.fillStyle = '#1B5E20';
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const seedX = Math.cos(angle) * w * 0.25;
      const seedY = Math.sin(angle) * h * 0.08;
      ctx.beginPath();
      ctx.ellipse(seedX, seedY, 3, 1.5, angle, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Highlight on skin
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.2, -h * 0.2, w * 0.15, h * 0.1, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderStrawberry(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 10, w * 0.35, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Berry shape (heart-like)
    const gradient = ctx.createRadialGradient(-w * 0.1, -h * 0.2, 0, 0, 0, h * 0.6);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.5, '#E53935');
    gradient.addColorStop(1, '#B71C1C');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.4);
    ctx.bezierCurveTo(w * 0.5, -h * 0.5, w * 0.5, h * 0.1, 0, h * 0.5);
    ctx.bezierCurveTo(-w * 0.5, h * 0.1, -w * 0.5, -h * 0.5, 0, -h * 0.4);
    ctx.fill();

    // Seeds
    ctx.fillStyle = '#FFEB3B';
    const seedPositions = [
      [-0.2, -0.2], [0.2, -0.15], [0, 0], [-0.25, 0.1], [0.25, 0.05],
      [-0.15, 0.25], [0.15, 0.2], [0, 0.35], [-0.2, -0.05], [0.2, 0.15]
    ];
    for (const [sx, sy] of seedPositions) {
      const seedX = sx * w;
      const seedY = sy * h;
      ctx.beginPath();
      ctx.ellipse(seedX, seedY, 4, 2.5, Math.random() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Green leaves at top
    ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI - Math.PI / 2 + (Math.random() - 0.5) * 0.3;
      ctx.save();
      ctx.translate(0, -h * 0.4);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -12, 5, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.15, -h * 0.2, w * 0.12, h * 0.08, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderApple(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 10, w * 0.4, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Apple body gradient
    const gradient = ctx.createRadialGradient(-w * 0.15, -h * 0.15, 0, 0, 0, h * 0.55);
    gradient.addColorStop(0, '#FF8A80');
    gradient.addColorStop(0.4, '#E53935');
    gradient.addColorStop(0.8, '#C62828');
    gradient.addColorStop(1, '#8B0000');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    // Apple shape with top indent
    ctx.moveTo(0, -h * 0.42);
    ctx.bezierCurveTo(w * 0.5, -h * 0.35, w * 0.5, h * 0.4, 0, h * 0.45);
    ctx.bezierCurveTo(-w * 0.5, h * 0.4, -w * 0.5, -h * 0.35, 0, -h * 0.42);
    ctx.fill();

    // Stem
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(-3, -h * 0.45, 6, 18);

    // Leaf
    ctx.fillStyle = '#66BB6A';
    ctx.beginPath();
    ctx.ellipse(12, -h * 0.42, 8, 15, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.2, -h * 0.15, w * 0.15, h * 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.1, -h * 0.05, w * 0.08, h * 0.06, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderSoap(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 15, w * 0.4, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soap bar with 3D effect
    const bodyGradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    bodyGradient.addColorStop(0, this.lightenColor(this.definition.color, 0.3));
    bodyGradient.addColorStop(0.3, this.lightenColor(this.definition.color, 0.15));
    bodyGradient.addColorStop(0.6, this.definition.color);
    bodyGradient.addColorStop(1, this.darkenColor(this.definition.color, 0.2));

    ctx.fillStyle = bodyGradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 15);
    ctx.fill();

    // Top highlight stripe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.drawRoundedRect(ctx, -w / 2 + 10, -h / 2 + 8, w - 20, h * 0.25, 8);
    ctx.fill();

    // Carved patterns/lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 15, -h / 2 + h * (i * 0.25));
      ctx.lineTo(w / 2 - 15, -h / 2 + h * (i * 0.25));
      ctx.stroke();
    }

    // Glossy corner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.25, -h * 0.25, 20, 15, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderKineticSand(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 15, w * 0.4, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sand block with texture
    const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    gradient.addColorStop(0, this.lightenColor(this.definition.color, 0.25));
    gradient.addColorStop(0.5, this.definition.color);
    gradient.addColorStop(1, this.darkenColor(this.definition.color, 0.15));

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 8);
    ctx.fill();

    // Sand grain texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * w * 0.9;
      const y = (Math.random() - 0.5) * h * 0.9;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.drawRoundedRect(ctx, -w / 2 + 8, -h / 2 + 6, w - 16, h * 0.2, 5);
    ctx.fill();
  }

  private renderClay(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 15, w * 0.38, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Clay block
    const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    gradient.addColorStop(0, this.lightenColor(this.definition.color, 0.2));
    gradient.addColorStop(0.4, this.definition.color);
    gradient.addColorStop(1, this.darkenColor(this.definition.color, 0.25));

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 12);
    ctx.fill();

    // Matte finish highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.2, -h * 0.2, w * 0.2, h * 0.12, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Subtle texture lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = -h / 2 + (i + 1) * (h / 6);
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 10, y + (Math.random() - 0.5) * 5);
      ctx.lineTo(w / 2 - 10, y + (Math.random() - 0.5) * 5);
      ctx.stroke();
    }
  }

  private renderGeneric(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 15, w * 0.4, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main body with 3D gradient
    const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    gradient.addColorStop(0, this.lightenColor(this.definition.color, 0.3));
    gradient.addColorStop(0.3, this.lightenColor(this.definition.color, 0.1));
    gradient.addColorStop(0.7, this.definition.color);
    gradient.addColorStop(1, this.darkenColor(this.definition.color, 0.25));

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 12);
    ctx.fill();

    // Accent highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    this.drawRoundedRect(ctx, -w / 2 + 10, -h / 2 + 8, w - 40, h * 0.25, 8);
    ctx.fill();

    // Health bar for multi-hit objects
    if (this.maxHealth > 1) {
      this.drawHealthBar(ctx, w, h);
    }
  }

  private drawHealthBar(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const barWidth = w * 0.6;
    const barHeight = 10;
    const barY = -h / 2 - 25;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.drawRoundedRect(ctx, -barWidth / 2, barY, barWidth, barHeight, 5);
    ctx.fill();

    // Health fill
    const healthRatio = this.currentHealth / this.maxHealth;
    const fillWidth = barWidth * healthRatio;
    const healthGradient = ctx.createLinearGradient(-barWidth / 2, barY, -barWidth / 2 + fillWidth, barY);

    if (healthRatio > 0.5) {
      healthGradient.addColorStop(0, '#4ade80');
      healthGradient.addColorStop(1, '#22c55e');
    } else if (healthRatio > 0.25) {
      healthGradient.addColorStop(0, '#fbbf24');
      healthGradient.addColorStop(1, '#f59e0b');
    } else {
      healthGradient.addColorStop(0, '#ef4444');
      healthGradient.addColorStop(1, '#dc2626');
    }

    ctx.fillStyle = healthGradient;
    this.drawRoundedRect(ctx, -barWidth / 2, barY, fillWidth, barHeight, 5);
    ctx.fill();

    // Segment dividers
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i < this.maxHealth; i++) {
      const segX = -barWidth / 2 + (barWidth / this.maxHealth) * i;
      ctx.beginPath();
      ctx.moveTo(segX, barY + 2);
      ctx.lineTo(segX, barY + barHeight - 2);
      ctx.stroke();
    }
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

  private lightenColor(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
    const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
    const newB = Math.min(255, Math.floor(b + (255 - b) * amount));
    return `rgb(${newR}, ${newG}, ${newB})`;
  }

  private darkenColor(hex: string, amount: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const newR = Math.max(0, Math.floor(r * (1 - amount)));
    const newG = Math.max(0, Math.floor(g * (1 - amount)));
    const newB = Math.max(0, Math.floor(b * (1 - amount)));
    return `rgb(${newR}, ${newG}, ${newB})`;
  }

  private easeOutBack(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
}
