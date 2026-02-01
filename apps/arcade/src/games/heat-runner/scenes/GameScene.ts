/**
 * GameScene - Polished core gameplay with layered rendering
 */

import { Scene } from './Scene';
import type { Game } from '../Game';
import { Player } from '../objects/Player';
import { Obstacle } from '../objects/Obstacle';
import { HUD } from '../ui/HUD';
import { ParallaxBackground } from '../effects/ParallaxBackground';
import { ParticleSystem } from '../effects/ParticleSystem';
import { ScreenEffects } from '../effects/ScreenEffects';
import { getRandomObstacle } from '../data/obstacles';
import type { SwipeDirection } from '../systems/InputHandler';

export class GameScene extends Scene {
  private player!: Player;
  private obstacles: Obstacle[] = [];
  private hud!: HUD;
  private background!: ParallaxBackground;
  private particles!: ParticleSystem;
  private screenEffects!: ScreenEffects;
  
  // Game state
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private gameOverTimer: number = 0;
  
  // Metrics
  private distance: number = 0;
  private score: number = 0;
  private coins: number = 0;
  
  // Speed progression
  private speed: number = 350;
  private readonly MIN_SPEED = 350;
  private readonly MAX_SPEED = 900;
  private targetSpeed: number = 350;
  
  // Spawn timing
  private spawnTimer: number = 0;
  private spawnInterval: number = 1800;
  private readonly MIN_SPAWN_INTERVAL = 700;
  
  // Visual
  private groundY: number = 0;
  private trackOffset: number = 0;
  private lastPlayerLane: number = 1;
  
  // Near miss detection
  private nearMissThreshold: number = 80;
  
  constructor(game: Game) {
    super(game);
  }
  
  enter(): void {
    super.enter();
    this.reset();
  }
  
  private reset(): void {
    const canvas = this.game.getCanvas();
    this.groundY = canvas.clientHeight * 0.75;
    
    this.player = new Player(this.groundY, canvas.clientWidth / 2);
    this.obstacles = [];
    this.hud = new HUD();
    this.background = new ParallaxBackground(canvas.clientWidth, canvas.clientHeight);
    this.particles = new ParticleSystem();
    this.screenEffects = new ScreenEffects();
    
    this.isGameOver = false;
    this.isPaused = false;
    this.gameOverTimer = 0;
    this.distance = 0;
    this.score = 0;
    this.coins = 0;
    this.speed = this.MIN_SPEED;
    this.targetSpeed = this.MIN_SPEED;
    this.spawnTimer = 0;
    this.spawnInterval = 1800;
    this.trackOffset = 0;
    this.lastPlayerLane = 1;
  }
  
  update(deltaTime: number): void {
    if (this.isGameOver) {
      this.gameOverTimer += deltaTime;
      this.particles.update(deltaTime);
      this.screenEffects.update(deltaTime);
      return;
    }
    
    if (this.isPaused) return;
    
    const dt = deltaTime / 1000;
    
    // Update distance and score
    this.distance += this.speed * dt / 100;
    this.score = Math.floor(this.distance);
    
    // Gradual speed increase
    const distanceMilestone = Math.floor(this.distance / 100);
    this.targetSpeed = Math.min(this.MIN_SPEED + distanceMilestone * 30, this.MAX_SPEED);
    this.speed += (this.targetSpeed - this.speed) * 0.02;
    
    // Show speed lines at high speed
    if (this.speed > 600) {
      this.screenEffects.showSpeedLines((this.speed - 600) / 400 * 0.3);
    }
    
    // Decrease spawn interval
    this.spawnInterval = Math.max(this.MIN_SPAWN_INTERVAL, 1800 - distanceMilestone * 50);
    
    // Track scrolling
    this.trackOffset = (this.trackOffset + this.speed * dt) % 50;
    
    // Update background with speed
    this.background.update(this.speed, deltaTime);
    
    // Update player
    this.player.update(deltaTime);
    
    // Emit dust when running
    if (this.player.state === 'running') {
      this.particles.emitDust(this.player.x, this.groundY, this.speed / 400);
    }
    
    // Emit trail when jumping
    if (this.player.state === 'jumping' && this.player.velocityY < 0) {
      this.particles.emitJumpTrail(this.player.x, this.player.y);
    }
    
    // Spawn obstacles
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnObstacle();
      this.spawnTimer = 0;
    }
    
    // Update obstacles and check collisions
    for (const obstacle of this.obstacles) {
      obstacle.update(this.speed, deltaTime);
      
      // Near miss detection
      this.checkNearMiss(obstacle);
      
      // Collision check
      if (obstacle.checkCollision(this.player)) {
        this.gameOver();
        return;
      }
    }
    
    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter(o => o.y < this.game.getCanvas().clientHeight + 150);
    
