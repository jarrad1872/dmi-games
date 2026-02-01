import { Scene } from './Scene';
import { Game } from '../Game';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { LEVELS, LevelData } from '../data/levels';
import { TOOLS } from '../data/tools';
import { STRUCTURES } from '../data/structures';
import { showToolDrop, getRandomProduct } from '@dmi-games/game-sdk';

export class GameScene extends Scene {
  private physics: PhysicsSystem;
  private particles: ParticleSystem;
  private currentLevel: LevelData;
  private toolsUsed = 0;
  private selectedTool = 'hammer';
  private gameState: 'playing' | 'complete' = 'playing';
  private starsEarned = 0;

  constructor(game: Game) {
    super(game);
    const canvas = game.getCanvas();
    this.physics = new PhysicsSystem(canvas.width / 2, canvas.height / 2);
    this.particles = new ParticleSystem();
    this.currentLevel = LEVELS[0];
  }

  enter(): void {
    this.loadLevel(this.game.getProgression().getCurrentLevel());
  }

  exit(): void {}

  private loadLevel(levelNum: number): void {
    const level = LEVELS.find(l => l.id === levelNum);
    if (!level) return;
    this.currentLevel = level;
    this.physics.loadBlocks(level.blocks);
    this.toolsUsed = 0;
    this.gameState = 'playing';
    this.particles.clear();
  }

  update(deltaTime: number): void {
    if (this.gameState === 'playing') {
      this.physics.update(deltaTime);
      this.particles.update(deltaTime);
      const destruction = this.physics.getDestructionPercent();
      if (destruction >= this.currentLevel.targetDestruction) {
        this.completeLevel();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const w = canvas.width / 2;
    const h = canvas.height / 2;

    ctx.fillStyle = '#0f3460';
    ctx.fillRect(0, 0, w, h);

    this.physics.getBlocks().forEach(block => {
      if (block.health <= 0) return;
      const structure = STRUCTURES[block.material];
      ctx.fillStyle = structure.color;
      const alpha = block.health / block.maxHealth;
      ctx.globalAlpha = alpha;
      ctx.fillRect(block.x, block.y, block.width, block.height);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x, block.y, block.width, block.height);
    });

    this.particles.render(ctx);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Level ${this.currentLevel.id}`, 20, 30);
    ctx.fillText(`Tools: ${this.toolsUsed}/${this.currentLevel.toolLimit}`, 20, 60);
    ctx.fillText(`Destruction: ${this.physics.getDestructionPercent().toFixed(0)}%`, 20, 90);

    if (this.gameState === 'complete') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('LEVEL COMPLETE!', w / 2, h / 2 - 40);
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(`${this.starsEarned} Stars`, w / 2, h / 2 + 10);
      ctx.font = '18px Arial';
      ctx.fillText('Tap to continue', w / 2, h / 2 + 60);
    }
  }

  onTap(x: number, y: number): void {
    if (this.gameState === 'complete') {
      this.game.changeScene('menu');
      return;
    }
    if (this.toolsUsed >= this.currentLevel.toolLimit) return;
    const tool = TOOLS[this.selectedTool];
    const destroyed = this.physics.applyDamage(x, y, tool.power, tool.radius);
    if (destroyed > 0) {
      this.particles.createExplosion(x, y, 20, tool.color);
      this.particles.createDust(x, y, 15);
      this.toolsUsed++;
    }
  }

  private completeLevel(): void {
    this.gameState = 'complete';
    const stars = this.calculateStars();
    this.starsEarned = stars;
    this.game.getProgression().completeLevel(this.currentLevel.id, stars);
    if (stars === 3) {
      setTimeout(() => {
        const product = getRandomProduct();
        if (product) {
          showToolDrop(product);
        }
      }, 2000);
    }
  }

  private calculateStars(): number {
    const level = this.currentLevel;
    if (this.toolsUsed <= level.stars[3]) return 3;
    if (this.toolsUsed <= level.stars[2]) return 2;
    if (this.toolsUsed <= level.stars[1]) return 1;
    return 0;
  }
}
