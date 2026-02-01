/**
 * Game Scene
 * Main slicing gameplay
 */

import { Scene } from './Scene';
import type { Game } from '../Game';
import { SliceableObject } from '../objects/SliceableObject';
import { SlicePiece, createSlicePieces } from '../objects/SlicePiece';
import { ObjectFactory } from '../objects/ObjectFactory';
import { Blender, Ramps } from '../objects/Environment';
import { InputHandler, SwipePath, SwipePoint } from '../systems/InputHandler';
import { SliceSystem } from '../systems/SliceSystem';
import { ParticleSystem, BURST_COLORS } from '../systems/ParticleSystem';
import { audioManager } from '../systems/AudioManager';
import { HUD } from '../ui/HUD';
import { ScorePopup } from '../ui/ScorePopup';
import { StarRating } from '../ui/StarRating';
import { showToolDrop, getRandomProduct, trackLevelComplete } from '@dmi-games/game-sdk';

type GameState = 'playing' | 'levelComplete' | 'transitioning';

export class GameScene extends Scene {
  private state: GameState = 'playing';

  // Systems
  private inputHandler: InputHandler;
  private sliceSystem: SliceSystem;
  private particleSystem: ParticleSystem;
  private objectFactory: ObjectFactory;

  // UI
  private hud: HUD;
  private scorePopup: ScorePopup;
  private starRating: StarRating;

  // Environment
  private blender: Blender;
  private ramps: Ramps;

  // Game objects
  private currentObject: SliceableObject | null = null;
  private slicePieces: SlicePiece[] = [];

  // Trail rendering
  private trailPoints: SwipePoint[] = [];

  // Level state
  private swipeCount: number = 0;
  private totalPrecision: number = 0;
  private levelCoins: number = 0;
  private stars: number = 0;

  // Transition
  private transitionTimer: number = 0;
  private transitionDuration: number = 2;

  constructor(game: Game) {
    super(game);

    const canvas = game.getCanvas();

    this.inputHandler = new InputHandler(canvas);
    this.sliceSystem = new SliceSystem();
    this.particleSystem = new ParticleSystem();
    this.objectFactory = new ObjectFactory();
    this.hud = new HUD();
    this.scorePopup = new ScorePopup();
    this.starRating = new StarRating();

    // Environment - blender at bottom center, ramps guide pieces
    this.blender = new Blender(canvas.width / 2, canvas.height - 50);
    this.ramps = new Ramps(canvas.width, canvas.height);
  }

  enter(): void {
    super.enter();

    const canvas = this.game.getCanvas();

    this.state = 'playing';
    this.swipeCount = 0;
    this.totalPrecision = 0;
    this.levelCoins = 0;
    this.slicePieces = [];
    this.trailPoints = [];

    // Reset/reposition environment
    this.blender = new Blender(canvas.width / 2, canvas.height - 50);
    this.ramps.resize(canvas.width, canvas.height);

    this.spawnObject();
    this.updateHUD();

    // Setup input callbacks
    this.inputHandler.setCallbacks({
      onSwipeStart: (point) => this.onSwipeStart(point),
      onSwipeMove: (point, path) => this.onSwipeMove(point, path),
      onSwipeEnd: (path) => this.onSwipeEnd(path),
      onTap: (point) => this.onTap(point.x, point.y),
    });
  }

  exit(): void {
    super.exit();
    this.inputHandler.setCallbacks({});
  }

  private spawnObject(): void {
    const canvas = this.game.getCanvas();
    const progression = this.game.getProgression();

    this.currentObject = this.objectFactory.createForLevel({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      level: progression.getCurrentLevel(),
    });
  }

  private updateHUD(): void {
    const progression = this.game.getProgression();
    const obj = this.currentObject;

    this.hud.setState({
      level: progression.getCurrentLevel(),
      coins: progression.getCoins(),
      objectName: obj?.definition.name || '',
      swipesRemaining: obj?.currentHealth || 0,
      totalSwipes: obj?.maxHealth || 1,
      blade: progression.getEquippedBlade(),
    });
  }

  private onSwipeStart(point: SwipePoint): void {
    if (this.state !== 'playing') return;
    this.trailPoints = [point];

    // Initialize audio on first interaction
    audioManager.init();
  }

