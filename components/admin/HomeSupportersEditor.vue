<script setup lang="ts">
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
import type { ISupporterEditable, ISupporterReadonly } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: ISupporterEditable[]; readonly: ISupporterReadonly[] };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
  uploaded: [url: string];
}>();

// ============== VALIDATION ==============

const rules = SUPPORTERS_CONFIG.validationRules;

// ============== ICON OPTIONS ==============

const iconSelectOptions = ICON_OPTIONS.map((opt) => ({
  value: opt.value,
  label: opt.label,
}));

// ============== CRUD ==============

function addSupporter(): void {
  if (props.forms.editable.length >= SUPPORTERS_CONFIG.items.max) return;
  const newItem = createNewSupporter();
  const editable: Record<string, unknown> = {};
  const readonly: Record<string, unknown> = {};
  for (const [key, mode] of Object.entries(SECTION_FIELDS.supporters)) {
    if (mode === 'editable') editable[key] = (newItem as Record<string, unknown>)[key];
    else readonly[key] = (newItem as Record<string, unknown>)[key];
  }
  props.forms.editable.push(editable as unknown as ISupporterEditable);
  props.forms.readonly.push(readonly as unknown as ISupporterReadonly);
  emit('changed');
}

function removeSupporter(index: number): void {
  if (props.forms.editable.length <= SUPPORTERS_CONFIG.items.min) return;
  props.forms.editable.splice(index, 1);
  props.forms.readonly.splice(index, 1);
  emit('changed');
}

function onDragEnd(evt: { oldIndex?: number; newIndex?: number }): void {
  const { oldIndex, newIndex } = evt;
  if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;
  const [item] = props.forms.readonly.splice(oldIndex, 1);
  props.forms.readonly.splice(newIndex, 0, item);
  emit('changed');
}
</script>

<template>
  <div class="supportersEditor">
    <div class="supportersEditor__header">
      <CBLabel text="Apoiadores" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.length}/${SUPPORTERS_CONFIG.items.max}`"
        size="xs"
        class="supportersEditor__counter"
      />
    </div>

    <draggable
      :model-value="forms.editable"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="supportersEditor__ghost"
      @update:model-value="forms.editable.splice(0, forms.editable.length, ...$event)"
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
              :disabled="forms.editable.length <= SUPPORTERS_CONFIG.items.min"
              @click="removeSupporter(index)"
            />
          </div>

          <div class="supportersEditor__fields">
            <div class="supportersEditor__row">
              <CBInput
                :model-value="element.name"
                label="Nome"
                :rules="createValidationRules(rules.name)"
                @update:model-value="element.name = $event; emit('changed')"
              />
              <CBSelect
                :model-value="element.icon"
                label="Icone"
                :items="iconSelectOptions"
                @update:model-value="element.icon = $event; emit('changed')"
              />
            </div>

            <div class="supportersEditor__row">
              <CBInput
                :model-value="element.url"
                label="Website (opcional)"
                @update:model-value="element.url = $event; emit('changed')"
              />
              <HomeImageUploader
                :model-value="element.image"
                category="supporters"
                label="Logo (opcional)"
                @update:model-value="element.image = $event; emit('changed')"
                @uploaded="emit('uploaded', $event)"
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
      :disabled="forms.editable.length >= SUPPORTERS_CONFIG.items.max"
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
