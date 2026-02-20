<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeProgramsEditor — Editor da secao Programas.
 *
 * Array CRUD + drag-and-drop. Tem readonly pareado (color).
 */

import { CBButton, CBIcon, CBInput, CBLabel, CBSelect, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import { PROGRAMS_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import { ICON_OPTIONS } from '@definitions/themeOptions';
import { createNewProgram } from '@utils/HomeFormUtils';
import { SECTION_FIELDS } from '@definitions/sectionFields';
import type {
  IProgramEditable,
  IProgramReadonly,
  IProgramsEditable,
  IProgramsReadonly,
} from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: IProgramsEditable; readonly: IProgramsReadonly };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
}>();

// ============== VALIDATION ==============

const itemRules = PROGRAMS_CONFIG.validationRules;
const sectionRules = PROGRAMS_CONFIG.sectionRules;

// ============== ICON OPTIONS ==============

const iconSelectOptions = ICON_OPTIONS.map((opt) => ({
  value: opt.value,
  label: opt.label,
}));

// ============== CRUD ==============

function addProgram(): void {
  if (props.forms.editable.items.length >= PROGRAMS_CONFIG.items.max) return;
  const newItem = createNewProgram();
  const editable: Record<string, unknown> = {};
  const readonly: Record<string, unknown> = {};
  for (const [key, mode] of Object.entries(SECTION_FIELDS.programs)) {
    if (mode === 'editable') editable[key] = (newItem as Record<string, unknown>)[key];
    else readonly[key] = (newItem as Record<string, unknown>)[key];
  }
  props.forms.editable.items.push(editable as unknown as IProgramEditable);
  props.forms.readonly.items.push(readonly as unknown as IProgramReadonly);
  emit('changed');
}

function removeProgram(index: number): void {
  if (props.forms.editable.items.length <= PROGRAMS_CONFIG.items.min) return;
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
  <div class="programsEditor">
    <!-- Metadados da secao -->
    <div class="programsEditor__sectionFields">
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
    <div class="programsEditor__header">
      <CBLabel text="Programas" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.items.length}/${PROGRAMS_CONFIG.items.max}`"
        size="xs"
        class="programsEditor__counter"
      />
    </div>

    <draggable
      :model-value="forms.editable.items"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="programsEditor__ghost"
      @update:model-value="forms.editable.items.splice(0, forms.editable.items.length, ...$event)"
      @end="onDragEnd"
    >
      <template #item="{ element, index }: { element: IProgramEditable; index: number }">
        <div class="programsEditor__card">
          <div class="programsEditor__cardHeader">
            <div class="dragHandle">
              <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
            </div>
            <CBLabel :text="`Programa ${index + 1}`" size="sm" weight="medium" />
            <CBButton
              variant="outline"
              size="sm"
              prepend-icon="luc-trash-2"
              :color="'var(--color-coral)'"
              :rounded="8"
              :disabled="forms.editable.items.length <= PROGRAMS_CONFIG.items.min"
              @click="removeProgram(index)"
            />
          </div>

          <div class="programsEditor__fields">
            <div class="programsEditor__row">
              <CBInput
                :model-value="element.title"
                label="Titulo"
                :rules="createValidationRules(itemRules.title)"
                @update:model-value="
                  element.title = $event;
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

            <CBTextarea
              :model-value="element.description"
              label="Descricao"
              :rules="createValidationRules(itemRules.description)"
              @update:model-value="
                element.description = $event;
                emit('changed');
              "
            />

            <CBInput
              :model-value="element.link"
              label="Texto do Link"
              :rules="createValidationRules(itemRules.link)"
              @update:model-value="
                element.link = $event;
                emit('changed');
              "
            />
          </div>
        </div>
      </template>
    </draggable>

    <CBButton
      label="Adicionar Programa"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="forms.editable.items.length >= PROGRAMS_CONFIG.items.max"
      @click="addProgram"
    />
  </div>
</template>

<style scoped>
.programsEditor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.programsEditor__sectionFields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 0.5rem;
}

.programsEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.programsEditor__counter {
  color: var(--text-tertiary);
}

.programsEditor__card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-light, #f8f9fa);
  border: 1px solid var(--border-light);
  border-radius: 10px;
}

.programsEditor__cardHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.programsEditor__cardHeader > :last-child {
  margin-left: auto;
}

.programsEditor__fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.programsEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.programsEditor__ghost {
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
  .programsEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
