<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeMissionEditor — Editor da secao Missao.
 *
 * Campos de texto + upload de imagem.
 */

import type { PropType } from 'vue';
import { CBInput } from '@cb/components';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminButtonVariantSelect from '@components/admin/AdminButtonVariantSelect.vue';
import AdminImageUploader from '@components/admin/AdminImageUploader.vue';
import AdminParagraphList from '@components/admin/AdminParagraphList.vue';
import { MISSION_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import type { IMissionEditable } from '@appTypes/admin';

// ============== PROPS ==============

defineProps({
  forms: {
    type: Object as PropType<{ editable: IMissionEditable }>,
    required: true,
  },
});

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
        :label="$t('admin.mission.badge')"
        :rules="createValidationRules(rules.badge)"
        @update:model-value="emit('changed')"
      />

      <CBInput
        v-model="forms.editable.title"
        :label="$t('admin.mission.title')"
        :rules="createValidationRules(rules.title)"
        @update:model-value="emit('changed')"
      />
    </div>

    <AdminParagraphList
      v-model="forms.editable.paragraphs"
      :min="MISSION_CONFIG.paragraphs.min"
      :max="MISSION_CONFIG.paragraphs.max"
      :rules="createValidationRules(MISSION_CONFIG.paragraphRule)"
      @changed="emit('changed')"
    />

    <CBInput
      v-model="forms.editable.btnText"
      :label="$t('admin.mission.btnText')"
      :rules="createValidationRules(rules.btnText)"
      @update:model-value="emit('changed')"
    />

    <div class="missionEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnColor"
        :label="$t('admin.mission.btnColor')"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnVariant"
        :label="$t('admin.mission.btnVariant')"
        @update:model-value="emit('changed')"
      />
    </div>

    <AdminImageUploader
      v-model="forms.editable.image"
      v-model:opacity="forms.editable.imageOpacity"
      category="mission"
      :label="$t('admin.mission.image')"
      opacity-editable
      @update:model-value="emit('changed')"
      @update:opacity="emit('changed')"
      @uploaded="emit('uploaded', $event)"
    />

    <CBInput
      v-model="forms.editable.imageAlt"
      :label="$t('admin.mission.imageAlt')"
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
