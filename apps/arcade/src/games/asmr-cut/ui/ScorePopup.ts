/**
 * Score Popup
 * Animated floating text for points and bonuses
 */

export interface PopupConfig {
  x: number;
  y: number;
  text: string;
  color?: string;
  fontSize?: number;
  duration?: number;
  type?: 'coins' | 'bonus' | 'perfect' | 'combo';
}

interface ActivePopup {
  x: number;
  y: number;
  startY: number;
  text: string;
  color: string;
  fontSize: number;
  life: number;
  maxLife: number;
  scale: number;
  type: string;
}

export class ScorePopup {
  private popups: ActivePopup[] = [];

  /**
   * Show a popup
   */
  show(config: PopupConfig): void {
    const duration = config.duration || 1.5;

    let color = config.color || '#ffffff';
    let fontSize = config.fontSize || 28;

    // Type-specific styling
    switch (config.type) {
      case 'coins':
        color = '#ffd700';
        break;
      case 'bonus':
        color = '#4ade80';
        fontSize = 32;
        break;
      case 'perfect':
        color = '#ff66cc';
        fontSize = 36;
        break;
      case 'combo':
        color = '#ff9933';
        fontSize = 34;
        break;
    }

    this.popups.push({
      x: config.x,
      y: config.y,
      startY: config.y,
      text: config.text,
      color,
      fontSize,
      life: duration,
      maxLife: duration,
      scale: 0,
      type: config.type || 'default',
    });
  }

  /**
   * Show coin reward popup
   */
  showCoins(x: number, y: number, amount: number): void {
    this.show({
      x,
      y,
      text: `+${amount}`,
      type: 'coins',
    });
  }

  /**
   * Show perfect cut popup
   */
  showPerfect(x: number, y: number): void {
    this.show({
      x,
      y: y - 50,
      text: 'PERFECT!',
      type: 'perfect',
    });
  }

  /**
   * Show combo popup
   */
  showCombo(x: number, y: number, combo: number): void {
    this.show({
      x,
      y,
      text: `${combo}x COMBO!`,
      type: 'combo',
    });
  }

  /**
   * Update all popups
   */
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    for (let i = this.popups.length - 1; i >= 0; i--) {
      const popup = this.popups[i];

      popup.life -= dt;

      // Animate upward
      const progress = 1 - (popup.life / popup.maxLife);
      popup.y = popup.startY - progress * 60;

      // Scale animation (pop in, then normal)
      if (progress < 0.1) {
        popup.scale = progress / 0.1 * 1.2;
      } else if (progress < 0.2) {
        popup.scale = 1.2 - ((progress - 0.1) / 0.1) * 0.2;
      } else {
        popup.scale = 1;
      }

      // Remove dead popups
      if (popup.life <= 0) {
        this.popups.splice(i, 1);
      }
    }
  }

  /**
   * Render all popups
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const popup of this.popups) {
      const alpha = Math.min(1, popup.life / (popup.maxLife * 0.3));

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(popup.x, popup.y);
      ctx.scale(popup.scale, popup.scale);

      // Text shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.font = `bold ${popup.fontSize}px 'Roboto Slab', serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(popup.text, 2, 2);

      // Main text
      ctx.fillStyle = popup.color;
      ctx.fillText(popup.text, 0, 0);

      // Glow effect for special types
      if (popup.type === 'perfect' || popup.type === 'combo') {
        ctx.shadowColor = popup.color;
        ctx.shadowBlur = 10;
        ctx.fillText(popup.text, 0, 0);
      }

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Clear all popups
   */
  clear(): void {
    this.popups = [];
  }
}
