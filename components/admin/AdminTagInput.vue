<script setup lang="ts">
/**
 * 🧩 AdminTagInput — Input de tags com Enter-to-add + cor do grupo.
 *
 * Digita no input, aperta Enter, tag vira chip removivel.
 * AdminColorPicker embutido para selecionar cor de todos os badges.
 * v-model de string[] + v-model:color seguindo padrao AdminParagraphList.
 */

import { ref } from 'vue';
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { CBBadge, CBInput, CBLabel } from '@cb/components';
import { resolveColorValue } from '@utils/colorResolver';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';

// ============== PROPS ==============

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  color: {
    type: String,
    default: 'magenta',
  },
  label: {
    type: String,
    default: '',
  },
  min: {
    type: Number,
    default: 0,
    validator: (v: number) => v >= 0,
  },
  max: {
    type: Number,
    default: 6,
    validator: (v: number) => v >= 1,
  },
});

const { t } = useI18n();

const effectiveLabel = computed(() => props.label || t('admin.tagInput.label'));
const resolvedColor = computed(() => resolveColorValue(props.color));

// ============== EMITS ==============

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  'update:color': [value: string];
  changed: [];
}>();

// ============== STATE ==============

const inputValue = ref('');

// ============== CRUD ==============

function addTag(): void {
  const value = inputValue.value.trim();
  if (!value) return;
  if (props.modelValue.length >= props.max) return;
  if (props.modelValue.includes(value)) return;
  emit('update:modelValue', [...props.modelValue, value]);
  emit('changed');
  inputValue.value = '';
}

function removeTag(index: number): void {
  if (props.modelValue.length <= props.min) return;
  const updated = props.modelValue.filter((_, i) => i !== index);
  emit('update:modelValue', updated);
  emit('changed');
}
</script>

<template>
  <div class="adminTagInput">
    <div class="adminTagInput__header">
      <CBLabel :text="effectiveLabel" weight="semibold" size="xs" />
      <CBLabel :text="`${modelValue.length}/${max}`" size="xs" class="adminTagInput__counter" />
    </div>

    <AdminColorPicker
      :model-value="color"
      :label="$t('admin.tagInput.colorLabel')"
      :unavailable-modes="['gradients', 'custom']"
      @update:model-value="emit('update:color', $event); emit('changed')"
    />

    <div v-if="modelValue.length" class="adminTagInput__chips">
      <CBBadge
        v-for="(tag, index) in modelValue"
        :key="index"
        :content="tag"
        variant="outline"
        size="xs"
        icon="luc-x"
        icon-position="right"
        :icon-size="12"
        :rounded="20"
        :text-color="resolvedColor"
        :border-color="resolvedColor"
        class="adminTagInput__chip"
        @click="removeTag(index)"
      />
    </div>

    <CBInput
      v-model="inputValue"
      :placeholder="$t('admin.tagInput.placeholder')"
      :disabled="modelValue.length >= max"
      @keydown.enter.prevent="addTag"
    />
  </div>
</template>

<style scoped>
.adminTagInput {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.adminTagInput__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.adminTagInput__counter {
  color: var(--text-tertiary);
}

.adminTagInput__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.adminTagInput__chip {
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.adminTagInput__chip:hover {
  opacity: 0.6;
}
</style>
