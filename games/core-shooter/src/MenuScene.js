class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        const cfg = GAME_CONFIG;
        const centerX = cfg.width / 2;
        
        // Background
        this.cameras.main.setBackgroundColor(cfg.colors.concrete);
        
        // Decorative construction elements
        this.createBackgroundElements();
        
        // DMI Logo (top-left)
        this.createDMILogo(60, 40);
        
        // Title
        const title = this.add.text(centerX, 180, 'CORE COMMANDO', {
            fontSize: '64px',
            color: '#A62022',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(centerX, 240, 'DIAMOND DRILL WARFARE', {
            fontSize: '18px',
            color: '#00D9FF',
            letterSpacing: 2
        }).setOrigin(0.5);
        
        // "Made in USA" badge
        const usaBadge = this.add.container(centerX, 300);
        const usaBg = this.add.rectangle(0, 0, 180, 40, 0x222222);
        const usaText = this.add.text(0, 0, '🇺🇸 MADE IN USA', {
            fontSize: '16px',
            color: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        usaBadge.add([usaBg, usaText]);
        
        // Instructions
        this.add.text(centerX, 380, 'MISSION: Survive 90 seconds or reach 2000 points', {
            fontSize: '16px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(centerX, 410, 'Enemies get faster. Stay sharp.', {
            fontSize: '14px',
            color: '#8B8682',
            align: 'center'
        }).setOrigin(0.5);
        
        // Controls
        const controlsY = 460;
        this.add.text(centerX, controlsY, 'CONTROLS', {
            fontSize: '14px',
            color: '#FFD700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(centerX, controlsY + 25, 'A/D = Move | SPACE = Jump | X = Shoot | Arrows = Aim', {
            fontSize: '12px',
            color: '#fff'
        }).setOrigin(0.5);
        
        // Start prompt (flashing)
        this.startText = this.add.text(centerX, 530, 'PRESS SPACE TO START', {
            fontSize: '24px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: this.startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // dmitools.com link (bottom-right)
        this.add.text(cfg.width - 10, cfg.height - 10, 'dmitools.com', {
            fontSize: '12px',
            color: '#00D9FF',
            fontStyle: 'italic'
        }).setOrigin(1, 1);
        
        // Version
        this.add.text(10, cfg.height - 10, 'v0.4 | Session 4', {
            fontSize: '10px',
            color: '#666'
        }).setOrigin(0, 1);
        
        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        
        // Mobile - tap to start
        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
    
    createBackgroundElements() {
        // Construction-themed decorative elements
        const cfg = GAME_CONFIG;
        
        // Corner beams
        const beam1 = this.add.rectangle(30, 30, 60, 8, cfg.colors.steelGray, 0.3);
        beam1.setRotation(-0.3);
        
        const beam2 = this.add.rectangle(cfg.width - 30, 30, 60, 8, cfg.colors.steelGray, 0.3);
        beam2.setRotation(0.3);
        
        // Rivets
        for (let i = 0; i < 5; i++) {
            this.add.circle(50 + i * 15, 30, 3, cfg.colors.dmiBlack, 0.4);
            this.add.circle(cfg.width - 50 - i * 15, 30, 3, cfg.colors.dmiBlack, 0.4);
        }
    }
    
    createDMILogo(x, y) {
        const logo = this.add.container(x, y);
        
        // Diamond shape (simplified)
        const diamond = this.add.graphics();
        diamond.fillStyle(GAME_CONFIG.colors.diamondBlue, 1);
        diamond.fillCircle(0, 0, 20);
        
        // DMI text
        const dmiText = this.add.text(30, 0, 'DMI', {
            fontSize: '20px',
            color: '#A62022',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        
        const toolsText = this.add.text(30, 15, 'TOOLS', {
            fontSize: '10px',
            color: '#fff',
            letterSpacing: 1
        }).setOrigin(0, 0.5);
        
        logo.add([diamond, dmiText, toolsText]);
        
        return logo;
    }
}
