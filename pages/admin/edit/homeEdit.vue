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
import HomeCtaEditor from '@components/admin/HomeCtaEditor.vue';
import HomeSeoEditor from '@components/admin/HomeSeoEditor.vue';

import type { SaveResult } from '@appTypes/admin';

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
  validateCta,
  validateSeo,
} = useValidation();
const { hasChanges, markAsChanged, resetChanges, cleanupOldImage, canExit } = usePageEditor();
const { userData } = useAuth();

// ============== STATE ==============

/** Secoes expandidas (Set de sectionName) */
const expandedSections = ref<Set<string>>(new Set(['hero']));

/** Secoes com alteracoes nao salvas */
const changedSections = ref<Set<string>>(new Set());

/** Erros de validacao por secao */
const sectionErrors = ref<Record<string, string[]>>({});

/** URLs de imagens uploadadas temporariamente (para cleanup no exit) */
const tempUploadedImages = ref<string[]>([]);

/** Mensagem de sucesso apos save */
const successMessage = ref('');

// ============== SECTION CONFIG ==============

const sections = [
  { name: 'hero', title: 'Hero', icon: 'luc-star' },
  { name: 'mission', title: 'Missao', icon: 'luc-heart' },
  { name: 'programs', title: 'Programas', icon: 'luc-layout-grid' },
  { name: 'testimonials', title: 'Depoimentos', icon: 'luc-quote' },
  { name: 'supporters', title: 'Apoiadores', icon: 'luc-heart-handshake' },
  { name: 'contact', title: 'Contato', icon: 'luc-mail' },
  { name: 'cta', title: 'CTA', icon: 'luc-megaphone' },
  { name: 'seo', title: 'SEO', icon: 'luc-search' },
] as const;

// ============== VALIDATORS MAP ==============

