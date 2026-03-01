<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- editors mutam forms via ref do parent */
/**
 * 🧩 HomeHeroEditor — Editor da secao Hero.
 *
 * Campos de texto + stats array com CRUD e drag-and-drop.
 */

import { CBButton, CBIcon, CBInput, CBLabel, CBSelect, CBTextarea } from '@cb/components';
import draggable from 'vuedraggable';
import AdminColorPicker from '@components/admin/AdminColorPicker.vue';
import AdminButtonVariantSelect from '@components/admin/AdminButtonVariantSelect.vue';
import AdminImageUploader from '@components/admin/AdminImageUploader.vue';
import { HERO_CONFIG } from '@definitions/validationConfigs';
import { createValidationRules } from '@utils/validationRules';
import { ICON_OPTIONS } from '@definitions/themeOptions';
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

// ============== ICON OPTIONS (para CBSelect) ==============

const iconSelectOptions = ICON_OPTIONS.map((opt) => ({
  value: opt.value,
  label: opt.label,
}));

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
        label="Badge"
        :rules="createValidationRules(rules.badge)"
        @update:model-value="emit('changed')"
      />

      <CBInput
        v-model="forms.editable.title"
        label="Titulo"
        :rules="createValidationRules(rules.title)"
        @update:model-value="emit('changed')"
      />
    </div>

    <CBTextarea
      v-model="forms.editable.description"
      label="Descricao"
      :rules="createValidationRules(rules.description)"
      @update:model-value="emit('changed')"
    />

    <div class="heroEditor__row">
      <CBInput
        v-model="forms.editable.btnDonate"
        label="Botao Doar"
        :rules="createValidationRules(rules.btnDonate)"
        @update:model-value="emit('changed')"
      />

      <CBInput
        v-model="forms.editable.btnHistory"
        label="Botao Historia"
        :rules="createValidationRules(rules.btnHistory)"
        @update:model-value="emit('changed')"
      />
    </div>

    <div class="heroEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnDonateColor"
        label="Cor/Gradiente Botao Doar"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnDonateVariant"
        label="Variante Botao Doar"
        @update:model-value="emit('changed')"
      />
    </div>

    <div class="heroEditor__row">
      <AdminColorPicker
        v-model="forms.editable.btnHistoryColor"
        label="Cor/Gradiente Botao Historia"
        @update:model-value="emit('changed')"
      />
      <AdminButtonVariantSelect
        v-model="forms.editable.btnHistoryVariant"
        label="Variante Botao Historia"
        @update:model-value="emit('changed')"
      />
    </div>

    <!-- Imagem de fundo do hero -->
    <AdminImageUploader
      v-model="forms.editable.heroImage"
      v-model:opacity="forms.editable.heroImageOpacity"
      category="hero"
      label="Imagem de Fundo (aparece opaca atras do conteudo)"
      opacity-editable
      @update:model-value="emit('changed')"
      @update:opacity="emit('changed')"
      @uploaded="emit('uploaded', $event)"
    />

    <!-- Stats array -->
    <div class="heroEditor__statsSection">
      <div class="heroEditor__statsHeader">
        <CBLabel text="Estatisticas" weight="semibold" size="sm" />
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
          <div class="heroEditor__statCard">
            <div class="dragHandle">
              <CBIcon icon="luc-grip-vertical" size="1rem" color="var(--text-tertiary)" />
            </div>

            <div class="heroEditor__statFields">
              <CBSelect
                v-model="element.icon"
                label="Icone"
                :items="iconSelectOptions"
                @update:model-value="emit('changed')"
              />
              <CBInput
                v-model="element.number"
                label="Numero"
                @update:model-value="emit('changed')"
              />
              <CBInput
                v-model="element.label"
                label="Label"
                @update:model-value="emit('changed')"
              />
            </div>

            <CBButton
              variant="outline"
              size="sm"
              prepend-icon="luc-trash-2"
              :color="'var(--color-coral)'"
              :rounded="8"
              :disabled="forms.editable.stats.length <= HERO_CONFIG.stats.min"
              @click="removeStat(index)"
            />
          </div>
        </template>
      </draggable>

      <CBButton
        label="Adicionar Stat"
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

.heroEditor__statCard {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--bg-light, #f8f9fa);
  border: 1px solid var(--border-light);
  border-radius: 10px;
}

.heroEditor__statFields {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}

.heroEditor__ghost {
  opacity: 0.4;
  background: rgba(var(--color-vinho-rgb), 0.05);
}

.dragHandle {
  cursor: grab;
  padding: 0.5rem 0.125rem;
  display: flex;
  align-items: center;
}

.dragHandle:active {
  cursor: grabbing;
}

@media (max-width: 640px) {
  .heroEditor__row {
    grid-template-columns: 1fr;
  }

  .heroEditor__statFields {
    grid-template-columns: 1fr;
  }

  .heroEditor__statCard {
    flex-direction: column;
  }
}
</style>
