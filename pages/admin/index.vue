<!--
  🧩 Admin Dashboard - Painel administrativo principal

  Hub de navegacao com status das paginas e acoes por role.
  Carrega metadados (lastUpdated, updatedByName) do Firestore.

  TODO (Fase 2):
  - Audit log: secao com ultimas acoes lidas de admin_logs.
    Adiado porque ainda nao existem acoes logadas (homeEdit nao existe).
    Quando homeEdit for implementado e acoes reais forem salvas,
    adicionar secao de audit log aqui com query em FIRESTORE_COLLECTIONS.ADMIN_LOGS.
  - Cards de paginas adicionais (sobre, contato, etc.) conforme forem criadas.
  - Layout admin (layouts/admin.vue) com sidebar — por agora usa layout false.
-->

<script setup lang="ts">
import { CBBadge, CBButton, CBCard, CBIcon, CBLabel } from '@cb/components';
import '@cb/components/style.css';
import '../../assets/css/theme.css';

import { ADMIN_ROLE_DISPLAY_NAMES } from '@definitions/adminRoles';
import type { AdminRole } from '@definitions/adminRoles';

// ============== PAGE META ==============

definePageMeta({
  layout: false,
});

// ============== COMPOSABLES ==============

const { userData, permissions, signOut } = useAuth();
const { originalData, isLoading, loadPageData } = useHomePageData();

// ============== COMPUTED ==============

/** Display name da role do usuario */
const roleDisplayName = computed(() => {
  if (!userData.value?.role) return '';
  return ADMIN_ROLE_DISPLAY_NAMES[userData.value.role as AdminRole] ?? userData.value.role;
});

/** Metadados de status do documento home (lastUpdated, updatedByName) */
const homeStatus = computed(() => {
  const data = originalData.value as Record<string, unknown> | null;
  if (!data) return null;

  return {
    lastUpdated: data.lastUpdated as string | null,
    updatedByName: data.updatedByName as string | null,
  };
});

/** Data formatada da ultima edicao */
const lastEditFormatted = computed(() => {
  if (!homeStatus.value?.lastUpdated) return null;

  try {
    return new Date(homeStatus.value.lastUpdated).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return homeStatus.value.lastUpdated;
  }
});

// ============== METHODS ==============

const handleLogout = async (): Promise<void> => {
  await signOut();
};

const navigateToHomeEdit = (): void => {
  navigateTo('/admin/edit/homeEdit');
};

// ============== LIFECYCLE ==============

onMounted(async () => {
  await loadPageData();
});
</script>

