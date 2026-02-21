<script setup lang="ts">
/**
 * 🧩 homeEdit — Editor da homepage (orquestrador).
 *
 * Coordena 8 secoes: load, save, discard, validacao, navigation guard.
 * Cada secao e um componente independente dentro de HomeEditorSection (accordion).
 */

import { CBButton, CBIcon, CBLabel } from '@cb/components';
import '@cb/components/style.css';
import '@assets/css/theme.css';

// Section editors
import HomeEditorSection from '@components/admin/HomeEditorSection.vue';
import HomeHeroEditor from '@components/admin/HomeHeroEditor.vue';
import HomeMissionEditor from '@components/admin/HomeMissionEditor.vue';
import HomeProgramsEditor from '@components/admin/HomeProgramsEditor.vue';
import HomeTestimonialsEditor from '@components/admin/HomeTestimonialsEditor.vue';
import HomeSupportersEditor from '@components/admin/HomeSupportersEditor.vue';
import HomeContactEditor from '@components/admin/HomeContactEditor.vue';
import HomeValuesEditor from '@components/admin/HomeValuesEditor.vue';
import HomeCtaEditor from '@components/admin/HomeCtaEditor.vue';
import HomeSeoEditor from '@components/admin/HomeSeoEditor.vue';

import type { Component } from 'vue';
import type { ISaveResult } from '@appTypes/admin';

// ============== PAGE META ==============

definePageMeta({
  layout: false,
});

// ============== COMPOSABLES ==============

const { forms, isLoading, isSaving, loadPageData, saveSection, resetSection } = useHomePageData();
const {
  validateHero,
  validateMission,
  validatePrograms,
  validateTestimonials,
  validateSupporters,
  validateContact,
  validateValues,
  validateCta,
  validateSeo,
} = useValidation();
const { hasChanges, markAsChanged, resetChanges, canExit } = usePageEditor();
const { userData } = useAuth();

// ============== STATE ==============

const expandedSections = ref<Set<string>>(new Set(['hero']));
const changedSections = ref<Set<string>>(new Set());
const sectionErrors = ref<Record<string, string[]>>({});
const tempUploadedImages = ref<string[]>([]);
const successMessage = ref('');

// ============== SECTION CONFIG ==============

interface ISectionConfig {
  name: string;
  title: string;
  icon: string;
  component: Component;
}

const sections: ISectionConfig[] = [
  { name: 'hero', title: 'Hero', icon: 'luc-star', component: HomeHeroEditor },
  { name: 'mission', title: 'Missao', icon: 'luc-heart', component: HomeMissionEditor },
  { name: 'programs', title: 'Programas', icon: 'luc-layout-grid', component: HomeProgramsEditor },
  {
    name: 'testimonials',
    title: 'Depoimentos',
    icon: 'luc-quote',
    component: HomeTestimonialsEditor,
  },
  {
    name: 'supporters',
    title: 'Apoiadores',
    icon: 'luc-heart-handshake',
    component: HomeSupportersEditor,
  },
  { name: 'contact', title: 'Contato', icon: 'luc-mail', component: HomeContactEditor },
  { name: 'values', title: 'Valores', icon: 'luc-heart', component: HomeValuesEditor },
  { name: 'cta', title: 'CTA', icon: 'luc-megaphone', component: HomeCtaEditor },
  { name: 'seo', title: 'SEO', icon: 'luc-search', component: HomeSeoEditor },
];

// ============== VALIDATORS MAP ==============

const validators: Record<string, (data: any) => { isValid: boolean; errors: string[] }> = {
  hero: validateHero,
  mission: validateMission,
  programs: validatePrograms,
  testimonials: validateTestimonials,
  supporters: validateSupporters,
  contact: validateContact,
  values: validateValues,
  cta: validateCta,
  seo: validateSeo,
};

// ============== METHODS ==============

function toggleSection(name: string): void {
  if (expandedSections.value.has(name)) {
    expandedSections.value.delete(name);
  } else {
    expandedSections.value.add(name);
  }
}

function markSectionChanged(name: string): void {
  changedSections.value.add(name);
  markAsChanged();
}

/** Obtem dados do forms para validacao (trata arrays vs objetos) */
function getValidationData(sectionName: string): Record<string, unknown> {
  const section = (forms.value as Record<string, any>)?.[sectionName];
  if (!section) return {};
  return section.editable as Record<string, unknown>;
}

