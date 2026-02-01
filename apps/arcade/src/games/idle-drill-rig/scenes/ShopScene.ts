/**
 * Shop Scene - Buy drills and managers
 */

import { Scene } from './Scene';
import type { Game } from '../Game';
import { DRILL_BITS } from '../data/drills';
import { MANAGERS } from '../data/managers';
import { formatNumber, drawText, renderButton, isPointInButton, Button } from '../ui/helpers';

interface ShopItem {
  type: 'drill' | 'manager';
  id: string;
  button: Button;
}

export class ShopScene extends Scene {
  private backButton: Button;
  private items: ShopItem[] = [];
  private scrollOffset: number = 0;

  constructor(game: Game) {
    super(game);

    const canvas = game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);

    this.backButton = {
      x: 20,
      y: 20,
      width: 100,
      height: 40,
      text: 'Back',
      enabled: true,
      color: '#2196F3',
    };

    this.buildShopItems();
  }

  private buildShopItems(): void {
    const canvas = this.game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    let yOffset = 100;

    // Drills
    for (const drill of DRILL_BITS) {
      this.items.push({
        type: 'drill',
        id: drill.id,
        button: {
          x: 20,
          y: yOffset,
          width: w - 40,
          height: 80,
          text: '',
          enabled: true,
          color: '#4CAF50',
        },
      });
      yOffset += 90;
    }

    // Managers
    for (const manager of MANAGERS) {
      this.items.push({
        type: 'manager',
        id: manager.id,
        button: {
          x: 20,
          y: yOffset,
          width: w - 40,
          height: 80,
          text: '',
          enabled: true,
          color: '#FF9800',
        },
      });
      yOffset += 90;
    }
  }

  enter(): void {
    console.log('[Idle Drill Rig] Entered shop scene');
  }

  exit(): void {
    // Nothing to clean up
  }

  update(deltaTime: number): void {
    // Update item availability
    const progression = this.game.getProgression();
    const cores = progression.getCores();
    const maxDepth = progression.getMaxDepth();
    const ownedDrills = progression.getOwnedDrills();
    const ownedManagers = progression.getOwnedManagers();

    for (const item of this.items) {
      if (item.type === 'drill') {
        const drill = DRILL_BITS.find(d => d.id === item.id);
        if (!drill) continue;

        const owned = ownedDrills.includes(drill.id);
        const unlocked = maxDepth >= drill.unlockDepth;
        const canAfford = cores >= drill.cost;

        item.button.enabled = !owned && unlocked && canAfford;
      } else if (item.type === 'manager') {
        const manager = MANAGERS.find(m => m.id === item.id);
        if (!manager) continue;

        const owned = ownedManagers.includes(manager.id);
        const unlocked = maxDepth >= manager.unlockDepth;
        const canAfford = cores >= manager.cost;

        item.button.enabled = !owned && unlocked && canAfford;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const canvas = this.game.getCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const progression = this.game.getProgression();
    const cores = progression.getCores();
    const maxDepth = progression.getMaxDepth();
    const ownedDrills = progression.getOwnedDrills();
    const ownedManagers = progression.getOwnedManagers();

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    // Title
    drawText(ctx, 'SHOP', w / 2, 30, {
      font: 'bold 32px sans-serif',
      color: '#fff',
      align: 'center',
      shadow: true,
    });

    // Cores
    drawText(ctx, `Cores: ${formatNumber(cores)}`, w / 2, 70, {
      font: 'bold 20px sans-serif',
      color: '#FFD700',
      align: 'center',
    });

    // Items
    ctx.save();
    ctx.translate(0, -this.scrollOffset);

    for (const item of this.items) {
      this.renderShopItem(ctx, item, ownedDrills, ownedManagers, maxDepth, cores);
    }

    ctx.restore();

    // Back button
    renderButton(ctx, this.backButton);
  }

  private renderShopItem(
    ctx: CanvasRenderingContext2D,
    item: ShopItem,
    ownedDrills: string[],
    ownedManagers: string[],
    maxDepth: number,
    cores: number
  ): void {
    const btn = item.button;

    if (item.type === 'drill') {
      const drill = DRILL_BITS.find(d => d.id === item.id);
      if (!drill) return;

      const owned = ownedDrills.includes(drill.id);
      const unlocked = maxDepth >= drill.unlockDepth;

      // Background
      ctx.fillStyle = owned ? '#555' : (item.button.enabled ? drill.color : '#333');
      ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

      // Border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

      // Name
      drawText(ctx, drill.name, btn.x + 10, btn.y + 10, {
        font: 'bold 18px sans-serif',
        color: '#fff',
      });

      // Description
      drawText(ctx, drill.description, btn.x + 10, btn.y + 35, {
        font: '14px sans-serif',
        color: '#ccc',
      });

      // Cost/Status
      if (owned) {
        drawText(ctx, 'OWNED', btn.x + btn.width - 10, btn.y + 40, {
          font: 'bold 16px sans-serif',
          color: '#4CAF50',
          align: 'right',
          baseline: 'middle',
        });
      } else if (!unlocked) {
        drawText(ctx, `Unlock: ${drill.unlockDepth}m`, btn.x + btn.width - 10, btn.y + 40, {
          font: 'bold 14px sans-serif',
          color: '#FF5722',
          align: 'right',
          baseline: 'middle',
        });
      } else {
        const canAfford = cores >= drill.cost;
        drawText(ctx, `${formatNumber(drill.cost)} cores`, btn.x + btn.width - 10, btn.y + 40, {
          font: 'bold 16px sans-serif',
          color: canAfford ? '#FFD700' : '#666',
          align: 'right',
          baseline: 'middle',
        });
      }
    } else if (item.type === 'manager') {
      const manager = MANAGERS.find(m => m.id === item.id);
      if (!manager) return;

      const owned = ownedManagers.includes(manager.id);
      const unlocked = maxDepth >= manager.unlockDepth;

      // Background
      ctx.fillStyle = owned ? '#555' : (item.button.enabled ? '#FF9800' : '#333');
      ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

      // Border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

      // Name
      drawText(ctx, manager.name, btn.x + 10, btn.y + 10, {
        font: 'bold 18px sans-serif',
        color: '#fff',
      });

      // Description
      drawText(ctx, manager.description, btn.x + 10, btn.y + 35, {
        font: '14px sans-serif',
        color: '#ccc',
      });

      // Cost/Status
      if (owned) {
        drawText(ctx, 'OWNED', btn.x + btn.width - 10, btn.y + 40, {
          font: 'bold 16px sans-serif',
          color: '#4CAF50',
          align: 'right',
          baseline: 'middle',
        });
      } else if (!unlocked) {
        drawText(ctx, `Unlock: ${manager.unlockDepth}m`, btn.x + btn.width - 10, btn.y + 40, {
          font: 'bold 14px sans-serif',
          color: '#FF5722',
          align: 'right',
          baseline: 'middle',
        });
      } else {
        const canAfford = cores >= manager.cost;
        drawText(ctx, `${formatNumber(manager.cost)} cores`, btn.x + btn.width - 10, btn.y + 40, {
          font: 'bold 16px sans-serif',
          color: canAfford ? '#FFD700' : '#666',
          align: 'right',
          baseline: 'middle',
        });
      }
    }
  }

  onTap(x: number, y: number): void {
    // Back button
    if (isPointInButton(x, y, this.backButton)) {
      this.game.changeScene('game');
      return;
    }

    // Shop items
    const progression = this.game.getProgression();
    const adjustedY = y + this.scrollOffset;

    for (const item of this.items) {
      const btn = { ...item.button, y: item.button.y };
      if (isPointInButton(x, adjustedY, btn) && btn.enabled) {
        if (item.type === 'drill') {
          const drill = DRILL_BITS.find(d => d.id === item.id);
          if (drill && progression.buyDrill(drill.id)) {
            console.log(`Purchased drill: ${drill.name}`);
          }
        } else if (item.type === 'manager') {
          const manager = MANAGERS.find(m => m.id === item.id);
          if (manager && progression.buyManager(manager.id)) {
            console.log(`Purchased manager: ${manager.name}`);
          }
        }
        return;
      }
    }
  }
}
