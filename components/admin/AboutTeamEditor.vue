<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 AboutTeamEditor — Editor da seção Equipe do About.
 *
 * Section fields (badge, title, subtitle) + array CRUD + drag + image upload.
 */

import type { PropType } from 'vue';
import { CBButton, CBInput, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import { ABOUT_TEAM_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import AdminEditorCard from '@components/admin/AdminEditorCard.vue';
import AdminImageUploader from '@components/admin/AdminImageUploader.vue';
import { createNewAboutTeamMember } from '@utils/AboutFormUtils';
import type { IAboutTeamEditable, IAboutTeamMemberEditable } from '@appTypes/admin';

// ============== PROPS ==============

const props = defineProps({
  forms: {
    type: Object as PropType<{ editable: IAboutTeamEditable }>,
    required: true,
  },
});

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
  uploaded: [url: string];
}>();

// ============== VALIDATION ==============

const itemRules = ABOUT_TEAM_CONFIG.validationRules;
const sectionRules = ABOUT_TEAM_CONFIG.sectionRules;

// ============== CRUD ==============

function addMember(): void {
  if (props.forms.editable.items.length >= ABOUT_TEAM_CONFIG.items.max) return;
  const newItem = createNewAboutTeamMember();
  props.forms.editable.items.push(newItem as unknown as IAboutTeamMemberEditable);
  emit('changed');
}

function removeMember(index: number): void {
  if (props.forms.editable.items.length <= ABOUT_TEAM_CONFIG.items.min) return;
  props.forms.editable.items.splice(index, 1);
  emit('changed');
}
</script>

<template>
  <div class="aboutTeamEditor">
    <!-- Metadados da seção -->
    <div class="aboutTeamEditor__sectionFields">
      <CBInput
        :model-value="forms.editable.badge"
        :label="$t('admin.aboutEdit.team.badge')"
        :rules="createValidationRules(sectionRules.badge)"
        @update:model-value="
          forms.editable.badge = $event;
          emit('changed');
        "
      />
      <CBInput
        :model-value="forms.editable.title"
        :label="$t('admin.aboutEdit.team.sectionTitle')"
        :rules="createValidationRules(sectionRules.title)"
        @update:model-value="
          forms.editable.title = $event;
          emit('changed');
        "
      />
      <CBInput
        :model-value="forms.editable.subtitle"
        :label="$t('admin.aboutEdit.team.subtitle')"
        @update:model-value="
          forms.editable.subtitle = $event;
          emit('changed');
        "
      />
    </div>

    <!-- Items -->
    <div class="aboutTeamEditor__header">
      <CBLabel :text="$t('admin.aboutEdit.team.listTitle')" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.items.length}/${ABOUT_TEAM_CONFIG.items.max}`"
        size="xs"
        class="aboutTeamEditor__counter"
      />
    </div>

    <draggable
      :model-value="forms.editable.items"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="aboutTeamEditor__ghost"
      @update:model-value="forms.editable.items.splice(0, forms.editable.items.length, ...$event)"
      @end="emit('changed')"
    >
      <template #item="{ element, index }: { element: IAboutTeamMemberEditable; index: number }">
        <AdminEditorCard
          :title="$t('admin.aboutEdit.team.item', { n: index + 1 })"
          :disabled="forms.editable.items.length <= ABOUT_TEAM_CONFIG.items.min"
          @remove="removeMember(index)"
        >
          <div class="aboutTeamEditor__row">
            <CBInput
              :model-value="element.name"
              :label="$t('admin.aboutEdit.team.name')"
              :rules="createValidationRules(itemRules.name)"
              @update:model-value="
                element.name = $event;
                emit('changed');
              "
            />

            <CBInput
              :model-value="element.role"
              :label="$t('admin.aboutEdit.team.role')"
              :rules="createValidationRules(itemRules.role)"
              @update:model-value="
                element.role = $event;
                emit('changed');
              "
            />
          </div>

          <CBInput
            :model-value="element.initials"
            :label="$t('admin.aboutEdit.team.initials')"
            @update:model-value="
              element.initials = $event;
              emit('changed');
            "
          />

          <CBTextarea
            :model-value="element.bio"
            :label="$t('admin.aboutEdit.team.bio')"
            :rules="createValidationRules(itemRules.bio)"
            @update:model-value="
              element.bio = $event;
              emit('changed');
            "
          />

          <AdminImageUploader
            :model-value="element.image"
            category="testimonials"
            :label="$t('admin.aboutEdit.team.photo')"
            @update:model-value="
              element.image = $event;
              emit('changed');
            "
            @uploaded="emit('uploaded', $event)"
          />

          <CBInput
            :model-value="element.imageAlt"
            :label="$t('admin.aboutEdit.team.photoAlt')"
            @update:model-value="
              element.imageAlt = $event;
              emit('changed');
            "
          />
        </AdminEditorCard>
      </template>
    </draggable>

    <CBButton
      :label="$t('admin.aboutEdit.team.add')"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="forms.editable.items.length >= ABOUT_TEAM_CONFIG.items.max"
      @click="addMember"
    />
  </div>
</template>

<style scoped>
.aboutTeamEditor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.aboutTeamEditor__sectionFields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 0.5rem;
}

.aboutTeamEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.aboutTeamEditor__counter {
  color: var(--text-tertiary);
}

.aboutTeamEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.aboutTeamEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-wine-rgb), 0.05);
}

@media (max-width: 640px) {
  .aboutTeamEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
