<script setup lang="ts">
/**
 * 🧩 AdminIconSelect — Seletor visual de icone com grid de preview.
 *
 * Mostra grid de CBIcon + label para cada opcao. Icone selecionado
 * tem borda/destaque visual. Segue padrao do AdminColorPicker.
 */

import { CBIcon, CBLabel } from '@cb/components';
import { ICON_OPTIONS } from '@definitions/themeOptions';

// ============== PROPS ==============

interface IconOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  label?: string;
  options?: IconOption[];
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Icone',
  options: () => ICON_OPTIONS as unknown as IconOption[],
});

// ============== EMITS ==============

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// ============== COMPUTED ==============

const selectedOption = computed(() => props.options.find((o) => o.value === props.modelValue));

// ============== METHODS ==============

function select(value: string): void {
  emit('update:modelValue', value);
}
</script>

<template>
  <div class="iconSelect">
    <CBLabel v-if="label" :text="label" weight="semibold" size="sm" class="iconSelect__label" />

    <!-- Grid de icones -->
    <div class="iconSelect__grid">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="iconSelect__item"
        :class="{ 'iconSelect__item--selected': modelValue === opt.value }"
        @click="select(opt.value)"
      >
        <CBIcon :icon="opt.value" size="1.25rem" />
        <span class="iconSelect__itemLabel">{{ opt.label }}</span>
      </button>
    </div>

    <!-- Preview do icone selecionado -->
    <div v-if="selectedOption" class="iconSelect__preview">
      <CBIcon :icon="selectedOption.value" size="1.5rem" color="var(--color-vinho)" />
      <CBLabel :text="selectedOption.label" size="xs" class="iconSelect__previewLabel" />
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

.iconSelect__label {
  color: var(--text-primary);
}

/* ============================================
   GRID
   ============================================ */
.iconSelect__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 0.5rem;
}

.iconSelect__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.25rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background: var(--bg-light, #f8f9fa);
  cursor: pointer;
  transition: all 0.2s ease;
}

.iconSelect__item:hover {
  transform: scale(1.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.iconSelect__item--selected {
  border-color: var(--color-vinho);
  box-shadow: 0 0 0 2px rgba(var(--color-vinho-rgb), 0.2);
  transform: scale(1.04);
  background: rgba(var(--color-vinho-rgb), 0.06);
}

.iconSelect__itemLabel {
  font-size: 0.625rem;
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
  color: var(--color-vinho);
  font-weight: 600;
}

/* ============================================
   PREVIEW
   ============================================ */
.iconSelect__preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-light);
}

.iconSelect__previewLabel {
  color: var(--text-tertiary);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 480px) {
  .iconSelect__grid {
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
    gap: 0.375rem;
  }

  .iconSelect__item {
    padding: 0.375rem 0.125rem;
  }
}
</style>
