<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeSeoEditor — Editor da secao SEO.
 *
 * Campos de texto com char counter + keywords array (CRUD + drag) + image upload.
 * Tem readonly pareado (og config).
 */

import { CBButton, CBIcon, CBInput, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import HomeImageUploader from '@components/admin/HomeImageUploader.vue';
import { SEO_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import type { ISeoEditable, ISeoReadonly } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: ISeoEditable; readonly: ISeoReadonly };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
  uploaded: [url: string];
}>();

// ============== VALIDATION ==============

const rules = SEO_CONFIG.validationRules;

// ============== KEYWORDS CRUD ==============

function addKeyword(): void {
  if (props.forms.editable.keywords.length >= SEO_CONFIG.keywords.max) return;
  props.forms.editable.keywords.push('');
  emit('changed');
}

function removeKeyword(index: number): void {
  if (props.forms.editable.keywords.length <= SEO_CONFIG.keywords.min) return;
  props.forms.editable.keywords.splice(index, 1);
  emit('changed');
}

function updateKeyword(index: number, value: string): void {
  props.forms.editable.keywords[index] = value;
  emit('changed');
}
</script>

<template>
  <div class="seoEditor">
    <!-- Title com counter -->
    <div class="seoEditor__field">
      <CBInput
        :model-value="forms.editable.title"
        label="Titulo SEO"
        :rules="createValidationRules(rules.title)"
        @update:model-value="
          forms.editable.title = $event;
          emit('changed');
        "
      />
      <span
        class="seoEditor__charCount"
        :class="{ 'seoEditor__charCount--warn': forms.editable.title.length > 55 }"
      >
        {{ forms.editable.title.length }}/{{ rules.title.maxLength }}
      </span>
    </div>

    <!-- Description com counter -->
    <div class="seoEditor__field">
      <CBTextarea
        :model-value="forms.editable.description"
        label="Descricao SEO"
        :rules="createValidationRules(rules.description)"
        @update:model-value="
          forms.editable.description = $event;
          emit('changed');
        "
      />
      <span
        class="seoEditor__charCount"
        :class="{ 'seoEditor__charCount--warn': forms.editable.description.length > 150 }"
      >
        {{ forms.editable.description.length }}/{{ rules.description.maxLength }}
      </span>
    </div>

    <!-- Keywords -->
    <div class="seoEditor__section">
      <div class="seoEditor__sectionHeader">
        <CBLabel text="Keywords" weight="semibold" size="sm" />
        <CBLabel
          :text="`${forms.editable.keywords.length}/${SEO_CONFIG.keywords.max}`"
          size="xs"
          class="seoEditor__counter"
        />
      </div>

      <draggable
        v-model="forms.editable.keywords"
        :item-key="(_: string, i: number) => i"
        handle=".dragHandle"
        :animation="200"
        ghost-class="seoEditor__ghost"
        @end="emit('changed')"
      >
        <template #item="{ index }: { index: number }">
          <div class="seoEditor__keywordRow">
            <div class="dragHandle">
              <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
            </div>
            <CBInput
              :model-value="forms.editable.keywords[index]"
              :label="`Keyword ${index + 1}`"
              @update:model-value="updateKeyword(index, $event)"
            />
            <CBButton
              variant="outline"
              size="sm"
              prepend-icon="luc-trash-2"
              :color="'var(--color-coral)'"
              :rounded="8"
              :disabled="forms.editable.keywords.length <= SEO_CONFIG.keywords.min"
              @click="removeKeyword(index)"
            />
          </div>
        </template>
      </draggable>

      <CBButton
        label="Adicionar Keyword"
        variant="outline"
        size="sm"
        prepend-icon="luc-plus"
        :rounded="10"
        :disabled="forms.editable.keywords.length >= SEO_CONFIG.keywords.max"
        @click="addKeyword"
      />
    </div>

    <!-- OG Image -->
    <HomeImageUploader
      :model-value="forms.editable.ogImage"
      category="seo"
      label="Imagem OG (Open Graph)"
      @update:model-value="
        forms.editable.ogImage = $event;
        emit('changed');
      "
      @uploaded="emit('uploaded', $event)"
    />
  </div>
</template>

<style scoped>
.seoEditor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.seoEditor__field {
  position: relative;
}

.seoEditor__charCount {
  position: absolute;
  bottom: 4px;
  right: 8px;
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  font-family: var(--font-body);
}

.seoEditor__charCount--warn {
  color: var(--color-coral, #ee4a55);
}

.seoEditor__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.seoEditor__sectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.seoEditor__counter {
  color: var(--text-tertiary);
}

.seoEditor__keywordRow {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.seoEditor__keywordRow > :nth-child(2) {
  flex: 1;
}

.seoEditor__ghost {
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
</style>
