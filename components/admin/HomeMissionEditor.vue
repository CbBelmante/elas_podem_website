<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeMissionEditor — Editor da secao Missao.
 *
 * Campos de texto + upload de imagem.
 */

import { CBInput, CBTextarea } from '@cb/components';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminButtonVariantSelect from '@components/admin/AdminButtonVariantSelect.vue';
import HomeImageUploader from '@components/admin/HomeImageUploader.vue';
import { MISSION_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
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
        v-model="forms.editable.badge"
        label="Badge"
        :rules="createValidationRules(rules.badge)"
        @update:model-value="emit('changed')"
      />

      <CBInput
        v-model="forms.editable.title"
        label="Titulo"
        :rules="createValidationRules(rules.title)"
        @update:model-value="emit('changed')"
      />
    </div>

    <CBTextarea
      v-model="forms.editable.text1"
      label="Texto 1"
      :rules="createValidationRules(rules.text1)"
      @update:model-value="emit('changed')"
    />

    <CBTextarea
      v-model="forms.editable.text2"
      label="Texto 2"
      :rules="createValidationRules(rules.text2)"
      @update:model-value="emit('changed')"
    />

    <CBInput
      v-model="forms.editable.btnText"
      label="Texto do Botao"
      :rules="createValidationRules(rules.btnText)"
      @update:model-value="emit('changed')"
    />

    <div class="missionEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnColor"
        label="Cor/Gradiente do Botao"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnVariant"
        label="Variante do Botao"
        @update:model-value="emit('changed')"
      />
    </div>

    <HomeImageUploader
      v-model="forms.editable.image"
      category="mission"
      label="Imagem da Missao"
      @update:model-value="emit('changed')"
      @uploaded="emit('uploaded', $event)"
    />

    <CBInput
      v-model="forms.editable.imageAlt"
      label="Texto alternativo da imagem (acessibilidade)"
      @update:model-value="emit('changed')"
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
