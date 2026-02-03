// Main game initialization
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    parent: 'game-container',
    backgroundColor: GAME_CONFIG.colors.concrete,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MenuScene, GameScene, WaveCompleteScene]
};

const game = new Phaser.Game(config);

// Create simple particle texture after game boots
game.events.once('ready', () => {
    const graphics = game.scene.scenes[0].add.graphics();
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle', 8, 8);
    graphics.destroy();
});
