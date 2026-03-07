<script setup lang="ts">
/**
 * 🧩 FrontBadge — CBBadge que resolve cor do tema automaticamente.
 *
 * Deriva text-color e bg-color a partir de themeColor.
 * Props nao declaradas sao repassadas ao CBBadge via $attrs.
 */

import { computed } from 'vue';
import { CBBadge } from '@cb/components';
import { resolveColorValue } from '@utils/colorResolver';

defineOptions({ inheritAttrs: false });

// ============== PROPS ==============

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  themeColor: {
    type: String,
    required: true,
  },
});

// ============== COMPUTED ==============

const resolved = computed(() => resolveColorValue(props.themeColor));
const bgColor = computed(() => `color-mix(in srgb, ${resolved.value} 10%, transparent)`);
</script>

<template>
  <CBBadge :content="content" :text-color="resolved" :bg-color="bgColor" v-bind="$attrs" />
</template>
