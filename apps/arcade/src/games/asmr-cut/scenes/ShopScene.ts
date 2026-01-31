/**
 * Shop Scene
 * Blade upgrades with DMI branding
 */

import { Scene } from './Scene';
import type { Game } from '../Game';
import { BLADES, BladeDefinition, getAvailableBlades } from '../data/blades';
import { track } from '@dmi-games/game-sdk';

interface BladeCard {
  blade: BladeDefinition;
  x: number;
  y: number;
  width: number;
  height: number;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  locked: boolean;
}

export class ShopScene extends Scene {
  private bladeCards: BladeCard[] = [];
  private scrollY: number = 0;
  private maxScrollY: number = 0;
  private coins: number = 0;
  private currentLevel: number = 1;

  constructor(game: Game) {
    super(game);
  }

  enter(): void {
    super.enter();
    this.scrollY = 0;
    this.updateData();
    this.setupCards();

    // Track shop view
    track('shop_opened', { coins: this.coins, level: this.currentLevel });
  }

  private updateData(): void {
    const progression = this.game.getProgression();
    this.coins = progression.getCoins();
    this.currentLevel = progression.getCurrentLevel();
  }

  private setupCards(): void {
    const canvas = this.game.getCanvas();
    const progression = this.game.getProgression();

    const cardWidth = Math.min(canvas.width - 40, 320);
    const cardHeight = 120;
    const startY = 120;
    const spacing = 15;

    this.bladeCards = [];

    for (let i = 0; i < BLADES.length; i++) {
      const blade = BLADES[i];
      const owned = progression.ownsBlade(blade.id);
      const equipped = progression.getEquippedBlade().id === blade.id;
      const locked = blade.unlockLevel > this.currentLevel;

      this.bladeCards.push({
        blade,
        x: canvas.width / 2,
        y: startY + i * (cardHeight + spacing),
        width: cardWidth,
        height: cardHeight,
        owned,
        equipped,
        canAfford: this.coins >= blade.cost,
        locked,
      });
    }

    // Calculate max scroll
    const totalHeight = BLADES.length * (cardHeight + spacing) + startY + 50;
    this.maxScrollY = Math.max(0, totalHeight - canvas.height);
  }

  update(deltaTime: number): void {
    // Could add scroll momentum here
  }

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const { width, height } = canvas;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Header
    this.renderHeader(ctx, width);

