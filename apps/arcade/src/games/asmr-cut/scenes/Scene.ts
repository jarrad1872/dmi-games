/**
 * Base Scene Class
 * All game scenes extend this
 */

import type { Game } from '../Game';

export abstract class Scene {
  protected game: Game;
  protected active: boolean = false;

  constructor(game: Game) {
    this.game = game;
  }

  /**
   * Called when scene becomes active
   */
  enter(): void {
    this.active = true;
  }

  /**
   * Called when scene becomes inactive
   */
  exit(): void {
    this.active = false;
  }

  /**
   * Update scene logic
   */
  abstract update(deltaTime: number): void;

  /**
   * Render scene
   */
  abstract render(ctx: CanvasRenderingContext2D): void;

  /**
   * Handle tap/click
   */
  onTap?(x: number, y: number): void;
}
