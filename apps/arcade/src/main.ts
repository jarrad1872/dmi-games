/**
 * ASMR CUT - Main Entry Point
 * DMI Games Arcade
 */

import { Game } from './games/asmr-cut';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const loadingScreen = document.getElementById('loading-screen');

  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Create and start game
  const game = new Game(canvas);

  // Initialize the game
  game.init().then(() => {
    // Hide loading screen with fade
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }

    // Start game loop
    game.start();
  }).catch((err) => {
    console.error('Failed to initialize game:', err);
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    game.resize();
  });

  // Prevent context menu on long press
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
});
