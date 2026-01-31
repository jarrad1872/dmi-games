/**
 * Star Rating Display
 * Shows 1-3 stars based on performance
 */

export interface StarRatingConfig {
  x: number;
  y: number;
  stars: number;
  maxStars?: number;
  size?: number;
  animated?: boolean;
}

interface StarState {
  filled: boolean;
  scale: number;
  rotation: number;
  delay: number;
  animating: boolean;
}

export class StarRating {
  private stars: StarState[] = [];
  private config: Required<StarRatingConfig>;
  private animationTime: number = 0;
  private complete: boolean = false;

  constructor() {
    this.config = {
      x: 0,
      y: 0,
      stars: 0,
      maxStars: 3,
      size: 40,
      animated: true,
    };
  }

  /**
   * Show stars with animation
   */
  show(config: StarRatingConfig): void {
    this.config = {
      ...this.config,
      ...config,
      maxStars: config.maxStars || 3,
      size: config.size || 40,
      animated: config.animated !== false,
    };

    this.stars = [];
    this.animationTime = 0;
    this.complete = false;

    for (let i = 0; i < this.config.maxStars; i++) {
      this.stars.push({
        filled: i < this.config.stars,
        scale: this.config.animated ? 0 : 1,
        rotation: this.config.animated ? -0.5 : 0,
        delay: i * 0.3,
        animating: this.config.animated,
      });
    }
  }

  /**
   * Check if animation is complete
   */
  isComplete(): boolean {
    return this.complete;
  }

  /**
   * Update animation
   */
  update(deltaTime: number): void {
    if (this.complete) return;

    const dt = deltaTime / 1000;
    this.animationTime += dt;

    let allDone = true;

    for (const star of this.stars) {
      if (!star.animating) continue;

      if (this.animationTime < star.delay) {
        allDone = false;
        continue;
      }

      const elapsed = this.animationTime - star.delay;
      const duration = 0.4;

      if (elapsed >= duration) {
        star.scale = 1;
        star.rotation = 0;
        star.animating = false;
      } else {
        const progress = elapsed / duration;
        // Bounce easing
        const bounce = 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 2);
        star.scale = bounce;
        star.rotation = (1 - progress) * -0.5;
        allDone = false;
      }
    }

    this.complete = allDone;
  }

  /**
   * Render stars
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    const spacing = this.config.size * 1.3;
    const totalWidth = spacing * (this.config.maxStars - 1);
    const startX = this.config.x - totalWidth / 2;

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      const x = startX + i * spacing;

      ctx.save();
      ctx.translate(x, this.config.y);
      ctx.rotate(star.rotation);
      ctx.scale(star.scale, star.scale);

      this.drawStar(ctx, 0, 0, this.config.size / 2, star.filled);

      ctx.restore();
    }

    ctx.restore();
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    filled: boolean
  ): void {
    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius * 0.5;

    ctx.beginPath();

    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.closePath();

    if (filled) {
      // Filled star with gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, '#ffd700');
      gradient.addColorStop(0.5, '#ffcc00');
      gradient.addColorStop(1, '#ff9900');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Glow
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Outline
      ctx.strokeStyle = '#cc8800';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Empty star
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}
