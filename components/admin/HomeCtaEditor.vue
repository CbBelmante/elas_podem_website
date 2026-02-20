<script setup lang="ts">
/**
 * 🧩 HomeCtaEditor — Editor da secao CTA (Call to Action).
 *
 * Secao mais simples: 4 campos de texto, sem arrays, sem imagem.
 */

import { CBInput, CBTextarea } from '@cb/components';
import { CTA_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import type { ICtaEditable } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: ICtaEditable };
}

defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
}>();

// ============== VALIDATION RULES ==============

const rules = CTA_CONFIG.validationRules;
</script>

<template>
  <div class="ctaEditor">
    <CBInput
      :model-value="forms.editable.title"
      label="Titulo"
      :rules="createValidationRules(rules.title)"
      @update:model-value="forms.editable.title = $event; emit('changed')"
    />

    <CBTextarea
      :model-value="forms.editable.subtitle"
      label="Subtitulo"
      :rules="createValidationRules(rules.subtitle)"
      @update:model-value="forms.editable.subtitle = $event; emit('changed')"
    />

    <div class="ctaEditor__row">
      <CBInput
        :model-value="forms.editable.btnDonate"
        label="Botao Doar"
        :rules="createValidationRules(rules.btnDonate)"
        @update:model-value="forms.editable.btnDonate = $event; emit('changed')"
      />

      <CBInput
        :model-value="forms.editable.btnProjects"
        label="Botao Projetos"
        :rules="createValidationRules(rules.btnProjects)"
        @update:model-value="forms.editable.btnProjects = $event; emit('changed')"
      />
    </div>
  </div>
</template>

<style scoped>
.ctaEditor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ctaEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .ctaEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
