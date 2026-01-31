/**
 * Environment Objects
 * Blender target and ramp guides for the game scene
 */

export class Blender {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  
  private fillLevel: number = 0;
  private targetFill: number = 0;
  private pieces: { color: string; x: number; y: number }[] = [];
  private bladeRotation: number = 0;
  
  constructor(x: number, y: number, width: number = 120, height: number = 140) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  addPiece(color: string): void {
    this.targetFill = Math.min(1, this.targetFill + 0.1);
    this.pieces.push({
      color,
      x: this.x + (Math.random() - 0.5) * this.width * 0.5,
      y: this.y - this.height * 0.2 + Math.random() * this.height * 0.3,
    });
    if (this.pieces.length > 10) {
      this.pieces.shift();
    }
  }
  
  reset(): void {
    this.fillLevel = 0;
    this.targetFill = 0;
    this.pieces = [];
  }
  
  containsPoint(px: number, py: number): boolean {
    const openingWidth = this.width * 0.8;
    const openingY = this.y - this.height;
    return (
      px > this.x - openingWidth / 2 &&
      px < this.x + openingWidth / 2 &&
      py > openingY &&
      py < this.y
    );
  }
  
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    if (this.fillLevel < this.targetFill) {
      this.fillLevel += dt * 2;
      if (this.fillLevel > this.targetFill) {
        this.fillLevel = this.targetFill;
      }
    }
    this.bladeRotation += dt * 3;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    const w = this.width;
    const h = this.height;
    
    // Glass jar
    ctx.fillStyle = "rgba(200, 220, 255, 0.3)";
    ctx.strokeStyle = "rgba(150, 180, 220, 0.5)";
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(-w * 0.4, -h);
    ctx.lineTo(-w * 0.5, 0);
    ctx.lineTo(w * 0.5, 0);
    ctx.lineTo(w * 0.4, -h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Fill liquid
    if (this.fillLevel > 0) {
      const fillHeight = h * 0.8 * this.fillLevel;
      const fillY = -fillHeight;
      const liquidGradient = ctx.createLinearGradient(0, 0, 0, fillY);
      liquidGradient.addColorStop(0, "rgba(255, 150, 150, 0.8)");
      liquidGradient.addColorStop(1, "rgba(255, 200, 150, 0.6)");
      ctx.fillStyle = liquidGradient;
      ctx.beginPath();
      const bottomWidth = w * 0.48;
      const topWidth = bottomWidth - (bottomWidth - w * 0.38) * this.fillLevel;
      ctx.moveTo(-bottomWidth, 0);
      ctx.lineTo(-topWidth, fillY);
      ctx.lineTo(topWidth, fillY);
      ctx.lineTo(bottomWidth, 0);
      ctx.closePath();
      ctx.fill();
    }
    
    // Pieces inside
    for (const piece of this.pieces) {
      ctx.fillStyle = piece.color;
      ctx.beginPath();
      ctx.arc(piece.x - this.x, piece.y - this.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Blender blade
    ctx.save();
    ctx.translate(0, -h * 0.15);
    ctx.rotate(this.bladeRotation);
    ctx.fillStyle = "#666";
    ctx.fillRect(-w * 0.25, -3, w * 0.5, 6);
    ctx.fillRect(-3, -w * 0.25, 6, w * 0.5);
    ctx.fillStyle = "#888";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Glass highlight
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w * 0.35, -h * 0.9);
    ctx.lineTo(-w * 0.42, -h * 0.1);
    ctx.stroke();
    
    // Pink rim
    ctx.fillStyle = "#e91e63";
    ctx.strokeStyle = "#c2185b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -h, w * 0.45, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Base
    ctx.fillStyle = "#90a4ae";
    ctx.fillRect(-w * 0.3, 0, w * 0.6, 15);
    ctx.fillStyle = "#78909c";
    ctx.beginPath();
    ctx.moveTo(-w * 0.35, 15);
    ctx.lineTo(-w * 0.4, 30);
    ctx.lineTo(w * 0.4, 30);
    ctx.lineTo(w * 0.35, 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
}

export class Ramps {
  private canvasWidth: number;
  private canvasHeight: number;
  private rampColor: string = "#5c6bc0";
  private rampShadowColor: string = "#3949ab";
  
  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }
  
  resize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }
  
  checkCollision(x: number, y: number, vx: number, vy: number): { hit: boolean; newVx: number; newVy: number } {
    const ramps = this.getRampGeometry();
    for (const ramp of ramps) {
      if (this.pointInRamp(x, y, ramp)) {
        const centerX = this.canvasWidth / 2;
        const dirX = centerX - x;
        const speed = Math.sqrt(vx * vx + vy * vy);
        return {
          hit: true,
          newVx: Math.sign(dirX) * speed * 0.5,
          newVy: Math.abs(vy) * 0.8,
        };
      }
    }
    return { hit: false, newVx: vx, newVy: vy };
  }
  
  private pointInRamp(x: number, y: number, ramp: number[][]): boolean {
    let inside = false;
    const n = ramp.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = ramp[i][0], yi = ramp[i][1];
      const xj = ramp[j][0], yj = ramp[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }
  
  private getRampGeometry(): number[][][] {
    const w = this.canvasWidth;
    const h = this.canvasHeight;
    const rampWidth = 40;
    const rampStartY = h * 0.45;
    const rampEndY = h * 0.75;
    const rampInset = w * 0.15;
    
    const leftRamp = [
      [0, rampStartY],
      [rampInset, rampStartY],
      [rampInset + rampWidth, rampEndY],
      [0, rampEndY],
    ];
    
    const rightRamp = [
      [w, rampStartY],
      [w - rampInset, rampStartY],
      [w - rampInset - rampWidth, rampEndY],
      [w, rampEndY],
    ];
    
    const vTop = h * 0.55;
    const vBottom = h * 0.7;
    const vWidth = w * 0.25;
    
    const centerLeft = [
      [w / 2 - vWidth, vTop],
      [w / 2 - vWidth + rampWidth, vTop],
      [w / 2, vBottom],
      [w / 2 - rampWidth / 2, vBottom],
    ];
    
    const centerRight = [
      [w / 2 + vWidth, vTop],
      [w / 2 + vWidth - rampWidth, vTop],
      [w / 2, vBottom],
      [w / 2 + rampWidth / 2, vBottom],
    ];
    
    return [leftRamp, rightRamp, centerLeft, centerRight];
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const ramps = this.getRampGeometry();
    ctx.save();
    
    for (const ramp of ramps) {
      // Shadow
      ctx.fillStyle = this.rampShadowColor;
      ctx.beginPath();
      ctx.moveTo(ramp[0][0] + 4, ramp[0][1] + 4);
      for (let i = 1; i < ramp.length; i++) {
        ctx.lineTo(ramp[i][0] + 4, ramp[i][1] + 4);
      }
      ctx.closePath();
      ctx.fill();
      
      // Main ramp
      ctx.fillStyle = this.rampColor;
      ctx.beginPath();
      ctx.moveTo(ramp[0][0], ramp[0][1]);
      for (let i = 1; i < ramp.length; i++) {
        ctx.lineTo(ramp[i][0], ramp[i][1]);
      }
      ctx.closePath();
      ctx.fill();
      
      // Highlight
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ramp[0][0], ramp[0][1]);
      ctx.lineTo(ramp[1][0], ramp[1][1]);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}
