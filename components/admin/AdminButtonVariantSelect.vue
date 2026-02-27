<script setup lang="ts">
/**
 * 🧩 AdminButtonVariantSelect — Seletor de variante de botao
 *
 * Valor armazenado: 'solid' | 'outline' | 'ghost' | 'link'
 */

import { CBSelect } from '@cb/components';
import { BUTTON_VARIANT_OPTIONS } from '@definitions/themeOptions';

// ============== PROPS ==============

interface Props {
  modelValue: string;
  label?: string;
}

withDefaults(defineProps<Props>(), {
  label: 'Variante do Botao',
});

// ============== EMITS ==============

defineEmits<{
  'update:modelValue': [value: string];
}>();

// ============== CONSTANTS ==============

const items = BUTTON_VARIANT_OPTIONS.map((opt) => ({
  value: opt.value,
  label: opt.label,
}));
</script>

<template>
  <CBSelect
    :model-value="modelValue"
    :label="label"
    :items="items"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
