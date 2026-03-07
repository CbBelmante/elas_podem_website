# Tiers de Workflow

Classifique TODA solicitação em um tier ANTES de agir.

## Tier 1: Quick
Ajuste CSS, fix de 1-5 linhas, rename, mudança de valor, layout tweak, responder pergunta, análise de código.
- Executa direto. Sem 3 opções.
- Commit simples, push direto em main.

## Tier 2: Task
Bug fix com investigação, feature pequena (1-3 arquivos), refactor localizado, ajuste de componente, novo campo admin.
- Commit com mensagem descritiva (conventional commits PT-BR).
- 3 opções (Alpha/Bravo/Charlie) apenas se houver ambiguidade real.
- Validar build antes de commitar (`npx nuxi build`).

## Tier 3: Feature
Feature nova completa (nova página admin, novo módulo, integração externa), mudança arquitetural.
- Planejar antes: listar arquivos afetados, ordem de criação, dependências.
- Seguir sequência do padrão admin (types → definitions → utils → composable → editor → page).
- Validar build + testar fluxo completo.
- Commit descritivo cobrindo todas as mudanças.

## Como classificar
- Na dúvida Quick vs Task: Quick.
- Na dúvida Task vs Feature: Task.
- Usuário pode reclassificar a qualquer momento.

## Regras que SEMPRE aplicam
- NUNCA adicionar `Co-Authored-By` nos commits.
- NUNCA introduzir vulnerabilidades de segurança.
- Seguir `docs/CODE_STYLE_GUIDE.md` e `docs/JSDOC_GUIDE.md`.
- Props Vue em Options API (não `defineProps<Props>()`).
- CSS via variables do theme — nunca hardcodar cores.
- Imports via aliases (`@appTypes`, `@composables`, `@definitions`, `@utils`, `@config`).
- Sempre push após commit (a menos que o usuário peça o contrário).
- Ao editar cbcomponents: build lib → limpar cache Nuxt → validar build elas_podem.
