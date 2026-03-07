<script setup lang="ts">
/**
 * 🧩 AdminButtonVariantSelect — Seletor de variante de botao
 *
 * Valor armazenado: 'solid' | 'outline' | 'ghost' | 'link'
 */

import { useI18n } from 'vue-i18n';
import { CBSelect } from '@cb/components';
import { BUTTON_VARIANT_OPTIONS } from '@definitions/themeOptions';

// ============== PROPS ==============

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
});

// ============== EMITS ==============

defineEmits<{
  'update:modelValue': [value: string];
}>();

// ============== I18N ==============

const { t } = useI18n();

const items = computed(() =>
  BUTTON_VARIANT_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t(opt.label),
  }))
);
</script>

<template>
  <CBSelect
    :model-value="modelValue"
    :label="label || $t('admin.variantSelect.label')"
    :items="items"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
