<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- padrao dos editors admin */
/**
 * 🧩 AdminParagraphList — Lista dinamica de paragrafos com drag-and-drop.
 *
 * Componente reutilizavel para arrays de strings editaveis.
 * Usa o mesmo padrao de draggable do HomeContactEditor (formSubjects).
 */

import type { PropType } from 'vue';
import { CBButton, CBIcon, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';

// ============== PROPS ==============

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [''],
  },
  label: {
    type: String,
    default: 'Paragrafos',
  },
  itemLabel: {
    type: String,
    default: 'Paragrafo',
  },
  min: {
    type: Number,
    default: 1,
    validator: (v: number) => v >= 0,
  },
  max: {
    type: Number,
    default: 6,
    validator: (v: number) => v >= 1,
  },
  rules: {
    type: Array as PropType<((v: string) => true | string)[]>,
    default: undefined,
  },
});

// ============== EMITS ==============

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  changed: [];
}>();

// ============== CRUD ==============

function add(): void {
  if (props.modelValue.length >= props.max) return;
  const updated = [...props.modelValue, ''];
  emit('update:modelValue', updated);
  emit('changed');
}

function remove(index: number): void {
  if (props.modelValue.length <= props.min) return;
  const updated = props.modelValue.filter((_, i) => i !== index);
  emit('update:modelValue', updated);
  emit('changed');
}

function update(index: number, value: string): void {
  const updated = [...props.modelValue];
  updated[index] = value;
  emit('update:modelValue', updated);
  emit('changed');
}

function onDragUpdate(newList: string[]): void {
  emit('update:modelValue', newList);
}
</script>

<template>
  <div class="paragraphList">
    <div class="paragraphList__header">
      <CBLabel :text="label" weight="semibold" size="sm" />
      <CBLabel :text="`${modelValue.length}/${max}`" size="xs" class="paragraphList__counter" />
    </div>

    <draggable
      :model-value="modelValue"
      :item-key="(_: string, i: number) => i"
      handle=".dragHandle"
      :animation="200"
      ghost-class="paragraphList__ghost"
      @update:model-value="onDragUpdate"
      @end="emit('changed')"
    >
      <template #item="{ index }: { index: number }">
        <div class="paragraphList__row">
          <div class="dragHandle">
            <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
          </div>
          <CBTextarea
            :model-value="modelValue[index]"
            :label="`${itemLabel} ${index + 1}`"
            :rules="rules"
            @update:model-value="update(index, $event)"
          />
          <CBButton
            variant="outline"
            size="sm"
            prepend-icon="luc-trash-2"
            :color="'var(--color-coral)'"
            :rounded="8"
            :disabled="modelValue.length <= min"
            @click="remove(index)"
          />
        </div>
      </template>
    </draggable>

    <CBButton
      :label="`Adicionar ${itemLabel}`"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="modelValue.length >= max"
      @click="add"
    />
  </div>
</template>

<style scoped>
.paragraphList {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.paragraphList__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.paragraphList__counter {
  color: var(--text-tertiary);
}

.paragraphList__row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.paragraphList__row > :nth-child(2) {
  flex: 1;
}

.paragraphList__ghost {
  opacity: 0.4;
  background: rgba(var(--color-vinho-rgb), 0.05);
}

.dragHandle {
  cursor: grab;
  padding: 0.25rem;
}

.dragHandle:active {
  cursor: grabbing;
}
</style>
