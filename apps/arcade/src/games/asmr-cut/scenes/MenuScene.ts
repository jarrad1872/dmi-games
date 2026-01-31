/**
 * Menu Scene
 * Main menu with play button and options
 */

import { Scene } from './Scene';
import type { Game } from '../Game';

interface Button {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  action: () => void;
  color: string;
  hoverScale: number;
}

export class MenuScene extends Scene {
  private buttons: Button[] = [];
  private titleY: number = 0;
  private titleBounce: number = 0;
  private bgGradientOffset: number = 0;

  constructor(game: Game) {
    super(game);
  }

  enter(): void {
    super.enter();
    this.setupButtons();
    this.titleY = -100;
  }

  private setupButtons(): void {
    const canvas = this.game.getCanvas();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.buttons = [
      {
        x: centerX,
        y: centerY + 50,
        width: 200,
        height: 60,
        text: 'PLAY',
        action: () => this.game.changeScene('game'),
        color: '#a61c00',
        hoverScale: 1,
      },
      {
        x: centerX,
        y: centerY + 130,
        width: 200,
        height: 50,
        text: 'SHOP',
        action: () => this.game.changeScene('shop'),
        color: '#0033A0',
        hoverScale: 1,
      },
    ];
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    // Animate title entrance
    if (this.titleY < 0) {
      this.titleY += 300 * dt;
      if (this.titleY > 0) this.titleY = 0;
    }

    // Title bounce
    this.titleBounce += dt * 2;

    // Background animation
    this.bgGradientOffset += dt * 20;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const { width, height } = canvas;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Animated background lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const y = ((i * 100 + this.bgGradientOffset) % (height + 200)) - 100;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + 50);
      ctx.stroke();
    }

    // Title
    const titleY = height * 0.25 + this.titleY + Math.sin(this.titleBounce) * 5;

    ctx.save();
    ctx.translate(width / 2, titleY);

    // Title shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = "bold 64px 'Roboto Slab', serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ASMR CUT', 4, 4);

    // Title gradient
    const titleGradient = ctx.createLinearGradient(-150, -30, 150, 30);
    titleGradient.addColorStop(0, '#ff6b6b');
    titleGradient.addColorStop(0.5, '#ffd93d');
    titleGradient.addColorStop(1, '#ff6b6b');
    ctx.fillStyle = titleGradient;
    ctx.fillText('ASMR CUT', 0, 0);

    ctx.restore();

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = "18px 'Roboto', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('DMI Games', width / 2, titleY + 50);

    // Stats display
    const progression = this.game.getProgression();
    const saveData = progression.getSaveData();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = "16px 'Roboto', sans-serif";
    ctx.fillText(`Level ${saveData.currentLevel} • ${saveData.coins} coins`, width / 2, titleY + 80);

    // Buttons
    for (const button of this.buttons) {
      this.renderButton(ctx, button);
    }

    // Instructions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = "14px 'Roboto', sans-serif";
    ctx.fillText('Swipe to slice!', width / 2, height - 50);
  }

  private renderButton(ctx: CanvasRenderingContext2D, button: Button): void {
    ctx.save();
    ctx.translate(button.x, button.y);
    ctx.scale(button.hoverScale, button.hoverScale);

    // Button shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.roundRect(ctx, -button.width / 2 + 3, -button.height / 2 + 3, button.width, button.height, 10);
    ctx.fill();

    // Button background
    const gradient = ctx.createLinearGradient(0, -button.height / 2, 0, button.height / 2);
    gradient.addColorStop(0, button.color);
    gradient.addColorStop(1, this.darkenColor(button.color, 0.2));
    ctx.fillStyle = gradient;
    this.roundRect(ctx, -button.width / 2, -button.height / 2, button.width, button.height, 10);
    ctx.fill();

    // Button text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${button.height * 0.4}px 'Roboto Slab', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(button.text, 0, 0);

    ctx.restore();
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  private darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.slice(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.slice(2, 4), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.slice(4, 6), 16) * (1 - amount));
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  }

  onTap(x: number, y: number): void {
    for (const button of this.buttons) {
      const halfW = button.width / 2;
      const halfH = button.height / 2;

      if (
        x >= button.x - halfW &&
        x <= button.x + halfW &&
        y >= button.y - halfH &&
        y <= button.y + halfH
      ) {
        button.action();
        break;
      }
    }
  }
}
