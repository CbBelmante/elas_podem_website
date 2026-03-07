/**
 * 🔧 killPort — Mata processos rodando em uma porta específica
 *
 * Uso: bun scripts/killPort.ts <porta>
 */

import { execSync } from 'child_process';

// ============== VALIDAÇÃO ==============

const port = process.argv[2];

if (!port) {
  console.error('Uso: bun scripts/killPort.ts <porta>');
  process.exit(1);
}

// ============== EXECUÇÃO ==============

try {
  const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf-8' }).trim();

  if (!pids) {
    console.log(`Nenhum processo na porta ${port}`);
  } else {
    execSync(`echo "${pids}" | xargs kill -9`);
    console.log(`Porta ${port} liberada`);
  }
} catch {
  console.log(`Nenhum processo na porta ${port}`);
}
