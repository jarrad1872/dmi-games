/**
 * UI Helpers
 * Utility functions for rendering UI elements
 */

export interface Button {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  enabled: boolean;
  color?: string;
  textColor?: string;
}

export function renderButton(ctx: CanvasRenderingContext2D, button: Button): void {
  ctx.save();

  // Background
  ctx.fillStyle = button.enabled ? (button.color || '#4CAF50') : '#666';
  ctx.fillRect(button.x, button.y, button.width, button.height);

  // Border
  ctx.strokeStyle = button.enabled ? '#fff' : '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(button.x, button.y, button.width, button.height);

  // Text
  ctx.fillStyle = button.textColor || '#fff';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);

  ctx.restore();
}

export function isPointInButton(x: number, y: number, button: Button): boolean {
  return x >= button.x && x <= button.x + button.width &&
         y >= button.y && y <= button.y + button.height;
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    font?: string;
    color?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    shadow?: boolean;
  } = {}
): void {
  ctx.save();

  ctx.font = options.font || '16px sans-serif';
  ctx.fillStyle = options.color || '#fff';
  ctx.textAlign = options.align || 'left';
  ctx.textBaseline = options.baseline || 'top';

  if (options.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }

  ctx.fillText(text, x, y);

  ctx.restore();
}
