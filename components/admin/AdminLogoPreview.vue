<script setup lang="ts">
/**
 * 🧩 AdminLogoPreview — Preview de tamanho real de logo/imagem com slider size.
 *
 * Reutilizado em Hero (blob logo) e Supporters (logo de parceiro).
 * Fundo escuro para logos transparentes ficarem visiveis.
 */

import { CBLabel } from '@cb/components';

// ============== PROPS ==============

defineProps({
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="logoPreview">
    <CBLabel :text="label || $t('admin.supporters.preview')" size="xs" class="logoPreview__label" />
    <div class="logoPreview__box">
      <img
        v-if="image"
        :src="image"
        :alt="alt || name || 'Logo'"
        :style="{ height: `${size}px`, width: 'auto', objectFit: 'contain' }"
      />
      <CBLabel
        v-else
        :text="name || '—'"
        size="lg"
        weight="bold"
        :style="{ height: `${size}px`, lineHeight: `${size}px` }"
      />
    </div>
  </div>
</template>

<style scoped>
.logoPreview {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.logoPreview__label {
  color: var(--text-tertiary);
}

.logoPreview__box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: rgba(var(--color-wine-rgb), 0.04);
  border: 1px solid rgba(var(--color-wine-rgb), 0.15);
  border-radius: 10px;
  min-height: 60px;
}
</style>