const validators: Record<string, (data: Record<string, unknown>) => { isValid: boolean; errors: string[] }> = {
  hero: (data) => validateHero(data),
  mission: (data) => validateMission(data),
  programs: () => validatePrograms(forms.value?.programs?.editable as unknown as Record<string, unknown>[]),
  testimonials: () => validateTestimonials(forms.value?.testimonials?.editable as unknown as Record<string, unknown>[]),
  supporters: () => validateSupporters(forms.value?.supporters?.editable as unknown as Record<string, unknown>[]),
  contact: (data) => validateContact(data),
  cta: (data) => validateCta(data),
  seo: (data) => validateSeo(data),
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

  const saveResult: SaveResult = await saveSection(sectionName as any);

  if (saveResult.success) {
    changedSections.value.delete(sectionName);
    if (changedSections.value.size === 0) {
      resetChanges();
    }
    successMessage.value = saveResult.message;
    setTimeout(() => { successMessage.value = ''; }, 3000);
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
            <CBLabel text="Editar Home" tag="h1" size="xl" weight="bold" class="homeEditHeader__title" />
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
        <CBIcon icon="luc-loader-2" size="1.5rem" color="var(--text-tertiary)" class="homeEditLoading__spinner" />
        <CBLabel text="Carregando dados da pagina..." size="sm" color="tertiary" />
      </div>

      <!-- Sections -->
      <div v-else class="homeEditSections">
        <!-- Hero -->
        <HomeEditorSection
          title="Hero"
          icon="luc-star"
          section-name="hero"
          :expanded="expandedSections.has('hero')"
          :errors="sectionErrors.hero ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has('hero')"
          @toggle="toggleSection('hero')"
          @save="handleSave('hero')"
          @discard="handleDiscard('hero')"
        >
          <HomeHeroEditor
            v-if="forms"
            :forms="(forms as any).hero"
            @changed="markSectionChanged('hero')"
          />
        </HomeEditorSection>

        <!-- Missao -->
        <HomeEditorSection
          title="Missao"
          icon="luc-heart"
          section-name="mission"
          :expanded="expandedSections.has('mission')"
          :errors="sectionErrors.mission ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has('mission')"
          @toggle="toggleSection('mission')"
          @save="handleSave('mission')"
          @discard="handleDiscard('mission')"
        >
          <HomeMissionEditor
            v-if="forms"
            :forms="(forms as any).mission"
            @changed="markSectionChanged('mission')"
            @uploaded="handleImageUploaded"
          />
        </HomeEditorSection>

        <!-- Programas -->
        <HomeEditorSection
          title="Programas"
          icon="luc-layout-grid"
          section-name="programs"
          :expanded="expandedSections.has('programs')"
          :errors="sectionErrors.programs ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has('programs')"
          @toggle="toggleSection('programs')"
          @save="handleSave('programs')"
          @discard="handleDiscard('programs')"
        >
          <HomeProgramsEditor
            v-if="forms"
            :forms="(forms as any).programs"
            @changed="markSectionChanged('programs')"
          />
        </HomeEditorSection>

        <!-- Depoimentos -->
        <HomeEditorSection
          title="Depoimentos"
          icon="luc-quote"
          section-name="testimonials"
          :expanded="expandedSections.has('testimonials')"
          :errors="sectionErrors.testimonials ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has('testimonials')"
          @toggle="toggleSection('testimonials')"
          @save="handleSave('testimonials')"
          @discard="handleDiscard('testimonials')"
        >
          <HomeTestimonialsEditor
            v-if="forms"
            :forms="(forms as any).testimonials"
            @changed="markSectionChanged('testimonials')"
            @uploaded="handleImageUploaded"
          />
        </HomeEditorSection>

        <!-- Apoiadores -->
        <HomeEditorSection
          title="Apoiadores"
          icon="luc-heart-handshake"
          section-name="supporters"
          :expanded="expandedSections.has('supporters')"
          :errors="sectionErrors.supporters ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has('supporters')"
          @toggle="toggleSection('supporters')"
          @save="handleSave('supporters')"
          @discard="handleDiscard('supporters')"
        >
          <HomeSupportersEditor
            v-if="forms"
            :forms="(forms as any).supporters"
            @changed="markSectionChanged('supporters')"
            @uploaded="handleImageUploaded"
          />
        </HomeEditorSection>

        <!-- Contato -->
        <HomeEditorSection
          title="Contato"
          icon="luc-mail"
          section-name="contact"
          :expanded="expandedSections.has('contact')"
          :errors="sectionErrors.contact ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has('contact')"
          @toggle="toggleSection('contact')"
          @save="handleSave('contact')"
          @discard="handleDiscard('contact')"
        >
          <HomeContactEditor
            v-if="forms"
            :forms="(forms as any).contact"
            @changed="markSectionChanged('contact')"
          />
        </HomeEditorSection>

        <!-- CTA -->
        <HomeEditorSection
          title="CTA"
          icon="luc-megaphone"
          section-name="cta"
          :expanded="expandedSections.has('cta')"
          :errors="sectionErrors.cta ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has('cta')"
          @toggle="toggleSection('cta')"
          @save="handleSave('cta')"
          @discard="handleDiscard('cta')"
        >
          <HomeCtaEditor
            v-if="forms"
            :forms="(forms as any).cta"
            @changed="markSectionChanged('cta')"
          />
        </HomeEditorSection>

        <!-- SEO -->
        <HomeEditorSection
          title="SEO"
          icon="luc-search"
          section-name="seo"
          :expanded="expandedSections.has('seo')"
          :errors="sectionErrors.seo ?? []"
          :is-saving="isSaving"
          :has-changes="changedSections.has('seo')"
          @toggle="toggleSection('seo')"
          @save="handleSave('seo')"
          @discard="handleDiscard('seo')"
        >
          <HomeSeoEditor
            v-if="forms"
            :forms="(forms as any).seo"
            @changed="markSectionChanged('seo')"
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
  color: var(--color-oliva, #88A201);
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
