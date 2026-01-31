/**
 * GameScene - Core gameplay
 * 3-lane endless runner
 */

import { Scene } from './Scene';
import type { Game } from '../Game';
import { Player } from '../objects/Player';
import { Obstacle } from '../objects/Obstacle';
import { HUD } from '../ui/HUD';
import { getRandomObstacle } from '../data/obstacles';
import type { SwipeDirection } from '../systems/InputHandler';

export class GameScene extends Scene {
  private player!: Player;
  private obstacles: Obstacle[] = [];
  private hud!: HUD;
  
  // Game state
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  
  // Metrics
  private distance: number = 0;
  private score: number = 0;
  private coins: number = 0;
  
  // Speed progression
  private speed: number = 400; // pixels per second
  private readonly MIN_SPEED = 400;
  private readonly MAX_SPEED = 1000;
  private readonly SPEED_INCREMENT = 20;
  
  // Spawn timing
  private spawnTimer: number = 0;
  private spawnInterval: number = 2000; // ms between spawns
  private readonly MIN_SPAWN_INTERVAL = 800;
  
  // Visual
  private groundY: number = 0;
  private trackOffset: number = 0;
  
  constructor(game: Game) {
    super(game);
  }
  
  enter(): void {
    super.enter();
    this.reset();
  }
  
  private reset(): void {
    const canvas = this.game.getCanvas();
    this.groundY = canvas.clientHeight - 150;
    
    this.player = new Player(this.groundY, canvas.clientWidth / 2);
    this.obstacles = [];
    this.hud = new HUD();
    
    this.isGameOver = false;
    this.isPaused = false;
    this.distance = 0;
    this.score = 0;
    this.coins = 0;
    this.speed = this.MIN_SPEED;
    this.spawnTimer = 0;
    this.spawnInterval = 2000;
    this.trackOffset = 0;
  }
  
  update(deltaTime: number): void {
    if (this.isGameOver || this.isPaused) return;
    
    const dt = deltaTime / 1000;
    
    // Update distance and score
    this.distance += this.speed * dt / 100;
    this.score = Math.floor(this.distance);
    
    // Speed progression
    if (this.distance > 0 && Math.floor(this.distance) % 50 === 0) {
      this.speed = Math.min(this.speed + this.SPEED_INCREMENT * dt, this.MAX_SPEED);
      this.spawnInterval = Math.max(this.spawnInterval - 5, this.MIN_SPAWN_INTERVAL);
    }
    
    // Track scrolling animation
    this.trackOffset = (this.trackOffset + this.speed * dt) % 40;
    
    // Update player
    this.player.update(deltaTime);
    
    // Spawn obstacles
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnObstacle();
      this.spawnTimer = 0;
    }
    
    // Update obstacles
    for (const obstacle of this.obstacles) {
      obstacle.update(this.speed, deltaTime);
      
      // Check collision
      if (obstacle.checkCollision(this.player)) {
        this.gameOver();
        return;
      }
    }
    
    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter(o => o.y < this.game.getCanvas().clientHeight + 200);
    
    // Update HUD
    this.hud.update(this.distance, this.score, this.coins);
  }
  
  private spawnObstacle(): void {
    const canvas = this.game.getCanvas();
    const definition = getRandomObstacle();
    
    // Random lane
    const lane = Math.floor(Math.random() * 3);
    
    // Spawn above screen
    const startY = -100;
    
    const obstacle = new Obstacle(definition, lane, startY, canvas.clientWidth / 2);
    this.obstacles.push(obstacle);
  }
  
  private gameOver(): void {
    this.isGameOver = true;
    this.player.hit();
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F0FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Ground/track
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, this.groundY, width, height - this.groundY);
    
    // Lane dividers (animated)
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 20]);
    ctx.lineDashOffset = -this.trackOffset;
    
    const laneWidth = width / 3;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(laneWidth * i, 0);
      ctx.lineTo(laneWidth * i, height);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Construction zone stripes on edges
    ctx.fillStyle = '#FF6B00';
    for (let y = -this.trackOffset; y < height; y += 40) {
      ctx.fillRect(0, y, 20, 20);
      ctx.fillRect(width - 20, y + 20, 20, 20);
    }
    
    // Render obstacles
    for (const obstacle of this.obstacles) {
      obstacle.render(ctx);
    }
    
    // Render player
    this.player.render(ctx);
    
    // Render HUD
    if (!this.isGameOver) {
      this.hud.render(ctx, width);
    } else {
      this.hud.renderGameOver(ctx, width, height);
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
    if (this.isGameOver) {
      // Restart game
      this.reset();
    }
  }
}
