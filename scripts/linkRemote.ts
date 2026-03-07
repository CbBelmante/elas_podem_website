/**
 * 🔧 linkRemote — Desativa npm link e volta para versão instalada
 *
 * Remove link, limpa node_modules/@cb e reinstala do registry.
 */

import { execSync } from 'child_process';
import { resolve } from 'path';

// ============== CONSTANTS ==============

const ROOT_DIR = resolve(import.meta.dirname, '..');

// ============== EXECUÇÃO ==============

console.log('🔌 Desativando npm link...');

console.log('❌ Removendo link...');
try {
  execSync('npm unlink @cb/components', { cwd: ROOT_DIR, stdio: 'inherit' });
} catch {
  // Ignora se não existir link ativo
}

console.log('🗑️  Removendo @cb...');
execSync('rm -rf node_modules/@cb', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('📦 Reinstalando @cb/components...');
execSync('npm install', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('🧹 Limpando cache...');
execSync('rm -rf .nuxt .output node_modules/.vite node_modules/.cache', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('\n📋 Links ativos (deve estar vazio):');
execSync('npm ls --link', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('\n✅ npm link DESATIVADO!');
console.log('   📦 Usando versão instalada do node_modules');
console.log('   🚀 Para rodar: npm run dev');
