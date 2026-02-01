/**
 * ParticleSystem - Visual juice effects
 * Dust trails, sparks, collection bursts, etc.
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  type: 'dust' | 'spark' | 'coin' | 'trail' | 'debris';
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles: number = 200;
  
  emit(config: {
    x: number;
    y: number;
    count: number;
    type: Particle['type'];
    spread?: number;
    speed?: number;
    color?: string;
    size?: number;
    life?: number;
  }): void {
    const { x, y, count, type, spread = 50, speed = 100, color, size = 4, life = 1000 } = config;
    
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 0.5 + 0.5) * speed;
      
      this.particles.push({
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * spread,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life,
        maxLife: life,
        size: size * (0.5 + Math.random()),
        color: color || this.getDefaultColor(type),
        alpha: 1,
        type,
      });
    }
  }
  
  emitDust(x: number, y: number, speed: number = 1): void {
    // Continuous dust behind player
    if (Math.random() > 0.3) return; // Don't emit every frame
    
    this.emit({
      x,
      y,
      count: 1,
      type: 'dust',
      spread: 20,
      speed: 30 * speed,
      color: '#8B7355',
      size: 6,
      life: 600,
    });
  }
  
  emitJumpTrail(x: number, y: number): void {
    this.emit({
      x,
      y: y + 20,
      count: 5,
      type: 'trail',
      spread: 30,
      speed: 80,
      color: '#FFD700',
      size: 4,
      life: 400,
    });
  }
  
  emitCoinCollect(x: number, y: number): void {
    this.emit({
      x,
      y,
      count: 12,
      type: 'coin',
      spread: 10,
      speed: 150,
      color: '#FFD700',
      size: 6,
      life: 500,
    });
  }
  
  emitHitSparks(x: number, y: number): void {
    this.emit({
      x,
      y,
      count: 20,
      type: 'spark',
      spread: 30,
      speed: 200,
      color: '#FF4500',
      size: 5,
      life: 600,
    });
  }
  
  emitDebris(x: number, y: number): void {
    this.emit({
      x,
      y,
      count: 8,
      type: 'debris',
      spread: 40,
      speed: 120,
      color: '#666666',
      size: 8,
      life: 800,
    });
  }
  
  private getDefaultColor(type: Particle['type']): string {
    switch (type) {
      case 'dust': return '#8B7355';
      case 'spark': return '#FFD700';
      case 'coin': return '#FFD700';
      case 'trail': return '#FF6B00';
      case 'debris': return '#666666';
      default: return '#FFFFFF';
    }
  }
  
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    const gravity = 300;
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      // Apply gravity (except for dust which floats)
      if (p.type !== 'dust') {
        p.vy += gravity * dt;
      } else {
        p.vy -= 20 * dt; // Dust floats up slightly
      }
      
      // Friction
      p.vx *= 0.98;
      p.vy *= 0.98;
      
      // Update life
      p.life -= deltaTime;
      p.alpha = Math.max(0, p.life / p.maxLife);
      
      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      
      switch (p.type) {
        case 'dust':
          // Soft circular dust
          const dustGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          dustGradient.addColorStop(0, p.color);
          dustGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = dustGradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'spark':
        case 'coin':
          // Glowing particles
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'trail':
          // Stretched trail particles
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 2, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'debris':
          // Square debris
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.life / 100);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          break;
      }
      
      ctx.restore();
    }
  }
  
  clear(): void {
    this.particles = [];
  }
}