    // Scrollable content area
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 100, width, height - 100);
    ctx.clip();

    ctx.translate(0, -this.scrollY);

    // Blade cards
    for (const card of this.bladeCards) {
      this.renderBladeCard(ctx, card);
    }

    ctx.restore();

    // Back button
    this.renderBackButton(ctx);
  }

  private renderHeader(ctx: CanvasRenderingContext2D, width: number): void {
    // Header background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, 100);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 32px 'Roboto Slab', serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BLADE SHOP', width / 2, 40);

    // Coins
    ctx.font = "20px 'Roboto', sans-serif";
    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'right';
    ctx.fillText(`${this.coins} coins`, width - 20, 40);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 70);
    ctx.lineTo(width - 20, 70);
    ctx.stroke();

    // Level indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = "14px 'Roboto', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${this.currentLevel}`, width / 2, 85);
  }

  private renderBladeCard(ctx: CanvasRenderingContext2D, card: BladeCard): void {
    const { blade, x, y, width, height, owned, equipped, canAfford, locked } = card;

    ctx.save();
    ctx.translate(x, y);

    // Card background
    let bgColor = 'rgba(255, 255, 255, 0.1)';
    if (equipped) {
      bgColor = 'rgba(76, 175, 80, 0.2)';
    } else if (locked) {
      bgColor = 'rgba(0, 0, 0, 0.3)';
    } else if (blade.dmiProduct) {
      bgColor = 'rgba(166, 28, 0, 0.15)';
    }

    ctx.fillStyle = bgColor;
    this.roundRect(ctx, -width / 2, 0, width, height, 10);
    ctx.fill();

    // Card border
    if (blade.dmiProduct && !locked) {
      ctx.strokeStyle = '#a61c00';
      ctx.lineWidth = 2;
      this.roundRect(ctx, -width / 2, 0, width, height, 10);
      ctx.stroke();
    }

    // DMI badge
    if (blade.dmiProduct && !locked) {
      ctx.fillStyle = '#a61c00';
      ctx.font = "bold 10px 'Roboto', sans-serif";
      ctx.textAlign = 'left';
      ctx.fillText('DMI OFFICIAL', -width / 2 + 15, 20);
    }

    // Blade icon
    const iconX = -width / 2 + 50;
    const iconY = height / 2;

    ctx.fillStyle = locked ? '#444444' : blade.color;
    ctx.beginPath();
    ctx.moveTo(iconX - 20, iconY);
    ctx.lineTo(iconX + 20, iconY - 8);
    ctx.lineTo(iconX + 25, iconY);
    ctx.lineTo(iconX + 20, iconY + 8);
    ctx.closePath();
    ctx.fill();

    if (!locked && blade.glowColor) {
      ctx.shadowColor = blade.glowColor;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Blade info
    const textX = -width / 2 + 100;

    ctx.textAlign = 'left';
    ctx.fillStyle = locked ? '#666666' : '#ffffff';
    ctx.font = "bold 18px 'Roboto', sans-serif";
    ctx.fillText(blade.name, textX, height / 2 - 20);

    ctx.fillStyle = locked ? '#555555' : 'rgba(255, 255, 255, 0.7)';
    ctx.font = "13px 'Roboto', sans-serif";

    // Truncate description if needed
    const maxDescWidth = width - 200;
    let desc = blade.description;
    while (ctx.measureText(desc).width > maxDescWidth && desc.length > 0) {
      desc = desc.slice(0, -1);
    }
    if (desc !== blade.description) desc += '...';

    ctx.fillText(desc, textX, height / 2 + 5);

    // Stats
    if (!locked) {
      const stats = [];
      if (blade.speedBonus > 1) stats.push(`Speed +${Math.round((blade.speedBonus - 1) * 100)}%`);
      if (blade.coinBonus > 1) stats.push(`Coins +${Math.round((blade.coinBonus - 1) * 100)}%`);

      ctx.fillStyle = '#4ade80';
      ctx.font = "12px 'Roboto', sans-serif";
      ctx.fillText(stats.join(' • '), textX, height / 2 + 25);
    }

    // Right side: price/status
    const rightX = width / 2 - 20;
    ctx.textAlign = 'right';

    if (locked) {
      ctx.fillStyle = '#666666';
      ctx.font = "14px 'Roboto', sans-serif";
      ctx.fillText(`Unlock at Level ${blade.unlockLevel}`, rightX, height / 2);
    } else if (equipped) {
      ctx.fillStyle = '#4ade80';
      ctx.font = "bold 16px 'Roboto', sans-serif";
      ctx.fillText('EQUIPPED', rightX, height / 2);
    } else if (owned) {
      ctx.fillStyle = '#888888';
      ctx.font = "14px 'Roboto', sans-serif";
      ctx.fillText('TAP TO EQUIP', rightX, height / 2);
    } else {
      // Price
      ctx.fillStyle = canAfford ? '#ffd700' : '#ff6666';
      ctx.font = "bold 18px 'Roboto', sans-serif";
      ctx.fillText(`${blade.cost}`, rightX, height / 2 - 5);

      ctx.fillStyle = canAfford ? '#ffffff' : '#888888';
      ctx.font = "12px 'Roboto', sans-serif";
      ctx.fillText('coins', rightX, height / 2 + 12);
    }

    ctx.restore();
  }

  private renderBackButton(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();

    ctx.save();

    // Back button in top left
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(30, 40, 20, 0, Math.PI * 2);
    ctx.fill();

    // Arrow
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(35, 35);
    ctx.lineTo(25, 40);
    ctx.lineTo(35, 45);
    ctx.stroke();

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

  onTap(x: number, y: number): void {
    const canvas = this.game.getCanvas();

    // Back button check
    if (Math.hypot(x - 30, y - 40) < 25) {
      this.game.changeScene('menu');
      return;
    }

    // Card tap check
    const adjustedY = y + this.scrollY;

    for (const card of this.bladeCards) {
      const left = card.x - card.width / 2;
      const right = card.x + card.width / 2;
      const top = card.y;
      const bottom = card.y + card.height;

      if (x >= left && x <= right && adjustedY >= top && adjustedY <= bottom) {
        this.handleCardTap(card);
        break;
      }
    }
  }

  private handleCardTap(card: BladeCard): void {
    if (card.locked || card.equipped) return;

    const progression = this.game.getProgression();

    if (card.owned) {
      // Equip the blade
      progression.equipBlade(card.blade.id);
      track('blade_equipped', { blade_id: card.blade.id, blade_name: card.blade.name });
      this.setupCards();
    } else if (card.canAfford) {
      // Purchase the blade
      if (progression.purchaseBlade(card.blade.id)) {
        progression.equipBlade(card.blade.id);
        track('blade_purchased', {
          blade_id: card.blade.id,
          blade_name: card.blade.name,
          cost: card.blade.cost,
          dmi_product: card.blade.dmiProduct,
        });
        this.updateData();
        this.setupCards();
      }
    }
  }
}
