<script setup lang="ts">
/**
 * 🧩 HomeEditorSection — Wrapper colapsavel generico para secoes do editor.
 *
 * Reutilizado 8 vezes no homeEdit.vue, uma por secao.
 * Exibe header clicavel, badges de status, erros e botoes de acao.
 */

import { CBBadge, CBButton, CBIcon, CBLabel } from '@cb/components';

// ============== PROPS ==============

interface Props {
  title: string;
  icon: string;
  sectionName: string;
  expanded: boolean;
  errors: string[];
  isSaving: boolean;
  hasChanges: boolean;
}

defineProps<Props>();

// ============== EMITS ==============

defineEmits<{
  toggle: [];
  save: [];
  discard: [];
}>();
</script>

<template>
  <div class="editorSection" :class="{ 'editorSection--expanded': expanded }">
    <!-- Header clicavel -->
    <button class="editorSection__header" type="button" @click="$emit('toggle')">
      <div class="editorSection__headerLeft">
        <div class="editorSection__iconWrapper">
          <CBIcon :icon size="1rem" color="#ffffff" />
        </div>
        <CBLabel :text="title" weight="semibold" />
        <CBBadge
          v-if="errors.length"
          :content="`${errors.length} erro${errors.length > 1 ? 's' : ''}`"
          variant="outline"
          size="xs"
          class="editorSection__errorBadge"
        />
        <CBBadge
          v-if="hasChanges && !errors.length"
          content="Alterado"
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
          label="Descartar"
          variant="outline"
          size="sm"
          :rounded="10"
          :disabled="!hasChanges || isSaving"
          @click="$emit('discard')"
        />
        <CBButton
          label="Salvar Secao"
          size="sm"
          :bg-gradient="'var(--gradient-primary)'"
          :rounded="10"
          :loading="isSaving"
          :disabled="!hasChanges"
          @click="$emit('save')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.editorSection {
  background: var(--bg-white, #ffffff);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.editorSection--expanded {
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
}

/* Header */
.editorSection__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.editorSection__header:hover {
  background: var(--bg-tint, rgba(230, 52, 107, 0.03));
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
  background: var(--gradient-magenta, linear-gradient(135deg, #e6346b, #d42d5e));
  flex-shrink: 0;
}

.editorSection__errorBadge {
  color: var(--color-coral, #ee4a55);
  border-color: var(--color-coral, #ee4a55);
}

.editorSection__changedBadge {
  color: var(--color-oliva, #88a201);
  border-color: var(--color-oliva, #88a201);
}

/* Body */
.editorSection__body {
  border-top: 1px solid var(--border-light);
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
  color: var(--color-coral, #ee4a55);
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
  .editorSection__header {
    padding: 0.875rem 1rem;
  }

  .editorSection__body {
    padding: 1rem;
  }

  .editorSection__actions {
    flex-direction: column;
  }
}
</style>
