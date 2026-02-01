/**
 * DMI Games Arcade - Main Entry Point
 * Supports: asmr-cut, heat-runner
 */

// Game selector - change this to switch games ('asmr-cut' | 'heat-runner')
const ACTIVE_GAME = 'asmr-cut' as string;

import { Game as AsmrCutGame } from './games/asmr-cut';
import { Game as HeatRunnerGame } from './games/heat-runner';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const loadingScreen = document.getElementById('loading-screen');

  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Select game based on ACTIVE_GAME constant
  const GameClass = ACTIVE_GAME === 'heat-runner' ? HeatRunnerGame : AsmrCutGame;

  const game = new GameClass(canvas);

  game.init().then(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
    game.start();
  }).catch((err) => {
    console.error('Failed to initialize game:', err);
  });

  window.addEventListener('resize', () => {
    game.resize();
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
});
