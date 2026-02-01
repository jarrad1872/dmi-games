/**
 * IDLE DRILL RIG - Main Game Class
 * An idle/incremental drilling game inspired by Idle Miner Tycoon
 */

import { Scene } from './scenes/Scene';
import { GameScene } from './scenes/GameScene';
import { ShopScene } from './scenes/ShopScene';
import { ProgressionSystem } from './systems/ProgressionSystem';
import {
  initSDK,
  fetchLoadout,
  initPromoEngine,
  trackGameStart,
  LoadoutConfig,
} from '@dmi-games/game-sdk';

export type SceneName = 'game' | 'shop';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Scenes
  private scenes: Map<SceneName, Scene> = new Map();
  private currentScene: Scene | null = null;
  private currentSceneName: SceneName = 'game';

  // Core systems
  private progression: ProgressionSystem;

  // Game loop
  private lastTime: number = 0;
  private running: boolean = false;

  // SDK
  private loadout: LoadoutConfig | null = null;

  // Input
  private tapHandlers: Array<(x: number, y: number) => void> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    // Initialize systems
    this.progression = new ProgressionSystem();

    // Setup input
    this.setupInput();
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
        gameId: 'idle_drill_rig',
      });

      // Fetch loadout
      this.loadout = await fetchLoadout('idle_drill_rig');
      initPromoEngine(this.loadout);
    } catch (err) {
      console.warn('SDK initialization failed, continuing offline:', err);
    }

    // Create scenes
    this.scenes.set('game', new GameScene(this));
    this.scenes.set('shop', new ShopScene(this));

    // Start at game scene
    this.changeScene('game');

    // Track game start
    trackGameStart();

    console.log('[Idle Drill Rig] Initialized');
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
    const cappedDelta = Math.min(deltaTime, 100);

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

    console.log(`[Idle Drill Rig] Changed to scene: ${name}`);
  }

  /**
   * Setup input handlers
   */
  private setupInput(): void {
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      
      const rect = this.canvas.getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        const touch = e.touches[0] || e.changedTouches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      this.handleTap(x, y);
    };

    this.canvas.addEventListener('click', handlePointer);
    this.canvas.addEventListener('touchend', handlePointer);
  }

  /**
   * Handle window resize
   */
  resize(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    const { clientWidth, clientHeight } = container;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = clientWidth * dpr;
    this.canvas.height = clientHeight * dpr;

    this.canvas.style.width = `${clientWidth}px`;
    this.canvas.style.height = `${clientHeight}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Handle tap input
   */
  private handleTap(x: number, y: number): void {
    if (this.currentScene && 'onTap' in this.currentScene) {
      (this.currentScene as Scene & { onTap: (x: number, y: number) => void }).onTap(x, y);
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
