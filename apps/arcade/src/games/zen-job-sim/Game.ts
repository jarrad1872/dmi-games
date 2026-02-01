/**
 * ZEN JOB SIM - Main Game Class
 * Manages game loop, scenes, and core systems
 */

import { Scene } from './scenes/Scene';
import { MenuScene } from './scenes/MenuScene';
import { JobScene } from './scenes/JobScene';
import { ProgressionSystem } from './systems/ProgressionSystem';
import { InputHandler } from './systems/InputHandler';
import {
  initSDK,
  fetchLoadout,
  initPromoEngine,
  trackGameStart,
  LoadoutConfig,
} from '@dmi-games/game-sdk';

export type SceneName = 'menu' | 'job';

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
      onPointerDown: (x: number, y: number) => this.handlePointerDown(x, y),
      onPointerMove: (x: number, y: number) => this.handlePointerMove(x, y),
      onPointerUp: () => this.handlePointerUp(),
    });
  }

  async init(): Promise<void> {
    this.resize();

    // Initialize SDK
    try {
      initSDK({
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        gameId: 'zen_job_sim',
      });

      this.loadout = await fetchLoadout('zen_job_sim');
      initPromoEngine(this.loadout);
    } catch (err) {
      console.warn('SDK initialization failed, continuing offline:', err);
    }

    // Create scenes
    this.scenes.set('menu', new MenuScene(this));
    this.scenes.set('job', new JobScene(this));

    // Start at menu
    this.changeScene('menu');

    trackGameStart();
    console.log('[ZEN JOB SIM] Initialized');
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
    console.log(`[ZEN JOB SIM] Changed to scene: ${name}`);
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

  private handlePointerDown(x: number, y: number): void {
    if (this.currentScene && 'onPointerDown' in this.currentScene) {
      (this.currentScene as Scene & { onPointerDown: (x: number, y: number) => void }).onPointerDown(x, y);
    }
  }

  private handlePointerMove(x: number, y: number): void {
    if (this.currentScene && 'onPointerMove' in this.currentScene) {
      (this.currentScene as Scene & { onPointerMove: (x: number, y: number) => void }).onPointerMove(x, y);
    }
  }

  private handlePointerUp(): void {
    if (this.currentScene && 'onPointerUp' in this.currentScene) {
      (this.currentScene as Scene & { onPointerUp: () => void }).onPointerUp();
    }
  }

  getCanvas(): HTMLCanvasElement { return this.canvas; }
  getContext(): CanvasRenderingContext2D { return this.ctx; }
  getProgression(): ProgressionSystem { return this.progression; }
  getLoadout(): LoadoutConfig | null { return this.loadout; }
  getCurrentSceneName(): SceneName { return this.currentSceneName; }
}
