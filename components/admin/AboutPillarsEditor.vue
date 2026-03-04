<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 AboutPillarsEditor — Editor da seção Pilares do About.
 *
 * Section fields (badge, title) + array CRUD + drag + icon + color.
 */

import { CBButton, CBInput, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import { ABOUT_PILLARS_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import AdminEditorCard from '@components/admin/AdminEditorCard.vue';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminIconSelect from '@components/admin/AdminIconSelect.vue';
import { createNewAboutPillar } from '@utils/AboutFormUtils';
import type { IAboutPillarsEditable, IAboutPillarEditable } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: IAboutPillarsEditable };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
}>();

// ============== VALIDATION ==============

const itemRules = ABOUT_PILLARS_CONFIG.validationRules;
const sectionRules = ABOUT_PILLARS_CONFIG.sectionRules;

// ============== CRUD ==============

function addPillar(): void {
  if (props.forms.editable.items.length >= ABOUT_PILLARS_CONFIG.items.max) return;
  const newItem = createNewAboutPillar();
  props.forms.editable.items.push(newItem as unknown as IAboutPillarEditable);
  emit('changed');
}

function removePillar(index: number): void {
  if (props.forms.editable.items.length <= ABOUT_PILLARS_CONFIG.items.min) return;
  props.forms.editable.items.splice(index, 1);
  emit('changed');
}
</script>

<template>
  <div class="aboutPillarsEditor">
    <!-- Metadados da seção -->
    <div class="aboutPillarsEditor__sectionFields">
      <CBInput
        :model-value="forms.editable.badge"
        :label="$t('admin.aboutEdit.pillars.badge')"
        :rules="createValidationRules(sectionRules.badge)"
        @update:model-value="
          forms.editable.badge = $event;
          emit('changed');
        "
      />
      <CBInput
        :model-value="forms.editable.title"
        :label="$t('admin.aboutEdit.pillars.sectionTitle')"
        :rules="createValidationRules(sectionRules.title)"
        @update:model-value="
          forms.editable.title = $event;
          emit('changed');
        "
      />
    </div>

    <!-- Items -->
    <div class="aboutPillarsEditor__header">
      <CBLabel :text="$t('admin.aboutEdit.pillars.listTitle')" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.items.length}/${ABOUT_PILLARS_CONFIG.items.max}`"
        size="xs"
        class="aboutPillarsEditor__counter"
      />
    </div>

    <draggable
      :model-value="forms.editable.items"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="aboutPillarsEditor__ghost"
      @update:model-value="forms.editable.items.splice(0, forms.editable.items.length, ...$event)"
      @end="emit('changed')"
    >
      <template #item="{ element, index }: { element: IAboutPillarEditable; index: number }">
        <AdminEditorCard
          :title="$t('admin.aboutEdit.pillars.item', { n: index + 1 })"
          :disabled="forms.editable.items.length <= ABOUT_PILLARS_CONFIG.items.min"
          @remove="removePillar(index)"
        >
          <CBInput
            :model-value="element.title"
            :label="$t('admin.aboutEdit.pillars.itemTitle')"
            :rules="createValidationRules(itemRules.title)"
            @update:model-value="
              element.title = $event;
              emit('changed');
            "
          />

          <AdminIconSelect
            :model-value="element.icon"
            :label="$t('admin.aboutEdit.pillars.itemIcon')"
            @update:model-value="
              element.icon = $event;
              emit('changed');
            "
          />

          <AdminColorPicker
            :model-value="element.color"
            :label="$t('admin.aboutEdit.pillars.itemColor')"
            :unavailable-modes="['gradients', 'custom']"
            @update:model-value="
              element.color = $event;
              emit('changed');
            "
          />

          <CBTextarea
            :model-value="element.description"
            :label="$t('admin.aboutEdit.pillars.itemDescription')"
            :rules="createValidationRules(itemRules.description)"
            @update:model-value="
              element.description = $event;
              emit('changed');
            "
          />
        </AdminEditorCard>
      </template>
    </draggable>

    <CBButton
      :label="$t('admin.aboutEdit.pillars.add')"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="forms.editable.items.length >= ABOUT_PILLARS_CONFIG.items.max"
      @click="addPillar"
    />
  </div>
</template>

<style scoped>
.aboutPillarsEditor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.aboutPillarsEditor__sectionFields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 0.5rem;
}

.aboutPillarsEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.aboutPillarsEditor__counter {
  color: var(--text-tertiary);
}

.aboutPillarsEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-wine-rgb), 0.05);
}
</style>
