/**
 * Particle System
 * Creates satisfying particle effects on slice
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  angularVel: number;
  type: 'circle' | 'square' | 'spark';
}

export interface ParticleEmitterConfig {
  count: number;
  color: string;
  colors?: string[]; // Multi-color support
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  minLife: number;
  maxLife: number;
  gravity: number;
  spread: number;
  type: 'circle' | 'square' | 'spark';
}

// Bright, satisfying colors matching Soap Cutting reference
export const BURST_COLORS = [
  '#ff6b9d', // Pink
  '#00e5ff', // Cyan
  '#ffeb3b', // Yellow
  '#69f0ae', // Green
  '#ff8a65', // Orange
  '#b388ff', // Purple
  '#64ffda', // Teal
  '#ffd54f', // Gold
];

const DEFAULT_CONFIG: ParticleEmitterConfig = {
  count: 20,
  color: '#ffffff',
  minSize: 2,
  maxSize: 8,
  minSpeed: 100,
  maxSpeed: 400,
  minLife: 0.3,
  maxLife: 0.8,
  gravity: 500,
  spread: Math.PI, // Full semicircle
  type: 'circle',
};

export class ParticleSystem {
  private particles: Particle[] = [];
  private readonly MAX_PARTICLES = 500;

  /**
   * Emit particles from a point
   */
  emit(
    x: number,
    y: number,
    angle: number,
    config: Partial<ParticleEmitterConfig> = {}
  ): void {
    const cfg = { ...DEFAULT_CONFIG, ...config };

    for (let i = 0; i < cfg.count; i++) {
      if (this.particles.length >= this.MAX_PARTICLES) {
        // Remove oldest particles if at limit
        this.particles.shift();
      }

      // Random angle within spread
      const spreadAngle = angle + (Math.random() - 0.5) * cfg.spread;
      const speed = cfg.minSpeed + Math.random() * (cfg.maxSpeed - cfg.minSpeed);
      const size = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
      const life = cfg.minLife + Math.random() * (cfg.maxLife - cfg.minLife);

      // Pick color from colors array if provided, otherwise use single color
      const particleColor = cfg.colors && cfg.colors.length > 0
        ? cfg.colors[Math.floor(Math.random() * cfg.colors.length)]
        : cfg.color;

      this.particles.push({
        x,
        y,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed,
        size,
        color: particleColor,
        alpha: 1,
        life,
        maxLife: life,
        rotation: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 10,
        type: cfg.type,
      });
    }
  }

  /**
   * Emit particles along a line (for slice effect)
   */
  emitAlongLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    config: Partial<ParticleEmitterConfig> = {}
  ): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Emit perpendicular to the line
    const perpAngle = angle + Math.PI / 2;

    const count = Math.min(Math.floor(distance / 10), 30);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const x = x1 + dx * t;
      const y = y1 + dy * t;

      // Emit in both directions perpendicular to slice
      this.emit(x, y, perpAngle, { ...config, count: 2 });
      this.emit(x, y, perpAngle + Math.PI, { ...config, count: 2 });
    }
  }

  /**
   * Create a burst effect at a point
   */
  burst(
    x: number,
    y: number,
    config: Partial<ParticleEmitterConfig> = {}
  ): void {
    const cfg = { ...DEFAULT_CONFIG, ...config, spread: Math.PI * 2 };

    for (let i = 0; i < cfg.count; i++) {
      const angle = (i / cfg.count) * Math.PI * 2;
      this.emit(x, y, angle, { ...cfg, count: 1 });
    }
  }

  /**
   * Update all particles
   */
  update(deltaTime: number): void {
    const dt = deltaTime / 1000; // Convert to seconds

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Apply gravity
      p.vy += DEFAULT_CONFIG.gravity * dt;

      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Update rotation
      p.rotation += p.angularVel * dt;

      // Update life
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Render all particles
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      switch (p.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'square':
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          break;

        case 'spark':
          // Diamond/spark shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.3, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.3, 0);
          ctx.closePath();
          ctx.fill();
          break;
      }

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }

  /**
   * Get particle count (for debugging)
   */
  getCount(): number {
    return this.particles.length;
  }
}
