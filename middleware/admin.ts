/**
 * 🛡️ Admin Middleware - Protecao de rotas /admin/*
 *
 * Verifica se o usuario esta autenticado no Firebase.
 * Redireciona pra /admin/login se nao estiver.
 * Nao protege a propria pagina de login.
 */

export default defineNuxtRouteMiddleware(async (to) => {
  // Nao protege a pagina de login
  if (to.path === '/admin/login') {
    return;
  }

  // So protege rotas admin
  if (!to.path.startsWith('/admin')) {
    return;
  }

  // Checa autenticacao via Firebase Auth
  const { $auth } = useFirebase();

  if (!$auth.currentUser) {
    return navigateTo('/admin/login');
  }
});
