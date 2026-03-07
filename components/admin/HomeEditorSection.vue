<script setup lang="ts">
/**
 * 🧩 HomeEditorSection — Wrapper colapsavel generico para secoes do editor.
 *
 * Reutilizado 8 vezes no homeEdit.vue, uma por secao.
 * Exibe header clicavel, badges de status, erros e botoes de acao.
 * Usa CBCard com header slot para manter padrao cbcomponents.
 */

import type { PropType } from 'vue';
import { CBBadge, CBButton, CBCard, CBIcon, CBLabel } from '@cb/components';

// ============== PROPS ==============

defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  sectionName: {
    type: String,
    required: true,
  },
  expanded: {
    type: Boolean,
    required: true,
  },
  errors: {
    type: Array as PropType<string[]>,
    required: true,
  },
  isSaving: {
    type: Boolean,
    required: true,
  },
  hasChanges: {
    type: Boolean,
    required: true,
  },
});

// ============== EMITS ==============

defineEmits<{
  toggle: [];
  save: [];
  discard: [];
}>();
</script>

<template>
  <CBCard
    density="comfortable"
    :rounded="16"
    class="editorSection"
    :class="{ 'editorSection--expanded': expanded }"
  >
    <template #header>
      <button class="editorSection__headerBtn" type="button" @click="$emit('toggle')">
        <div class="editorSection__headerLeft">
          <div class="editorSection__iconWrapper">
            <CBIcon :icon size="1rem" color="#ffffff" />
          </div>
          <CBLabel :text="title" weight="semibold" />
          <CBBadge
            v-if="errors.length"
            :content="$t('admin.editor.errors', errors.length)"
            variant="outline"
            size="xs"
            class="editorSection__errorBadge"
          />
          <CBBadge
            v-if="hasChanges && !errors.length"
            :content="$t('admin.editor.changed')"
            variant="outline"
            size="xs"
            class="editorSection__changedBadge"
          />
        </div>
        <CBIcon
          :icon="expanded ? 'luc-chevron-up' : 'luc-chevron-down'"
          size="1.25rem"
          color="var(--text-tertiary)"
        />
      </button>
    </template>

    <!-- Body colapsavel -->
    <div v-show="expanded" class="editorSection__body">
      <!-- Erros de validacao -->
      <div v-if="errors.length" class="editorSection__errors">
        <div v-for="(err, i) in errors" :key="i" class="editorSection__errorItem">
          <CBIcon icon="luc-alert-circle" size="0.875rem" color="var(--color-coral)" />
          <span class="editorSection__errorText">{{ err }}</span>
        </div>
      </div>

      <!-- Conteudo da secao (slot) -->
      <div class="editorSection__content">
        <slot />
      </div>

      <!-- Botoes de acao -->
      <div class="editorSection__actions">
        <CBButton
          :label="$t('admin.editor.discard')"
          variant="outline"
          size="sm"
          :rounded="10"
          :disabled="!hasChanges || isSaving"
          @click="$emit('discard')"
        />
        <CBButton
          :label="$t('admin.editor.save')"
          size="sm"
          :bg-gradient="'var(--gradient-wine)'"
          :rounded="10"
          :loading="isSaving"
          :disabled="!hasChanges"
          @click="$emit('save')"
        />
      </div>
    </div>
  </CBCard>
</template>

<style scoped>
.editorSection {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.editorSection--expanded {
  box-shadow: var(--shadow-lg);
}

/* Header button (dentro do slot #header do CBCard) */
.editorSection__headerBtn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.editorSection__headerBtn:hover {
  background: rgba(var(--color-wine-rgb), 0.03);
}

.editorSection__headerLeft {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.editorSection__iconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--gradient-wine-rose);
  flex-shrink: 0;
}

.editorSection__errorBadge {
  color: var(--color-coral);
  border-color: var(--color-coral);
}

.editorSection__changedBadge {
  color: var(--color-olive);
  border-color: var(--color-olive);
}

/* Body */
.editorSection__body {
  padding: 1.25rem;
}

/* Erros */
.editorSection__errors {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background: rgba(238, 74, 85, 0.06);
  border-radius: 8px;
  border: 1px solid rgba(238, 74, 85, 0.15);
}

.editorSection__errorItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.editorSection__errorText {
  font-size: 0.8125rem;
  color: var(--color-coral);
  font-family: var(--font-body);
}

/* Conteudo */
.editorSection__content {
  margin-bottom: 1.25rem;
}

/* Acoes */
.editorSection__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

/* Responsive */
@media (max-width: 640px) {
  .editorSection__body {
    padding: 1rem;
  }

  .editorSection__actions {
    flex-direction: column;
  }
}
</style>
