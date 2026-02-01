/**
 * Base Scene Class
 */

import type { Game } from '../Game';

export abstract class Scene {
  protected game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  abstract enter(): void;
  abstract exit(): void;
  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;

  // Optional tap handler
  onTap?(x: number, y: number): void;
}
