#!/bin/bash
# 🔗 Ativa npm link para desenvolvimento local da CBComponents

set -e

echo "🔗 Ativando npm link para desenvolvimento..."

# 1. Carregar variável de ambiente (fallback para ../cbcomponents)
CB_PATH="${CB_COMPONENTS_PATH:-../cbcomponents}"

echo "📂 Procurando CBComponents em: $CB_PATH"

# 2. Verificar se biblioteca existe
if [ ! -d "$CB_PATH" ]; then
  echo ""
  echo "❌ ERRO: CBComponents não encontrado em $CB_PATH"
  echo ""
  echo "💡 Soluções:"
  echo "   1. Configure a variável CB_COMPONENTS_PATH no seu .env"
  echo "   2. Clone o repositório em ../cbcomponents"
  echo "   3. Ou use a versão remota: npm run cbcomponentsLinkRemote"
  echo ""
  exit 1
fi

# 3. Build da biblioteca
echo "📦 Building CBComponents..."
cd "$CB_PATH"
npm run build

# 4. Criar link global
echo "🌍 Criando link global..."
npm link

# 5. Voltar ao projeto e usar o link
echo "🔗 Linkando no projeto..."
cd - > /dev/null  # Volta para o diretório original
npm link @cb/components

# 6. Limpar cache do Nuxt
echo "🧹 Limpando cache..."
rm -rf .nuxt .output node_modules/.vite node_modules/.cache

# 7. Listar links ativos
echo ""
echo "📋 Links ativos:"
npm ls --link

echo ""
echo "✅ npm link ATIVADO!"
echo "   📝 Para desativar: npm run cbcomponentsLinkRemote"
echo "   🚀 Para rodar: npm run dev"
