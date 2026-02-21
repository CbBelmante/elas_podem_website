<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * HomeValuesEditor — Editor da secao Valores.
 *
 * Array CRUD + drag-and-drop. Color e hidden (preservado no save).
 */

import { CBButton, CBIcon, CBInput, CBLabel, CBSelect } from '@cb/components';
import draggable from 'vuedraggable';
import { VALUES_CONFIG } from '@definitions/validationConfigs';
import { THEME_COLOR_OPTIONS } from '@definitions/themeOptions';
import { createValidationRules } from '@utils/validationRules';
import { createNewValue } from '@utils/HomeFormUtils';
import type { IValueEditable } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: IValueEditable[] };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
}>();

// ============== VALIDATION ==============

const rules = VALUES_CONFIG.validationRules;

// ============== CRUD ==============

function addValue(): void {
  if (props.forms.editable.length >= VALUES_CONFIG.items.max) return;
  props.forms.editable.push(createNewValue() as unknown as IValueEditable);
  emit('changed');
}

function removeValue(index: number): void {
  if (props.forms.editable.length <= VALUES_CONFIG.items.min) return;
  props.forms.editable.splice(index, 1);
  emit('changed');
}
</script>

<template>
  <div class="valuesEditor">
    <div class="valuesEditor__header">
      <CBLabel text="Valores" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.length}/${VALUES_CONFIG.items.max}`"
        size="xs"
        class="valuesEditor__counter"
      />
    </div>

    <draggable
      v-model="forms.editable"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="valuesEditor__ghost"
      @end="emit('changed')"
    >
      <template #item="{ element, index }: { element: IValueEditable; index: number }">
        <div class="valuesEditor__card">
          <div class="valuesEditor__cardHeader">
            <div class="dragHandle">
              <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
            </div>
            <CBLabel :text="`Valor ${index + 1}`" size="sm" weight="medium" />
            <CBButton
              variant="outline"
              size="sm"
              prepend-icon="luc-trash-2"
              :color="'var(--color-coral)'"
              :rounded="8"
              :disabled="forms.editable.length <= VALUES_CONFIG.items.min"
              @click="removeValue(index)"
            />
          </div>

          <div class="valuesEditor__fields">
            <CBInput
              :model-value="element.title"
              label="Titulo"
              :rules="createValidationRules(rules.title)"
              @update:model-value="
                element.title = $event;
                emit('changed');
              "
            />

            <CBInput
              :model-value="element.subtitle"
              label="Subtitulo"
              :rules="createValidationRules(rules.subtitle)"
              @update:model-value="
                element.subtitle = $event;
                emit('changed');
              "
            />
          </div>
        </div>
      </template>
    </draggable>

    <CBButton
      label="Adicionar Valor"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="forms.editable.length >= VALUES_CONFIG.items.max"
      @click="addValue"
    />
  </div>
</template>

<style scoped>
.valuesEditor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.valuesEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.valuesEditor__counter {
  color: var(--text-tertiary);
}

.valuesEditor__card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-light, #f8f9fa);
  border: 1px solid var(--border-light);
  border-radius: 10px;
}

.valuesEditor__cardHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.valuesEditor__cardHeader > :last-child {
  margin-left: auto;
}

.valuesEditor__fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.valuesEditor__ghost {
  opacity: 0.4;
  background: var(--bg-tint, rgba(230, 52, 107, 0.05));
}

.dragHandle {
  cursor: grab;
  padding: 0.25rem;
}

.dragHandle:active {
  cursor: grabbing;
}
</style>
