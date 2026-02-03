// Core Shooter Configuration
const GAME_CONFIG = {
    // Canvas
    width: 800,
    height: 600,
    
    // DMI Branding Colors
    colors: {
        dmiRed: 0xA62022,
        dmiBlack: 0x222222,
        diamondBlue: 0x00D9FF,
        steelGray: 0x4A4A4A,
        concrete: 0x8B8682,
        safetyYellow: 0xFFD700
    },
    
    // Player Movement
    player: {
        speed: 200,              // Max horizontal speed
        acceleration: 2000,      // How fast we reach max speed (instant feel)
        deceleration: 1800,      // How fast we stop (slight slide)
        jumpForce: -450,         // Initial jump velocity
        gravity: 1000,           // Gravity strength
        maxFallSpeed: 600,       // Terminal velocity
        
        // Jump feel
        jumpHoldBonus: -150,     // Extra upward velocity while holding
        jumpHoldTime: 200,       // Max time (ms) jump button can add velocity
        
        // Coyote time
        coyoteTime: 90,          // Grace period (ms) after leaving platform
        
        // Visual
        width: 32,
        height: 48,
        hitboxScale: 0.8,        // Slightly smaller hitbox than sprite
    },
    
    // Shooting
    shooting: {
        fireRate: 300,           // ms between shots
        bulletSpeed: 500,        // pixels per second
        bulletDamage: 1,
        bulletSize: { width: 12, height: 4 }, // Cylindrical core bit
        muzzleFlashDuration: 50, // ms
        screenShake: 4,          // pixels
    },
    
    // Mobile Controls
    mobile: {
        dpadSize: 100,
        dpadPadding: 30,
        buttonSize: 60,
        buttonPadding: 30,
        opacity: 0.6
    },
    
    // Enemy System
    enemies: {
        spawnRate: 2000,         // ms between spawns
        spawnX: 850,             // Spawn off right side of screen
        spawnYMin: 200,
        spawnYMax: 500,
        
        // Jackhammer - hops toward player
        jackhammer: {
            hp: 1,
            speed: 100,
            hopForce: -300,       // Vertical hop velocity
            hopInterval: 800,     // ms between hops
            width: 24,
            height: 32,
            score: 100
        },
        
        // Concrete Mixer Bot - rolls slowly
        mixer: {
            hp: 3,
            speed: 60,
            width: 40,
            height: 40,
            score: 250
        }
    },
    
    // Game State
    game: {
        startLives: 3,
        playerInvulnerabilityTime: 2000,  // ms after getting hit
    },
    
    // Wave System
    wave: {
        duration: 90000,         // 90 seconds in milliseconds
        goalScore: 2000,         // Win condition: reach this score
        startSpawnRate: 3000,    // Initial: 1 enemy every 3 seconds
        endSpawnRate: 1000,      // Final: 1 enemy every 1 second
    }
};
