/**
 * HUD (Heads-Up Display)
 * Shows score, coins, level, and other game info
 */

import { BladeDefinition } from '../data/blades';

export interface HUDState {
  level: number;
  coins: number;
  objectName: string;
  swipesRemaining: number;
  totalSwipes: number;
  blade: BladeDefinition;
  onReset?: () => void;
}

export class HUD {
  private state: HUDState;
  private animatedCoins: number;
  private coinPulse: number = 0;

  constructor() {
    this.state = {
      level: 1,
      coins: 0,
      objectName: '',
      swipesRemaining: 1,
      totalSwipes: 1,
      blade: {} as BladeDefinition,
    };
    this.animatedCoins = 0;
  }

  /**
   * Update HUD state
   */
  setState(state: Partial<HUDState>): void {
    this.state = { ...this.state, ...state };
  }

  /**
   * Trigger coin animation
   */
  addCoins(amount: number): void {
    this.coinPulse = 1;
  }

  /**
   * Update animations
   */
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    // Animate coin counter
    if (this.animatedCoins !== this.state.coins) {
      const diff = this.state.coins - this.animatedCoins;
      const speed = Math.max(1, Math.abs(diff) * 0.1);

      if (Math.abs(diff) < speed) {
        this.animatedCoins = this.state.coins;
      } else {
        this.animatedCoins += Math.sign(diff) * speed;
      }
    }