  private onSwipeMove(point: SwipePoint, path: SwipePoint[]): void {
    if (this.state !== 'playing') return;
    this.trailPoints = path;
  }

  private onSwipeEnd(path: SwipePath): void {
    if (this.state !== 'playing' || !this.currentObject) return;

    this.trailPoints = [];
    this.swipeCount++;

    // Check for slice hit
    const result = this.sliceSystem.checkSlice(path, this.currentObject.getBounds());

    if (result.hit && result.entryPoint && result.exitPoint) {
      const precision = result.precision || 0;
      this.totalPrecision += precision;

      // Play slice sound
      audioManager.playSlice();

      // Record the slice
      this.game.getProgression().recordSlice(precision);

      // Emit particles along cut line with varied colors
      this.particleSystem.emitAlongLine(
        result.entryPoint.x,
        result.entryPoint.y,
        result.exitPoint.x,
        result.exitPoint.y,
        {
          colors: BURST_COLORS,
          count: 6,
          type: 'square',
          minSize: 6,
          maxSize: 12,
        }
      );

      // Apply damage
      const destroyed = this.currentObject.damage();

      // Show precision feedback
      if (precision > 0.9) {
        this.scorePopup.showPerfect(this.currentObject.x, this.currentObject.y - 80);
      }

      if (destroyed) {
        this.onObjectDestroyed(result.cutAngle || 0, path);
      } else {
        // Play impact sound for non-final hits
        audioManager.playImpact();

        // Show progress
        this.updateHUD();

        // Haptic feedback (if available)
        if (navigator.vibrate) {
          navigator.vibrate(20);
        }
      }
    }
  }

  private onObjectDestroyed(cutAngle: number, swipePath: SwipePath): void {
    if (!this.currentObject) return;

    // Create slice pieces
    const velocity = this.sliceSystem.getSwipeVelocity(swipePath);
    const pieces = createSlicePieces(
      this.currentObject.x,
      this.currentObject.y,
      this.currentObject.width,
      this.currentObject.height,
      this.currentObject.definition,
      cutAngle,
      velocity
    );

    this.slicePieces.push(...pieces);

    // Big particle burst with colorful squares (like Soap Cutting reference)
    this.particleSystem.burst(this.currentObject.x, this.currentObject.y, {
      colors: BURST_COLORS,
      count: 40,
      minSpeed: 250,
      maxSpeed: 600,
      minSize: 8,
      maxSize: 18,
      minLife: 0.6,
      maxLife: 1.2,
      type: 'square',
    });

    // Play burst sound
    audioManager.playBurst();

    // Calculate rewards
    const progression = this.game.getProgression();
    const avgPrecision = this.totalPrecision / this.swipeCount;

    this.stars = progression.calculateStars(
      avgPrecision,
      this.swipeCount,
      this.currentObject.definition.requiredSwipes
    );

    this.levelCoins = progression.calculateCoinReward(
      this.currentObject.definition.baseCoins,
      this.stars,
      avgPrecision
    );

    // Add coins
    progression.addCoins(this.levelCoins);

    // Play coin sound
    audioManager.playCoin();

    // Show coin popup
    this.scorePopup.showCoins(this.currentObject.x, this.currentObject.y, this.levelCoins);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    // Clear current object
    this.currentObject = null;

    // Transition to level complete
    this.state = 'levelComplete';
    this.transitionTimer = 0;

    // Show stars
    const canvas = this.game.getCanvas();
    this.starRating.show({
      x: canvas.width / 2,
      y: canvas.height / 2 - 50,
      stars: this.stars,
      animated: true,
    });

    // Play level complete fanfare
    audioManager.playLevelComplete();

    // Track level complete
    trackLevelComplete(progression.getCurrentLevel(), this.levelCoins, {
      stars: this.stars,
      precision: avgPrecision,
      swipes: this.swipeCount,
    });
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    // Update particles
    this.particleSystem.update(deltaTime);

    // Update blender
    this.blender.update(deltaTime);

    // Update slice pieces with ramp collision and blender collection
    for (let i = this.slicePieces.length - 1; i >= 0; i--) {
      const piece = this.slicePieces[i];
      piece.update(deltaTime);

      // Check ramp collision
      const collision = this.ramps.checkCollision(piece.x, piece.y, piece.vx, piece.vy);
      if (collision.hit) {
        piece.vx = collision.newVx;
        piece.vy = collision.newVy;
      }

      // Check if piece enters blender
      if (this.blender.containsPoint(piece.x, piece.y)) {
        this.blender.addPiece(piece.color);
        this.slicePieces.splice(i, 1);
        continue;
      }

      if (piece.isDead()) {
        this.slicePieces.splice(i, 1);
      }
    }

    // Update current object
    if (this.currentObject) {
      this.currentObject.update(deltaTime);
    }

    // Update UI
    this.hud.update(deltaTime);
    this.scorePopup.update(deltaTime);
    this.starRating.update(deltaTime);

    // Handle level complete transition
    if (this.state === 'levelComplete') {
      this.transitionTimer += dt;

      if (this.transitionTimer >= this.transitionDuration && this.starRating.isComplete()) {
        this.completeLevel();
      }
    }
  }

