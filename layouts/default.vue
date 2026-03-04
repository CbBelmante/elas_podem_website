<script setup lang="ts">
/**
 * Layout default — paginas publicas.
 * Navbar + Footer compartilhados. Admin usa layout: false.
 */

import { computed } from 'vue';
import { CBImage, CBNavbar, type INavbarMenuItem } from '@cb/components';
import { useI18n } from 'vue-i18n';

// ============== NAVBAR ==============

const route = useRoute();
const { t } = useI18n();

const currentPath = computed(() => route.path);

const menuItems = computed<INavbarMenuItem[]>(() => [
  { label: t('navbar.home'), to: '/' },
  { label: t('navbar.about'), to: '/about' },
  { label: t('navbar.projects'), to: '/projetos' },
]);

const handleNavigate = ({ path }: { path: string }) => {
  navigateTo(path);
};

const handleLogoClick = () => {
  navigateTo('/');
};
</script>

<template>
  <div>
    <CBNavbar
      :menu-items="menuItems"
      :current-path="currentPath"
      menu-style="underline"
      placement="fixed"
      :elevation="2"
      mobile-mode="popover"
      class="customNavbar"
      @navigate="handleNavigate"
      @logo-click="handleLogoClick"
    >
      <template #logo>
        <CBImage
          src="/logo-elas-podem.png"
          alt="Elas Podem"
          size="auto"
          :height="48"
          fit="contain"
          :eager="true"
          class="navbarLogo"
        />
      </template>
    </CBNavbar>

    <slot />
    <AppFooter />
  </div>
</template>

<style scoped>
.customNavbar :deep(.cbNavbar) {
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.customNavbar :deep(.cbNavbar__logoSection) {
  margin-left: 80px;
}

.customNavbar :deep(.cbNavbar__menuContainer) {
  justify-content: center;
}

.navbarLogo {
  height: 48px;
  width: auto;
  cursor: pointer;
  transition: transform 0.35s ease;
}

.navbarLogo:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .customNavbar :deep(.cbNavbar__logoSection) {
    margin-left: 1rem;
  }

  .navbarLogo {
    height: 40px;
  }
}
</style>
