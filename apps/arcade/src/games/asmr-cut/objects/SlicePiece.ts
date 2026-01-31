/**
 * Slice Piece
 * Physics-enabled piece that falls after cutting
 */

import { ObjectDefinition } from '../data/objects';

export interface SlicePieceConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  definition: ObjectDefinition;
  vx: number;
  vy: number;
  rotation: number;
  angularVel: number;
  cutAngle: number;
  isLeftPiece: boolean;
}

export class SlicePiece {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public vx: number;
  public vy: number;
  public rotation: number;
  public angularVel: number;
  public alpha: number = 1;
  public scale: number = 1;

  private definition: ObjectDefinition;
  private cutAngle: number;
  private isLeftPiece: boolean;
  private life: number = 2; // Seconds before fade
  private readonly GRAVITY = 800;
  private readonly FLOOR_Y = 1000; // Off-screen

  /** Get piece color for blender collection */
  get color(): string {
    return this.definition.color;
  }

  constructor(config: SlicePieceConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.definition = config.definition;
    this.vx = config.vx;
    this.vy = config.vy;
    this.rotation = config.rotation;
    this.angularVel = config.angularVel;
    this.cutAngle = config.cutAngle;
    this.isLeftPiece = config.isLeftPiece;
  }

  /**
   * Check if piece should be removed
   */
  isDead(): boolean {
    return this.alpha <= 0 || this.y > this.FLOOR_Y;
  }

  /**
   * Update physics
   */
  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    // Apply gravity
    this.vy += this.GRAVITY * dt;

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Update rotation
    this.rotation += this.angularVel * dt;

    // Slow down horizontal movement (air resistance)
    this.vx *= 0.99;

    // Update life and fade
    this.life -= dt;
    if (this.life < 0.5) {
      this.alpha = Math.max(0, this.life / 0.5);
      this.scale = 0.8 + this.alpha * 0.2;
    }
  }

  /**
   * Render the piece
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (this.alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    // Draw the cut piece
    const halfW = this.width / 2;
    const halfH = this.height / 2;

    ctx.fillStyle = this.definition.color;

    // Draw as a polygon representing the cut half
    ctx.beginPath();

    if (this.isLeftPiece) {
      // Left piece - full left edge, cut on right
      ctx.moveTo(-halfW, -halfH);
      ctx.lineTo(0, -halfH);

      // Cut edge (angled)
      const cutOffset = Math.tan(this.cutAngle) * halfH;
      ctx.lineTo(cutOffset, halfH);

      ctx.lineTo(-halfW, halfH);
      ctx.closePath();
    } else {
      // Right piece - cut on left, full right edge
      const cutOffset = Math.tan(this.cutAngle) * halfH;
      ctx.moveTo(-cutOffset, -halfH);
      ctx.lineTo(halfW, -halfH);
      ctx.lineTo(halfW, halfH);
      ctx.lineTo(0, halfH);
      ctx.closePath();
    }

    ctx.fill();

    // Draw cut edge highlight
    ctx.strokeStyle = this.definition.accentColor;
    ctx.lineWidth = 3;

    ctx.beginPath();
    if (this.isLeftPiece) {
      const cutOffset = Math.tan(this.cutAngle) * halfH;
      ctx.moveTo(0, -halfH);
      ctx.lineTo(cutOffset, halfH);
    } else {
      const cutOffset = Math.tan(this.cutAngle) * halfH;
      ctx.moveTo(-cutOffset, -halfH);
      ctx.lineTo(0, halfH);
    }
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * Create two slice pieces from an object cut
 */
export function createSlicePieces(
  x: number,
  y: number,
  width: number,
  height: number,
  definition: ObjectDefinition,
  cutAngle: number,
  swipeVelocity: { x: number; y: number }
): [SlicePiece, SlicePiece] {
  // Calculate perpendicular impulse
  const perpAngle = cutAngle + Math.PI / 2;
  const impulseStrength = Math.min(400, Math.max(150, Math.abs(swipeVelocity.x) + Math.abs(swipeVelocity.y)) * 0.3);

  const leftPiece = new SlicePiece({
    x: x - width / 4,
    y,
    width: width / 2,
    height,
    definition,
    vx: Math.cos(perpAngle) * impulseStrength + swipeVelocity.x * 0.2,
    vy: Math.sin(perpAngle) * impulseStrength - 100,
    rotation: 0,
    angularVel: -2 - Math.random() * 3,
    cutAngle,
    isLeftPiece: true,
  });

  const rightPiece = new SlicePiece({
    x: x + width / 4,
    y,
    width: width / 2,
    height,
    definition,
    vx: Math.cos(perpAngle + Math.PI) * impulseStrength + swipeVelocity.x * 0.2,
    vy: Math.sin(perpAngle + Math.PI) * impulseStrength - 100,
    rotation: 0,
    angularVel: 2 + Math.random() * 3,
    cutAngle,
    isLeftPiece: false,
  });

  return [leftPiece, rightPiece];
}
