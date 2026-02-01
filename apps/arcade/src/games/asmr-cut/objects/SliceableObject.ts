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
      case 'drywall':
        this.renderDrywall(ctx);
        break;
      case 'cement_board':
        this.renderCementBoard(ctx);
        break;
      case 'asphalt_patch':
        this.renderAsphalt(ctx);
        break;
      case 'mortar_block':
        this.renderMortar(ctx);
        break;
      case 'thinset_tile':
        this.renderThinSet(ctx);
        break;
      case 'fiber_cement':
        this.renderFiberCite(ctx);
        break;
      case 'concrete':
      case 'reinforced_concrete':
        this.renderConcrete(ctx);
        break;
      case 'stone':
      case 'granite':
        this.renderStone(ctx);
        break;
      case 'brick':
        this.renderBrick(ctx);
        break;
      case 'rubber':
        this.renderRubber(ctx);
        break;
      case 'wax':
        this.renderWax(ctx);
        break;
      case 'wood':
        this.renderWood(ctx);
        break;
      default:
        this.renderGeneric(ctx);
    }

    ctx.restore();
  }

  private renderFoamBlock(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 15, w * 0.4, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Foam block with soft gradient
    const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    gradient.addColorStop(0, '#ffcccc');
    gradient.addColorStop(0.5, '#ff9999');
    gradient.addColorStop(1, '#ff7777');

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 8);
    ctx.fill();

    // Foam texture (small bubbles)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * w * 0.8;
      const y = (Math.random() - 0.5) * h * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    this.drawRoundedRect(ctx, -w / 2 + 8, -h / 2 + 6, w - 16, h * 0.2, 5);
    ctx.fill();
  }

  private renderGelPad(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 12, w * 0.4, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gel pad with translucent look
    const gradient = ctx.createRadialGradient(-w * 0.2, -h * 0.2, 0, 0, 0, w * 0.6);
    gradient.addColorStop(0, '#90caf9');
    gradient.addColorStop(0.5, '#64b5f6');
    gradient.addColorStop(1, '#42a5f5');

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 15);
    ctx.fill();

    // Internal bubbles (gel texture)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * w * 0.7;
      const y = (Math.random() - 0.5) * h * 0.7;
      ctx.beginPath();
      ctx.arc(x, y, 3 + Math.random() * 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glossy highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-w * 0.2, -h * 0.2, w * 0.25, h * 0.15, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderInsulation(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(8, h / 2 + 15, w * 0.4, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Yellow insulation foam
    const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    gradient.addColorStop(0, '#fff59d');
    gradient.addColorStop(0.5, '#ffeb3b');
    gradient.addColorStop(1, '#fdd835');

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 5);
    ctx.fill();

    // Foam texture (porous)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * w * 0.9;
      const y = (Math.random() - 0.5) * h * 0.9;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.drawRoundedRect(ctx, -w / 2 + 6, -h / 2 + 5, w - 12, h * 0.2, 3);
    ctx.fill();
  }

  private renderConcrete(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;
    const hasRebar = this.definition.hasRebar && this.definition.rebarChance && Math.random() < this.definition.rebarChance;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(10, h / 2 + 18, w * 0.42, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Concrete block
    const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    gradient.addColorStop(0, '#9e9e9e');
    gradient.addColorStop(0.3, '#888888');
    gradient.addColorStop(0.7, '#757575');
    gradient.addColorStop(1, '#616161');

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 4);
    ctx.fill();

    // Aggregate texture (stones in concrete)
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * w * 0.85;
      const y = (Math.random() - 0.5) * h * 0.85;
      const size = 3 + Math.random() * 8;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(120, 120, 120, 0.5)' : 'rgba(180, 180, 180, 0.4)';
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hidden rebar (visible as slight lines if present)
    if (hasRebar) {
      ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-w * 0.3, -h * 0.2);
      ctx.lineTo(w * 0.3, -h * 0.2);
      ctx.moveTo(-w * 0.3, h * 0.15);
      ctx.lineTo(w * 0.3, h * 0.15);
      ctx.stroke();
    }

    // Surface wear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.ellipse(w * 0.2, h * 0.1, 15, 10, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderStone(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(10, h / 2 + 18, w * 0.42, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone with natural coloring
    const gradient = ctx.createRadialGradient(-w * 0.2, -h * 0.2, 0, 0, 0, w * 0.7);
    gradient.addColorStop(0, '#bdbdbd');
    gradient.addColorStop(0.5, '#9e9e9e');
    gradient.addColorStop(1, '#757575');

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 6);
    ctx.fill();

    // Natural stone veins
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w * 0.4, -h * 0.1);
    ctx.quadraticCurveTo(0, h * 0.1, w * 0.4, -h * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, h * 0.3);
    ctx.quadraticCurveTo(w * 0.1, h * 0.2, w * 0.35, h * 0.35);
    ctx.stroke();

    // Mineral flecks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * w * 0.8;
      const y = (Math.random() - 0.5) * h * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderBrick(ctx: CanvasRenderingContext2D): void {
    const w = this.width;
    const h = this.height;
    const hasRebar = this.definition.hasRebar && this.definition.rebarChance && Math.random() < this.definition.rebarChance;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(10, h / 2 + 18, w * 0.42, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brick with DMI red
    const gradient = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    gradient.addColorStop(0, '#c62828');
    gradient.addColorStop(0.3, '#a61c00');
    gradient.addColorStop(0.7, '#8a1700');
    gradient.addColorStop(1, '#6d1400');

    ctx.fillStyle = gradient;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 3);
    ctx.fill();

    // Brick texture (rough surface)
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * w * 0.9;
      const y = (Math.random() - 0.5) * h * 0.9;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mortar line suggestion at edges
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4);

    // Hidden rebar
    if (hasRebar) {
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.25)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-w * 0.35, 0);
      ctx.lineTo(w * 0.35, 0);
      ctx.stroke();
    }
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