    // Decay coin pulse
    if (this.coinPulse > 0) {
      this.coinPulse -= dt * 3;
      if (this.coinPulse < 0) this.coinPulse = 0;
    }
  }

  /**
   * Render the HUD
   */
  render(ctx: CanvasRenderingContext2D, canvasWidth: number): void {
    ctx.save();

    const padding = 20;
    const circleRadius = 28;

    // === TOP LEFT: Swipes remaining in orange circle ===
    const swipeCircleX = padding + circleRadius;
    const swipeCircleY = padding + circleRadius;

    // Orange circle background
    ctx.beginPath();
    ctx.arc(swipeCircleX, swipeCircleY, circleRadius, 0, Math.PI * 2);
    const orangeGradient = ctx.createRadialGradient(
      swipeCircleX - 5, swipeCircleY - 5, 0,
      swipeCircleX, swipeCircleY, circleRadius
    );
    orangeGradient.addColorStop(0, '#ffb74d');
    orangeGradient.addColorStop(1, '#ff9800');
    ctx.fillStyle = orangeGradient;
    ctx.fill();

    // White border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Swipes number
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 26px 'Roboto', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.state.swipesRemaining.toString(), swipeCircleX, swipeCircleY);

    // === TOP CENTER: Level and stars ===
    const centerX = canvasWidth / 2;

    // Level text
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 20px 'Roboto Slab', serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillText(`Level`, centerX, padding - 2);
    ctx.font = "bold 32px 'Roboto Slab', serif";
    ctx.fillText(this.state.level.toString(), centerX, padding + 18);
    ctx.shadowBlur = 0;

    // Progress bar (below level)
    const barWidth = 100;
    const barHeight = 8;
    const barY = padding + 58;
    const progress = 1 - (this.state.swipesRemaining / Math.max(1, this.state.totalSwipes));

    // Bar background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.drawRoundedRect(ctx, centerX - barWidth / 2, barY, barWidth, barHeight, 4);
    ctx.fill();

    // Bar fill
    if (progress > 0) {
      const fillGradient = ctx.createLinearGradient(centerX - barWidth / 2, 0, centerX + barWidth / 2, 0);
      fillGradient.addColorStop(0, '#4ade80');
      fillGradient.addColorStop(1, '#22c55e');
      ctx.fillStyle = fillGradient;
      this.drawRoundedRect(ctx, centerX - barWidth / 2, barY, barWidth * progress, barHeight, 4);
      ctx.fill();
    }

    // Star placeholders
    const starY = barY + 18;
    const starSpacing = 28;
    for (let i = 0; i < 3; i++) {
      const starX = centerX + (i - 1) * starSpacing;
      this.drawStar(ctx, starX, starY, 10, '#5d4037', '#8d6e63');
    }

    // === TOP RIGHT: Reset button (blue circle) ===
    const resetCircleX = canvasWidth - padding - circleRadius;
    const resetCircleY = padding + circleRadius;
    this.resetButtonBounds = {
      x: resetCircleX - circleRadius,
      y: resetCircleY - circleRadius,
      width: circleRadius * 2,
      height: circleRadius * 2,
    };

    // Blue circle background
    ctx.beginPath();
    ctx.arc(resetCircleX, resetCircleY, circleRadius, 0, Math.PI * 2);
    const blueGradient = ctx.createRadialGradient(
      resetCircleX - 5, resetCircleY - 5, 0,
      resetCircleX, resetCircleY, circleRadius
    );
    blueGradient.addColorStop(0, '#64b5f6');
    blueGradient.addColorStop(1, '#2196f3');
    ctx.fillStyle = blueGradient;
    ctx.fill();

    // White border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Reset/retry arrow icon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(resetCircleX, resetCircleY, 12, -Math.PI * 0.8, Math.PI * 0.5);
    ctx.stroke();

    // Arrow head
    const arrowAngle = Math.PI * 0.5;
    const arrowX = resetCircleX + Math.cos(arrowAngle) * 12;
    const arrowY = resetCircleY + Math.sin(arrowAngle) * 12;
    ctx.beginPath();
    ctx.moveTo(arrowX - 6, arrowY - 2);
    ctx.lineTo(arrowX, arrowY + 6);
    ctx.lineTo(arrowX + 6, arrowY - 2);
    ctx.stroke();

    // === COIN COUNTER (below reset button) ===
    const coinScale = 1 + this.coinPulse * 0.2;
    const coinX = canvasWidth - padding - 15;
    const coinY = padding + circleRadius * 2 + 25;

    ctx.save();
    ctx.translate(coinX, coinY);
    ctx.scale(coinScale, coinScale);

    // Coin icon
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    const coinGradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, 14);
    coinGradient.addColorStop(0, '#fff176');
    coinGradient.addColorStop(1, '#ffc107');
    ctx.fillStyle = coinGradient;
    ctx.fill();
    ctx.strokeStyle = '#ff8f00';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Coin $ symbol
    ctx.fillStyle = '#ff8f00';
    ctx.font = "bold 14px 'Roboto', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 1);

    ctx.restore();

    // Coin count
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 20px 'Roboto', sans-serif";
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 3;
    ctx.fillText(Math.floor(this.animatedCoins).toString(), coinX - 22, coinY);
    ctx.shadowBlur = 0;

    // === BOTTOM LEFT: Blade indicator ===
    if (this.state.blade && this.state.blade.name) {
      const bladeY = ctx.canvas.height - padding - 15;

      // Blade icon (knife shape)
      ctx.fillStyle = this.state.blade.color || '#888888';
      ctx.beginPath();
      ctx.moveTo(padding, bladeY);
      ctx.lineTo(padding + 35, bladeY - 4);
      ctx.lineTo(padding + 40, bladeY);
      ctx.lineTo(padding + 35, bladeY + 4);
      ctx.closePath();
      ctx.fill();

      // Handle
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(padding - 8, bladeY - 6, 12, 12);

      // Blade name
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = "14px 'Roboto', sans-serif";
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.state.blade.name, padding + 50, bladeY);
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

  private drawStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    fillColor: string,
    strokeColor: string
  ): void {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.5;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  /**
   * Check if a point is within the reset button
   */
  isResetButtonHit(x: number, y: number): boolean {
    if (!this.resetButtonBounds) return false;
    const b = this.resetButtonBounds;
    return x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
  }

  private resetButtonBounds: { x: number; y: number; width: number; height: number } | null = null;
}
