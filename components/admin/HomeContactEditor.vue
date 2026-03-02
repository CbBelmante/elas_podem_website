<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeContactEditor — Editor da secao Contato.
 *
 * Secao mais complexa: campos top-level + methods array (CRUD + drag, readonly pareado)
 * + formSubjects array (CRUD + drag, strings simples).
 */

import { CBButton, CBIcon, CBInput, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import { CONTACT_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminIconSelect from '@components/admin/AdminIconSelect.vue';
import { createNewContactMethod } from '@utils/HomeFormUtils';
import { SECTION_FIELDS } from '@definitions/sectionFields';
import type {
  IContactEditable,
  IContactReadonly,
  IContactMethodEditable,
  IContactMethodReadonly,
} from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: IContactEditable; readonly: IContactReadonly };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
}>();

// ============== VALIDATION ==============

const rules = CONTACT_CONFIG.validationRules;

// ============== METHODS CRUD ==============

function addMethod(): void {
  if (props.forms.editable.methods.length >= CONTACT_CONFIG.methods.max) return;
  const newItem = createNewContactMethod();
  const editable: Record<string, unknown> = {};
  const readonly: Record<string, unknown> = {};
  for (const [key, mode] of Object.entries(SECTION_FIELDS.contactMethod)) {
    if (mode === 'editable') editable[key] = (newItem as Record<string, unknown>)[key];
    else readonly[key] = (newItem as Record<string, unknown>)[key];
  }
  props.forms.editable.methods.push(editable as unknown as IContactMethodEditable);
  props.forms.readonly.methods.push(readonly as unknown as IContactMethodReadonly);
  emit('changed');
}

function removeMethod(index: number): void {
  if (props.forms.editable.methods.length <= CONTACT_CONFIG.methods.min) return;
  props.forms.editable.methods.splice(index, 1);
  props.forms.readonly.methods.splice(index, 1);
  emit('changed');
}

function onMethodsDragEnd(evt: { oldIndex?: number; newIndex?: number }): void {
  const { oldIndex, newIndex } = evt;
  if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;
  const [item] = props.forms.readonly.methods.splice(oldIndex, 1);
  props.forms.readonly.methods.splice(newIndex, 0, item);
  emit('changed');
}

// ============== SUBJECTS CRUD ==============

function addSubject(): void {
  if (props.forms.editable.formSubjects.length >= CONTACT_CONFIG.formSubjects.max) return;
  props.forms.editable.formSubjects.push('');
  emit('changed');
}

function removeSubject(index: number): void {
  if (props.forms.editable.formSubjects.length <= CONTACT_CONFIG.formSubjects.min) return;
  props.forms.editable.formSubjects.splice(index, 1);
  emit('changed');
}

function updateSubject(index: number, value: string): void {
  props.forms.editable.formSubjects[index] = value;
  emit('changed');
}
</script>

