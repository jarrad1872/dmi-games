/**
 * HEAT RUNNER - Main Game Class
 * Manages game loop, scenes, and core systems
 */

import { Scene } from './scenes/Scene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { ProgressionSystem } from './systems/ProgressionSystem';
import { InputHandler, SwipeDirection } from './systems/InputHandler';
import {
  initSDK,
  fetchLoadout,
  initPromoEngine,
  trackGameStart,
  LoadoutConfig,
} from '@dmi-games/game-sdk';

export type SceneName = 'menu' | 'game';

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

    // Setup input callbacks
    this.inputHandler.setCallbacks({
      onTap: (x: number, y: number) => this.handleTap(x, y),
      onSwipe: (direction: SwipeDirection) => this.handleSwipe(direction),
    });
  }

  async init(): Promise<void> {
    this.resize();

    // Initialize SDK
    try {
      initSDK({
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        gameId: 'heat_runner',
      });

      this.loadout = await fetchLoadout('heat_runner');
      initPromoEngine(this.loadout);
    } catch (err) {
      console.warn('SDK initialization failed, continuing offline:', err);
    }

    // Create scenes
    this.scenes.set('menu', new MenuScene(this));
    this.scenes.set('game', new GameScene(this));

    // Start at menu
    this.changeScene('menu');

    trackGameStart();
    console.log('[HEAT RUNNER] Initialized');
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop(): void {
    this.running = false;
  }

  private gameLoop(currentTime: number): void {
    if (!this.running) return;
    requestAnimationFrame((t) => this.gameLoop(t));

    const deltaTime = Math.min(currentTime - this.lastTime, 100);
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();
  }

  private update(deltaTime: number): void {
    this.currentScene?.update(deltaTime);
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentScene?.render(this.ctx);
  }

  changeScene(name: SceneName): void {
    this.currentScene?.exit();
    const scene = this.scenes.get(name);
    if (!scene) {
      console.error(`Scene not found: ${name}`);
      return;
    }
    this.currentScene = scene;
    this.currentSceneName = name;
    scene.enter();
    console.log(`[HEAT RUNNER] Changed to scene: ${name}`);
  }

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

  private handleTap(x: number, y: number): void {
    if (this.currentScene && 'onTap' in this.currentScene) {
      (this.currentScene as Scene & { onTap: (x: number, y: number) => void }).onTap(x, y);
    }
  }

  private handleSwipe(direction: SwipeDirection): void {
    if (this.currentScene && 'onSwipe' in this.currentScene) {
      (this.currentScene as Scene & { onSwipe: (d: SwipeDirection) => void }).onSwipe(direction);
    }
  }

  getCanvas(): HTMLCanvasElement { return this.canvas; }
  getContext(): CanvasRenderingContext2D { return this.ctx; }
  getProgression(): ProgressionSystem { return this.progression; }
  getLoadout(): LoadoutConfig | null { return this.loadout; }
  getCurrentSceneName(): SceneName { return this.currentSceneName; }
}
