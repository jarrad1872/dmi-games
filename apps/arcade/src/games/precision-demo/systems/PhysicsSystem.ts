import { Block } from '../data/levels';
import { STRUCTURES } from '../data/structures';

export interface PhysicsBlock extends Block {
  vx: number;
  vy: number;
  health: number;
  maxHealth: number;
  falling: boolean;
  grounded: boolean;
}

export class PhysicsSystem {
  private blocks: PhysicsBlock[] = [];
  private gravity = 800;
  private groundY = 500;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  loadBlocks(blocks: Block[]): void {
    this.blocks = blocks.map(b => {
      const structure = STRUCTURES[b.material];
      return {
        ...b,
        vx: 0,
        vy: 0,
        health: structure.durability,
        maxHealth: structure.durability,
        falling: false,
        grounded: false,
      };
    });
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000;
    this.blocks.forEach(block => {
      if (block.health <= 0) return;
      const isGrounded = block.y + block.height >= this.groundY;
      const hasSupport = this.hasSupport(block);
      if (!isGrounded && !hasSupport) {
        block.falling = true;
        block.vy += this.gravity * dt;
        block.y += block.vy * dt;
        block.x += block.vx * dt;
        block.vx *= 0.98;
      } else {
        block.falling = false;
        block.vy = 0;
        if (isGrounded) {
          block.y = this.groundY - block.height;
          block.grounded = true;
        }
      }
    });
  }

  applyDamage(x: number, y: number, power: number, radius: number): number {
    let destroyed = 0;
    this.blocks.forEach(block => {
      if (block.health <= 0) return;
      const centerX = block.x + block.width / 2;
      const centerY = block.y + block.height / 2;
      const dist = Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2);
      if (dist < radius) {
        const damage = power * (1 - dist / radius);
        block.health -= damage;
        if (block.health <= 0) {
          block.health = 0;
          destroyed++;
          const angle = Math.atan2(centerY - y, centerX - x);
          block.vx = Math.cos(angle) * 200;
          block.vy = Math.sin(angle) * 200 - 100;
        }
      }
    });
    return destroyed;
  }

  private hasSupport(block: PhysicsBlock): boolean {
    return this.blocks.some(other => {
      if (other === block || other.health <= 0) return false;
      const touching = Math.abs((other.y) - (block.y + block.height)) < 5 &&
        block.x < other.x + other.width && block.x + block.width > other.x;
      return touching;
    });
  }

  getBlocks(): PhysicsBlock[] { return this.blocks; }
  getDestructionPercent(): number {
    const destroyed = this.blocks.filter(b => b.health <= 0).length;
    return this.blocks.length > 0 ? (destroyed / this.blocks.length) * 100 : 0;
  }
}