<template>
  <div class="dashboardPage">
    <div class="dashboardContainer">
      <!-- Header com welcome + logout -->
      <header class="dashboardHeader">
        <div class="dashboardHeader__info">
          <CBLabel
            :text="`Ola, ${userData?.displayName ?? 'Admin'}`"
            tag="h1"
            size="xl"
            weight="bold"
            class="dashboardHeader__title"
          />
          <CBBadge
            v-if="roleDisplayName"
            :content="roleDisplayName"
            variant="outline"
            size="xs"
            weight="bold"
          />
        </div>

        <CBButton
          label="Sair"
          variant="outline"
          size="sm"
          :color="'var(--text-tertiary)'"
          prepend-icon="luc-log-out"
          :rounded="10"
          @click="handleLogout"
        />
      </header>

      <!-- Loading -->
      <div v-if="isLoading" class="dashboardLoading">
        <CBIcon
          icon="luc-loader-2"
          size="1.5rem"
          color="var(--text-tertiary)"
          class="dashboardLoading__spinner"
        />
        <CBLabel text="Carregando dados..." size="sm" color="tertiary" />
      </div>

      <!-- Cards de paginas -->
      <section v-else class="dashboardPages">
        <CBLabel
          text="Paginas"
          tag="h2"
          size="lg"
          weight="semibold"
          class="dashboardPages__title"
        />

        <!-- Card: Home Page -->
        <CBCard
          variant="outlined"
          :rounded="20"
          hover
          border-color="var(--border-light)"
          class="pageCard"
        >
          <div class="pageCard__header">
            <div class="pageCard__iconWrapper pageCard__iconWrapper--magenta">
              <CBIcon icon="luc-home" size="1.25rem" color="#ffffff" />
            </div>
            <div class="pageCard__titleGroup">
              <CBLabel text="Home Page" tag="h3" weight="bold" />
              <CBLabel
                text="Pagina principal do site — 8 secoes editaveis"
                size="sm"
                color="secondary"
              />
            </div>
          </div>

          <!-- Status: quem editou, quando -->
          <div v-if="homeStatus" class="pageCard__status">
            <div v-if="homeStatus.updatedByName" class="pageCard__statusItem">
              <CBIcon icon="luc-user" size="0.875rem" color="var(--text-tertiary)" />
              <CBLabel :text="homeStatus.updatedByName" size="xs" color="tertiary" />
            </div>
            <div v-if="lastEditFormatted" class="pageCard__statusItem">
              <CBIcon icon="luc-clock" size="0.875rem" color="var(--text-tertiary)" />
              <CBLabel :text="lastEditFormatted" size="xs" color="tertiary" />
            </div>
          </div>

          <!-- Acao: so aparece se tem permissao canEdit -->
          <div class="pageCard__actions">
            <CBButton
              v-if="permissions?.canEdit"
              label="Editar Pagina"
              size="md"
              :bg-gradient="'var(--gradient-primary)'"
              :rounded="12"
              prepend-icon="luc-pencil"
              @click="navigateToHomeEdit"
            />
            <CBBadge v-else content="Sem permissao para editar" variant="outline" size="xs" />
          </div>
        </CBCard>
      </section>

      <!-- Audit Log placeholder (TODO Fase 2) -->
      <section v-if="permissions?.canViewLogs" class="dashboardAudit">
        <CBLabel
          text="Atividade Recente"
          tag="h2"
          size="lg"
          weight="semibold"
          class="dashboardAudit__title"
        />
        <CBCard
          variant="outlined"
          :rounded="16"
          border-color="var(--border-light)"
          class="dashboardAudit__placeholder"
        >
          <div class="dashboardAudit__empty">
            <CBIcon icon="luc-scroll-text" size="2rem" color="var(--text-tertiary)" />
            <CBLabel
              text="Audit log disponivel na Fase 2 — quando acoes de edicao forem implementadas"
              size="sm"
              color="tertiary"
              class="dashboardAudit__emptyText"
            />
          </div>
        </CBCard>
      </section>

      <!-- Footer -->
      <footer class="dashboardFooter">
        <CBLabel text="Elas Podem — Painel Admin" size="xs" color="tertiary" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   DASHBOARD PAGE — LAYOUT
   ============================================ */
.dashboardPage {
  min-height: 100vh;
  background: var(--bg-light);
  font-family: var(--font-body);
  padding: 2rem;
}

.dashboardContainer {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ============================================
   HEADER
   ============================================ */
.dashboardHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboardHeader__info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dashboardHeader__title {
  font-family: var(--font-heading);
  color: var(--text-primary);
}

/* ============================================
   LOADING
   ============================================ */
.dashboardLoading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem 0;
}

.dashboardLoading__spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ============================================
   PAGES SECTION
   ============================================ */
.dashboardPages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboardPages__title {
  font-family: var(--font-heading);
  color: var(--text-primary);
}

/* ============================================
   PAGE CARD
   ============================================ */
.pageCard {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.pageCard:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.pageCard__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pageCard__iconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
}

.pageCard__iconWrapper--magenta {
  background: var(--gradient-magenta);
  box-shadow: var(--glow-magenta);
}

.pageCard__titleGroup {
  flex: 1;
}

.pageCard__status {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-top: 1px solid var(--border-light);
}

.pageCard__statusItem {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.pageCard__actions {
  display: flex;
  justify-content: flex-end;
}

/* ============================================
   AUDIT LOG PLACEHOLDER
   ============================================ */
.dashboardAudit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboardAudit__title {
  font-family: var(--font-heading);
  color: var(--text-primary);
}

.dashboardAudit__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
}

.dashboardAudit__emptyText {
  text-align: center;
  max-width: 300px;
}

/* ============================================
   FOOTER
   ============================================ */
.dashboardFooter {
  text-align: center;
  padding-top: 1rem;
  opacity: 0.6;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 640px) {
  .dashboardPage {
    padding: 1.5rem 1rem;
  }

  .dashboardHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .pageCard__status {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
