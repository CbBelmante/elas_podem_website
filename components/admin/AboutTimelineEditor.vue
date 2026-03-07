<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 AboutTimelineEditor — Editor da seção Trajetória do About.
 *
 * Section fields (badge, title) + array CRUD + drag-and-drop.
 */

import type { PropType } from 'vue';
import { CBButton, CBInput, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import { ABOUT_TIMELINE_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import AdminEditorCard from '@components/admin/AdminEditorCard.vue';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminIconSelect from '@components/admin/AdminIconSelect.vue';
import { createNewAboutTimelineItem } from '@utils/AboutFormUtils';
import type { IAboutTimelineEditable, IAboutTimelineItemEditable } from '@appTypes/admin';

// ============== PROPS ==============

const props = defineProps({
  forms: {
    type: Object as PropType<{ editable: IAboutTimelineEditable }>,
    required: true,
  },
});

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
}>();

// ============== VALIDATION ==============

const itemRules = ABOUT_TIMELINE_CONFIG.validationRules;
const sectionRules = ABOUT_TIMELINE_CONFIG.sectionRules;

// ============== CRUD ==============

function addItem(): void {
  if (props.forms.editable.items.length >= ABOUT_TIMELINE_CONFIG.items.max) return;
  const newItem = createNewAboutTimelineItem();
  props.forms.editable.items.push(newItem as unknown as IAboutTimelineItemEditable);
  emit('changed');
}

function removeItem(index: number): void {
  if (props.forms.editable.items.length <= ABOUT_TIMELINE_CONFIG.items.min) return;
  props.forms.editable.items.splice(index, 1);
  emit('changed');
}
</script>

<template>
  <div class="aboutTimelineEditor">
    <!-- Metadados da seção -->
    <div class="aboutTimelineEditor__sectionFields">
      <CBInput
        :model-value="forms.editable.badge"
        :label="$t('admin.aboutEdit.timeline.badge')"
        :rules="createValidationRules(sectionRules.badge)"
        @update:model-value="
          forms.editable.badge = $event;
          emit('changed');
        "
      />
      <CBInput
        :model-value="forms.editable.title"
        :label="$t('admin.aboutEdit.timeline.sectionTitle')"
        :rules="createValidationRules(sectionRules.title)"
        @update:model-value="
          forms.editable.title = $event;
          emit('changed');
        "
      />
    </div>

    <!-- Items -->
    <div class="aboutTimelineEditor__header">
      <CBLabel :text="$t('admin.aboutEdit.timeline.listTitle')" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.items.length}/${ABOUT_TIMELINE_CONFIG.items.max}`"
        size="xs"
        class="aboutTimelineEditor__counter"
      />
    </div>

    <draggable
      :model-value="forms.editable.items"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="aboutTimelineEditor__ghost"
      @update:model-value="forms.editable.items.splice(0, forms.editable.items.length, ...$event)"
      @end="emit('changed')"
    >
      <template #item="{ element, index }: { element: IAboutTimelineItemEditable; index: number }">
        <AdminEditorCard
          :title="$t('admin.aboutEdit.timeline.item', { n: index + 1 })"
          :disabled="forms.editable.items.length <= ABOUT_TIMELINE_CONFIG.items.min"
          @remove="removeItem(index)"
        >
          <div class="aboutTimelineEditor__row">
            <CBInput
              :model-value="element.year"
              :label="$t('admin.aboutEdit.timeline.year')"
              :rules="createValidationRules(itemRules.year)"
              @update:model-value="
                element.year = $event;
                emit('changed');
              "
            />

            <CBInput
              :model-value="element.title"
              :label="$t('admin.aboutEdit.timeline.itemTitle')"
              :rules="createValidationRules(itemRules.title)"
              @update:model-value="
                element.title = $event;
                emit('changed');
              "
            />
          </div>

          <AdminIconSelect
            :model-value="element.icon"
            :label="$t('admin.aboutEdit.timeline.itemIcon')"
            @update:model-value="
              element.icon = $event;
              emit('changed');
            "
          />

          <AdminColorPicker
            :model-value="element.color"
            :label="$t('admin.aboutEdit.timeline.itemColor')"
            :unavailable-modes="['gradients', 'custom']"
            @update:model-value="
              element.color = $event;
              emit('changed');
            "
          />

          <CBTextarea
            :model-value="element.description"
            :label="$t('admin.aboutEdit.timeline.itemDescription')"
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
      :label="$t('admin.aboutEdit.timeline.add')"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="forms.editable.items.length >= ABOUT_TIMELINE_CONFIG.items.max"
      @click="addItem"
    />
  </div>
</template>

<style scoped>
.aboutTimelineEditor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.aboutTimelineEditor__sectionFields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 0.5rem;
}

.aboutTimelineEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.aboutTimelineEditor__counter {
  color: var(--text-tertiary);
}

.aboutTimelineEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.aboutTimelineEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-wine-rgb), 0.05);
}

@media (max-width: 640px) {
  .aboutTimelineEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
