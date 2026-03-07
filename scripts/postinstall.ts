/**
 * 🔧 postinstall — nuxt prepare + link local condicional
 *
 * Lê config.useCbLocal do package.json.
 * Se true, roda cbcomponentsLinkLocal automaticamente.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ============== CONSTANTS ==============

const ROOT_DIR = resolve(import.meta.dirname, '..');

const pkg = JSON.parse(readFileSync(resolve(ROOT_DIR, 'package.json'), 'utf-8'));
const useCbLocal: boolean = pkg.config?.useCbLocal ?? false;

// ============== NUXT PREPARE ==============

console.log('[postinstall] nuxt prepare...');
execSync('npx nuxt prepare', { cwd: ROOT_DIR, stdio: 'inherit' });

// ============== LINK LOCAL CONDICIONAL ==============

if (useCbLocal) {
  console.log('\n[postinstall] useCbLocal=true — linkando CBComponents local...');
  execSync('npm run cbcomponentsLinkLocal', { cwd: ROOT_DIR, stdio: 'inherit' });
} else {
  console.log('\n[postinstall] useCbLocal=false — usando CBComponents remoto.');
}
