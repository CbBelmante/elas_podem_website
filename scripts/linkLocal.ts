/**
 * 🔧 linkLocal — Ativa npm link para dev local da CBComponents
 *
 * Build da lib, cria link global, linka no projeto e limpa cache.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

// ============== CONSTANTS ==============

const ROOT_DIR = resolve(import.meta.dirname, '..');
const CB_PATH = process.env.CB_COMPONENTS_PATH ?? resolve(ROOT_DIR, '../cbcomponents');

// ============== VALIDAÇÃO ==============

if (!existsSync(CB_PATH)) {
  console.error(`\n❌ CBComponents não encontrado em ${CB_PATH}`);
  console.error('\n💡 Soluções:');
  console.error('   1. Configure CB_COMPONENTS_PATH no seu .env');
  console.error('   2. Clone o repositório em ../cbcomponents');
  console.error('   3. Ou use: npm run cbcomponentsLinkRemote\n');
  process.exit(1);
}

// ============== EXECUÇÃO ==============

console.log(`📂 CBComponents em: ${CB_PATH}`);

console.log('📦 Building CBComponents...');
execSync('npm run build', { cwd: CB_PATH, stdio: 'inherit' });

console.log('🌍 Criando link global...');
execSync('npm link', { cwd: CB_PATH, stdio: 'inherit' });

console.log('🔗 Linkando no projeto...');
execSync('npm link @cb/components', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('🧹 Limpando cache...');
execSync('rm -rf .nuxt .output node_modules/.vite node_modules/.cache', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('\n📋 Links ativos:');
execSync('npm ls --link', { cwd: ROOT_DIR, stdio: 'inherit' });

console.log('\n✅ npm link ATIVADO!');
console.log('   📝 Para desativar: npm run cbcomponentsLinkRemote');
console.log('   🚀 Para rodar: npm run dev');
