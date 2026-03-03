<script setup lang="ts">
/**
 * 🧩 AdminEditorCard — Card wrapper para itens de listas editaveis.
 *
 * Encapsula CBCard + drag handle + titulo + botao remover.
 * Slot default para campos do formulario.
 * Usado em Programs, Testimonials, Supporters, Values, Contact.
 */

import { CBButton, CBCard, CBIcon, CBLabel } from '@cb/components';

// ============== PROPS ==============

interface Props {
  title: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});

// ============== EMITS ==============

defineEmits<{
  remove: [];
}>();
</script>

<template>
  <CBCard density="compact" :rounded="10" color="#FDF5F0" class="adminEditorCard">
    <template #header>
      <div class="adminEditorCard__header">
        <div class="adminEditorCard__drag dragHandle">
          <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
        </div>
        <CBLabel :text="title" size="sm" weight="semibold" class="adminEditorCard__title" />
        <CBButton
          variant="ghost"
          size="sm"
          prepend-icon="luc-trash-2"
          color="coral"
          :rounded="8"
          :disabled="disabled"
          @click="$emit('remove')"
        />
      </div>
    </template>

    <div class="adminEditorCard__fields">
      <slot />
    </div>
  </CBCard>
</template>

<style scoped>
.adminEditorCard {
  margin-bottom: 0.5rem;
}

.adminEditorCard__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.adminEditorCard__title {
  flex: 1;
}

.adminEditorCard__drag {
  cursor: grab;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.15s ease;
}

.adminEditorCard__drag:hover {
  background: rgba(0, 0, 0, 0.05);
}

.adminEditorCard__drag:active {
  cursor: grabbing;
}

.adminEditorCard__fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
