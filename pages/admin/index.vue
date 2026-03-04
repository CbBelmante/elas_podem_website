<!--
  🧩 Admin Dashboard - Painel administrativo principal

  Hub de navegacao com status das paginas e acoes por role.
  Carrega metadados (lastUpdated, updatedByName) do Firestore.

  TODO (Fase 2):
  - Audit log: secao com ultimas acoes lidas de admin_logs.
  - Cards de paginas adicionais (sobre, contato, etc.) conforme forem criadas.
-->

<script setup lang="ts">
import { CBBadge, CBCard, CBIcon, CBLabel, formatDayjs, DATE_TIME_BR } from '@cb/components';
import AdminPageCard from '@components/admin/AdminPageCard.vue';

// ============== PAGE META ==============

definePageMeta({
  layout: 'admin',
});

// ============== COMPOSABLES ==============

const { permissions, userData } = useAuth();
const { originalData, isLoading, loadPageData } = useHomePageData();
const { originalData: aboutOriginalData, isLoading: aboutIsLoading, loadPageData: loadAboutPageData } = useAboutPageData();

// ============== COMPUTED ==============

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
  return formatDayjs(homeStatus.value?.lastUpdated, DATE_TIME_BR);
});

/** Metadados de status do documento about */
const aboutStatus = computed(() => {
  const data = aboutOriginalData.value as Record<string, unknown> | null;
  if (!data) return null;

  return {
    lastUpdated: data.lastUpdated as string | null,
    updatedByName: data.updatedByName as string | null,
  };
});

/** Data formatada da última edição do about */
const aboutLastEditFormatted = computed(() => {
  return formatDayjs(aboutStatus.value?.lastUpdated, DATE_TIME_BR);
});

const userName = computed(() => userData.value?.displayName ?? 'Admin');

// ============== LIFECYCLE ==============

onMounted(async () => {
  await Promise.all([loadPageData(), loadAboutPageData()]);
});
</script>

<template>
  <div class="dashboardContainer">
    <!-- Header -->
    <header class="dashboardHeader">
      <CBBadge
        :content="$t('admin.dashboard.badge')"
        variant="outline"
        :icon-size="14"
        weight="bold"
        size="xs"
        bg-color="rgba(92, 26, 42, 0.06)"
        text-color="var(--color-wine-mid)"
        class="dashboardHeader__badge"
      />
      <CBLabel
        :text="$t('admin.dashboard.title')"
        tag="h1"
        weight="black"
        class="dashboardHeader__title"
      />
      <CBLabel
        :text="$t('admin.dashboard.welcome', { name: userName })"
        size="md"
        color="secondary"
        class="dashboardHeader__subtitle"
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
      <CBLabel :text="$t('admin.common.loading')" size="sm" color="tertiary" />
    </div>

    <!-- Cards de paginas -->
    <section v-else class="dashboardPages">
      <div class="dashboardPages__header">
        <CBBadge
          :content="$t('admin.dashboard.contentBadge')"
          variant="outline"
          :icon-size="14"
          weight="bold"
          size="xs"
          bg-color="rgba(92, 26, 42, 0.06)"
          text-color="var(--color-wine-mid)"
          class="sectionBadge"
        />
        <CBLabel
          :text="$t('admin.dashboard.pagesTitle')"
          tag="h2"
          weight="black"
          class="dashboardPages__title"
        />
      </div>

      <!-- Card: Home Page -->
      <AdminPageCard
        :title="$t('admin.dashboard.homePageTitle')"
        :description="$t('admin.dashboard.homePageDesc')"
        icon="luc-home"
        color="wine-rose"
        edit-url="/admin/edit/homeEdit"
        :can-edit="permissions?.canEdit ?? false"
        :last-editor-name="homeStatus?.updatedByName"
        :last-edit-date="lastEditFormatted"
      />

      <!-- Card: About Page -->
      <AdminPageCard
        :title="$t('admin.dashboard.aboutPageTitle')"
        :description="$t('admin.dashboard.aboutPageDesc')"
        icon="luc-users"
        color="olive"
        edit-url="/admin/edit/aboutEdit"
        :can-edit="permissions?.canEdit ?? false"
        :last-editor-name="aboutStatus?.updatedByName"
        :last-edit-date="aboutLastEditFormatted"
      />
    </section>

    <!-- Audit Log placeholder (TODO Fase 2) -->
    <section v-if="permissions?.canViewLogs" class="dashboardAudit">
      <div class="dashboardAudit__header">
        <CBBadge
          :content="$t('admin.dashboard.activityBadge')"
          variant="outline"
          :icon-size="14"
          weight="bold"
          size="xs"
          bg-color="rgba(92, 26, 42, 0.06)"
          text-color="var(--color-wine-mid)"
          class="sectionBadge"
        />
        <CBLabel
          :text="$t('admin.dashboard.activityTitle')"
          tag="h2"
          weight="black"
          class="dashboardAudit__title"
        />
      </div>
      <CBCard
        variant="outlined"
        :rounded="20"
        bg-color="#FFFFFF"
        border-color="rgba(92, 26, 42, 0.06)"
        class="dashboardAudit__placeholder"
      >
        <div class="dashboardAudit__empty">
          <CBIcon icon="luc-scroll-text" size="2rem" color="var(--color-nude-warm)" />
          <CBLabel
            :text="$t('admin.dashboard.activityPlaceholder')"
            size="sm"
            color="tertiary"
            class="dashboardAudit__emptyText"
          />
        </div>
      </CBCard>
    </section>
  </div>
</template>

<style scoped>
/* ============================================
   DASHBOARD CONTAINER
   ============================================ */
.dashboardContainer {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* ============================================
   HEADER
   ============================================ */
.dashboardHeader {
  display: flex;
  flex-direction: column;
}

.dashboardHeader__badge {
  letter-spacing: 1.5px;
  margin-bottom: 14px;
}

.dashboardHeader__title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.dashboardHeader__subtitle {
  line-height: 1.6;
}

/* ============================================
   SHARED SECTION BADGE
   ============================================ */
.sectionBadge {
  letter-spacing: 1.5px;
  margin-bottom: 10px;
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
  gap: 1.25rem;
}

.dashboardPages__header {
  display: flex;
  flex-direction: column;
}

.dashboardPages__title {
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

/* ============================================
   AUDIT LOG
   ============================================ */
.dashboardAudit {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dashboardAudit__header {
  display: flex;
  flex-direction: column;
}

.dashboardAudit__title {
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.dashboardAudit__placeholder {
  box-shadow: var(--shadow-sm);
}

.dashboardAudit__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2.5rem;
}

.dashboardAudit__emptyText {
  text-align: center;
  max-width: 300px;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 640px) {
  .dashboardHeader__title {
    font-size: 1.75rem;
  }
}
</style>
