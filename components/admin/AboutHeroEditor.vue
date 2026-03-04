<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 AboutHeroEditor — Editor da seção Hero do About.
 *
 * Campos flat: badge, title, description.
 */

import { CBInput, CBTextarea } from '@cb/components';
import { ABOUT_HERO_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import type { IAboutHeroEditable } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: IAboutHeroEditable };
}

defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
}>();

// ============== VALIDATION RULES ==============

const rules = ABOUT_HERO_CONFIG.validationRules;
</script>

<template>
  <div class="aboutHeroEditor">
    <CBInput
      :model-value="forms.editable.badge"
      :label="$t('admin.aboutEdit.hero.badge')"
      :rules="createValidationRules(rules.badge)"
      @update:model-value="
        forms.editable.badge = $event;
        emit('changed');
      "
    />

    <CBInput
      :model-value="forms.editable.title"
      :label="$t('admin.aboutEdit.hero.title')"
      :rules="createValidationRules(rules.title)"
      @update:model-value="
        forms.editable.title = $event;
        emit('changed');
      "
    />

    <CBTextarea
      :model-value="forms.editable.description"
      :label="$t('admin.aboutEdit.hero.description')"
      :rules="createValidationRules(rules.description)"
      @update:model-value="
        forms.editable.description = $event;
        emit('changed');
      "
    />
  </div>
</template>

<style scoped>
.aboutHeroEditor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
