/**
 * MenuScene - Polished start screen with parallax and animated character
 */

import { Scene } from './Scene';
import type { Game } from '../Game';
import { ParallaxBackground } from '../effects/ParallaxBackground';
import { ParticleSystem } from '../effects/ParticleSystem';
import { Player } from '../objects/Player';

export class MenuScene extends Scene {
  private background!: ParallaxBackground;
  private particles!: ParticleSystem;
  private player!: Player;
  
  private time: number = 0;
  private highScore: number = 0;
  
  // Animation state
  private titleScale: number = 1;
  private buttonPulse: number = 0;
  private dustTimer: number = 0;
  
  constructor(game: Game) {
    super(game);
  }
  
  enter(): void {
    super.enter();
    const canvas = this.game.getCanvas();
    this.background = new ParallaxBackground(canvas.clientWidth, canvas.clientHeight);
    this.particles = new ParticleSystem();
    this.player = new Player(canvas.clientHeight * 0.72, canvas.clientWidth / 2);
    this.time = 0;
    this.loadHighScore();
  }
  
  private loadHighScore(): void {
    try {
      const saved = localStorage.getItem('heat_runner_highscore');
      this.highScore = saved ? parseInt(saved, 10) : 0;
    } catch {
      this.highScore = 0;
    }
  }
  
  update(deltaTime: number): void {
    this.time += deltaTime;
    this.buttonPulse = Math.sin(this.time * 0.004) * 0.1 + 1;
    this.titleScale = 1 + Math.sin(this.time * 0.002) * 0.02;
    
    // Update background with slow scroll
    this.background.update(150, deltaTime);
    
    // Emit dust particles behind character
    this.dustTimer += deltaTime;
    if (this.dustTimer > 100) {
      this.dustTimer = 0;
      const canvas = this.game.getCanvas();
      this.particles.emitDust(
        canvas.clientWidth / 2 + (Math.random() - 0.5) * 40,
        canvas.clientHeight * 0.72,
        1
      );
    }
    
    this.particles.update(deltaTime);
  }
  
  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Draw parallax background
    this.background.render(ctx);
    
    // Draw road
    this.renderRoad(ctx, width, height);
    
    // Draw particles (behind character)
    this.particles.render(ctx);
    
    // Draw animated character
    this.player.renderMenuPose(ctx, width / 2, height * 0.72, this.time);
    
    // Draw title
    this.renderTitle(ctx, width, height);
    
    // Draw play button
    this.renderPlayButton(ctx, width, height);
    
    // Draw high score
    this.renderHighScore(ctx, width, height);
    
    // Draw controls hint
    this.renderControls(ctx, width, height);
    
    // Draw branding
    this.renderBranding(ctx, width, height);
    
    // Subtle vignette
    this.renderVignette(ctx, width, height);
  }
  
  private renderRoad(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const roadY = height * 0.55;
    const roadHeight = height - roadY;
    
    // Road gradient
    const roadGradient = ctx.createLinearGradient(0, roadY, 0, height);
    roadGradient.addColorStop(0, '#3a3a3a');
    roadGradient.addColorStop(1, '#2a2a2a');
    ctx.fillStyle = roadGradient;
    ctx.fillRect(0, roadY, width, roadHeight);
    
    // Lane markers (animated)
    const laneOffset = (this.time * 0.15) % 50;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 20]);
    ctx.lineDashOffset = -laneOffset;
    
    const laneWidth = width / 3;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(laneWidth * i, roadY);
      ctx.lineTo(laneWidth * i, height);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Construction zone stripes on edges
    ctx.fillStyle = '#FF6B00';
    for (let y = -laneOffset; y < height; y += 40) {
      ctx.fillRect(0, roadY + y, 15, 20);
      ctx.fillRect(width - 15, roadY + y + 20, 15, 20);
    }
    ctx.fillStyle = '#FFFFFF';
    for (let y = -laneOffset + 20; y < height; y += 40) {
      ctx.fillRect(0, roadY + y, 15, 20);
      ctx.fillRect(width - 15, roadY + y + 20, 15, 20);
    }
  }
  
  private renderTitle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    
    const titleY = height * 0.18;
    
    // Title shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HEAT RUNNER', width / 2 + 3, titleY + 3);
    
    // Title with gradient
    const titleGradient = ctx.createLinearGradient(0, titleY - 40, 0, titleY + 10);
    titleGradient.addColorStop(0, '#FFD700');
    titleGradient.addColorStop(0.5, '#FF6B00');
    titleGradient.addColorStop(1, '#CC5500');
    
    ctx.translate(width / 2, titleY);
    ctx.scale(this.titleScale, this.titleScale);
    ctx.translate(-width / 2, -titleY);
    
    ctx.fillStyle = titleGradient;
    ctx.strokeStyle = '#2a1a00';
    ctx.lineWidth = 4;
    ctx.strokeText('HEAT RUNNER', width / 2, titleY);
    ctx.fillText('HEAT RUNNER', width / 2, titleY);
    
    // Subtitle
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText('Construction Site Dash', width / 2, titleY + 35);
    
    ctx.restore();
  }
  
  private renderPlayButton(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const buttonY = height * 0.38;
    const buttonWidth = 180 * this.buttonPulse;
    const buttonHeight = 55 * this.buttonPulse;
    
    ctx.save();
    
    // Button glow
    const glowGradient = ctx.createRadialGradient(
      width / 2, buttonY, 0,
      width / 2, buttonY, buttonWidth
    );
    glowGradient.addColorStop(0, 'rgba(255, 107, 0, 0.4)');
    glowGradient.addColorStop(1, 'rgba(255, 107, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(width / 2 - buttonWidth, buttonY - buttonHeight, buttonWidth * 2, buttonHeight * 2);
    
    // Button background
    const btnGradient = ctx.createLinearGradient(0, buttonY - buttonHeight / 2, 0, buttonY + buttonHeight / 2);
    btnGradient.addColorStop(0, '#FF8C00');
    btnGradient.addColorStop(1, '#FF6B00');
    
    ctx.fillStyle = btnGradient;
    ctx.beginPath();
    ctx.roundRect(width / 2 - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 12);
    ctx.fill();
    
    // Button border
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Button text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.fillText('TAP TO PLAY', width / 2, buttonY + 8);
    
    ctx.restore();
  }
  
  private renderHighScore(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.highScore > 0) {
      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;
      ctx.fillText(`HIGH SCORE: ${this.highScore}`, width / 2, height * 0.48);
      ctx.restore();
    }
  }
  
  private renderControls(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    const controlsY = height * 0.88;
    ctx.fillText('Swipe \u2190 \u2192 to dodge', width / 2, controlsY);
    ctx.fillText('Swipe \u2191 to jump, \u2193 to slide', width / 2, controlsY + 22);
    
    ctx.restore();
  }
  
  private renderBranding(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.save();
    
    // DMI logo area
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DMI GAMES', width / 2, height - 20);
    
    ctx.restore();
  }
  
  private renderVignette(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, height * 0.3,
      width / 2, height / 2, height * 0.9
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  onTap(x: number, y: number): void {
    this.game.changeScene('game');
  }
}
