#!/bin/bash
# 🔌 Desativa npm link e volta a usar versão local de node_modules

set -e

echo "🔌 Desativando npm link..."

# 1. Desfazer link
echo "❌ Removendo link..."
npm unlink @cb/components || true

# 2. Remover pasta
echo "🗑️  Removendo @cb..."
rm -rf node_modules/@cb

# 3. Reinstalar do node_modules local
echo "📦 Reinstalando @cb/components..."
npm install

# 4. Limpar cache
echo "🧹 Limpando cache..."
rm -rf .nuxt .output node_modules/.vite node_modules/.cache

# 5. Confirmar que não tem links ativos
echo ""
echo "📋 Links ativos (deve estar vazio):"
npm ls --link

echo ""
echo "✅ npm link DESATIVADO!"
echo "   📦 Usando versão instalada do node_modules"
echo "   🚀 Para rodar: npm run dev"
