/**
 * HUD - Polished Heads Up Display
 * Minimal, clean design with smooth animations
 */

export class HUD {
  private score: number = 0;
  private distance: number = 0;
  private coins: number = 0;
  private highScore: number = 0;
  
  // Animation
  private displayScore: number = 0;
  private scorePopups: { value: number; x: number; y: number; life: number }[] = [];
  
  constructor() {
    this.loadHighScore();
  }
  
  update(distance: number, score: number, coins: number): void {
    this.distance = Math.floor(distance);
    this.score = score;
    this.coins = coins;
    
    // Smooth score counter
    this.displayScore += (this.score - this.displayScore) * 0.1;
    
    // Update popups
    this.scorePopups = this.scorePopups.filter(p => {
      p.life -= 16;
      p.y -= 1;
      return p.life > 0;
    });
  }
  
  addScorePopup(value: number, x: number, y: number): void {
    this.scorePopups.push({ value, x, y, life: 1000 });
  }
  
  render(ctx: CanvasRenderingContext2D, canvasWidth: number): void {
    ctx.save();
    
    // Top bar with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 55);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, 55);
    
    // Distance (top left) - main focus
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.fillText(`${this.distance}m`, 20, 38);
    
    // Score (top right)
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`${Math.floor(this.displayScore)}`, canvasWidth - 20, 38);
    
    // Score label
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('SCORE', canvasWidth - 20, 18);
    
    // Coins (center top, if any)
    if (this.coins > 0) {
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`\u2B50 ${this.coins}`, canvasWidth / 2, 35);
    }
    
    // Score popups
    for (const popup of this.scorePopups) {
      const alpha = popup.life / 1000;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`+${popup.value}`, popup.x, popup.y);
    }
    ctx.globalAlpha = 1;
    
    ctx.restore();
  }
  
  renderGameOver(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, animTimer: number = 0): void {
    ctx.save();
    
    // Animated dark overlay
    const overlayAlpha = Math.min(0.85, animTimer / 300);
    ctx.fillStyle = `rgba(0, 0, 0, ${overlayAlpha})`;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Only show content after fade-in
    if (animTimer < 200) {
      ctx.restore();
      return;
    }
    
    const contentAlpha = Math.min(1, (animTimer - 200) / 300);
    ctx.globalAlpha = contentAlpha;
    
    // Game Over title with glow
    const titleY = canvasHeight * 0.25;
    
    // Glow
    ctx.shadowColor = '#FF6B00';
    ctx.shadowBlur = 20;
    
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvasWidth / 2, titleY);
    
    ctx.shadowBlur = 0;
    
    // Stats container
    const statsY = canvasHeight * 0.4;
    const statsHeight = 140;
    
    ctx.fillStyle = 'rgba(255, 107, 0, 0.2)';
    ctx.beginPath();
    ctx.roundRect(canvasWidth / 2 - 120, statsY - 30, 240, statsHeight, 15);
    ctx.fill();
    
    // Score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.fillText('SCORE', canvasWidth / 2, statsY);
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`${this.score}`, canvasWidth / 2, statsY + 40);
    
    // Distance
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '18px Arial';
    ctx.fillText(`Distance: ${this.distance}m`, canvasWidth / 2, statsY + 80);
    
    // High score handling
    const isNewHighScore = this.score > this.highScore && this.highScore > 0;
    if (isNewHighScore) {
      this.saveHighScore();
      
      // Animated new high score badge
      const pulse = Math.sin(animTimer * 0.01) * 0.1 + 1;
      ctx.save();
      ctx.translate(canvasWidth / 2, statsY + 115);
      ctx.scale(pulse, pulse);
      
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('\u2605 NEW HIGH SCORE! \u2605', 0, 0);
      ctx.restore();
    } else if (this.highScore > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px Arial';
      ctx.fillText(`Best: ${this.highScore}`, canvasWidth / 2, statsY + 110);
    }
    
    // Tap to restart (animated)
    if (animTimer > 500) {
      const restartAlpha = Math.sin(animTimer * 0.005) * 0.3 + 0.7;
      ctx.globalAlpha = restartAlpha * contentAlpha;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '22px Arial';
      ctx.fillText('Tap to play again', canvasWidth / 2, canvasHeight * 0.75);
    }
    
    ctx.restore();
  }
  
  getScore(): number {
    return this.score;
  }
  
  private loadHighScore(): void {
    try {
      const saved = localStorage.getItem('heat_runner_highscore');
      this.highScore = saved ? parseInt(saved, 10) : 0;
    } catch {
      this.highScore = 0;
    }
  }
  
  private saveHighScore(): void {
    try {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('heat_runner_highscore', this.highScore.toString());
      }
    } catch {
      // Ignore storage errors
    }
  }
  
  reset(): void {
    this.score = 0;
    this.displayScore = 0;
    this.distance = 0;
    this.coins = 0;
    this.scorePopups = [];
  }
}
