<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeSupportersEditor — Editor da secao Apoiadores.
 *
 * Array CRUD + drag-and-drop + image upload por item.
 * Tem readonly pareado (color).
 */

import { CBButton, CBIcon, CBInput, CBLabel, CBSelect } from '@cb/components';
import draggable from 'vuedraggable';
import HomeImageUploader from '@components/admin/HomeImageUploader.vue';
import { SUPPORTERS_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import { ICON_OPTIONS } from '@definitions/themeOptions';
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

// ============== ICON OPTIONS ==============

const iconSelectOptions = ICON_OPTIONS.map((opt) => ({
  value: opt.value,
  label: opt.label,
}));

// ============== CRUD ==============

function addSupporter(): void {
  if (props.forms.editable.items.length >= SUPPORTERS_CONFIG.items.max) return;
  const newItem = createNewSupporter();
  const editable: Record<string, unknown> = {};
  const readonly: Record<string, unknown> = {};
  for (const [key, mode] of Object.entries(SECTION_FIELDS.supporters)) {
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
        label="Badge"
        :rules="createValidationRules(sectionRules.badge)"
        @update:model-value="
          forms.editable.badge = $event;
          emit('changed');
        "
      />
      <CBInput
        :model-value="forms.editable.title"
        label="Titulo da Secao"
        :rules="createValidationRules(sectionRules.title)"
        @update:model-value="
          forms.editable.title = $event;
          emit('changed');
        "
      />
      <CBInput
        :model-value="forms.editable.subtitle"
        label="Subtitulo (opcional)"
        @update:model-value="
          forms.editable.subtitle = $event;
          emit('changed');
        "
      />
    </div>

    <!-- Items -->
    <div class="supportersEditor__header">
      <CBLabel text="Apoiadores" weight="semibold" size="sm" />
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
        <div class="supportersEditor__card">
          <div class="supportersEditor__cardHeader">
            <div class="dragHandle">
              <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
            </div>
            <CBLabel :text="`Apoiador ${index + 1}`" size="sm" weight="medium" />
            <CBButton
              variant="outline"
              size="sm"
              prepend-icon="luc-trash-2"
              :color="'var(--color-coral)'"
              :rounded="8"
              :disabled="forms.editable.items.length <= SUPPORTERS_CONFIG.items.min"
              @click="removeSupporter(index)"
            />
          </div>

          <div class="supportersEditor__fields">
            <div class="supportersEditor__row">
              <CBInput
                :model-value="element.name"
                label="Nome"
                :rules="createValidationRules(itemRules.name)"
                @update:model-value="
                  element.name = $event;
                  emit('changed');
                "
              />
              <CBSelect
                :model-value="element.icon"
                label="Icone"
                :items="iconSelectOptions"
                @update:model-value="
                  element.icon = $event;
                  emit('changed');
                "
              />
            </div>

            <div class="supportersEditor__row">
              <CBInput
                :model-value="element.url"
                label="Website (opcional)"
                @update:model-value="
                  element.url = $event;
                  emit('changed');
                "
              />
              <HomeImageUploader
                :model-value="element.image"
                category="supporters"
                label="Logo (opcional)"
                @update:model-value="
                  element.image = $event;
                  emit('changed');
                "
                @uploaded="emit('uploaded', $event)"
              />

              <CBInput
                :model-value="element.imageAlt"
                label="Alt do logo (acessibilidade)"
                @update:model-value="
                  element.imageAlt = $event;
                  emit('changed');
                "
              />
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <CBButton
      label="Adicionar Apoiador"
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

.supportersEditor__card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-light, #f8f9fa);
  border: 1px solid var(--border-light);
  border-radius: 10px;
}

.supportersEditor__cardHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.supportersEditor__cardHeader > :last-child {
  margin-left: auto;
}

.supportersEditor__fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.supportersEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.supportersEditor__ghost {
  opacity: 0.4;
  background: var(--bg-tint, rgba(230, 52, 107, 0.05));
}

.dragHandle {
  cursor: grab;
  padding: 0.25rem;
}

.dragHandle:active {
  cursor: grabbing;
}

@media (max-width: 640px) {
  .supportersEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
