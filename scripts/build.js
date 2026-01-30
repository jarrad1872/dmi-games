#!/usr/bin/env node
/**
 * DMI Games Build Script
 * - Generates games manifest (games.json)
 * - Validates all games
 * - Reports any issues
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GAMES_DIR = path.join(ROOT, 'games');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

console.log('🏗️  Building DMI Games...\n');

// Scan games directory
const games = [];
const issues = [];

if (fs.existsSync(GAMES_DIR)) {
  const gameDirs = fs.readdirSync(GAMES_DIR);
  
  for (const dir of gameDirs) {
    const gamePath = path.join(GAMES_DIR, dir);
    const indexPath = path.join(gamePath, 'index.html');
    
    if (!fs.statSync(gamePath).isDirectory()) continue;
    
    if (!fs.existsSync(indexPath)) {
      issues.push(`⚠️  ${dir}: Missing index.html`);
      continue;
    }
    
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // Extract title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(' - DMI Tools', '').trim() : dir;
    
    // Check requirements
    const checks = {
      'Phaser 3': content.includes('phaser'),
      'Mobile viewport': content.includes('viewport'),
      'DMI branding': content.includes('#A62022') || content.includes('DMI'),
      'Touch support': content.includes('pointerdown') || content.includes('touch'),
    };
    
    const passing = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    
    if (passing < total) {
      const failing = Object.entries(checks).filter(([,v]) => !v).map(([k]) => k);
      issues.push(`⚠️  ${dir}: Missing ${failing.join(', ')}`);
    }
    
    games.push({
      id: dir,
      title,
      path: `/games/${dir}/`,
      checks,
      valid: passing === total,
    });
    
    console.log(`✅ ${title} (${dir})`);
  }
}

// Write manifest
const manifest = {
  version: new Date().toISOString(),
  count: games.length,
  games,
};

fs.writeFileSync(
  path.join(ROOT, 'games.json'),
  JSON.stringify(manifest, null, 2)
);

// Scan templates
console.log('\n📁 Templates:');
if (fs.existsSync(TEMPLATES_DIR)) {
  const templates = fs.readdirSync(TEMPLATES_DIR);
  for (const t of templates) {
    if (fs.statSync(path.join(TEMPLATES_DIR, t)).isDirectory()) {
      console.log(`   - ${t}`);
    }
  }
}

// Report
console.log(`
═══════════════════════════════════════
📊 Build Summary
═══════════════════════════════════════
Games:     ${games.length}
Valid:     ${games.filter(g => g.valid).length}
Issues:    ${issues.length}
═══════════════════════════════════════
`);

if (issues.length > 0) {
  console.log('Issues found:');
  issues.forEach(i => console.log(`  ${i}`));
  console.log('');
}

console.log('✨ Build complete! games.json updated.');
