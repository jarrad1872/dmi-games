/**
 * MenuScene - Start screen
 */

import { Scene } from './Scene';
import type { Game } from '../Game';

export class MenuScene extends Scene {
  private titleY: number = 200;
  private pulseTimer: number = 0;
  
  constructor(game: Game) {
    super(game);
  }
  
  enter(): void {
    super.enter();
    this.pulseTimer = 0;
  }
  
  update(deltaTime: number): void {
    this.pulseTimer += deltaTime;
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Background - construction site gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.6, '#FFD700'); // Sunset orange
    gradient.addColorStop(1, '#FF6B00'); // DMI Orange
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Ground
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, height - 200, width, 200);
    
    // Lane markers
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]);
    for (let i = 1; i < 3; i++) {
      const x = width / 3 * i;
      ctx.beginPath();
      ctx.moveTo(x, height - 200);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Title
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.strokeText('HEAT RUNNER', width / 2, this.titleY);
    ctx.fillText('HEAT RUNNER', width / 2, this.titleY);
    
    // Subtitle
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText('Construction Site Dash', width / 2, this.titleY + 50);
    
    // Animated play button
    const pulse = Math.sin(this.pulseTimer * 0.003) * 5;
    const buttonY = height / 2 + 50;
    const buttonWidth = 200 + pulse;
    const buttonHeight = 60 + pulse;
    
    ctx.fillStyle = '#FF6B00';
    ctx.beginPath();
    ctx.roundRect(width / 2 - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 10);
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('TAP TO PLAY', width / 2, buttonY + 10);
    
    // Controls hint
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.fillText('Swipe \u2190 \u2192 to switch lanes', width / 2, height - 120);
    ctx.fillText('Swipe \u2191 to jump, \u2193 to slide', width / 2, height - 90);
    
    // DMI branding
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('DMI GAMES', width / 2, height - 40);
  }
  
  onTap(x: number, y: number): void {
    // Start game on any tap
    this.game.changeScene('game');
  }
}
