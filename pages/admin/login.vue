<!--
  🧩 Admin Login - Pagina de autenticacao do painel admin

  Tela standalone (sem layout) com email/senha via Firebase Auth.
  Redireciona pra /admin se ja estiver logado.
-->

<script setup lang="ts">
import { CBButton, CBCard, CBIcon, CBImage, CBInput, CBLabel } from '@cb/components';
import '@cb/components/style.css';
import '../../assets/css/theme.css';

// ============== PAGE META ==============

definePageMeta({
  layout: false,
});

// ============== COMPOSABLES ==============

const { signIn, isAuthenticated } = useAuth();

// ============== REACTIVE STATE ==============

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const isSubmitting = ref(false);

/** Mostra/oculta senha no input */
const showPassword = ref(false);

// ============== METHODS ==============

/**
 * Submete login via useAuth().signIn().
 * Firebase Auth valida credenciais — sem validacao local.
 */
const handleLogin = async (): Promise<void> => {
  if (isSubmitting.value) return;

  error.value = null;
  isSubmitting.value = true;

  const result = await signIn(email.value, password.value);

  if (result.success) {
    await navigateTo('/admin');
  } else {
    error.value = result.error ?? 'Erro ao fazer login';
  }

  isSubmitting.value = false;
};

/** Alterna visibilidade da senha */
const togglePassword = (): void => {
  showPassword.value = !showPassword.value;
};

// ============== LIFECYCLE ==============

/** Se ja logado, redireciona direto (sem mostrar form) */
onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/admin');
  }
});
</script>

<template>
  <div class="loginPage">
    <!-- Glow decorativo de fundo -->
    <div class="loginPage__glow" />

    <div class="loginContainer">
      <!-- Logo -->
      <div class="loginLogo">
        <CBImage
          src="/logo-elas-podem.png"
          alt="Elas Podem"
          size="auto"
          :height="56"
          fit="contain"
          :eager="true"
        />
      </div>

      <!-- Card de login -->
      <CBCard variant="elevated" :rounded="24" class="loginCard">
        <!-- Header -->
        <div class="loginCard__header">
          <CBLabel
            text="Painel Administrativo"
            tag="h1"
            size="xl"
            weight="bold"
            class="loginCard__title"
          />
          <CBLabel text="Entre com suas credenciais para acessar" size="sm" color="secondary" />
        </div>

        <!-- Erro -->
        <div v-if="error" class="loginError">
          <CBIcon icon="luc-alert-circle" size="1rem" color="var(--color-coral)" />
          <CBLabel :text="error" size="sm" class="loginError__text" />
        </div>

        <!-- Formulario -->
        <form class="loginForm" @submit.prevent="handleLogin">
          <CBInput
            v-model="email"
            name="admin-email"
            type="email"
            label="Email"
            placeholder="seu@email.com"
            :rounded="12"
            prepend-icon="luc-mail"
            :disabled="isSubmitting"
            required
          />

          <div class="loginForm__passwordWrapper">
            <CBInput
              v-model="password"
              name="admin-password"
              :type="showPassword ? 'text' : 'password'"
              label="Senha"
              placeholder="Digite sua senha"
              :rounded="12"
              prepend-icon="luc-lock"
              :disabled="isSubmitting"
              required
            />
            <button
              type="button"
              class="loginForm__togglePassword"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="togglePassword"
            >
              <CBIcon
                :icon="showPassword ? 'luc-eye-off' : 'luc-eye'"
                size="1.125rem"
                color="var(--text-tertiary)"
              />
            </button>
          </div>

          <CBButton
            label="Entrar"
            type="submit"
            size="lg"
            :bg-gradient="'var(--gradient-primary)'"
            :rounded="12"
            :loading="isSubmitting"
            :disabled="isSubmitting || !email || !password"
            prepend-icon="luc-log-in"
            block
            class="loginForm__submit"
          />
        </form>
      </CBCard>

      <!-- Rodape discreto -->
      <CBLabel text="Elas Podem — Painel Admin" size="xs" color="tertiary" class="loginFooter" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   LOGIN PAGE — LAYOUT
   ============================================ */
.loginPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hero);
  font-family: var(--font-body);
  position: relative;
  overflow: hidden;
}

/* Glow decorativo — mesmo padrao visual do site */
.loginPage__glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--color-magenta-rgb), 0.12) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  pointer-events: none;
}

/* ============================================
   CONTAINER CENTRALIZADO
   ============================================ */
.loginContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

/* ============================================
   LOGO
   ============================================ */
.loginLogo {
  transition: transform 0.3s ease;
}

.loginLogo:hover {
  transform: scale(1.05);
}

/* ============================================
   CARD DE LOGIN
   ============================================ */
.loginCard {
  width: 100%;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.loginCard__header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.loginCard__title {
  font-family: var(--font-heading);
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

/* ============================================
   ERRO INLINE
   ============================================ */
.loginError {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(var(--color-coral-rgb), 0.08);
  border: 1px solid rgba(var(--color-coral-rgb), 0.2);
  border-radius: 10px;
  margin-bottom: 1rem;
}

.loginError__text {
  color: var(--color-coral);
}

/* ============================================
   FORMULARIO
   ============================================ */
.loginForm {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.loginForm__passwordWrapper {
  position: relative;
}

.loginForm__togglePassword {
  position: absolute;
  right: 12px;
  top: 38px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease;
}

.loginForm__togglePassword:hover {
  opacity: 0.7;
}

.loginForm__submit {
  margin-top: 0.5rem;
}

/* ============================================
   RODAPE
   ============================================ */
.loginFooter {
  opacity: 0.6;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 480px) {
  .loginContainer {
    padding: 1.5rem;
  }

  .loginCard {
    border-radius: 20px;
  }
}
</style>
