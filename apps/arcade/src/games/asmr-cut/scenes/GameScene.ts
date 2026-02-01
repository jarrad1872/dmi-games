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

  // Rebar hazard
  private currentObjectHasRebar: boolean = false;
  private rebarWarningTimer: number = 0;
  private rebarHitCount: number = 0;

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

    // Determine if this object has hidden rebar
    const def = this.currentObject.definition;
    this.currentObjectHasRebar = def.hasRebar === true &&
      def.rebarChance !== undefined &&
      Math.random() < def.rebarChance;
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

      // Check for rebar hit (after first slice on hard materials)
      if (this.currentObjectHasRebar && this.currentObject.currentHealth < this.currentObject.maxHealth) {
        this.handleRebarHit();
      }

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

  private handleRebarHit(): void {
    this.rebarHitCount++;
    this.rebarWarningTimer = 2; // Show warning for 2 seconds

    // Emit orange/rust colored sparks
    if (this.currentObject) {
      this.particleSystem.burst(this.currentObject.x, this.currentObject.y, {
        colors: ['#ff6600', '#ff8800', '#ffaa00', '#8b4513'],
        count: 25,
        minSpeed: 300,
        maxSpeed: 500,
        minSize: 3,
        maxSize: 8,
        minLife: 0.3,
        maxLife: 0.6,
        type: 'circle',
      });
    }

    // Strong haptic feedback for rebar hit
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Track rebar hit
    trackLevelComplete(this.game.getProgression().getCurrentLevel(), 0, {
      event_type: 'rebar_hit',
      hit_count: this.rebarHitCount,
    });
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

    // Update rebar warning timer
    if (this.rebarWarningTimer > 0) {
      this.rebarWarningTimer -= dt;
    }

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

    // Rebar warning
    if (this.rebarWarningTimer > 0) {
      this.renderRebarWarning(ctx, canvas.width, canvas.height);
    }

    // Level complete overlay
    if (this.state === 'levelComplete' || this.state === 'transitioning') {
      this.renderLevelComplete(ctx, canvas.width, canvas.height);
    }
  }

  private renderRebarWarning(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const alpha = Math.min(1, this.rebarWarningTimer);

    // Red flash overlay
    ctx.fillStyle = `rgba(166, 28, 0, ${alpha * 0.15})`;
    ctx.fillRect(0, 0, width, height);

    // Warning text
    ctx.save();
    ctx.globalAlpha = alpha;

    // Warning box
    const boxWidth = 280;
    const boxHeight = 60;
    const boxX = (width - boxWidth) / 2;
    const boxY = height * 0.15;

    ctx.fillStyle = 'rgba(166, 28, 0, 0.9)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
    ctx.fill();

    // Warning text
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 18px 'Roboto', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚠️ REBAR HIT!', width / 2, boxY + 22);

    ctx.font = "14px 'Roboto', sans-serif";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Watch out for hidden rebar!', width / 2, boxY + 44);

    ctx.restore();
  }

  private renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Industrial workshop background - dark gray gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#2d2d2d'); // Dark gray top
    gradient.addColorStop(0.5, '#3d3d3d'); // Mid gray
    gradient.addColorStop(1, '#4a4a4a'); // Slightly lighter bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle concrete texture (random dots)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Faint grid lines suggesting workshop floor
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Safety yellow stripe at bottom
    const stripeHeight = 12;
    const stripeY = height - stripeHeight - 60;
    ctx.fillStyle = '#ffc107';
    ctx.fillRect(0, stripeY, width, stripeHeight);
    // Black hazard stripes
    ctx.fillStyle = '#1a1a1a';
    const stripeWidth = 20;
    for (let x = -stripeWidth; x < width + stripeWidth; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x, stripeY);
      ctx.lineTo(x + stripeWidth, stripeY);
      ctx.lineTo(x + stripeWidth * 2, stripeY + stripeHeight);
      ctx.lineTo(x + stripeWidth, stripeY + stripeHeight);
      ctx.closePath();
      ctx.fill();
    }

    // Soft vignette for depth
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.8
    );
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
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

    // Draw DMI diamond blade at the current swipe position
    this.drawDiamondBlade(ctx, endPoint.x, endPoint.y);

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

  private drawDiamondBlade(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ): void {
    ctx.save();
    ctx.translate(x, y);

    // Blade rotation based on time for spinning effect
    const spinAngle = (performance.now() / 50) % (Math.PI * 2);
    ctx.rotate(spinAngle);

    const outerRadius = 35;
    const innerRadius = 12;
    const segments = 16;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(4, 4, outerRadius, 0, Math.PI * 2);
    ctx.fill();

    // Outer blade ring (silver/steel)
    const bladeGradient = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius);
    bladeGradient.addColorStop(0, '#e0e0e0');
    bladeGradient.addColorStop(0.5, '#bdbdbd');
    bladeGradient.addColorStop(0.8, '#9e9e9e');
    bladeGradient.addColorStop(1, '#757575');

    ctx.fillStyle = bladeGradient;
    ctx.beginPath();
    ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true);
    ctx.fill();

    // Diamond segments (DMI red)
    ctx.fillStyle = '#a61c00';
    for (let i = 0; i < segments; i++) {
      const startAngle = (i / segments) * Math.PI * 2;
      const endAngle = ((i + 0.4) / segments) * Math.PI * 2;

      ctx.beginPath();
      ctx.arc(0, 0, outerRadius - 2, startAngle, endAngle);
      ctx.arc(0, 0, outerRadius - 8, endAngle, startAngle, true);
      ctx.fill();
    }

    // Segment notches (cutting edge detail)
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x1 = Math.cos(angle) * (outerRadius - 8);
      const y1 = Math.sin(angle) * (outerRadius - 8);
      const x2 = Math.cos(angle) * outerRadius;
      const y2 = Math.sin(angle) * outerRadius;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Center hub (DMI branded)
    const hubGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, innerRadius);
    hubGradient.addColorStop(0, '#333333');
    hubGradient.addColorStop(0.7, '#1a1a1a');
    hubGradient.addColorStop(1, '#000000');

    ctx.fillStyle = hubGradient;
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
    ctx.fill();

    // DMI text on hub
    ctx.fillStyle = '#a61c00';
    ctx.font = "bold 8px 'Roboto', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.rotate(-spinAngle); // Counter-rotate so text stays readable
    ctx.fillText('DMI', 0, 0);
    ctx.restore();

    // Center arbor hole
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Highlight reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.ellipse(-outerRadius * 0.4, -outerRadius * 0.4, outerRadius * 0.3, outerRadius * 0.15, -0.5, 0, Math.PI * 2);
    ctx.fill();

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
