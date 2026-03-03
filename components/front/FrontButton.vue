<script setup lang="ts">
/**
 * 🧩 FrontButton — CBButton que resolve cor/gradiente do tema automaticamente.
 *
 * Encapsula isGradientValue/resolveColorValue em um wrapper fino.
 * Props nao declaradas sao repassadas ao CBButton via $attrs.
 */

import { computed } from 'vue';
import { CBButton } from '@cb/components';
import { resolveColorValue, isGradientValue } from '@utils/colorResolver';
import type { ButtonVariant } from '@appTypes/admin';

defineOptions({ inheritAttrs: false });

// ============== PROPS ==============

const props = defineProps<{
  label: string;
  themeColor: string;
  variant: ButtonVariant;
}>();

// ============== COMPUTED ==============

const isGradient = computed(() => isGradientValue(props.themeColor));
const resolved = computed(() => resolveColorValue(props.themeColor));
</script>

<template>
  <CBButton
    :label="label"
    :variant="variant"
    :bg-gradient="isGradient ? resolved : undefined"
    :color="!isGradient ? resolved : undefined"
    v-bind="$attrs"
  />
</template>
