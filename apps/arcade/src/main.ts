/**
 * DMI Games Arcade - Main Entry Point
 * Supports: asmr-cut, heat-runner, precision-demo, zen-job-sim
 */

// Game selector - change this to switch games
const ACTIVE_GAME = 'zen-job-sim'; // 'asmr-cut' | 'heat-runner' | 'precision-demo' | 'zen-job-sim'

import { Game as AsmrCutGame } from './games/asmr-cut';
import { Game as HeatRunnerGame } from './games/heat-runner';
import { Game as PrecisionDemoGame } from './games/precision-demo';
import { Game as ZenJobSimGame } from './games/zen-job-sim';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const loadingScreen = document.getElementById('loading-screen');

  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Select game based on ACTIVE_GAME constant
  let GameClass;
  if (ACTIVE_GAME === 'zen-job-sim') {
    GameClass = ZenJobSimGame;
  } else if (ACTIVE_GAME === 'precision-demo') {
    GameClass = PrecisionDemoGame;
  } else if (ACTIVE_GAME === 'heat-runner') {
    GameClass = HeatRunnerGame;
  } else {
    GameClass = AsmrCutGame;
  }

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
