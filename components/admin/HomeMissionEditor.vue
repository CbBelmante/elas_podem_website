<script setup lang="ts">
/**
 * 🧩 HomeMissionEditor — Editor da secao Missao.
 *
 * Campos de texto + upload de imagem.
 */

import { CBInput, CBTextarea } from '@cb/components';
import HomeImageUploader from '@components/admin/HomeImageUploader.vue';
import { MISSION_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@definitions/validationRules';
import type { IMissionEditable } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: IMissionEditable };
}

defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
  uploaded: [url: string];
}>();

// ============== VALIDATION RULES ==============

const rules = MISSION_CONFIG.validationRules;
</script>

<template>
  <div class="missionEditor">
    <div class="missionEditor__row">
      <CBInput
        :model-value="forms.editable.badge"
        label="Badge"
        :rules="createValidationRules(rules.badge)"
        @update:model-value="forms.editable.badge = $event; emit('changed')"
      />

      <CBInput
        :model-value="forms.editable.title"
        label="Titulo"
        :rules="createValidationRules(rules.title)"
        @update:model-value="forms.editable.title = $event; emit('changed')"
      />
    </div>

    <CBTextarea
      :model-value="forms.editable.text1"
      label="Texto 1"
      :rules="createValidationRules(rules.text1)"
      @update:model-value="forms.editable.text1 = $event; emit('changed')"
    />

    <CBTextarea
      :model-value="forms.editable.text2"
      label="Texto 2"
      :rules="createValidationRules(rules.text2)"
      @update:model-value="forms.editable.text2 = $event; emit('changed')"
    />

    <CBInput
      :model-value="forms.editable.btnText"
      label="Texto do Botao"
      :rules="createValidationRules(rules.btnText)"
      @update:model-value="forms.editable.btnText = $event; emit('changed')"
    />

    <HomeImageUploader
      :model-value="forms.editable.image"
      category="mission"
      label="Imagem da Missao"
      @update:model-value="forms.editable.image = $event; emit('changed')"
      @uploaded="emit('uploaded', $event)"
    />
  </div>
</template>

<style scoped>
.missionEditor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.missionEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .missionEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
