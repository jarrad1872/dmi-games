/**
 * ASMR CUT - Main Game Class
 * Manages game loop, scenes, and core systems
 */

import { Scene } from './scenes/Scene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { ShopScene } from './scenes/ShopScene';
import { ProgressionSystem } from './systems/ProgressionSystem';
import { InputHandler, SwipePoint } from './systems/InputHandler';
import {
  initSDK,
  fetchLoadout,
  initPromoEngine,
  trackGameStart,
  LoadoutConfig,
} from '@dmi-games/game-sdk';

export type SceneName = 'menu' | 'game' | 'shop';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Scenes
  private scenes: Map<SceneName, Scene> = new Map();
  private currentScene: Scene | null = null;
  private currentSceneName: SceneName = 'menu';

  // Core systems
  private progression: ProgressionSystem;
  private inputHandler: InputHandler;

  // Game loop
  private lastTime: number = 0;
  private running: boolean = false;
  private targetFPS: number = 60;
  private frameInterval: number = 1000 / 60;

  // SDK
  private loadout: LoadoutConfig | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    // Initialize systems
    this.progression = new ProgressionSystem();
    this.inputHandler = new InputHandler(canvas);

    // Setup input
    this.inputHandler.setCallbacks({
      onTap: (point: SwipePoint) => this.handleTap(point),
    });
  }

  /**
   * Initialize the game
   */
  async init(): Promise<void> {
    // Set canvas size
    this.resize();

    // Initialize SDK
    try {
      initSDK({
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        gameId: 'asmr_cut',
      });

      // Fetch loadout
      this.loadout = await fetchLoadout('asmr_cut');
      initPromoEngine(this.loadout);
    } catch (err) {
      console.warn('SDK initialization failed, continuing offline:', err);
    }

    // Create scenes
    this.scenes.set('menu', new MenuScene(this));
    this.scenes.set('game', new GameScene(this));
    this.scenes.set('shop', new ShopScene(this));

    // Start at menu
    this.changeScene('menu');

    // Track game start
    trackGameStart();

    console.log('[ASMR CUT] Initialized');
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.running = false;
  }

  /**
   * Main game loop
   */
  private gameLoop(currentTime: number): void {
    if (!this.running) return;

    requestAnimationFrame((t) => this.gameLoop(t));

    const deltaTime = currentTime - this.lastTime;

    // Cap delta time to prevent huge jumps
    const cappedDelta = Math.min(deltaTime, 100);

    // Frame rate limiting (optional, smooth 60fps)
    // if (deltaTime < this.frameInterval) return;

    this.lastTime = currentTime;

    // Update
    this.update(cappedDelta);

    // Render
    this.render();
  }

  /**
   * Update game state
   */
  private update(deltaTime: number): void {
    this.currentScene?.update(deltaTime);
  }

  /**
   * Render the game
   */
  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render current scene
    this.currentScene?.render(this.ctx);
  }

  /**
   * Change to a different scene
   */
  changeScene(name: SceneName): void {
    // Exit current scene
    this.currentScene?.exit();

    // Get new scene
    const scene = this.scenes.get(name);
    if (!scene) {
      console.error(`Scene not found: ${name}`);
      return;
    }

    // Enter new scene
    this.currentScene = scene;
    this.currentSceneName = name;
    scene.enter();

    console.log(`[ASMR CUT] Changed to scene: ${name}`);
  }

  /**
   * Handle window resize
   */
  resize(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    // Get container size
    const { clientWidth, clientHeight } = container;

    // Set canvas size (using device pixel ratio for sharpness)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = clientWidth * dpr;
    this.canvas.height = clientHeight * dpr;

    this.canvas.style.width = `${clientWidth}px`;
    this.canvas.style.height = `${clientHeight}px`;

    // Scale context for DPR
    this.ctx.scale(dpr, dpr);

    // Reset scale on next frame
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Handle tap input
   */
  private handleTap(point: SwipePoint): void {
    // Delegate to current scene
    if (this.currentScene && 'onTap' in this.currentScene) {
      (this.currentScene as Scene & { onTap: (x: number, y: number) => void }).onTap(point.x, point.y);
    }
  }

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get 2D context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get progression system
   */
  getProgression(): ProgressionSystem {
    return this.progression;
  }

  /**
   * Get current loadout
   */
  getLoadout(): LoadoutConfig | null {
    return this.loadout;
  }

  /**
   * Get current scene name
   */
  getCurrentSceneName(): SceneName {
    return this.currentSceneName;
  }
}
