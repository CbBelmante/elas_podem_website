<script setup lang="ts">
/**
 * 🧩 AdminParagraphList — Lista dinamica de paragrafos com drag-and-drop.
 *
 * Componente reutilizavel para arrays de strings editaveis.
 * Usa o mesmo padrao de draggable do HomeContactEditor (formSubjects).
 */

import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { CBButton, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import AdminEditorCard from '@components/admin/AdminEditorCard.vue';

// ============== PROPS ==============

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [''],
  },
  label: {
    type: String,
    default: '',
  },
  itemLabel: {
    type: String,
    default: '',
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

const { t } = useI18n();

const effectiveLabel = computed(() => props.label || t('admin.paragraphList.label'));
const effectiveItemLabel = computed(() => props.itemLabel || t('admin.paragraphList.itemLabel'));

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
      <CBLabel :text="effectiveLabel" weight="semibold" size="sm" />
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
        <AdminEditorCard
          :title="`${effectiveItemLabel} ${index + 1}`"
          :disabled="modelValue.length <= min"
          @remove="remove(index)"
        >
          <CBTextarea
            :model-value="modelValue[index]"
            :label="effectiveItemLabel"
            :rules="rules"
            @update:model-value="update(index, $event)"
          />
        </AdminEditorCard>
      </template>
    </draggable>

    <CBButton
      :label="$t('admin.paragraphList.add', { item: effectiveItemLabel })"
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

.paragraphList__ghost {
  opacity: 0.4;
  background: rgba(var(--color-wine-rgb), 0.05);
}
</style>
