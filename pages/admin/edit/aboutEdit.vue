<script setup lang="ts">
/**
 * 🧩 aboutEdit — Editor da página About (orquestrador).
 *
 * Coordena 6 seções: load, save, discard, validação, navigation guard.
 * Cada seção é um componente independente dentro de HomeEditorSection (accordion).
 */

import { useI18n } from 'vue-i18n';
import { CBBadge, CBIcon, CBLabel } from '@cb/components';

// Section editors
import HomeEditorSection from '@components/admin/HomeEditorSection.vue';
import AboutHeroEditor from '@components/admin/AboutHeroEditor.vue';
import AboutTimelineEditor from '@components/admin/AboutTimelineEditor.vue';
import AboutTeamEditor from '@components/admin/AboutTeamEditor.vue';
import AboutPillarsEditor from '@components/admin/AboutPillarsEditor.vue';
import AboutCtaEditor from '@components/admin/AboutCtaEditor.vue';
import HomeSeoEditor from '@components/admin/HomeSeoEditor.vue';

import type { ISectionConfig, ISaveResult } from '@appTypes/admin';

// ============== PAGE META ==============

definePageMeta({
  layout: 'admin',
});

// ============== COMPOSABLES ==============

const { t } = useI18n();
const { forms, isLoading, isSaving, loadPageData, saveSection, resetSection } =
  useAboutPageData();
const {
  validateAboutHero,
  validateAboutTimeline,
  validateAboutTeam,
  validateAboutPillars,
  validateAboutCta,
  validateSeo,
} = useValidation();
const { hasChanges, markAsChanged, resetChanges, canExit } = usePageEditor();

// ============== STATE ==============

const expandedSections = ref<Set<string>>(new Set(['hero']));
const changedSections = ref<Set<string>>(new Set());
const sectionErrors = ref<Record<string, string[]>>({});
const tempUploadedImages = ref<string[]>([]);
const successMessage = ref('');

// ============== SECTION CONFIG ==============

const sections = computed<ISectionConfig[]>(() => [
  {
    name: 'hero',
    title: t('admin.aboutEdit.sections.hero'),
    icon: 'luc-star',
    component: AboutHeroEditor,
  },
  {
    name: 'timeline',
    title: t('admin.aboutEdit.sections.timeline'),
    icon: 'luc-calendar',
    component: AboutTimelineEditor,
  },
  {
    name: 'team',
    title: t('admin.aboutEdit.sections.team'),
    icon: 'luc-users',
    component: AboutTeamEditor,
  },
  {
    name: 'pillars',
    title: t('admin.aboutEdit.sections.pillars'),
    icon: 'luc-heart',
    component: AboutPillarsEditor,
  },
  {
    name: 'cta',
    title: t('admin.aboutEdit.sections.cta'),
    icon: 'luc-megaphone',
    component: AboutCtaEditor,
  },
  {
    name: 'seo',
    title: t('admin.aboutEdit.sections.seo'),
    icon: 'luc-search',
    component: HomeSeoEditor,
  },
]);

// ============== VALIDATORS MAP ==============

const validators: Record<string, (data: any) => { isValid: boolean; errors: string[] }> = {
  hero: validateAboutHero,
  timeline: validateAboutTimeline,
  team: validateAboutTeam,
  pillars: validateAboutPillars,
  cta: validateAboutCta,
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

/** Obtém dados do forms para validação (trata arrays vs objetos) */
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
  <div class="aboutEditContainer">
    <!-- Header -->
    <header class="aboutEditHeader">
      <CBBadge
        :content="$t('admin.aboutEdit.badge')"
        variant="outline"
        :icon-size="14"
        weight="bold"
        size="xs"
        bg-color="rgba(92, 26, 42, 0.06)"
        text-color="var(--color-wine-mid)"
        class="aboutEditHeader__badge"
      />
      <CBLabel
        :text="$t('admin.aboutEdit.title')"
        tag="h1"
        weight="black"
        class="aboutEditHeader__title"
      />
      <CBLabel :text="$t('admin.aboutEdit.subtitle')" size="md" color="secondary" />
    </header>

    <!-- Success message -->
    <div v-if="successMessage" class="aboutEditSuccess">
      <CBIcon icon="luc-check-circle" size="1rem" color="var(--color-olive)" />
      <span class="aboutEditSuccess__text">{{ successMessage }}</span>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="aboutEditLoading">
      <CBIcon
        icon="luc-loader-2"
        size="1.5rem"
        color="var(--text-tertiary)"
        class="aboutEditLoading__spinner"
      />
      <CBLabel :text="$t('admin.aboutEdit.loading')" size="sm" color="tertiary" />
    </div>

    <!-- Sections -->
    <div v-else class="aboutEditSections">
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
  </div>
</template>

<style scoped>
/* ============================================
   CONTAINER
   ============================================ */
.aboutEditContainer {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ============================================
   HEADER
   ============================================ */
.aboutEditHeader {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.aboutEditHeader__badge {
  letter-spacing: 1.5px;
  margin-bottom: 14px;
}

.aboutEditHeader__title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

/* ============================================
   SUCCESS MESSAGE
   ============================================ */
.aboutEditSuccess {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(136, 162, 1, 0.08);
  border: 1px solid rgba(136, 162, 1, 0.2);
  border-radius: 10px;
}

.aboutEditSuccess__text {
  font-size: 0.875rem;
  color: var(--color-olive, #88a201);
  font-family: var(--font-body);
}

/* ============================================
   LOADING
   ============================================ */
.aboutEditLoading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem 0;
}

.aboutEditLoading__spinner {
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
.aboutEditSections {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
