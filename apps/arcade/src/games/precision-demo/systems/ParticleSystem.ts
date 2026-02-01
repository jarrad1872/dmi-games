interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private gravity = 400;

  createExplosion(x: number, y: number, count: number, color: string): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 100 + Math.random() * 100;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.5,
        size: 3 + Math.random() * 5,
        color,
      });
    }
  }

  createDust(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 50,
        vy: -Math.random() * 100 - 50,
        life: 1,
        maxLife: 0.8 + Math.random() * 0.4,
        size: 4 + Math.random() * 6,
        color: '#aaa',
      });
    }
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    this.particles = this.particles.filter(p => {
      p.life -= dt / p.maxLife;
      if (p.life <= 0) return false;
      p.vy += this.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      return true;
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  clear(): void { this.particles = []; }
}
