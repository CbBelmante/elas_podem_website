<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeSupportersEditor — Editor da secao Apoiadores.
 *
 * Array CRUD + drag-and-drop + image upload por item.
 * Tem readonly pareado (color).
 */

import { CBButton, CBInput, CBLabel, CBSlider } from '@cb/components';
import draggable from 'vuedraggable';
import AdminEditorCard from '@components/admin/AdminEditorCard.vue';
import AdminImageUploader from '@components/admin/AdminImageUploader.vue';
import AdminIconSelect from '@components/admin/AdminIconSelect.vue';
import { SUPPORTERS_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import { createNewSupporter } from '@utils/HomeFormUtils';
import { SECTION_FIELDS } from '@definitions/sectionFields';
import type {
  ISupporterEditable,
  ISupporterReadonly,
  ISupportersEditable,
  ISupportersReadonly,
} from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: ISupportersEditable; readonly: ISupportersReadonly };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
  uploaded: [url: string];
}>();

// ============== VALIDATION ==============

const itemRules = SUPPORTERS_CONFIG.validationRules;
const sectionRules = SUPPORTERS_CONFIG.sectionRules;

// ============== CRUD ==============

function addSupporter(): void {
  if (props.forms.editable.items.length >= SUPPORTERS_CONFIG.items.max) return;
  const newItem = createNewSupporter();
  const editable: Record<string, unknown> = {};
  const readonly: Record<string, unknown> = {};
  for (const [key, mode] of Object.entries(SECTION_FIELDS.supporters.items)) {
    if (mode === 'editable') editable[key] = (newItem as Record<string, unknown>)[key];
    else readonly[key] = (newItem as Record<string, unknown>)[key];
  }
  props.forms.editable.items.push(editable as unknown as ISupporterEditable);
  props.forms.readonly.items.push(readonly as unknown as ISupporterReadonly);
  emit('changed');
}

function removeSupporter(index: number): void {
  if (props.forms.editable.items.length <= SUPPORTERS_CONFIG.items.min) return;
  props.forms.editable.items.splice(index, 1);
  props.forms.readonly.items.splice(index, 1);
  emit('changed');
}

function onDragEnd(evt: { oldIndex?: number; newIndex?: number }): void {
  const { oldIndex, newIndex } = evt;
  if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;
  const [item] = props.forms.readonly.items.splice(oldIndex, 1);
  props.forms.readonly.items.splice(newIndex, 0, item);
  emit('changed');
}
</script>

<template>
  <div class="supportersEditor">
    <!-- Metadados da secao -->
    <div class="supportersEditor__sectionFields">
      <CBInput
        :model-value="forms.editable.badge"
        :label="$t('admin.supporters.badge')"
        :rules="createValidationRules(sectionRules.badge)"
        @update:model-value="
          forms.editable.badge = $event;
          emit('changed');
        "
      />
      <CBInput
        :model-value="forms.editable.title"
        :label="$t('admin.supporters.sectionTitle')"
        :rules="createValidationRules(sectionRules.title)"
        @update:model-value="
          forms.editable.title = $event;
          emit('changed');
        "
      />
      <CBInput
        :model-value="forms.editable.subtitle"
        :label="$t('admin.supporters.subtitle')"
        @update:model-value="
          forms.editable.subtitle = $event;
          emit('changed');
        "
      />

      <CBSlider
        :model-value="forms.editable.marqueeSpeed"
        :min="SUPPORTERS_CONFIG.marqueeSpeed.min"
        :max="SUPPORTERS_CONFIG.marqueeSpeed.max"
        :step="1"
        :label="$t('admin.supporters.marqueeSpeed')"
        thumb-label="always"
        color="primary"
        @update:model-value="
          forms.editable.marqueeSpeed = $event;
          emit('changed');
        "
      />
    </div>

    <!-- Items -->
    <div class="supportersEditor__header">
      <CBLabel :text="$t('admin.supporters.listTitle')" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.items.length}/${SUPPORTERS_CONFIG.items.max}`"
        size="xs"
        class="supportersEditor__counter"
      />
    </div>

    <draggable
      :model-value="forms.editable.items"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="supportersEditor__ghost"
      @update:model-value="forms.editable.items.splice(0, forms.editable.items.length, ...$event)"
      @end="onDragEnd"
    >
      <template #item="{ element, index }: { element: ISupporterEditable; index: number }">
        <AdminEditorCard
          :title="$t('admin.supporters.item', { n: index + 1 })"
          :disabled="forms.editable.items.length <= SUPPORTERS_CONFIG.items.min"
          @remove="removeSupporter(index)"
        >
          <CBInput
            :model-value="element.name"
            :label="$t('admin.supporters.name')"
            :rules="createValidationRules(itemRules.name)"
            @update:model-value="
              element.name = $event;
              emit('changed');
            "
          />
          <AdminIconSelect
            :model-value="element.icon"
            :label="$t('admin.supporters.icon')"
            @update:model-value="
              element.icon = $event;
              emit('changed');
            "
          />

          <div class="supportersEditor__row">
            <CBInput
              :model-value="element.url"
              :label="$t('admin.supporters.website')"
              @update:model-value="
                element.url = $event;
                emit('changed');
              "
            />
            <CBInput
              :model-value="element.imageAlt"
              :label="$t('admin.supporters.logoAlt')"
              @update:model-value="
                element.imageAlt = $event;
                emit('changed');
              "
            />
          </div>

          <AdminImageUploader
            :model-value="element.image"
            category="supporters"
            :label="$t('admin.supporters.logo')"
            @update:model-value="
              element.image = $event;
              emit('changed');
            "
            @uploaded="emit('uploaded', $event)"
          />

          <CBSlider
            :model-value="element.logoSize"
            :min="SUPPORTERS_CONFIG.logoSize.min"
            :max="SUPPORTERS_CONFIG.logoSize.max"
            :step="2"
            :label="$t('admin.supporters.logoSize')"
            thumb-label="always"
            color="primary"
            @update:model-value="
              element.logoSize = $event;
              emit('changed');
            "
          />

          <!-- Preview do tamanho real -->
          <div class="supportersEditor__preview">
            <CBLabel
              :text="$t('admin.supporters.preview')"
              size="xs"
              class="supportersEditor__previewLabel"
            />
            <div class="supportersEditor__previewBox">
              <img
                v-if="element.image"
                :src="element.image"
                :alt="element.imageAlt || element.name"
                :style="{ height: `${element.logoSize}px`, width: 'auto', objectFit: 'contain' }"
              />
              <CBLabel
                v-else
                :text="element.name || '—'"
                size="lg"
                weight="bold"
                :style="{ height: `${element.logoSize}px`, lineHeight: `${element.logoSize}px` }"
              />
            </div>
          </div>
        </AdminEditorCard>
      </template>
    </draggable>

    <CBButton
      :label="$t('admin.supporters.add')"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="forms.editable.items.length >= SUPPORTERS_CONFIG.items.max"
      @click="addSupporter"
    />
  </div>
</template>

<style scoped>
.supportersEditor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.supportersEditor__sectionFields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 0.5rem;
}

.supportersEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.supportersEditor__counter {
  color: var(--text-tertiary);
}

.supportersEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.supportersEditor__preview {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.supportersEditor__previewLabel {
  color: var(--text-tertiary);
}

.supportersEditor__previewBox {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: 1px dashed var(--border-light);
  border-radius: 8px;
  background: var(--bg-subtle);
  min-height: 60px;
}

.supportersEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-wine-rgb), 0.05);
}

@media (max-width: 640px) {
  .supportersEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
