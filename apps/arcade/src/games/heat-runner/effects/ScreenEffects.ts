/**
 * ScreenEffects - Camera shake, flash, vignette, etc.
 */

export class ScreenEffects {
  // Screen shake
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;
  private shakeTimer: number = 0;
  
  // Red flash (hit)
  private flashAlpha: number = 0;
  private flashColor: string = '#ff0000';
  
  // Speed lines
  private speedLineAlpha: number = 0;
  
  // Near miss glow
  private nearMissTimer: number = 0;
  
  shake(intensity: number = 10, duration: number = 200): void {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }
  
  flash(color: string = '#ff0000', alpha: number = 0.5): void {
    this.flashColor = color;
    this.flashAlpha = alpha;
  }
  
  showSpeedLines(alpha: number = 0.3): void {
    this.speedLineAlpha = alpha;
  }
  
  triggerNearMiss(): void {
    this.nearMissTimer = 300;
  }
  
  update(deltaTime: number): void {
    // Update shake
    if (this.shakeTimer > 0) {
      this.shakeTimer -= deltaTime;
      if (this.shakeTimer <= 0) {
        this.shakeIntensity = 0;
      }
    }
    
    // Decay flash
    if (this.flashAlpha > 0) {
      this.flashAlpha -= deltaTime / 200;
      if (this.flashAlpha < 0) this.flashAlpha = 0;
    }
    
    // Decay speed lines
    if (this.speedLineAlpha > 0) {
      this.speedLineAlpha -= deltaTime / 500;
      if (this.speedLineAlpha < 0) this.speedLineAlpha = 0;
    }
    
    // Decay near miss
    if (this.nearMissTimer > 0) {
      this.nearMissTimer -= deltaTime;
    }
  }
  
  applyShake(ctx: CanvasRenderingContext2D): void {
    if (this.shakeIntensity > 0 && this.shakeTimer > 0) {
      const progress = this.shakeTimer / this.shakeDuration;
      const intensity = this.shakeIntensity * progress;
      const offsetX = (Math.random() - 0.5) * intensity * 2;
      const offsetY = (Math.random() - 0.5) * intensity * 2;
      ctx.translate(offsetX, offsetY);
    }
  }
  
  renderOverlays(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Speed lines
    if (this.speedLineAlpha > 0) {
      this.renderSpeedLines(ctx, width, height);
    }
    
    // Near miss edge glow
    if (this.nearMissTimer > 0) {
      this.renderNearMissGlow(ctx, width, height);
    }
    
    // Flash overlay
    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    }
    
    // Vignette (always subtle)
    this.renderVignette(ctx, width, height);
  }
  
  private renderSpeedLines(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    ctx.globalAlpha = this.speedLineAlpha;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    // Draw radial speed lines from center
    const centerX = width / 2;
    const centerY = height / 3;
    
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI / 2) + (Math.random() - 0.5) * 0.5; // Mostly downward
      const startDist = 100 + Math.random() * 100;
      const length = 50 + Math.random() * 100;
      
      const x1 = centerX + Math.cos(angle) * startDist;
      const y1 = centerY + Math.sin(angle) * startDist;
      const x2 = centerX + Math.cos(angle) * (startDist + length);
      const y2 = centerY + Math.sin(angle) * (startDist + length);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  private renderNearMissGlow(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const alpha = (this.nearMissTimer / 300) * 0.4;
    
    // Golden glow from edges
    const gradient = ctx.createLinearGradient(0, 0, width * 0.1, 0);
    gradient.addColorStop(0, `rgba(255, 215, 0, ${alpha})`);
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width * 0.15, height);
    
    const gradient2 = ctx.createLinearGradient(width, 0, width * 0.9, 0);
    gradient2.addColorStop(0, `rgba(255, 215, 0, ${alpha})`);
    gradient2.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = gradient2;
    ctx.fillRect(width * 0.85, 0, width * 0.15, height);
  }
  
  private renderVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, height * 0.3,
      width / 2, height / 2, height * 0.9
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  reset(): void {
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    this.flashAlpha = 0;
    this.speedLineAlpha = 0;
    this.nearMissTimer = 0;
  }
}
