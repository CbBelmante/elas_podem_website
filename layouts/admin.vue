<script setup lang="ts">
/**
 * Layout Admin — Sidebar persistente com CBSidebar
 *
 * Usado por todas as paginas admin (exceto login que usa layout: false).
 * Sidebar com navegacao, user info no footer, glows decorativos no main.
 */

import { useI18n } from 'vue-i18n';
import { CBSidebar, CBBadge, CBIcon } from '@cb/components';
import type { ISidebarMenuGroup } from '@cb/components';

import { ADMIN_ROLE_DISPLAY_NAMES } from '@definitions/adminRoles';
import type { AdminRole } from '@definitions/adminRoles';

// ============== COMPOSABLES ==============

const { t } = useI18n();
const { userData, signOut } = useAuth();

// ============== STATE ==============

const isCollapsed = ref(false);

// ============== COMPUTED ==============

const roleDisplayName = computed(() => {
  if (!userData.value?.role) return '';
  return ADMIN_ROLE_DISPLAY_NAMES[userData.value.role as AdminRole] ?? userData.value.role;
});

const userName = computed(() => userData.value?.displayName ?? 'Admin');

// ============== SIDEBAR CONFIG ==============

const sidebarItems = computed<ISidebarMenuGroup[]>(() => [
  {
    label: t('admin.layout.groupGeneral'),
    items: [{ label: t('admin.layout.dashboard'), icon: 'luc-layout-dashboard', to: '/admin' }],
  },
  {
    label: t('admin.layout.groupPages'),
    items: [{ label: t('admin.layout.homePage'), icon: 'luc-home', to: '/admin/edit/homeEdit' }],
  },
]);

// ============== METHODS ==============

const handleLogout = async (): Promise<void> => {
  await signOut();
};
</script>

<template>
  <div class="adminLayout">
    <CBSidebar
      :items="sidebarItems"
      :app-name="$t('admin.layout.appName')"
      :app-subtitle="$t('admin.layout.appSubtitle')"
      :collapsed="isCollapsed"
      placement="in-flow"
      location="left"
      bg-color="var(--glass-bg)"
      :blur="20"
      :expand-on-border-click="true"
      @update:collapsed="isCollapsed = $event"
    >
      <template #logo="{ isCollapsed: collapsed }">
        <div class="adminLayout__logo">
          <CBIcon icon="luc-heart" :size="collapsed ? 18 : 16" color="var(--color-rosa)" />
        </div>
      </template>

      <template #footer="{ isCollapsed: collapsed }">
        <div class="adminLayout__footer">
          <!-- User info -->
          <div class="adminLayout__user" :class="{ 'adminLayout__user--collapsed': collapsed }">
            <CBIcon icon="luc-user" :size="16" color="var(--text-secondary)" />
            <template v-if="!collapsed">
              <div class="adminLayout__userInfo">
                <span class="adminLayout__userName">{{ userName }}</span>
                <CBBadge
                  v-if="roleDisplayName"
                  :content="roleDisplayName"
                  variant="outline"
                  size="xs"
                />
              </div>
            </template>
          </div>

          <!-- Logout -->
          <button
            class="adminLayout__logoutBtn"
            :class="{ 'adminLayout__logoutBtn--collapsed': collapsed }"
            @click="handleLogout"
          >
            <CBIcon icon="luc-log-out" :size="16" />
            <span v-if="!collapsed">{{ $t('admin.layout.logout') }}</span>
          </button>
        </div>
      </template>
    </CBSidebar>

    <main class="adminLayout__main">
      <!-- Glows decorativos -->
      <div class="adminLayout__glow adminLayout__glow--1" />
      <div class="adminLayout__glow adminLayout__glow--2" />
      <div class="adminLayout__glow adminLayout__glow--3" />
      <div class="adminLayout__glow adminLayout__glow--4" />

      <!-- Dots decorativos (como na home) -->
      <div class="adminLayout__dot adminLayout__dot--1" />
      <div class="adminLayout__dot adminLayout__dot--2" />
      <div class="adminLayout__dot adminLayout__dot--3" />
      <div class="adminLayout__dot adminLayout__dot--4" />
      <div class="adminLayout__dot adminLayout__dot--5" />

      <div class="adminLayout__content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ============================================
   LAYOUT ROOT
   ============================================ */
.adminLayout {
  display: flex;
  height: 100vh;
  background: var(--bg-hero);
  font-family: var(--font-body);
}

/* ============================================
   LOGO
   ============================================ */
.adminLayout__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(var(--color-rosa-rgb), 0.1);
  flex-shrink: 0;
}

/* ============================================
   FOOTER (USER + LOGOUT)
   ============================================ */
.adminLayout__footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.adminLayout__user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 6px;
}

.adminLayout__user--collapsed {
  justify-content: center;
}

.adminLayout__userInfo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
  flex: 1;
}

.adminLayout__userName {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.adminLayout__logoutBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--cb-destructive, #ef4444);
  border-radius: 6px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.adminLayout__logoutBtn:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.adminLayout__logoutBtn--collapsed {
  justify-content: center;
}

/* ============================================
   MAIN CONTENT
   ============================================ */
.adminLayout__main {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.adminLayout__content {
  position: relative;
  z-index: 1;
  padding: 3rem 2.5rem;
  height: 100%;
  overflow-y: auto;
}

/* ============================================
   GLOWS DECORATIVOS
   ============================================ */
.adminLayout__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.adminLayout__glow--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(var(--color-rosa-rgb), 0.12) 0%, transparent 70%);
  top: -150px;
  right: -120px;
}

.adminLayout__glow--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(var(--color-vinho-medio-rgb), 0.1) 0%, transparent 70%);
  bottom: -100px;
  left: -100px;
}

.adminLayout__glow--3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(var(--color-roxo-acento-rgb), 0.07) 0%, transparent 70%);
  top: 35%;
  right: 20%;
}

.adminLayout__glow--4 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(var(--color-coral-rgb), 0.08) 0%, transparent 70%);
  top: 15%;
  left: 10%;
}

/* ============================================
   DOTS DECORATIVOS (padrao home)
   ============================================ */
@keyframes adminFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.adminLayout__dot {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: adminFloat 5s ease-in-out infinite;
}

.adminLayout__dot--1 {
  width: 10px;
  height: 10px;
  background: var(--color-coral-claro);
  top: 12%;
  right: 15%;
  opacity: 0.4;
}

.adminLayout__dot--2 {
  width: 8px;
  height: 8px;
  background: var(--color-vinho-medio);
  top: 55%;
  right: 8%;
  opacity: 0.3;
  animation-delay: 1.2s;
}

.adminLayout__dot--3 {
  width: 14px;
  height: 14px;
  background: var(--color-nude-quente);
  bottom: 20%;
  left: 18%;
  opacity: 0.5;
  animation-delay: 2.5s;
}

.adminLayout__dot--4 {
  width: 6px;
  height: 6px;
  background: var(--color-roxo-acento);
  top: 30%;
  left: 40%;
  opacity: 0.35;
  animation-delay: 3.2s;
}

.adminLayout__dot--5 {
  width: 12px;
  height: 12px;
  background: var(--color-rosa);
  bottom: 35%;
  right: 30%;
  opacity: 0.15;
  animation-delay: 0.8s;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 640px) {
  .adminLayout__content {
    padding: 2rem 1.25rem;
  }
}
</style>
