<script setup lang="ts">
/**
 * 🧩 AdminIconSelect — Seletor de icone Lucide com busca e categorias.
 *
 * Grid scrollavel de ~80 icones curados, filtro por categoria (chips),
 * busca por texto (label traduzido + value). Preview do selecionado.
 *
 * Segue padrao JustPrime CbIconSelector adaptado para cbcomponents.
 */

import { useI18n } from 'vue-i18n';
import { CBIcon, CBInput, CBLabel } from '@cb/components';
import {
  ALL_LUCIDE_ICONS,
  LUCIDE_CATEGORIES,
  findIconByValue,
  type LucideIconCategory,
} from '@definitions/lucideIconData';

// ============== PROPS ==============

interface Props {
  modelValue: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
});

// ============== EMITS ==============

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// ============== I18N ==============

const { t } = useI18n();

// ============== STATE ==============

const searchQuery = ref('');
const selectedCategory = ref<LucideIconCategory | null>(null);

// ============== COMPUTED ==============

/** Mapa de label i18n key → texto traduzido (para busca) */
const translatedLabels = computed(() => {
  const map = new Map<string, string>();
  for (const icon of ALL_LUCIDE_ICONS) {
    map.set(icon.label, t(icon.label));
  }
  return map;
});

/** Icones filtrados por busca + categoria */
const filteredIcons = computed(() => {
  let icons = ALL_LUCIDE_ICONS;

  if (selectedCategory.value) {
    icons = icons.filter((i) => i.category === selectedCategory.value);
  }

  if (searchQuery.value.trim()) {
    const term = searchQuery.value.trim().toLowerCase();
    icons = icons.filter((icon) => {
      const translated = translatedLabels.value.get(icon.label)?.toLowerCase() ?? '';
      return (
        translated.includes(term) ||
        icon.value.toLowerCase().includes(term) ||
        icon.category.toLowerCase().includes(term)
      );
    });
  }

  return icons;
});

/** Icone selecionado (para preview) */
const selectedIcon = computed(() => findIconByValue(props.modelValue));

// ============== METHODS ==============

function select(value: string): void {
  emit('update:modelValue', value);
}

function toggleCategory(cat: LucideIconCategory): void {
  selectedCategory.value = selectedCategory.value === cat ? null : cat;
}
</script>

<template>
  <div class="iconSelect">
    <!-- Busca -->
    <CBInput
      v-model="searchQuery"
      :label="label || $t('admin.iconSelect.label')"
      :placeholder="$t('admin.iconSelect.search')"
      prepend-icon="luc-search"
      size="sm"
    />

    <!-- Filtro de categorias -->
    <div class="iconSelect__categories">
      <button
        type="button"
        class="iconSelect__chip"
        :class="{ 'iconSelect__chip--active': selectedCategory === null }"
        @click="selectedCategory = null"
      >
        {{ $t('admin.iconSelect.all') }}
      </button>
      <button
        v-for="cat in LUCIDE_CATEGORIES"
        :key="cat"
        type="button"
        class="iconSelect__chip"
        :class="{ 'iconSelect__chip--active': selectedCategory === cat }"
        @click="toggleCategory(cat)"
      >
        {{ $t(`admin.iconSelect.categories.${cat}`) }}
      </button>
    </div>

    <!-- Grid de icones -->
    <div v-if="filteredIcons.length > 0" class="iconSelect__grid">
      <button
        v-for="icon in filteredIcons"
        :key="icon.value"
        type="button"
        class="iconSelect__item"
        :class="{ 'iconSelect__item--selected': modelValue === icon.value }"
        :title="$t(icon.label)"
        @click="select(icon.value)"
      >
        <CBIcon :icon="icon.value" size="1.25rem" />
        <span class="iconSelect__itemLabel">{{ $t(icon.label) }}</span>
      </button>
    </div>

    <!-- Sem resultados -->
    <div v-else class="iconSelect__empty">
      <CBIcon icon="luc-search-x" size="1.5rem" color="var(--text-tertiary)" />
      <CBLabel :text="$t('admin.iconSelect.noResults')" size="xs" class="iconSelect__emptyText" />
    </div>

    <!-- Preview do icone selecionado -->
    <div v-if="selectedIcon" class="iconSelect__preview">
      <div class="iconSelect__previewIcon">
        <CBIcon :icon="selectedIcon.value" size="1.5rem" color="var(--color-wine)" />
      </div>
      <div class="iconSelect__previewInfo">
        <CBLabel :text="$t(selectedIcon.label)" size="sm" weight="medium" />
        <span class="iconSelect__previewValue">{{ selectedIcon.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   CONTAINER
   ============================================ */
.iconSelect {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ============================================
   CATEGORIAS (chips)
   ============================================ */
.iconSelect__categories {
  display: flex;
  gap: 0.375rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: thin;
}

.iconSelect__chip {
  flex-shrink: 0;
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--border-light);
  border-radius: 999px;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.iconSelect__chip:hover {
  border-color: var(--color-wine);
  color: var(--color-wine);
}

.iconSelect__chip--active {
  background: var(--color-wine);
  border-color: var(--color-wine);
  color: #fff;
}

.iconSelect__chip--active:hover {
  color: #fff;
}

/* ============================================
   GRID
   ============================================ */
.iconSelect__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 0.375rem;
  max-height: 240px;
  overflow-y: auto;
  padding: 0.25rem;
  scrollbar-width: thin;
}

.iconSelect__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.25rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: rgba(var(--color-wine-rgb), 0.04);
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.iconSelect__item:hover {
  transform: scale(1.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.iconSelect__item--selected {
  border-color: var(--color-wine);
  transform: scale(1.04);
  background: rgba(var(--color-wine-rgb), 0.08);
}

.iconSelect__itemLabel {
  font-size: 0.5625rem;
  font-family: var(--font-body);
  color: var(--text-tertiary);
  text-align: center;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.iconSelect__item--selected .iconSelect__itemLabel {
  color: var(--color-wine);
  font-weight: 600;
}

/* ============================================
   EMPTY STATE
   ============================================ */
.iconSelect__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
}

.iconSelect__emptyText {
  color: var(--text-tertiary);
}

/* ============================================
   PREVIEW
   ============================================ */
.iconSelect__preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
  padding: 0.625rem 0.75rem;
  background: rgba(var(--color-wine-rgb), 0.04);
  border: 1px solid rgba(var(--color-wine-rgb), 0.15);
  border-radius: 10px;
}

.iconSelect__previewIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(var(--color-wine-rgb), 0.08);
  border-radius: 8px;
  flex-shrink: 0;
}

.iconSelect__previewInfo {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.iconSelect__previewValue {
  font-size: 0.6875rem;
  font-family: var(--font-mono, monospace);
  color: var(--text-tertiary);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 480px) {
  .iconSelect__grid {
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
    gap: 0.25rem;
    max-height: 200px;
  }

  .iconSelect__item {
    padding: 0.375rem 0.125rem;
  }
}
</style>
