/**
 * Obstacle - Spawnable obstacle class
 */

import { ObstacleDefinition, AvoidMethod } from '../data/obstacles';
import { Player } from './Player';

export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  avoidMethod: AvoidMethod;
  lane: number;
  active: boolean = true;
  definition: ObstacleDefinition;
  
  constructor(definition: ObstacleDefinition, lane: number, startY: number, baseX: number) {
    this.definition = definition;
    this.width = definition.width;
    this.height = definition.height;
    this.color = definition.color;
    this.avoidMethod = definition.avoidMethod;
    this.lane = lane;
    this.y = startY;
    this.x = baseX + Player.LANES[lane];
  }
  
  update(speed: number, deltaTime: number): void {
    // Move toward player (down the screen)
    this.y += speed * (deltaTime / 1000);
  }
  
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height,
      width: this.width,
      height: this.height,
    };
  }
  
  checkCollision(player: Player): boolean {
    if (!this.active) return false;
    
    const pBounds = player.getBounds();
    const oBounds = this.getBounds();
    
    // AABB collision
    const collides = (
      pBounds.x < oBounds.x + oBounds.width &&
      pBounds.x + pBounds.width > oBounds.x &&
      pBounds.y < oBounds.y + oBounds.height &&
      pBounds.y + pBounds.height > oBounds.y
    );
    
    if (!collides) return false;
    
    // Check if player is avoiding correctly
    if (player.isInvincible) return false;
    
    switch (this.avoidMethod) {
      case 'jump':
        // Can jump over
        if (player.state === 'jumping' && player.y < player.groundY - 50) {
          return false;
        }
        break;
      case 'slide':
        // Can slide under
        if (player.state === 'sliding') {
          return false;
        }
        break;
      case 'lane':
        // Must be in different lane
        if (player.lane !== this.lane) {
          return false;
        }
        break;
      case 'any':
        // Any method works
        if (player.state === 'jumping' || player.state === 'sliding' || player.lane !== this.lane) {
          return false;
        }
        break;
    }
    
    return true;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const bounds = this.getBounds();
    
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    
    // Add some detail based on type
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    
    // Hazard stripes for barriers
    if (this.avoidMethod === 'lane' || this.avoidMethod === 'slide') {
      ctx.fillStyle = '#000';
      for (let i = 0; i < bounds.width; i += 20) {
        ctx.fillRect(bounds.x + i, bounds.y, 10, 5);
      }
    }
    
    ctx.restore();
  }
}
