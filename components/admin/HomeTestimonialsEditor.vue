<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeTestimonialsEditor — Editor da secao Depoimentos.
 *
 * Section-level: switch autoplay + slider intervalo.
 * Array CRUD + drag-and-drop + image upload por item.
 * Sem readonly pareado (tudo editavel).
 */

import { CBButton, CBInput, CBLabel, CBSlider, CBSwitch, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import AdminEditorCard from '@components/admin/AdminEditorCard.vue';
import AdminImageUploader from '@components/admin/AdminImageUploader.vue';
import { TESTIMONIALS_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import { createNewTestimonial } from '@utils/HomeFormUtils';
import type { ITestimonialEditable, ITestimonialsEditable } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: ITestimonialsEditable };
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
  if (props.forms.editable.items.length >= TESTIMONIALS_CONFIG.items.max) return;
  props.forms.editable.items.push(createNewTestimonial() as unknown as ITestimonialEditable);
  emit('changed');
}

function removeTestimonial(index: number): void {
  if (props.forms.editable.items.length <= TESTIMONIALS_CONFIG.items.min) return;
  props.forms.editable.items.splice(index, 1);
  emit('changed');
}
</script>

<template>
  <div class="testimonialsEditor">
    <!-- Metadados da secao -->
    <div class="testimonialsEditor__sectionFields">
      <CBSwitch
        :model-value="forms.editable.autoplay"
        :label="$t('admin.testimonials.autoplay')"
        @update:model-value="
          forms.editable.autoplay = $event;
          emit('changed');
        "
      />

      <CBSlider
        v-if="forms.editable.autoplay"
        :model-value="forms.editable.autoplayInterval"
        :min="TESTIMONIALS_CONFIG.autoplayInterval.min"
        :max="TESTIMONIALS_CONFIG.autoplayInterval.max"
        :step="500"
        :label="$t('admin.testimonials.autoplayInterval')"
        thumb-label="always"
        color="primary"
        @update:model-value="
          forms.editable.autoplayInterval = $event;
          emit('changed');
        "
      />
    </div>

    <!-- Items -->
    <div class="testimonialsEditor__header">
      <CBLabel :text="$t('admin.testimonials.listTitle')" weight="semibold" size="sm" />
      <CBLabel
        :text="`${forms.editable.items.length}/${TESTIMONIALS_CONFIG.items.max}`"
        size="xs"
        class="testimonialsEditor__counter"
      />
    </div>

    <draggable
      v-model="forms.editable.items"
      item-key="_dragId"
      handle=".dragHandle"
      :animation="200"
      ghost-class="testimonialsEditor__ghost"
      @end="emit('changed')"
    >
      <template #item="{ element, index }: { element: ITestimonialEditable; index: number }">
        <AdminEditorCard
          :title="$t('admin.testimonials.item', { n: index + 1 })"
          :disabled="forms.editable.items.length <= TESTIMONIALS_CONFIG.items.min"
          @remove="removeTestimonial(index)"
        >
          <CBTextarea
            :model-value="element.quote"
            :label="$t('admin.testimonials.quote')"
            :rules="createValidationRules(rules.quote)"
            @update:model-value="
              element.quote = $event;
              emit('changed');
            "
          />

          <div class="testimonialsEditor__row">
            <CBInput
              :model-value="element.name"
              :label="$t('admin.testimonials.name')"
              @update:model-value="
                element.name = $event;
                emit('changed');
              "
            />

            <CBInput
              :model-value="element.role"
              :label="$t('admin.testimonials.role')"
              @update:model-value="
                element.role = $event;
                emit('changed');
              "
            />
          </div>

          <div class="testimonialsEditor__row">
            <CBInput
              :model-value="element.initials"
              :label="$t('admin.testimonials.initials')"
              @update:model-value="
                element.initials = $event;
                emit('changed');
              "
            />

            <CBInput
              :model-value="element.imageAlt"
              :label="$t('admin.testimonials.photoAlt')"
              @update:model-value="
                element.imageAlt = $event;
                emit('changed');
              "
            />
          </div>

          <AdminImageUploader
            :model-value="element.image"
            category="testimonials"
            :label="$t('admin.testimonials.photo')"
            @update:model-value="
              element.image = $event;
              emit('changed');
            "
            @uploaded="emit('uploaded', $event)"
          />
        </AdminEditorCard>
      </template>
    </draggable>

    <CBButton
      :label="$t('admin.testimonials.add')"
      variant="outline"
      size="sm"
      prepend-icon="luc-plus"
      :rounded="10"
      :disabled="forms.editable.items.length >= TESTIMONIALS_CONFIG.items.max"
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

.testimonialsEditor__sectionFields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 0.5rem;
}

.testimonialsEditor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.testimonialsEditor__counter {
  color: var(--text-tertiary);
}

.testimonialsEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.testimonialsEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-wine-rgb), 0.05);
}

@media (max-width: 640px) {
  .testimonialsEditor__row {
    grid-template-columns: 1fr;
  }
}
</style>
