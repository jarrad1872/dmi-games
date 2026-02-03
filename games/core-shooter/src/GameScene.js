class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        const cfg = GAME_CONFIG;
        
        // Background
        this.cameras.main.setBackgroundColor(cfg.colors.concrete);
        
        // Create platforms
        this.createPlatforms();
        
        // Create player
        this.createPlayer();
        
        // Input setup
        this.setupKeyboardInput();
        this.setupMobileControls();
        
        // Movement state
        this.jumpHoldStartTime = 0;
        this.isJumpHeld = false;
        this.lastGroundedTime = 0;
        this.wasGrounded = false;
        
        // Shooting state
        this.lastFireTime = 0;
        this.aimDirection = { x: 1, y: 0 }; // Default aim right
        this.bullets = this.physics.add.group();
        this.muzzleFlash = null;
        
        // Game state
        this.score = 0;
        this.lives = GAME_CONFIG.game.startLives;
        this.isInvulnerable = false;
        this.gameOver = false;
        
        // Wave system
        this.waveStartTime = this.time.now;
        this.waveDuration = GAME_CONFIG.wave.duration; // 90 seconds
        this.waveGoalScore = GAME_CONFIG.wave.goalScore; // 2000 points
        this.enemiesKilled = 0;
        
        // Enemy system
        this.enemies = this.physics.add.group();
        this.nextSpawnTime = this.time.now + this.getCurrentSpawnRate();
        
        // Collisions
        this.setupCollisions();
        
        // UI
        this.createUI();
        this.createHUD();
        
        // Particles for landing effect
        this.createParticles();
    }
    
    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        
        const cfg = GAME_CONFIG;
        
        // Ground platform (main floor)
        const ground = this.add.rectangle(400, 560, 800, 80, cfg.colors.steelGray);
        this.physics.add.existing(ground, true);
        this.platforms.add(ground);
        
        // Strategic platform layout for tactical combat
        
        // Left side - low platform (easy escape)
        const platLeft1 = this.add.rectangle(120, 480, 180, 20, cfg.colors.steelGray);
        this.physics.add.existing(platLeft1, true);
        this.platforms.add(platLeft1);
        
        // Left side - mid platform
        const platLeft2 = this.add.rectangle(180, 360, 220, 20, cfg.colors.steelGray);
        this.physics.add.existing(platLeft2, true);
        this.platforms.add(platLeft2);
        
        // Left side - high platform (sniper position)
        const platLeft3 = this.add.rectangle(140, 240, 160, 20, cfg.colors.steelGray);
        this.physics.add.existing(platLeft3, true);
        this.platforms.add(platLeft3);
        
        // Center - floating platform (risky high ground)
        const platCenter = this.add.rectangle(400, 320, 180, 20, cfg.colors.steelGray);
        this.physics.add.existing(platCenter, true);
        this.platforms.add(platCenter);
        
        // Right side - mid platform (enemy spawn side)
        const platRight1 = this.add.rectangle(620, 400, 200, 20, cfg.colors.steelGray);
        this.physics.add.existing(platRight1, true);
        this.platforms.add(platRight1);
        
        // Right side - high platform
        const platRight2 = this.add.rectangle(660, 280, 160, 20, cfg.colors.steelGray);
        this.physics.add.existing(platRight2, true);
        this.platforms.add(platRight2);
        
        // Top corner platforms (escape routes)
        const platTopLeft = this.add.rectangle(60, 160, 100, 20, cfg.colors.steelGray);
        this.physics.add.existing(platTopLeft, true);
        this.platforms.add(platTopLeft);
        
        const platTopRight = this.add.rectangle(740, 180, 100, 20, cfg.colors.steelGray);
        this.physics.add.existing(platTopRight, true);
        this.platforms.add(platTopRight);
    }
    
    createPlayer() {
        const cfg = GAME_CONFIG.player;
        
        // Create player sprite (placeholder - construction worker colors)
        this.player = this.add.container(100, 400);
        
        // Body (safety vest - yellow/orange)
        const body = this.add.rectangle(0, 8, 24, 32, 0xFFD700);
        
        // Hard hat (DMI red)
        const hardhat = this.add.rectangle(0, -16, 28, 16, GAME_CONFIG.colors.dmiRed);
        
        // DMI logo on hat (simplified)
        const logo = this.add.circle(0, -16, 4, GAME_CONFIG.colors.diamondBlue);
        
        // Legs
        const leg1 = this.add.rectangle(-6, 28, 8, 12, 0x4A4A4A);
        const leg2 = this.add.rectangle(6, 28, 8, 12, 0x4A4A4A);
        
        this.player.add([body, hardhat, logo, leg1, leg2]);
        
        // Physics
        this.physics.add.existing(this.player);
        this.player.body.setSize(cfg.width * cfg.hitboxScale, cfg.height * cfg.hitboxScale);
        this.player.body.setGravityY(cfg.gravity);
        this.player.body.setMaxVelocity(cfg.speed, cfg.maxFallSpeed);
        this.player.body.setDragX(cfg.deceleration);
        
        // Collision
        this.physics.add.collider(this.player, this.platforms);
        
        // Store parts for animation
        this.playerParts = { body, hardhat, logo, leg1, leg2 };
    }
    
    setupKeyboardInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            jumpAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
            fireAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
        };
    }
    
    setupMobileControls() {
        const cfg = GAME_CONFIG.mobile;
        const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (!isMobile && window.innerWidth > 768) {
            return; // Skip mobile controls on desktop
        }
        
        // D-Pad (left side)
        const dpadX = cfg.dpadPadding + cfg.dpadSize / 2;
        const dpadY = this.cameras.main.height - cfg.dpadPadding - cfg.dpadSize / 2;
        
        // D-pad background
        this.dpadBg = this.add.circle(dpadX, dpadY, cfg.dpadSize / 2, 0x000000, cfg.opacity);
        this.dpadBg.setScrollFactor(0);
        this.dpadBg.setDepth(100);
        
        // Left button
        this.btnLeft = this.add.circle(dpadX - 35, dpadY, 25, GAME_CONFIG.colors.steelGray, cfg.opacity);
        this.btnLeft.setScrollFactor(0);
        this.btnLeft.setDepth(101);
        this.btnLeft.setInteractive();
        this.add.text(dpadX - 35, dpadY, '◀', { fontSize: '20px', color: '#fff' })
            .setOrigin(0.5).setScrollFactor(0).setDepth(102);
        
        // Right button
        this.btnRight = this.add.circle(dpadX + 35, dpadY, 25, GAME_CONFIG.colors.steelGray, cfg.opacity);
        this.btnRight.setScrollFactor(0);
        this.btnRight.setDepth(101);
        this.btnRight.setInteractive();
        this.add.text(dpadX + 35, dpadY, '▶', { fontSize: '20px', color: '#fff' })
            .setOrigin(0.5).setScrollFactor(0).setDepth(102);
        
        // Jump button (right side, upper)
        const jumpX = this.cameras.main.width - cfg.buttonPadding - cfg.buttonSize / 2;
        const jumpY = this.cameras.main.height - cfg.buttonPadding - cfg.buttonSize / 2 - cfg.buttonSize - 15;
        
        this.btnJump = this.add.circle(jumpX, jumpY, cfg.buttonSize / 2, GAME_CONFIG.colors.dmiRed, cfg.opacity);
        this.btnJump.setScrollFactor(0);
        this.btnJump.setDepth(101);
        this.btnJump.setInteractive();
        this.add.text(jumpX, jumpY, 'A', { fontSize: '24px', color: '#fff', fontStyle: 'bold' })
            .setOrigin(0.5).setScrollFactor(0).setDepth(102);
        
        // Fire button (right side, lower)
        const fireX = this.cameras.main.width - cfg.buttonPadding - cfg.buttonSize / 2;
        const fireY = this.cameras.main.height - cfg.buttonPadding - cfg.buttonSize / 2;
        
        this.btnFire = this.add.circle(fireX, fireY, cfg.buttonSize / 2, GAME_CONFIG.colors.diamondBlue, cfg.opacity);
        this.btnFire.setScrollFactor(0);
        this.btnFire.setDepth(101);
        this.btnFire.setInteractive();
        this.add.text(fireX, fireY, 'B', { fontSize: '24px', color: '#fff', fontStyle: 'bold' })
            .setOrigin(0.5).setScrollFactor(0).setDepth(102);
        
        // Touch state
        this.touchState = {
            left: false,
            right: false,
            jump: false,
            fire: false
        };
        
        // Touch handlers
        this.btnLeft.on('pointerdown', () => { this.touchState.left = true; });
        this.btnLeft.on('pointerup', () => { this.touchState.left = false; });
        this.btnLeft.on('pointerout', () => { this.touchState.left = false; });
        
        this.btnRight.on('pointerdown', () => { this.touchState.right = true; });
        this.btnRight.on('pointerup', () => { this.touchState.right = false; });
        this.btnRight.on('pointerout', () => { this.touchState.right = false; });
        
        this.btnJump.on('pointerdown', () => { 
            this.touchState.jump = true;
            this.onJumpPressed();
        });
        this.btnJump.on('pointerup', () => { 
            this.touchState.jump = false;
            this.onJumpReleased();
        });
        this.btnJump.on('pointerout', () => { 
            this.touchState.jump = false;
            this.onJumpReleased();
        });
        
        this.btnFire.on('pointerdown', () => { 
            this.touchState.fire = true;
        });
        this.btnFire.on('pointerup', () => { 
            this.touchState.fire = false;
        });
        this.btnFire.on('pointerout', () => { 
            this.touchState.fire = false;
        });
    }
    
    setupCollisions() {
        // Bullet hits enemy
        this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitEnemy, null, this);
        
        // Enemy hits player
        this.physics.add.overlap(this.player, this.enemies, this.enemyHitPlayer, null, this);
    }
    
    bulletHitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;
        
        bullet.destroy();
        enemy.takeDamage(1);
    }
    
    enemyHitPlayer(player, enemy) {
        if (!enemy.active || this.isInvulnerable || this.gameOver) return;
        
        this.takeDamage();
        
        // Knockback
        const knockbackDir = Math.sign(player.x - enemy.x);
        player.body.setVelocity(knockbackDir * 300, -200);
    }
    
    takeDamage() {
        this.lives--;
        this.isInvulnerable = true;
        
        // Flash red
        this.tweens.add({
            targets: this.playerParts.body,
            tint: 0xFF0000,
            duration: 100,
            yoyo: true,
            repeat: 5
        });
        
        // Screen shake
        this.cameras.main.shake(200, 0.01);
        
        this.updateHUD();
        
        if (this.lives <= 0) {
            this.playerDeath();
        } else {
            // Temporary invulnerability
            this.time.delayedCall(GAME_CONFIG.game.playerInvulnerabilityTime, () => {
                this.isInvulnerable = false;
            });
        }
    }
    
    playerDeath() {
        this.gameOver = true;
        
        // Death animation - fall and fade
        this.player.body.setVelocity(0, -100);
        this.tweens.add({
            targets: this.player,
            angle: 90,
            alpha: 0,
            duration: 1000,
            ease: 'Quad.easeIn'
        });
        
        // Game over screen
        this.time.delayedCall(1500, () => {
            const gameOverText = this.add.text(400, 250, 'GAME OVER', {
                fontSize: '48px',
                color: '#A62022',
                fontStyle: 'bold',
                stroke: '#000',
                strokeThickness: 6
            }).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setAlpha(0);
            
            const scoreText = this.add.text(400, 320, `FINAL SCORE: ${this.score}`, {
                fontSize: '24px',
                color: '#fff',
                stroke: '#000',
                strokeThickness: 4
            }).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setAlpha(0);
            
            const restartText = this.add.text(400, 370, 'Press SPACE to restart', {
                fontSize: '16px',
                color: '#FFD700',
            }).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setAlpha(0);
            
            this.tweens.add({
                targets: [gameOverText, scoreText, restartText],
                alpha: 1,
                duration: 500
            });
            
            // Restart on space
            this.input.keyboard.once('keydown-SPACE', () => {
                this.scene.restart();
            });
        });
    }
    
    createUI() {
        const cfg = GAME_CONFIG;
        
        // Debug text (top-left corner)
        const text = this.add.text(10, 10, '', {
            fontSize: '12px',
            color: '#fff',
            backgroundColor: '#000',
            padding: { x: 6, y: 3 }
        });
        text.setScrollFactor(0);
        text.setDepth(1000);
        this.debugText = text;
        
        // Title banner (top center)
        const titleBg = this.add.rectangle(400, 30, 500, 50, cfg.colors.dmiRed, 0.9);
        titleBg.setScrollFactor(0).setDepth(999);
        
        this.add.text(400, 30, 'CORE COMMANDO', {
            fontSize: '28px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        // Wave timer (top center, below title)
        this.waveTimerText = this.add.text(400, 60, 'TIME: 90s', {
            fontSize: '16px',
            color: '#00D9FF',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        // Wave goal reminder (top center, below timer)
        this.add.text(400, 80, 'Goal: 90s OR 2000 pts', {
            fontSize: '11px',
            color: '#FFD700',
            backgroundColor: '#00000088',
            padding: { x: 6, y: 2 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000);
        
        // DMI logo (corner of HUD, top-right near score)
        this.createMiniLogo(720, 110);
    }
    
    createMiniLogo(x, y) {
        const logo = this.add.container(x, y);
        logo.setScrollFactor(0);
        logo.setDepth(1001);
        
        // Small diamond
        const diamond = this.add.circle(0, 0, 8, GAME_CONFIG.colors.diamondBlue);
        const text = this.add.text(12, 0, 'DMI', {
            fontSize: '10px',
            color: '#A62022',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        
        logo.add([diamond, text]);
        
        return logo;
    }
    
    createHUD() {
        // Health display (hearts) - top left
        this.heartsUI = [];
        for (let i = 0; i < GAME_CONFIG.game.startLives; i++) {
            const heart = this.add.text(20 + (i * 35), 90, '❤️', {
                fontSize: '24px'
            }).setScrollFactor(0).setDepth(1001);
            this.heartsUI.push(heart);
        }
        
        // Score display - top right
        this.scoreText = this.add.text(780, 90, '0', {
            fontSize: '28px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(1001);
    }
    
    updateHUD() {
        // Update hearts
        for (let i = 0; i < this.heartsUI.length; i++) {
            this.heartsUI[i].setAlpha(i < this.lives ? 1 : 0.2);
        }
        
        // Update score
        this.scoreText.setText(this.score.toString());
    }
    
    addScore(points) {
        this.score += points;
        this.updateHUD();
    }
    
    createParticles() {
        // Dust particles for landing
        this.dustParticles = this.add.particles(0, 0, 'particle', {
            speed: { min: 20, max: 80 },
            angle: { min: -120, max: -60 },
            scale: { start: 1, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 300,
            gravityY: 200,
            quantity: 5
        });
        this.dustParticles.stop();
    }
    
    onJumpPressed() {
        const cfg = GAME_CONFIG.player;
        const body = this.player.body;
        
        // Check if grounded OR within coyote time
        const timeSinceGrounded = this.time.now - this.lastGroundedTime;
        const canCoyoteJump = !body.touching.down && timeSinceGrounded < cfg.coyoteTime;
        
        if (body.touching.down || canCoyoteJump) {
            body.setVelocityY(cfg.jumpForce);
            this.isJumpHeld = true;
            this.jumpHoldStartTime = this.time.now;
            
            // Visual feedback - slight squash
            this.tweens.add({
                targets: this.playerParts.body,
                scaleY: 1.1,
                scaleX: 0.95,
                duration: 100,
                yoyo: true
            });
        }
    }
    
    onJumpReleased() {
        this.isJumpHeld = false;
        
        // Cut jump short if moving upward
        if (this.player.body.velocity.y < 0) {
            this.player.body.setVelocityY(this.player.body.velocity.y * 0.5);
        }
    }
    
    calculate8DirectionAim() {
        // Get input for aiming (Contra-style 8 directions)
        const up = this.cursors.up.isDown;
        const down = this.cursors.down.isDown;
        const facingRight = this.playerParts.body.scaleX > 0;
        
        let x = facingRight ? 1 : -1; // Default to facing direction
        let y = 0;
        
        // 8 directions: up, up-diagonal, horizontal, down-diagonal, down
        if (up && !down) {
            y = -1;
            // up-diagonal if moving, straight up if standing still
            if (Math.abs(this.player.body.velocity.x) < 20) {
                x = 0; // Straight up when standing still
            }
        } else if (down && !up) {
            y = 1;
            // down-diagonal if moving or in air, straight down if standing still on ground
            if (this.player.body.touching.down && Math.abs(this.player.body.velocity.x) < 20) {
                x = 0; // Straight down when standing still
            }
        }
        
        // Normalize for consistent bullet speed
        const length = Math.sqrt(x * x + y * y);
        if (length > 0) {
            x /= length;
            y /= length;
        }
        
        return { x, y };
    }
    
    fire() {
        const cfg = GAME_CONFIG.shooting;
        const now = this.time.now;
        
        // Fire rate limiting
        if (now - this.lastFireTime < cfg.fireRate) {
            return;
        }
        
        this.lastFireTime = now;
        
        // Calculate aim direction
        this.aimDirection = this.calculate8DirectionAim();
        
        // Find muzzle position (end of drill/gun)
        const muzzleOffset = 20;
        const muzzleX = this.player.x + (this.aimDirection.x * muzzleOffset);
        const muzzleY = this.player.y + (this.aimDirection.y * muzzleOffset);
        
        // Create bullet (cylindrical core bit)
        this.createBullet(muzzleX, muzzleY, this.aimDirection);
        
        // Muzzle flash effect
        this.showMuzzleFlash(muzzleX, muzzleY);
        
        // Screen shake for punch
        this.cameras.main.shake(100, cfg.screenShake / 1000);
    }
    
    createBullet(x, y, direction) {
        const cfg = GAME_CONFIG.shooting;
        
        // Create bullet container
        const bullet = this.add.container(x, y);
        
        // Core bit cylinder (diamond blue with glow)
        const core = this.add.rectangle(0, 0, cfg.bulletSize.width, cfg.bulletSize.height, 
                                        GAME_CONFIG.colors.diamondBlue);
        
        // Glow effect
        const glow = this.add.rectangle(0, 0, cfg.bulletSize.width + 4, cfg.bulletSize.height + 4, 
                                        GAME_CONFIG.colors.diamondBlue, 0.3);
        
        bullet.add([glow, core]);
        
        // Rotate to face direction
        const angle = Math.atan2(direction.y, direction.x);
        bullet.setRotation(angle);
        
        // Physics
        this.physics.add.existing(bullet);
        bullet.body.setVelocity(
            direction.x * cfg.bulletSpeed,
            direction.y * cfg.bulletSpeed
        );
        bullet.body.setSize(cfg.bulletSize.width, cfg.bulletSize.height);
        
        // Add to bullets group
        this.bullets.add(bullet);
        
        // Particle trail
        this.createBulletTrail(bullet);
        
        // Auto-destroy after 3 seconds
        this.time.delayedCall(3000, () => {
            if (bullet && bullet.active) {
                bullet.destroy();
            }
        });
        
        return bullet;
    }
    
    createBulletTrail(bullet) {
        // Sparkle trail particles
        const trail = this.add.particles(bullet.x, bullet.y, 'particle', {
            speed: 20,
            scale: { start: 0.6, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: GAME_CONFIG.colors.diamondBlue,
            lifespan: 200,
            quantity: 1,
            frequency: 30
        });
        
        // Follow bullet
        trail.startFollow(bullet);
        
        // Clean up trail when bullet is destroyed
        bullet.once('destroy', () => {
            trail.stop();
            this.time.delayedCall(300, () => trail.destroy());
        });
    }
    
    showMuzzleFlash(x, y) {
        const cfg = GAME_CONFIG.shooting;
        
        // Remove old flash if exists
        if (this.muzzleFlash) {
            this.muzzleFlash.destroy();
        }
        
        // Create bright flash
        this.muzzleFlash = this.add.circle(x, y, 8, 0xFFFF00, 1);
        this.muzzleFlash.setBlendMode(Phaser.BlendModes.ADD);
        
        // Fade out quickly
        this.tweens.add({
            targets: this.muzzleFlash,
            alpha: 0,
            scale: 1.5,
            duration: cfg.muzzleFlashDuration,
            onComplete: () => {
                this.muzzleFlash.destroy();
                this.muzzleFlash = null;
            }
        });
    }
    
    spawnEnemy() {
        if (this.gameOver) return;
        
        const cfg = GAME_CONFIG.enemies;
        const y = Phaser.Math.Between(cfg.spawnYMin, cfg.spawnYMax);
        
        // Randomly choose enemy type (70% jackhammer, 30% mixer)
        const enemyType = Math.random() < 0.7 ? 'jackhammer' : 'mixer';
        
        let enemy;
        if (enemyType === 'jackhammer') {
            enemy = this.createJackhammer(cfg.spawnX, y);
        } else {
            enemy = this.createMixer(cfg.spawnX, y);
        }
        
        this.enemies.add(enemy);
    }
    
    createJackhammer(x, y) {
        const cfg = GAME_CONFIG.enemies.jackhammer;
        
        // Create container
        const enemy = this.add.container(x, y);
        enemy.enemyType = 'jackhammer';
        enemy.hp = cfg.hp;
        enemy.maxHp = cfg.hp;
        enemy.scoreValue = cfg.score;
        
        // Visual - rectangular jackhammer
        const body = this.add.rectangle(0, 0, cfg.width, cfg.height, GAME_CONFIG.colors.steelGray);
        const drill = this.add.rectangle(0, cfg.height/2 + 5, cfg.width * 0.6, 10, GAME_CONFIG.colors.dmiRed);
        
        enemy.add([body, drill]);
        enemy.bodyPart = body; // For hit flash
        
        // Physics
        this.physics.add.existing(enemy);
        enemy.body.setSize(cfg.width, cfg.height);
        enemy.body.setGravityY(GAME_CONFIG.player.gravity);
        enemy.body.setVelocityX(-cfg.speed);
        enemy.body.setBounce(0.3);
        
        // Hopping behavior
        enemy.lastHopTime = this.time.now;
        enemy.hopInterval = cfg.hopInterval;
        enemy.hopForce = cfg.hopForce;
        
        // Collision with platforms
        this.physics.add.collider(enemy, this.platforms);
        
        // Add takeDamage method
        enemy.takeDamage = (damage) => {
            enemy.hp -= damage;
            
            // White flash on hit
            this.tweens.add({
                targets: enemy.bodyPart,
                tint: 0xFFFFFF,
                duration: 50,
                yoyo: true
            });
            
            if (enemy.hp <= 0) {
                this.enemyDeath(enemy);
            }
        };
        
        return enemy;
    }
    
    createMixer(x, y) {
        const cfg = GAME_CONFIG.enemies.mixer;
        
        // Create container
        const enemy = this.add.container(x, y);
        enemy.enemyType = 'mixer';
        enemy.hp = cfg.hp;
        enemy.maxHp = cfg.hp;
        enemy.scoreValue = cfg.score;
        
        // Visual - circular mixer bot
        const body = this.add.circle(0, 0, cfg.width/2, GAME_CONFIG.colors.steelGray);
        const stripe1 = this.add.rectangle(0, -8, cfg.width * 0.8, 4, GAME_CONFIG.colors.dmiRed);
        const stripe2 = this.add.rectangle(0, 8, cfg.width * 0.8, 4, GAME_CONFIG.colors.dmiRed);
        
        enemy.add([body, stripe1, stripe2]);
        enemy.bodyPart = body;
        
        // Physics
        this.physics.add.existing(enemy);
        enemy.body.setCircle(cfg.width/2);
        enemy.body.setGravityY(GAME_CONFIG.player.gravity);
        enemy.body.setVelocityX(-cfg.speed);
        enemy.body.setBounce(0.2);
        
        // Collision with platforms
        this.physics.add.collider(enemy, this.platforms);
        
        // Add takeDamage method
        enemy.takeDamage = (damage) => {
            enemy.hp -= damage;
            
            // White flash on hit
            this.tweens.add({
                targets: enemy.bodyPart,
                tint: 0xFFFFFF,
                duration: 50,
                yoyo: true
            });
            
            // Show HP with brief tint
            const hpPercent = enemy.hp / enemy.maxHp;
            if (hpPercent <= 0.66 && hpPercent > 0.33) {
                enemy.bodyPart.setFillStyle(0x8B8682); // Slightly damaged
            } else if (hpPercent <= 0.33 && hpPercent > 0) {
                enemy.bodyPart.setFillStyle(0x666666); // More damaged
            }
            
            if (enemy.hp <= 0) {
                this.enemyDeath(enemy);
            }
        };
        
        return enemy;
    }
    
    enemyDeath(enemy) {
        if (!enemy.active) return;
        
        // Explosion particles
        const explosion = this.add.particles(enemy.x, enemy.y, 'particle', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.5, end: 0 },
            tint: [0xFF6600, 0xFF0000, 0xFFD700],
            lifespan: 500,
            quantity: 15,
            gravityY: 200
        });
        explosion.explode();
        
        // Score popup
        const scorePopup = this.add.text(enemy.x, enemy.y, `+${enemy.scoreValue}`, {
            fontSize: '20px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: scorePopup,
            y: enemy.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => scorePopup.destroy()
        });
        
        // Add score
        this.addScore(enemy.scoreValue);
        
        // Track kill count
        this.enemiesKilled++;
        
        // Screen shake
        this.cameras.main.shake(80, 0.003);
        
        // Destroy enemy
        enemy.destroy();
        
        // Clean up explosion after particles finish
        this.time.delayedCall(600, () => explosion.destroy());
    }
    
    // Wave progression methods
    getCurrentSpawnRate() {
        const cfg = GAME_CONFIG.wave;
        const elapsed = this.time.now - this.waveStartTime;
        const progress = Math.min(elapsed / this.waveDuration, 1); // 0 to 1
        
        // Interpolate from startSpawnRate to endSpawnRate
        const spawnRate = cfg.startSpawnRate - (progress * (cfg.startSpawnRate - cfg.endSpawnRate));
        return spawnRate;
    }
    
    getWaveTimeRemaining() {
        const elapsed = this.time.now - this.waveStartTime;
        const remaining = Math.max(0, this.waveDuration - elapsed);
        return remaining;
    }
    
    checkWaveComplete() {
        // Win condition 1: Reached score goal
        if (this.score >= this.waveGoalScore) {
            this.waveComplete();
            return true;
        }
        
        // Win condition 2: Survived the time
        if (this.getWaveTimeRemaining() <= 0) {
            this.waveComplete();
            return true;
        }
        
        return false;
    }
    
    waveComplete() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        
        // Freeze enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.body) {
                enemy.body.setVelocity(0, 0);
            }
        });
        
        // Celebration effect
        this.cameras.main.flash(500, 255, 215, 0, false, (camera, progress) => {
            if (progress === 1) {
                // Transition to wave complete scene
                this.scene.start('WaveCompleteScene', {
                    score: this.score,
                    time: this.time.now - this.waveStartTime,
                    enemiesKilled: this.enemiesKilled
                });
            }
        });
        
        // Victory sound effect (screen shake as substitute)
        this.cameras.main.shake(300, 0.01);
    }
    
    update(time, delta) {
        if (this.gameOver) return;
        
        const cfg = GAME_CONFIG.player;
        const body = this.player.body;
        
        // Check wave completion
        if (this.checkWaveComplete()) {
            return;
        }
        
        // Update wave timer UI
        const timeRemaining = Math.ceil(this.getWaveTimeRemaining() / 1000);
        this.waveTimerText.setText(`TIME: ${timeRemaining}s`);
        
        // Color code timer based on urgency
        if (timeRemaining <= 10) {
            this.waveTimerText.setColor('#FF0000'); // Red - urgent
        } else if (timeRemaining <= 30) {
            this.waveTimerText.setColor('#FFD700'); // Yellow - warning
        } else {
            this.waveTimerText.setColor('#00D9FF'); // Blue - normal
        }
        
        // Enemy spawning with dynamic difficulty
        if (time >= this.nextSpawnTime) {
            this.spawnEnemy();
            this.nextSpawnTime = time + this.getCurrentSpawnRate();
        }
        
        // Update enemies
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            
            // Destroy if off screen (left side)
            if (enemy.x < -100) {
                enemy.destroy();
                return;
            }
            
            // Jackhammer hopping
            if (enemy.enemyType === 'jackhammer') {
                if (enemy.body.touching.down && time - enemy.lastHopTime > enemy.hopInterval) {
                    enemy.body.setVelocityY(enemy.hopForce);
                    enemy.lastHopTime = time;
                }
            }
            
            // Mixer rotation (visual)
            if (enemy.enemyType === 'mixer') {
                enemy.angle += 2;
            }
        });
        
        // Track grounded state for coyote time
        if (body.touching.down) {
            this.lastGroundedTime = time;
            
            // Landing impact detection
            if (!this.wasGrounded && body.velocity.y > 100) {
                this.onLanding();
            }
            this.wasGrounded = true;
        } else {
            this.wasGrounded = false;
        }
        
        // Horizontal movement
        const leftPressed = this.cursors.left.isDown || this.keys.left.isDown || 
                           (this.touchState && this.touchState.left);
        const rightPressed = this.cursors.right.isDown || this.keys.right.isDown || 
                            (this.touchState && this.touchState.right);
        
        if (leftPressed) {
            body.setAccelerationX(-cfg.acceleration);
            this.playerParts.body.setScale(-1, 1); // Face left
        } else if (rightPressed) {
            body.setAccelerationX(cfg.acceleration);
            this.playerParts.body.setScale(1, 1); // Face right
        } else {
            body.setAccelerationX(0);
        }
        
        // Jump input (keyboard only - mobile uses touch events)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || 
            Phaser.Input.Keyboard.JustDown(this.keys.jump) ||
            Phaser.Input.Keyboard.JustDown(this.keys.jumpAlt)) {
            this.onJumpPressed();
        }
        
        if (this.cursors.up.isUp && this.keys.jump.isUp && this.keys.jumpAlt.isUp) {
            if (this.isJumpHeld) {
                this.onJumpReleased();
            }
        }
        
        // Shooting input
        const firePressed = this.keys.fire.isDown || this.keys.fireAlt.isDown || 
                           (this.touchState && this.touchState.fire);
        
        if (firePressed) {
            this.fire();
        }
        
        // Clean up bullets that go offscreen
        this.bullets.children.entries.forEach(bullet => {
            if (bullet && bullet.active) {
                const bounds = 100; // Buffer outside screen
                if (bullet.x < -bounds || bullet.x > this.cameras.main.width + bounds ||
                    bullet.y < -bounds || bullet.y > this.cameras.main.height + bounds) {
                    bullet.destroy();
                }
            }
        });
        
        // Jump hold mechanic - add upward velocity while holding
        if (this.isJumpHeld && body.velocity.y < 0) {
            const holdDuration = time - this.jumpHoldStartTime;
            if (holdDuration < cfg.jumpHoldTime) {
                // Apply additional upward force
                const holdForce = cfg.jumpHoldBonus * (delta / 1000);
                body.setVelocityY(body.velocity.y + holdForce);
            }
        }
        
        // Simple leg animation when moving
        if (body.touching.down && Math.abs(body.velocity.x) > 20) {
            const legOffset = Math.sin(time / 100) * 3;
            this.playerParts.leg1.y = 28 + legOffset;
            this.playerParts.leg2.y = 28 - legOffset;
        } else {
            this.playerParts.leg1.y = 28;
            this.playerParts.leg2.y = 28;
        }
        
        // Slight tilt when moving in air
        if (!body.touching.down) {
            const tilt = Phaser.Math.Clamp(body.velocity.x / cfg.speed, -0.15, 0.15);
            this.player.setRotation(tilt);
        } else {
            this.player.setRotation(0);
        }
        
        // Debug info
        const timeSinceGrounded = time - this.lastGroundedTime;
        const inCoyoteTime = !body.touching.down && timeSinceGrounded < cfg.coyoteTime;
        const timeSinceFire = time - this.lastFireTime;
        const canFire = timeSinceFire >= GAME_CONFIG.shooting.fireRate;
        
        this.debugText.setText([
            `Lives: ${this.lives} | Score: ${this.score}`,
            `Enemies: ${this.enemies.countActive()} | Next spawn: ${Math.max(0, Math.round((this.nextSpawnTime - time) / 1000))}s`,
            `Bullets: ${this.bullets.countActive()}`,
            `Invulnerable: ${this.isInvulnerable}`
        ]);
    }
    
    onLanding() {
        const body = this.player.body;
        
        // Dust particles
        this.dustParticles.emitParticleAt(
            this.player.x - 10,
            this.player.y + 20,
            5
        );
        this.dustParticles.emitParticleAt(
            this.player.x + 10,
            this.player.y + 20,
            5
        );
        
        // Brief screen settle (camera shake)
        this.cameras.main.shake(100, 0.002);
        
        // Squash animation
        this.tweens.add({
            targets: this.playerParts.body,
            scaleY: 0.85,
            scaleX: 1.15,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
    }
}
