import { Scene } from './Scene';
import { Game } from '../Game';

export class MenuScene extends Scene {
  constructor(game: Game) {
    super(game);
  }

  enter(): void {
    console.log('[PRECISION DEMO] Menu entered');
  }

  exit(): void {}

  update(deltaTime: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const w = canvas.width / 2;
    const h = canvas.height / 2;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PRECISION DEMO', w / 2, h / 2 - 60);

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText('Tap to Start', w / 2, h / 2 + 20);

    ctx.fillStyle = '#aaa';
    ctx.font = '16px Arial';
    ctx.fillText('Demolition Puzzle Game', w / 2, h / 2 + 60);
  }

  onTap(x: number, y: number): void {
    this.game.changeScene('game');
  }
}
