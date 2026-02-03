class WaveCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WaveCompleteScene' });
    }
    
    init(data) {
        this.finalScore = data.score || 0;
        this.survivalTime = data.time || 0;
        this.enemiesKilled = data.enemiesKilled || 0;
    }
    
    create() {
        const cfg = GAME_CONFIG;
        const centerX = cfg.width / 2;
        
        // Background
        this.cameras.main.setBackgroundColor(cfg.colors.concrete);
        
        // Victory banner
        const banner = this.add.rectangle(centerX, 150, cfg.width, 120, cfg.colors.dmiRed, 0.9);
        
        // Main title
        const title = this.add.text(centerX, 120, 'WAVE COMPLETE!', {
            fontSize: '56px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5).setAlpha(0);
        
        const subtitle = this.add.text(centerX, 170, 'MISSION ACCOMPLISHED', {
            fontSize: '20px',
            color: '#fff',
            letterSpacing: 2
        }).setOrigin(0.5).setAlpha(0);
        
        // Stats container
        const statsY = 260;
        const lineHeight = 45;
        
        // Score
        const scoreLabel = this.add.text(centerX - 100, statsY, 'FINAL SCORE', {
            fontSize: '16px',
            color: '#8B8682'
        }).setOrigin(1, 0.5).setAlpha(0);
        
        const scoreValue = this.add.text(centerX + 100, statsY, this.finalScore.toString(), {
            fontSize: '32px',
            color: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(1, 0.5).setAlpha(0);
        
        // Time survived
        const timeLabel = this.add.text(centerX - 100, statsY + lineHeight, 'TIME SURVIVED', {
            fontSize: '16px',
            color: '#8B8682'
        }).setOrigin(1, 0.5).setAlpha(0);
        
        const timeValue = this.add.text(centerX + 100, statsY + lineHeight, `${Math.floor(this.survivalTime / 1000)}s`, {
            fontSize: '32px',
            color: '#00D9FF',
            fontStyle: 'bold'
        }).setOrigin(1, 0.5).setAlpha(0);
        
        // Enemies killed
        const killsLabel = this.add.text(centerX - 100, statsY + lineHeight * 2, 'ENEMIES ELIMINATED', {
            fontSize: '16px',
            color: '#8B8682'
        }).setOrigin(1, 0.5).setAlpha(0);
        
        const killsValue = this.add.text(centerX + 100, statsY + lineHeight * 2, this.enemiesKilled.toString(), {
            fontSize: '32px',
            color: '#A62022',
            fontStyle: 'bold'
        }).setOrigin(1, 0.5).setAlpha(0);
        
        // Rank/message based on performance
        let rankText = 'GOOD WORK';
        let rankColor = '#fff';
        
        if (this.finalScore >= 2000) {
            rankText = '⭐ OUTSTANDING! ⭐';
            rankColor = '#FFD700';
        } else if (this.survivalTime >= 90000) {
            rankText = '⭐ EXCELLENT! ⭐';
            rankColor = '#00D9FF';
        } else if (this.finalScore >= 1500) {
            rankText = 'IMPRESSIVE';
            rankColor = '#FFD700';
        }
        
        const rankDisplay = this.add.text(centerX, 450, rankText, {
            fontSize: '24px',
            color: rankColor,
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        
        // Continue prompt
        this.continueText = this.add.text(centerX, 520, 'PRESS SPACE TO CONTINUE', {
            fontSize: '20px',
            color: '#FFD700',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);
        
        // Animate elements in sequence
        this.tweens.add({
            targets: [title, subtitle],
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        this.tweens.add({
            targets: [scoreLabel, scoreValue],
            alpha: 1,
            duration: 400,
            delay: 600,
            ease: 'Power2'
        });
        
        this.tweens.add({
            targets: [timeLabel, timeValue],
            alpha: 1,
            duration: 400,
            delay: 900,
            ease: 'Power2'
        });
        
        this.tweens.add({
            targets: [killsLabel, killsValue],
            alpha: 1,
            duration: 400,
            delay: 1200,
            ease: 'Power2'
        });
        
        this.tweens.add({
            targets: rankDisplay,
            alpha: 1,
            scale: { from: 0.8, to: 1 },
            duration: 500,
            delay: 1500,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: this.continueText,
            alpha: 1,
            duration: 400,
            delay: 2000
        });
        
        // Flashing continue text
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: this.continueText,
                alpha: 0.3,
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        });
        
        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MenuScene');
        });
        
        // Mobile tap
        this.input.once('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        // DMI branding footer
        this.add.text(cfg.width - 10, cfg.height - 10, 'dmitools.com', {
            fontSize: '12px',
            color: '#00D9FF',
            fontStyle: 'italic'
        }).setOrigin(1, 1);
    }
}
