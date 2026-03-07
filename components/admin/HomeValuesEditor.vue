<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeValuesEditor — Editor da secao Valores.
 *
 * Array CRUD + drag-and-drop.
 */

import type { PropType } from 'vue';
import { CBButton, CBInput, CBLabel } from '@cb/components';
import draggable from 'vuedraggable';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminEditorCard from '@components/admin/AdminEditorCard.vue';
import { VALUES_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import { createNewValue } from '@utils/HomeFormUtils';
import type { IValueEditable } from '@appTypes/admin';

// ============== PROPS ==============

const props = defineProps({
  forms: {
    type: Object as PropType<{ editable: IValueEditable[] }>,
    required: true,
  },
});

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
      <CBLabel :text="$t('admin.values.listTitle')" weight="semibold" size="sm" />
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
        <AdminEditorCard
          :title="$t('admin.values.item', { n: index + 1 })"
          :disabled="forms.editable.length <= VALUES_CONFIG.items.min"
          @remove="removeValue(index)"
        >
          <CBInput
            :model-value="element.title"
            :label="$t('admin.values.title')"
            :rules="createValidationRules(rules.title)"
            @update:model-value="
              element.title = $event;
              emit('changed');
            "
          />

          <CBInput
            :model-value="element.subtitle"
            :label="$t('admin.values.subtitle')"
            :rules="createValidationRules(rules.subtitle)"
            @update:model-value="
              element.subtitle = $event;
              emit('changed');
            "
          />

          <AdminColorPicker
            :model-value="element.color"
            :label="$t('admin.values.color')"
            :unavailable-modes="['gradients', 'custom']"
            @update:model-value="
              element.color = $event;
              emit('changed');
            "
          />
        </AdminEditorCard>
      </template>
    </draggable>

    <CBButton
      :label="$t('admin.values.add')"
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

.valuesEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-wine-rgb), 0.05);
}
</style>
