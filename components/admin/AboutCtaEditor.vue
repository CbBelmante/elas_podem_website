<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 AboutCtaEditor — Editor da seção CTA do About.
 *
 * Campos de texto + cor/variante para cada botão.
 */

import type { PropType } from 'vue';
import { CBInput, CBTextarea } from '@cb/components';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminButtonVariantSelect from '@components/admin/AdminButtonVariantSelect.vue';
import { ABOUT_CTA_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import type { IAboutCtaEditable } from '@appTypes/admin';

// ============== PROPS ==============

defineProps({
  forms: {
    type: Object as PropType<{ editable: IAboutCtaEditable }>,
    required: true,
  },
});

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
}>();

// ============== VALIDATION RULES ==============

const rules = ABOUT_CTA_CONFIG.validationRules;
</script>

<template>
  <div class="aboutCtaEditor">
    <CBInput
      :model-value="forms.editable.title"
      :label="$t('admin.aboutEdit.cta.title')"
      :rules="createValidationRules(rules.title)"
      @update:model-value="
        forms.editable.title = $event;
        emit('changed');
      "
    />

    <CBTextarea
      :model-value="forms.editable.subtitle"
      :label="$t('admin.aboutEdit.cta.subtitle')"
      :rules="createValidationRules(rules.subtitle)"
      @update:model-value="
        forms.editable.subtitle = $event;
        emit('changed');
      "
    />

    <div class="aboutCtaEditor__row">
      <CBInput
        :model-value="forms.editable.btnDonate"
        :label="$t('admin.aboutEdit.cta.btnDonate')"
        :rules="createValidationRules(rules.btnDonate)"
        @update:model-value="
          forms.editable.btnDonate = $event;
          emit('changed');
        "
      />

      <CBInput
        :model-value="forms.editable.btnContact"
        :label="$t('admin.aboutEdit.cta.btnContact')"
        :rules="createValidationRules(rules.btnContact)"
        @update:model-value="
          forms.editable.btnContact = $event;
          emit('changed');
        "
      />
    </div>

    <div class="aboutCtaEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnDonateColor"
        :label="$t('admin.aboutEdit.cta.btnDonateColor')"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnDonateVariant"
        :label="$t('admin.aboutEdit.cta.btnDonateVariant')"
        @update:model-value="emit('changed')"
      />
    </div>

    <div class="aboutCtaEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnContactColor"
        :label="$t('admin.aboutEdit.cta.btnContactColor')"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnContactVariant"
        :label="$t('admin.aboutEdit.cta.btnContactVariant')"
        @update:model-value="emit('changed')"
      />
    </div>
  </div>
</template>

<style scoped>
.aboutCtaEditor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.aboutCtaEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .aboutCtaEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