    // Update particles and effects
    this.particles.update(deltaTime);
    this.screenEffects.update(deltaTime);
    
    // Update HUD
    this.hud.update(this.distance, this.score, this.coins);
  }
  
  private checkNearMiss(obstacle: Obstacle): void {
    if (!obstacle.active) return;
    
    const pBounds = this.player.getBounds();
    const oBounds = obstacle.getBounds();
    
    // Check if obstacle just passed player without collision
    const playerCenter = pBounds.y + pBounds.height / 2;
    const obstacleBottom = oBounds.y + oBounds.height;
    
    if (obstacleBottom > playerCenter - 20 && obstacleBottom < playerCenter + 20) {
      const horizontalDist = Math.abs(this.player.x - obstacle.x);
      if (horizontalDist < this.nearMissThreshold && obstacle.lane !== this.player.lane) {
        this.screenEffects.triggerNearMiss();
        // Bonus points for near miss
        this.score += 5;
      }
    }
  }
  
  private spawnObstacle(): void {
    const canvas = this.game.getCanvas();
    const definition = getRandomObstacle();
    const lane = Math.floor(Math.random() * 3);
    const startY = -100;
    
    const obstacle = new Obstacle(definition, lane, startY, canvas.clientWidth / 2);
    this.obstacles.push(obstacle);
  }
  
  private gameOver(): void {
    this.isGameOver = true;
    this.player.hit();
    
    // Screen effects
    this.screenEffects.shake(15, 400);
    this.screenEffects.flash('#ff0000', 0.4);
    
    // Particles
    this.particles.emitHitSparks(this.player.x, this.player.y - 50);
    this.particles.emitDebris(this.player.x, this.player.y - 30);
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    ctx.save();
    
    // Apply screen shake
    this.screenEffects.applyShake(ctx);
    
    // Layer 1: Parallax background
    this.background.render(ctx);
    
    // Layer 2: Road
    this.renderRoad(ctx, width, height);
    
    // Layer 3: Obstacles (behind player if higher on screen)
    for (const obstacle of this.obstacles) {
      if (obstacle.y < this.player.y) {
        obstacle.render(ctx);
      }
    }
    
    // Layer 4: Particles (dust, etc.)
    this.particles.render(ctx);
    
    // Layer 5: Player
    this.player.render(ctx);
    
    // Layer 6: Obstacles in front of player
    for (const obstacle of this.obstacles) {
      if (obstacle.y >= this.player.y) {
        obstacle.render(ctx);
      }
    }
    
    // Layer 7: Screen effects overlay
    this.screenEffects.renderOverlays(ctx, width, height);
    
    ctx.restore();
    
    // Layer 8: HUD (unaffected by shake)
    if (!this.isGameOver) {
      this.hud.render(ctx, width);
    } else {
      this.hud.renderGameOver(ctx, width, height, this.gameOverTimer);
    }
  }
  
  private renderRoad(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const roadY = height * 0.55;
    const roadHeight = height - roadY;
    
    // Road gradient
    const roadGradient = ctx.createLinearGradient(0, roadY, 0, height);
    roadGradient.addColorStop(0, '#3a3a3a');
    roadGradient.addColorStop(0.3, '#2f2f2f');
    roadGradient.addColorStop(1, '#252525');
    ctx.fillStyle = roadGradient;
    ctx.fillRect(0, roadY, width, roadHeight);
    
    // Lane markers
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 25]);
    ctx.lineDashOffset = -this.trackOffset;
    
    const laneWidth = width / 3;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(laneWidth * i, roadY);
      ctx.lineTo(laneWidth * i, height);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Edge stripes
    this.renderEdgeStripes(ctx, width, height, roadY);
  }
  
  private renderEdgeStripes(ctx: CanvasRenderingContext2D, width: number, height: number, roadY: number): void {
    // Left edge
    for (let y = -this.trackOffset; y < height - roadY; y += 40) {
      ctx.fillStyle = '#FF6B00';
      ctx.fillRect(0, roadY + y, 12, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, roadY + y + 20, 12, 20);
    }
    
    // Right edge
    for (let y = -this.trackOffset + 20; y < height - roadY; y += 40) {
      ctx.fillStyle = '#FF6B00';
      ctx.fillRect(width - 12, roadY + y, 12, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(width - 12, roadY + y + 20, 12, 20);
    }
  }
  
  onSwipe(direction: SwipeDirection): void {
    if (this.isGameOver) return;
    
    switch (direction) {
      case 'left':
        this.player.moveLeft();
        break;
      case 'right':
        this.player.moveRight();
        break;
      case 'up':
        this.player.jump();
        break;
      case 'down':
        this.player.slide();
        break;
    }
  }
  
  onTap(x: number, y: number): void {
    if (this.isGameOver && this.gameOverTimer > 500) {
      this.reset();
    }
  }
}
