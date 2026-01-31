/**
 * HUD - Heads Up Display
 * Shows score, distance, coins
 */

export class HUD {
  private score: number = 0;
  private distance: number = 0;
  private coins: number = 0;
  private highScore: number = 0;
  
  constructor() {
    this.loadHighScore();
  }
  
  update(distance: number, score: number, coins: number): void {
    this.distance = Math.floor(distance);
    this.score = score;
    this.coins = coins;
  }
  
  render(ctx: CanvasRenderingContext2D, canvasWidth: number): void {
    ctx.save();
    
    // Semi-transparent background strips
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasWidth, 50);
    
    // Score (top right)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${this.score}`, canvasWidth - 20, 35);
    
    // Distance (top left)
    ctx.textAlign = 'left';
    ctx.fillText(`${this.distance}m`, 20, 35);
    
    // Coins (center)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`\u2B50 ${this.coins}`, canvasWidth / 2, 35);
    
    ctx.restore();
  }
  
  renderGameOver(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    ctx.save();
    
    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Game Over text
    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', canvasWidth / 2, canvasHeight / 2 - 100);
    
    // Final score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`Score: ${this.score}`, canvasWidth / 2, canvasHeight / 2 - 40);
    ctx.fillText(`Distance: ${this.distance}m`, canvasWidth / 2, canvasHeight / 2);
    ctx.fillText(`Coins: ${this.coins}`, canvasWidth / 2, canvasHeight / 2 + 40);
    
    // High score
    if (this.score > this.highScore) {
      ctx.fillStyle = '#FFD700';
      ctx.fillText('NEW HIGH SCORE!', canvasWidth / 2, canvasHeight / 2 + 90);
      this.saveHighScore();
    } else {
      ctx.fillStyle = '#888888';
      ctx.fillText(`Best: ${this.highScore}`, canvasWidth / 2, canvasHeight / 2 + 90);
    }
    
    // Tap to restart
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText('Tap to play again', canvasWidth / 2, canvasHeight / 2 + 150);
    
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
    this.distance = 0;
    this.coins = 0;
  }
}
