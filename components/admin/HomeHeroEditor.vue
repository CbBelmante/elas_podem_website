<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeHeroEditor — Editor da secao Hero.
 *
 * Campos de texto + stats array com CRUD e drag-and-drop.
 */

import { CBButton, CBInput, CBLabel, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import AdminEditorCard from '@components/admin/AdminEditorCard.vue';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminButtonVariantSelect from '@components/admin/AdminButtonVariantSelect.vue';
import AdminImageUploader from '@components/admin/AdminImageUploader.vue';
import AdminIconSelect from '@components/admin/AdminIconSelect.vue';
import { HERO_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import { createNewHeroStat } from '@utils/HomeFormUtils';
import type { IHeroEditable, IHeroStat } from '@appTypes/admin';

// ============== PROPS ==============

interface Props {
  forms: { editable: IHeroEditable };
}

const props = defineProps<Props>();

// ============== EMITS ==============

const emit = defineEmits<{
  changed: [];
  uploaded: [url: string];
}>();

// ============== VALIDATION ==============

const rules = HERO_CONFIG.validationRules;

// ============== STATS CRUD ==============

function addStat(): void {
  if (props.forms.editable.stats.length >= HERO_CONFIG.stats.max) return;
  props.forms.editable.stats.push(createNewHeroStat());
  emit('changed');
}

function removeStat(index: number): void {
  if (props.forms.editable.stats.length <= HERO_CONFIG.stats.min) return;
  props.forms.editable.stats.splice(index, 1);
  emit('changed');
}
</script>

<template>
  <div class="heroEditor">
    <div class="heroEditor__row">
      <CBInput
        v-model="forms.editable.badge"
        :label="$t('admin.hero.badge')"
        :rules="createValidationRules(rules.badge)"
        @update:model-value="emit('changed')"
      />

      <CBInput
        v-model="forms.editable.title"
        :label="$t('admin.hero.title')"
        :rules="createValidationRules(rules.title)"
        @update:model-value="emit('changed')"
      />
    </div>

    <CBTextarea
      v-model="forms.editable.description"
      :label="$t('admin.hero.description')"
      :rules="createValidationRules(rules.description)"
      @update:model-value="emit('changed')"
    />

    <div class="heroEditor__row">
      <CBInput
        v-model="forms.editable.btnDonate"
        :label="$t('admin.hero.btnDonate')"
        :rules="createValidationRules(rules.btnDonate)"
        @update:model-value="emit('changed')"
      />

      <CBInput
        v-model="forms.editable.btnHistory"
        :label="$t('admin.hero.btnHistory')"
        :rules="createValidationRules(rules.btnHistory)"
        @update:model-value="emit('changed')"
      />
    </div>

    <div class="heroEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnDonateColor"
        :label="$t('admin.hero.btnDonateColor')"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnDonateVariant"
        :label="$t('admin.hero.btnDonateVariant')"
        @update:model-value="emit('changed')"
      />
    </div>

    <div class="heroEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnHistoryColor"
        :label="$t('admin.hero.btnHistoryColor')"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnHistoryVariant"
        :label="$t('admin.hero.btnHistoryVariant')"
        @update:model-value="emit('changed')"
      />
    </div>

    <!-- Imagem de fundo do hero -->
    <AdminImageUploader
      v-model="forms.editable.heroImage"
      v-model:opacity="forms.editable.heroImageOpacity"
      category="hero"
      :label="$t('admin.hero.backgroundImage')"
      opacity-editable
      @update:model-value="emit('changed')"
      @update:opacity="emit('changed')"
      @uploaded="emit('uploaded', $event)"
    />

    <!-- Stats array -->
    <div class="heroEditor__statsSection">
      <div class="heroEditor__statsHeader">
        <CBLabel :text="$t('admin.hero.statsTitle')" weight="semibold" size="sm" />
        <CBLabel
          :text="`${forms.editable.stats.length}/${HERO_CONFIG.stats.max}`"
          size="xs"
          class="heroEditor__counter"
        />
      </div>

      <draggable
        v-model="forms.editable.stats"
        item-key="_dragId"
        handle=".dragHandle"
        :animation="200"
        ghost-class="heroEditor__ghost"
        @end="emit('changed')"
      >
        <template #item="{ element, index }: { element: IHeroStat; index: number }">
          <AdminEditorCard
            :title="$t('admin.hero.statsItem', { n: index + 1 })"
            :disabled="forms.editable.stats.length <= HERO_CONFIG.stats.min"
            @remove="removeStat(index)"
          >
            <div class="heroEditor__statRow">
              <CBInput
                v-model="element.number"
                :label="$t('admin.hero.statsNumber')"
                @update:model-value="emit('changed')"
              />
              <CBInput
                v-model="element.label"
                :label="$t('admin.hero.statsLabel')"
                @update:model-value="emit('changed')"
              />
            </div>
            <AdminIconSelect
              :model-value="element.icon"
              :label="$t('admin.hero.statsIcon')"
              @update:model-value="
                element.icon = $event;
                emit('changed');
              "
            />
          </AdminEditorCard>
        </template>
      </draggable>

      <CBButton
        :label="$t('admin.hero.addStat')"
        variant="outline"
        size="sm"
        prepend-icon="luc-plus"
        :rounded="10"
        :disabled="forms.editable.stats.length >= HERO_CONFIG.stats.max"
        @click="addStat"
      />
    </div>
  </div>
</template>

<style scoped>
.heroEditor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.heroEditor__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Stats section */
.heroEditor__statsSection {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.heroEditor__statsHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.heroEditor__counter {
  color: var(--text-tertiary);
}

.heroEditor__statRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.heroEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-wine-rgb), 0.05);
}

@media (max-width: 640px) {
  .heroEditor__row {
    grid-template-columns: 1fr;
  }

  .heroEditor__statRow {
    grid-template-columns: 1fr;
  }
}
</style>