<template>
  <div class="contactEditor">
    <!-- Campos top-level -->
    <div class="contactEditor__topFields">
      <CBInput
        :model-value="forms.editable.badge"
        :label="$t('admin.contact.badge')"
        :rules="createValidationRules(rules.badge)"
        @update:model-value="
          forms.editable.badge = $event;
          emit('changed');
        "
      />

      <CBInput
        :model-value="forms.editable.title"
        :label="$t('admin.contact.title')"
        :rules="createValidationRules(rules.title)"
        @update:model-value="
          forms.editable.title = $event;
          emit('changed');
        "
      />

      <CBTextarea
        :model-value="forms.editable.description"
        :label="$t('admin.contact.description')"
        :rules="createValidationRules(rules.description)"
        @update:model-value="
          forms.editable.description = $event;
          emit('changed');
        "
      />
    </div>

    <!-- Metodos de contato -->
    <div class="contactEditor__section">
      <div class="contactEditor__sectionHeader">
        <CBLabel :text="$t('admin.contact.methodsTitle')" weight="semibold" size="sm" />
        <CBLabel
          :text="`${forms.editable.methods.length}/${CONTACT_CONFIG.methods.max}`"
          size="xs"
          class="contactEditor__counter"
        />
      </div>

      <draggable
        :model-value="forms.editable.methods"
        item-key="_dragId"
        handle=".dragHandle"
        :animation="200"
        ghost-class="contactEditor__ghost"
        @update:model-value="
          forms.editable.methods.splice(0, forms.editable.methods.length, ...$event)
        "
        @end="onMethodsDragEnd"
      >
        <template #item="{ element, index }: { element: IContactMethodEditable; index: number }">
          <div class="contactEditor__card">
            <div class="contactEditor__cardHeader">
              <div class="dragHandle">
                <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
              </div>
              <CBLabel
                :text="$t('admin.contact.methodItem', { n: index + 1 })"
                size="sm"
                weight="medium"
              />
              <CBButton
                variant="outline"
                size="sm"
                prepend-icon="luc-trash-2"
                :color="'var(--color-coral)'"
                :rounded="8"
                :disabled="forms.editable.methods.length <= CONTACT_CONFIG.methods.min"
                @click="removeMethod(index)"
              />
            </div>

            <div class="contactEditor__methodFields">
              <div class="contactEditor__row">
                <CBInput
                  :model-value="element.label"
                  :label="$t('admin.contact.methodLabel')"
                  @update:model-value="
                    element.label = $event;
                    emit('changed');
                  "
                />
                <CBInput
                  :model-value="element.value"
                  :label="$t('admin.contact.methodValue')"
                  @update:model-value="
                    element.value = $event;
                    emit('changed');
                  "
                />
              </div>
              <div class="contactEditor__row">
                <AdminIconSelect
                  :model-value="element.icon"
                  :label="$t('admin.contact.methodIcon')"
                  @update:model-value="
                    element.icon = $event;
                    emit('changed');
                  "
                />
                <AdminColorPicker
                  :model-value="element.color"
                  :label="$t('admin.contact.methodColor')"
                  :unavailable-modes="['gradients', 'custom']"
                  @update:model-value="
                    element.color = $event;
                    emit('changed');
                  "
                />
              </div>
              <CBInput
                :model-value="element.url"
                :label="$t('admin.contact.methodUrl')"
                @update:model-value="
                  element.url = $event;
                  emit('changed');
                "
              />
            </div>
          </div>
        </template>
      </draggable>

      <CBButton
        :label="$t('admin.contact.addMethod')"
        variant="outline"
        size="sm"
        prepend-icon="luc-plus"
        :rounded="10"
        :disabled="forms.editable.methods.length >= CONTACT_CONFIG.methods.max"
        @click="addMethod"
      />
    </div>

    <!-- Assuntos do formulario -->
    <div class="contactEditor__section">
      <div class="contactEditor__sectionHeader">
        <CBLabel :text="$t('admin.contact.subjectsTitle')" weight="semibold" size="sm" />
        <CBLabel
          :text="`${forms.editable.formSubjects.length}/${CONTACT_CONFIG.formSubjects.max}`"
          size="xs"
          class="contactEditor__counter"
        />
      </div>

      <draggable
        v-model="forms.editable.formSubjects"
        :item-key="(_: string, i: number) => i"
        handle=".dragHandle"
        :animation="200"
        ghost-class="contactEditor__ghost"
        @end="emit('changed')"
      >
        <template #item="{ index }: { index: number }">
          <div class="contactEditor__subjectRow">
            <div class="dragHandle">
              <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
            </div>
            <CBInput
              :model-value="forms.editable.formSubjects[index]"
              :label="$t('admin.contact.subjectItem', { n: index + 1 })"
              @update:model-value="updateSubject(index, $event)"
            />
            <CBButton
              variant="outline"
              size="sm"
              prepend-icon="luc-trash-2"
              :color="'var(--color-coral)'"
              :rounded="8"
              :disabled="forms.editable.formSubjects.length <= CONTACT_CONFIG.formSubjects.min"
              @click="removeSubject(index)"
            />
          </div>
        </template>
      </draggable>

      <CBButton
        :label="$t('admin.contact.addSubject')"
        variant="outline"
        size="sm"
        prepend-icon="luc-plus"
        :rounded="10"
        :disabled="forms.editable.formSubjects.length >= CONTACT_CONFIG.formSubjects.max"
        @click="addSubject"
      />
    </div>
  </div>
</template>

<style scoped>
.contactEditor {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contactEditor__topFields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contactEditor__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-light);
}

.contactEditor__sectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contactEditor__counter {
  color: var(--text-tertiary);
}

.contactEditor__card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-light, #f8f9fa);
  border: 1px solid var(--border-light);
  border-radius: 10px;
}

.contactEditor__cardHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.contactEditor__cardHeader > :last-child {
  margin-left: auto;
}

.contactEditor__methodFields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contactEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.contactEditor__subjectRow {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.contactEditor__subjectRow > :nth-child(2) {
  flex: 1;
}

.contactEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-vinho-rgb), 0.05);
}

.dragHandle {
  cursor: grab;
  padding: 0.25rem;
}

.dragHandle:active {
  cursor: grabbing;
}

@media (max-width: 640px) {
  .contactEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
