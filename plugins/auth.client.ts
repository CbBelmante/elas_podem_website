/**
 * 🔐 Auth Plugin - Inicializacao do listener de autenticacao (client-only)
 *
 * Roda no boot da aplicacao e inicia o onAuthStateChanged do Firebase.
 * Sufixo .client.ts garante que so executa no browser (nao no SSR).
 */

export default defineNuxtPlugin(() => {
  const { initAuthStateListener } = useAuth();
  initAuthStateListener();
});
