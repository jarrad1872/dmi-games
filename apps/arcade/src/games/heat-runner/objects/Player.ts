/**
 * Player - Construction worker character
 */

export type PlayerState = 'running' | 'jumping' | 'sliding' | 'hit';

export class Player {
  // Position
  x: number;
  y: number;
  groundY: number;
  
  // Lane system
  lane: number = 1; // 0=left, 1=center, 2=right
  static readonly LANES = [-150, 0, 150];
  
  // Dimensions
  width: number = 60;
  height: number = 100;
  
  // State
  state: PlayerState = 'running';
  isInvincible: boolean = false;
  
  // Jump physics
  velocityY: number = 0;
  private readonly GRAVITY = 2500;
  private readonly JUMP_FORCE = -800;
  
  // Slide
  slideTimer: number = 0;
  private readonly SLIDE_DURATION = 500;
  
  // Animation
  animFrame: number = 0;
  animTimer: number = 0;
  
  constructor(groundY: number, centerX: number) {
    this.groundY = groundY;
    this.y = groundY;
    this.x = centerX;
  }
  
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    
    // Update lane position
    const targetX = this.x - (this.x - Player.LANES[this.lane]) + this.getBaseX();
    this.x = this.getBaseX() + Player.LANES[this.lane];
    
    // Jump physics
    if (this.state === 'jumping') {
      this.velocityY += this.GRAVITY * dt;
      this.y += this.velocityY * dt;
      
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
        this.state = 'running';
      }
    }
    
    // Slide timer
    if (this.state === 'sliding') {
      this.slideTimer -= deltaTime;
      if (this.slideTimer <= 0) {
        this.state = 'running';
      }
    }
    
    // Animation
    this.animTimer += deltaTime;
    if (this.animTimer > 100) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 8;
    }
  }
  
  jump(): void {
    if (this.state === 'running' || this.state === 'sliding') {
      this.state = 'jumping';
      this.velocityY = this.JUMP_FORCE;
      this.slideTimer = 0;
    }
  }
  
  slide(): void {
    if (this.state === 'running') {
      this.state = 'sliding';
      this.slideTimer = this.SLIDE_DURATION;
    }
  }
  
  moveLeft(): void {
    if (this.lane > 0) {
      this.lane--;
    }
  }
  
  moveRight(): void {
    if (this.lane < 2) {
      this.lane++;
    }
  }
  
  hit(): void {
    if (!this.isInvincible) {
      this.state = 'hit';
    }
  }
  
  reset(): void {
    this.lane = 1;
    this.y = this.groundY;
    this.velocityY = 0;
    this.state = 'running';
    this.isInvincible = false;
    this.slideTimer = 0;
  }
  
  getBaseX(): number {
    return 360; // Center of 720px canvas
  }
  
  getBounds(): { x: number; y: number; width: number; height: number } {
    const height = this.state === 'sliding' ? 40 : this.height;
    const yOffset = this.state === 'sliding' ? 60 : 0;
    return {
      x: this.x - this.width / 2,
      y: this.y - height + yOffset,
      width: this.width,
      height: height,
    };
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const bounds = this.getBounds();
    
    ctx.save();
    
    // Body color (orange vest)
    ctx.fillStyle = this.isInvincible ? '#FFD700' : '#FF6B00';
    
    if (this.state === 'sliding') {
      // Sliding pose - horizontal rectangle
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    } else {
      // Standing/running/jumping
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      
      // Hard hat (yellow)
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(bounds.x + 5, bounds.y - 20, 50, 20);
      
      // Face
      ctx.fillStyle = '#DEB887';
      ctx.fillRect(bounds.x + 15, bounds.y + 5, 30, 25);
    }
    
    // Draw running legs animation
    if (this.state === 'running') {
      ctx.fillStyle = '#2F4F4F';
      const legOffset = Math.sin(this.animFrame * 0.8) * 10;
      ctx.fillRect(bounds.x + 10, bounds.y + bounds.height, 15, 25 + legOffset);
      ctx.fillRect(bounds.x + 35, bounds.y + bounds.height, 15, 25 - legOffset);
    }
    
    ctx.restore();
  }
}