  private completeLevel(): void {
    const progression = this.game.getProgression();

    // Advance level
    progression.completeLevel(this.stars);

    // Check for Tool Drop
    if (progression.shouldShowToolDrop()) {
      const product = getRandomProduct();
      if (product) {
        showToolDrop(product);
      }
    }

    // Start next level
    this.state = 'transitioning';
    this.transitionTimer = 0;

    // Brief pause then spawn new object
    setTimeout(() => {
      this.state = 'playing';
      this.swipeCount = 0;
      this.totalPrecision = 0;
      this.levelCoins = 0;
      this.spawnObject();
      this.updateHUD();
    }, 500);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();

    // Background
    this.renderBackground(ctx, canvas.width, canvas.height);

    // Ramps (behind objects)
    this.ramps.render(ctx);

    // Blender (behind falling pieces)
    this.blender.render(ctx);

    // Slice pieces
    for (const piece of this.slicePieces) {
      piece.render(ctx);
    }

    // Current object
    if (this.currentObject) {
      this.currentObject.render(ctx);
    }

    // Particles
    this.particleSystem.render(ctx);

    // Swipe trail
    this.renderTrail(ctx);

    // UI
    this.hud.render(ctx, canvas.width);
    this.scorePopup.render(ctx);

    // Level complete overlay
    if (this.state === 'levelComplete' || this.state === 'transitioning') {
      this.renderLevelComplete(ctx, canvas.width, canvas.height);
    }
  }

