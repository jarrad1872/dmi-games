/**
 * ParallaxBackground - Multi-layer scrolling background system
 * Creates depth and visual polish for the construction site aesthetic
 */

export interface ParallaxLayer {
  name: string;
  speed: number; // 0-1 relative speed (1 = road speed, 0 = static)
  elements: ParallaxElement[];
  offset: number;
}

export interface ParallaxElement {
  type: 'building' | 'crane' | 'scaffold' | 'cloud';
  x: number;
  width: number;
  height: number;
  color: string;
  details?: any;
}

export class ParallaxBackground {
  private layers: ParallaxLayer[] = [];
  private width: number;
  private height: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.initLayers();
  }
  
  private initLayers(): void {
    // Layer 1: City skyline silhouettes (slowest)
    this.layers.push({
      name: 'skyline',
      speed: 0.1,
      offset: 0,
      elements: this.generateSkyline(),
    });
    
    // Layer 2: Cranes and tall structures
    this.layers.push({
      name: 'cranes',
      speed: 0.2,
      offset: 0,
      elements: this.generateCranes(),
    });
    
    // Layer 3: Mid-ground scaffolding
    this.layers.push({
      name: 'scaffolds',
      speed: 0.35,
      offset: 0,
      elements: this.generateScaffolds(),
    });
    
    // Layer 4: Near buildings/construction
    this.layers.push({
      name: 'near',
      speed: 0.5,
      offset: 0,
      elements: this.generateNearBuildings(),
    });
  }
  
  private generateSkyline(): ParallaxElement[] {
    const elements: ParallaxElement[] = [];
    let x = 0;
    
    // Generate 2x width for seamless loop
    while (x < this.width * 2) {
      const width = 60 + Math.random() * 100;
      const height = 150 + Math.random() * 200;
      elements.push({
        type: 'building',
        x,
        width,
        height,
        color: '#1a1a1a',
        details: {
          windows: Math.random() > 0.3,
          antenna: Math.random() > 0.7,
        },
      });
      x += width + Math.random() * 20;
    }
    return elements;
  }
  
  private generateCranes(): ParallaxElement[] {
    const elements: ParallaxElement[] = [];
    const cranePositions = [150, 450, 800, 1100];
    
    for (const pos of cranePositions) {
      elements.push({
        type: 'crane',
        x: pos,
        width: 120,
        height: 300,
        color: '#333333',
        details: {
          armAngle: Math.random() * 30 - 15,
          armLength: 80 + Math.random() * 60,
        },
      });
    }
    return elements;
  }
  
  private generateScaffolds(): ParallaxElement[] {
    const elements: ParallaxElement[] = [];
    let x = 50;
    
    while (x < this.width * 2) {
      if (Math.random() > 0.4) {
        elements.push({
          type: 'scaffold',
          x,
          width: 80 + Math.random() * 60,
          height: 120 + Math.random() * 100,
          color: '#444444',
        });
      }
      x += 150 + Math.random() * 100;
    }
    return elements;
  }
  
  private generateNearBuildings(): ParallaxElement[] {
    const elements: ParallaxElement[] = [];
    let x = 0;
    
    while (x < this.width * 2) {
      const width = 100 + Math.random() * 80;
      elements.push({
        type: 'building',
        x,
        width,
        height: 80 + Math.random() * 60,
        color: '#555555',
        details: { construction: true },
      });
      x += width + 80 + Math.random() * 60;
    }
    return elements;
  }
  
  update(speed: number, deltaTime: number): void {
    const dt = deltaTime / 1000;
    for (const layer of this.layers) {
      layer.offset = (layer.offset + speed * layer.speed * dt) % this.width;
    }
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    // Draw sky gradient
    this.renderSky(ctx);
    
    // Draw each parallax layer
    for (const layer of this.layers) {
      this.renderLayer(ctx, layer);
    }
  }
  
  private renderSky(ctx: CanvasRenderingContext2D): void {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height * 0.7);
    gradient.addColorStop(0, '#1a0a2e');     // Deep purple-blue
    gradient.addColorStop(0.3, '#4a1942');   // Purple
    gradient.addColorStop(0.6, '#ff6b35');   // Orange
    gradient.addColorStop(1, '#ff8c42');     // Lighter orange
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height * 0.7);
    
    // Sun/glow at horizon
    const sunGradient = ctx.createRadialGradient(
      this.width / 2, this.height * 0.55, 0,
      this.width / 2, this.height * 0.55, 200
    );
    sunGradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
    sunGradient.addColorStop(0.3, 'rgba(255, 150, 50, 0.4)');
    sunGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
    
    ctx.fillStyle = sunGradient;
    ctx.fillRect(0, 0, this.width, this.height * 0.7);
  }
  
  private renderLayer(ctx: CanvasRenderingContext2D, layer: ParallaxLayer): void {
    ctx.save();
    
    for (const element of layer.elements) {
      const x = element.x - layer.offset;
      const wrappedX = ((x % this.width) + this.width) % this.width - element.width;
      
      this.renderElement(ctx, element, wrappedX, layer.name);
    }
    
    ctx.restore();
  }
  
  private renderElement(ctx: CanvasRenderingContext2D, element: ParallaxElement, x: number, layerName: string): void {
    const groundY = this.height * 0.55; // Where buildings sit
    
    switch (element.type) {
      case 'building':
        this.renderBuilding(ctx, element, x, groundY);
        break;
      case 'crane':
        this.renderCrane(ctx, element, x, groundY);
        break;
      case 'scaffold':
        this.renderScaffold(ctx, element, x, groundY);
        break;
    }
  }
  
  private renderBuilding(ctx: CanvasRenderingContext2D, element: ParallaxElement, x: number, groundY: number): void {
    const y = groundY - element.height;
    
    // Main building shape
    ctx.fillStyle = element.color;
    ctx.fillRect(x, y, element.width, element.height);
    
    // Windows (lit)
    if (element.details?.windows) {
      ctx.fillStyle = 'rgba(255, 220, 100, 0.3)';
      const windowSize = 6;
      const spacing = 12;
      for (let wy = y + 15; wy < groundY - 15; wy += spacing) {
        for (let wx = x + 10; wx < x + element.width - 10; wx += spacing) {
          if (Math.random() > 0.3) {
            ctx.fillRect(wx, wy, windowSize, windowSize);
          }
        }
      }
    }
    
    // Antenna
    if (element.details?.antenna) {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + element.width / 2, y);
      ctx.lineTo(x + element.width / 2, y - 30);
      ctx.stroke();
      
      // Blinking light
      if (Math.sin(Date.now() / 500) > 0) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(x + element.width / 2, y - 30, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  private renderCrane(ctx: CanvasRenderingContext2D, element: ParallaxElement, x: number, groundY: number): void {
    const baseY = groundY;
    const armAngle = element.details?.armAngle || 0;
    const armLength = element.details?.armLength || 100;
    
    ctx.strokeStyle = element.color;
    ctx.lineWidth = 6;
    
    // Vertical tower
    ctx.beginPath();
    ctx.moveTo(x + 60, baseY);
    ctx.lineTo(x + 60, baseY - element.height);
    ctx.stroke();
    
    // Cross bracing on tower
    ctx.lineWidth = 2;
    for (let i = 0; i < element.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(x + 50, baseY - i);
      ctx.lineTo(x + 70, baseY - i - 40);
      ctx.moveTo(x + 70, baseY - i);
      ctx.lineTo(x + 50, baseY - i - 40);
      ctx.stroke();
    }
    
    // Horizontal arm
    ctx.lineWidth = 5;
    const armTop = baseY - element.height;
    const armEndX = x + 60 + Math.cos(armAngle * Math.PI / 180) * armLength;
    const armEndY = armTop + Math.sin(armAngle * Math.PI / 180) * armLength * 0.2;
    
    ctx.beginPath();
    ctx.moveTo(x + 60, armTop);
    ctx.lineTo(armEndX, armEndY);
    ctx.stroke();
    
    // Counter-arm
    ctx.beginPath();
    ctx.moveTo(x + 60, armTop);
    ctx.lineTo(x + 20, armTop + 10);
    ctx.stroke();
    
    // Hanging cable
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(armEndX, armEndY);
    ctx.lineTo(armEndX, armEndY + 50);
    ctx.stroke();
  }
  
  private renderScaffold(ctx: CanvasRenderingContext2D, element: ParallaxElement, x: number, groundY: number): void {
    const y = groundY - element.height;
    
    ctx.strokeStyle = element.color;
    ctx.lineWidth = 3;
    
    // Vertical poles
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, y);
    ctx.moveTo(x + element.width, groundY);
    ctx.lineTo(x + element.width, y);
    ctx.stroke();
    
    // Horizontal platforms
    ctx.lineWidth = 4;
    const platformSpacing = 40;
    for (let py = groundY - platformSpacing; py > y; py -= platformSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + element.width, py);
      ctx.stroke();
    }
    
    // X bracing
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#555';
    for (let py = groundY; py > y + platformSpacing; py -= platformSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x + element.width, py - platformSpacing);
      ctx.moveTo(x + element.width, py);
      ctx.lineTo(x, py - platformSpacing);
      ctx.stroke();
    }
  }
  
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.layers = [];
    this.initLayers();
  }
}
