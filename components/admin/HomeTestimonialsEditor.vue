<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeTestimonialsEditor — Editor da secao Depoimentos.
 *
 * Array CRUD + drag-and-drop + image upload por item.
 * Sem readonly pareado (tudo editavel).
 */

import { CBButton, CBIcon, CBInput, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import HomeImageUploader from '@components/admin/HomeImageUploader.vue';
import { TESTIMONIALS_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import { createNewTestimonial } from '@utils/HomeFormUtils';
import type { ITestimonialEditable } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: ITestimonialEditable[] };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
  uploaded: [url: string];
}>();

// ============== VALIDATION ==============

const rules = TESTIMONIALS_CONFIG.validationRules;

// ============== CRUD ==============

function addTestimonial(): void {
  if (props.forms.editable.length >= TESTIMONIALS_CONFIG.items.max) return;
  props.forms.editable.push(createNewTestimonial() as unknown as ITestimonialEditable);
  emit('changed');
}

function removeTestimonial(index: number): void {
  if (props.forms.editable.length <= TESTIMONIALS_CONFIG.items.min) return;
  props.forms.editable.splice(index, 1);
  emit('changed');
}
</script>

<template>
  <div class="testimonialsEditor">
    <div class="testimonialsEditor__header">
      <CBLabel text="Depoimentos" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.length}/${TESTIMONIALS_CONFIG.items.max}`"
        size="xs"
        class="testimonialsEditor__counter"
      />
    </div>

    <draggable
      v-model="forms.editable"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="testimonialsEditor__ghost"
      @end="emit('changed')"
    >
      <template #item="{ element, index }: { element: ITestimonialEditable; index: number }">
        <div class="testimonialsEditor__card">
          <div class="testimonialsEditor__cardHeader">
            <div class="dragHandle">
              <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
            </div>
            <CBLabel :text="`Depoimento ${index + 1}`" size="sm" weight="medium" />
            <CBButton
              variant="outline"
              size="sm"
              prepend-icon="luc-trash-2"
              :color="'var(--color-coral)'"
              :rounded="8"
              :disabled="forms.editable.length <= TESTIMONIALS_CONFIG.items.min"
              @click="removeTestimonial(index)"
            />
          </div>

          <div class="testimonialsEditor__fields">
            <CBTextarea
              :model-value="element.quote"
              label="Citacao"
              :rules="createValidationRules(rules.quote)"
              @update:model-value="
                element.quote = $event;
                emit('changed');
              "
            />

            <div class="testimonialsEditor__row">
              <CBInput
                :model-value="element.name"
                label="Nome"
                :rules="createValidationRules(rules.name)"
                @update:model-value="
                  element.name = $event;
                  emit('changed');
                "
              />

              <CBInput
                :model-value="element.role"
                label="Funcao"
                :rules="createValidationRules(rules.role)"
                @update:model-value="
                  element.role = $event;
                  emit('changed');
                "
              />
            </div>

            <div class="testimonialsEditor__row">
              <CBInput
                :model-value="element.initials"
                label="Iniciais (ex: ED)"
                @update:model-value="
                  element.initials = $event;
                  emit('changed');
                "
              />

              <HomeImageUploader
                :model-value="element.image"
                category="testimonials"
                label="Foto (opcional)"
                @update:model-value="
                  element.image = $event;
                  emit('changed');
                "
                @uploaded="emit('uploaded', $event)"
              />
            </div>
          </div>
        </div>
      </template>
    </draggable>

    <CBButton
      label="Adicionar Depoimento"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="forms.editable.length >= TESTIMONIALS_CONFIG.items.max"
      @click="addTestimonial"
    />
  </div>
</template>

<style scoped>
.testimonialsEditor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.testimonialsEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.testimonialsEditor__counter {
  color: var(--text-tertiary);
}

.testimonialsEditor__card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-light, #f8f9fa);
  border: 1px solid var(--border-light);
  border-radius: 10px;
}

.testimonialsEditor__cardHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.testimonialsEditor__cardHeader > :last-child {
  margin-left: auto;
}

.testimonialsEditor__fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.testimonialsEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.testimonialsEditor__ghost {
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
  .testimonialsEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