  private renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Light pastel gradient (matching ASMR Slicing reference)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#e0f7fa'); // Light cyan/mint
    gradient.addColorStop(0.5, '#b2ebf2'); // Mid cyan
    gradient.addColorStop(1, '#e1f5fe'); // Light blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Soft vignette (lighter than before)
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.8
    );
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  private renderTrail(ctx: CanvasRenderingContext2D): void {
    if (this.trailPoints.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const blade = this.game.getProgression().getEquippedBlade();
    const startPoint = this.trailPoints[0];
    const endPoint = this.trailPoints[this.trailPoints.length - 1];

    // Cut preview line (dotted) from start to end
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Small circle indicator at the end point
    ctx.fillStyle = '#64b5f6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw knife at the current swipe position (end of trail)
    this.drawKnife(ctx, endPoint.x, endPoint.y, startPoint, endPoint);

    // Trail glow (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
    for (let i = 1; i < this.trailPoints.length; i++) {
      ctx.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
    }
    ctx.stroke();

    ctx.restore();
  }

  private drawKnife(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): void {
    ctx.save();
    ctx.translate(x, y);

    // Calculate angle from start to end, knife points in travel direction
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    ctx.rotate(angle + Math.PI / 4); // Tilt knife slightly

    // Knife dimensions
    const bladeLength = 60;
    const bladeWidth = 12;
    const handleLength = 45;
    const handleWidth = 16;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(20, 15, 35, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Blade (silver with gradient)
    const bladeGradient = ctx.createLinearGradient(0, -bladeWidth / 2, 0, bladeWidth / 2);
    bladeGradient.addColorStop(0, '#f5f5f5');
    bladeGradient.addColorStop(0.3, '#e0e0e0');
    bladeGradient.addColorStop(0.5, '#bdbdbd');
    bladeGradient.addColorStop(0.7, '#e0e0e0');
    bladeGradient.addColorStop(1, '#9e9e9e');

    ctx.fillStyle = bladeGradient;
    ctx.beginPath();
    ctx.moveTo(-5, -bladeWidth / 2);
    ctx.lineTo(bladeLength - 15, -bladeWidth / 2);
    ctx.quadraticCurveTo(bladeLength, -bladeWidth / 4, bladeLength, 0); // Tip curve
    ctx.quadraticCurveTo(bladeLength, bladeWidth / 4, bladeLength - 10, bladeWidth / 3);
    ctx.lineTo(-5, bladeWidth / 2);
    ctx.closePath();
    ctx.fill();

    // Blade edge shine
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -bladeWidth / 2 + 2);
    ctx.lineTo(bladeLength - 18, -bladeWidth / 2 + 2);
    ctx.stroke();

    // Blade edge (sharp part)
    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, bladeWidth / 2);
    ctx.lineTo(bladeLength - 10, bladeWidth / 3);
    ctx.stroke();

    // Handle (blue like reference)
    const handleGradient = ctx.createLinearGradient(0, -handleWidth / 2, 0, handleWidth / 2);
    handleGradient.addColorStop(0, '#42a5f5');
    handleGradient.addColorStop(0.3, '#2196f3');
    handleGradient.addColorStop(0.7, '#1976d2');
    handleGradient.addColorStop(1, '#1565c0');

    ctx.fillStyle = handleGradient;
    ctx.beginPath();
    ctx.moveTo(-5, -handleWidth / 2);
    ctx.lineTo(-handleLength, -handleWidth / 2 + 2);
    ctx.quadraticCurveTo(-handleLength - 5, 0, -handleLength, handleWidth / 2 - 2);
    ctx.lineTo(-5, handleWidth / 2);
    ctx.closePath();
    ctx.fill();

    // Handle highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(-8, -handleWidth / 2 + 2);
    ctx.lineTo(-handleLength + 5, -handleWidth / 2 + 4);
    ctx.lineTo(-handleLength + 5, -handleWidth / 4);
    ctx.lineTo(-8, -handleWidth / 4);
    ctx.closePath();
    ctx.fill();

    // Metal bolster (where blade meets handle)
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(-8, -handleWidth / 2, 6, handleWidth);

    // Bolster shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(-7, -handleWidth / 2 + 1, 2, handleWidth - 2);

    ctx.restore();
  }

  private renderLevelComplete(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Overlay
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.5, this.transitionTimer * 0.5)})`;
    ctx.fillRect(0, 0, width, height);

    // Stars
    this.starRating.render(ctx);

    // Level complete text
    if (this.transitionTimer > 0.5) {
      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 36px 'Roboto Slab', serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Level Complete!', width / 2, height / 2 + 40);

      // Coins earned
      ctx.font = "24px 'Roboto', sans-serif";
      ctx.fillStyle = '#ffd700';
      ctx.fillText(`+${this.levelCoins} coins`, width / 2, height / 2 + 80);
    }
  }

  onTap(x: number, y: number): void {
    // Initialize audio on tap interaction too
    audioManager.init();

    // Check for reset button tap (only during gameplay)
    if (this.state === 'playing' && this.hud.isResetButtonHit(x, y)) {
      audioManager.playClick();
      this.resetLevel();
      return;
    }

    // Tap to continue after level complete
    if (this.state === 'levelComplete' && this.transitionTimer > 1) {
      this.completeLevel();
    }
  }

  /**
   * Reset the current level (retry)
   */
  private resetLevel(): void {
    // Reset level state
    this.state = 'playing';
    this.swipeCount = 0;
    this.totalPrecision = 0;
    this.levelCoins = 0;
    this.slicePieces = [];
    this.trailPoints = [];
    this.transitionTimer = 0;

    // Clear particles
    this.particleSystem.clear();

    // Reset blender
    this.blender.reset();

    // Respawn object
    this.spawnObject();
    this.updateHUD();

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }
}