async function handleSave(sectionName: string): Promise<void> {
  successMessage.value = '';
  const data = getValidationData(sectionName);
  const validator = validators[sectionName];

  if (validator) {
    const result = validator(data);
    if (!result.isValid) {
      sectionErrors.value[sectionName] = result.errors;
      return;
    }
  }

  sectionErrors.value[sectionName] = [];

  const saveResult: ISaveResult = await saveSection(sectionName as any);

  if (saveResult.success) {
    changedSections.value.delete(sectionName);
    if (changedSections.value.size === 0) {
      resetChanges();
    }
    successMessage.value = saveResult.message;
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } else {
    sectionErrors.value[sectionName] = [saveResult.message];
  }
}

function handleDiscard(sectionName: string): void {
  resetSection(sectionName as any);
  changedSections.value.delete(sectionName);
  sectionErrors.value[sectionName] = [];
  if (changedSections.value.size === 0) {
    resetChanges();
  }
}

function handleImageUploaded(url: string): void {
  tempUploadedImages.value.push(url);
}

function navigateBack(): void {
  navigateTo('/admin');
}

// ============== NAVIGATION GUARD ==============

onBeforeRouteLeave(async () => {
  return await canExit(tempUploadedImages);
});

function handleBeforeUnload(e: BeforeUnloadEvent): void {
  if (hasChanges.value) {
    e.preventDefault();
  }
}

// ============== LIFECYCLE ==============

onMounted(async () => {
  await loadPageData();
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <div class="homeEditPage">
    <div class="homeEditContainer">
      <!-- Header -->
      <header class="homeEditHeader">
        <div class="homeEditHeader__left">
          <CBButton
            variant="outline"
            size="sm"
            prepend-icon="luc-arrow-left"
            :rounded="10"
            :color="'var(--text-tertiary)'"
            @click="navigateBack"
          />
          <div>
            <CBLabel
              text="Editar Home"
              tag="h1"
              size="xl"
              weight="bold"
              class="homeEditHeader__title"
            />
            <CBLabel
              v-if="userData?.displayName"
              :text="`Editando como ${userData.displayName}`"
              size="xs"
              color="tertiary"
            />
          </div>
        </div>
      </header>

      <!-- Success message -->
      <div v-if="successMessage" class="homeEditSuccess">
        <CBIcon icon="luc-check-circle" size="1rem" color="var(--color-oliva)" />
        <span class="homeEditSuccess__text">{{ successMessage }}</span>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="homeEditLoading">
        <CBIcon
          icon="luc-loader-2"
          size="1.5rem"
          color="var(--text-tertiary)"
          class="homeEditLoading__spinner"
        />
        <CBLabel text="Carregando dados da pagina..." size="sm" color="tertiary" />
      </div>

      <!-- Sections -->
      <div v-else class="homeEditSections">
        <HomeEditorSection
          v-for="section in sections"
          :key="section.name"
          :title="section.title"
          :icon="section.icon"
          :section-name="section.name"
          :expanded="expandedSections.has(section.name)"
          :errors="sectionErrors[section.name] ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has(section.name)"
          @toggle="toggleSection(section.name)"
          @save="handleSave(section.name)"
          @discard="handleDiscard(section.name)"
        >
          <component
            :is="section.component"
            v-if="forms"
            :forms="(forms as any)[section.name]"
            @changed="markSectionChanged(section.name)"
            @uploaded="handleImageUploaded"
          />
        </HomeEditorSection>
      </div>

      <!-- Footer -->
      <footer class="homeEditFooter">
        <CBLabel text="Elas Podem — Editor de Pagina" size="xs" color="tertiary" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   HOME EDIT PAGE — LAYOUT
   ============================================ */
.homeEditPage {
  min-height: 100vh;
  background: var(--bg-light);
  font-family: var(--font-body);
  padding: 2rem;
}

.homeEditContainer {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ============================================
   HEADER
   ============================================ */
.homeEditHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.homeEditHeader__left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.homeEditHeader__title {
  font-family: var(--font-heading);
  color: var(--text-primary);
}

/* ============================================
   SUCCESS MESSAGE
   ============================================ */
.homeEditSuccess {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(136, 162, 1, 0.08);
  border: 1px solid rgba(136, 162, 1, 0.2);
  border-radius: 10px;
}

.homeEditSuccess__text {
  font-size: 0.875rem;
  color: var(--color-oliva, #88a201);
  font-family: var(--font-body);
}

/* ============================================
   LOADING
   ============================================ */
.homeEditLoading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem 0;
}

.homeEditLoading__spinner {
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
   SECTIONS
   ============================================ */
.homeEditSections {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ============================================
   FOOTER
   ============================================ */
.homeEditFooter {
  text-align: center;
  padding-top: 1rem;
  opacity: 0.6;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 640px) {
  .homeEditPage {
    padding: 1.5rem 1rem;
  }

  .homeEditHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
