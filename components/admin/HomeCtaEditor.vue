<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeCtaEditor — Editor da secao CTA (Call to Action).
 *
 * Campos de texto + cor/variante para cada botao.
 */

import { CBInput, CBTextarea } from '@cb/components';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminButtonVariantSelect from '@components/admin/AdminButtonVariantSelect.vue';
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
      :label="$t('admin.cta.title')"
      :rules="createValidationRules(rules.title)"
      @update:model-value="
        forms.editable.title = $event;
        emit('changed');
      "
    />

    <CBTextarea
      :model-value="forms.editable.subtitle"
      :label="$t('admin.cta.subtitle')"
      :rules="createValidationRules(rules.subtitle)"
      @update:model-value="
        forms.editable.subtitle = $event;
        emit('changed');
      "
    />

    <div class="ctaEditor__row">
      <CBInput
        :model-value="forms.editable.btnDonate"
        :label="$t('admin.cta.btnDonate')"
        :rules="createValidationRules(rules.btnDonate)"
        @update:model-value="
          forms.editable.btnDonate = $event;
          emit('changed');
        "
      />

      <CBInput
        :model-value="forms.editable.btnProjects"
        :label="$t('admin.cta.btnProjects')"
        :rules="createValidationRules(rules.btnProjects)"
        @update:model-value="
          forms.editable.btnProjects = $event;
          emit('changed');
        "
      />
    </div>

    <div class="ctaEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnDonateColor"
        :label="$t('admin.cta.btnDonateColor')"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnDonateVariant"
        :label="$t('admin.cta.btnDonateVariant')"
        @update:model-value="emit('changed')"
      />
    </div>

    <div class="ctaEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnProjectsColor"
        :label="$t('admin.cta.btnProjectsColor')"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnProjectsVariant"
        :label="$t('admin.cta.btnProjectsVariant')"
        @update:model-value="emit('changed')"
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
