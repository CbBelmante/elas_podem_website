<script setup lang="ts">
/**
 * 🧩 AdminPageCard — Card reutilizavel para paginas do dashboard admin.
 *
 * Exibe titulo, descricao, icone com cor, status (editor/data),
 * botao de edicao com permissao, e blob organico decorativo.
 *
 * Padrao visual alinhado com a home publica (Fraunces, cores quentes,
 * blobs organicos, botao pill com shine).
 */

import type { PropType } from 'vue';
import { CBBadge, CBButton, CBCard, CBIcon, CBLabel } from '@cb/components';

// ============== PROPS ==============

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'wine-rose',
  },
  editUrl: {
    type: String,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
  lastEditorName: {
    type: String as PropType<string | null>,
    default: null,
  },
  lastEditDate: {
    type: String as PropType<string | null>,
    default: null,
  },
});

// ============== COMPUTED ==============

const hasStatus = computed(() => !!props.lastEditorName || !!props.lastEditDate);

/** CSS variables dinamicas baseadas na prop color */
const cardStyle = computed(() => ({
  '--pageCard-color': `var(--color-${props.color})`,
  '--pageCard-gradient': `var(--gradient-${props.color})`,
  '--pageCard-glow': `var(--glow-${props.color})`,
  '--pageCard-glow-hover': `var(--glow-${props.color}-hover)`,
}));

// ============== METHODS ==============

const handleEdit = (): void => {
  navigateTo(props.editUrl);
};
</script>

<template>
  <CBCard
    variant="outlined"
    :rounded="20"
    hover
    bg-color="#FFFFFF"
    border-color="rgba(92, 26, 42, 0.06)"
    class="pageCard"
    :style="cardStyle"
  >
    <div class="pageCard__header">
      <div class="pageCard__iconWrapper">
        <CBIcon :icon="icon" size="1.25rem" color="#ffffff" />
      </div>
      <div class="pageCard__titleGroup">
        <CBLabel :text="title" tag="h3" weight="bold" />
        <CBLabel :text="description" size="sm" color="secondary" />
      </div>
    </div>

    <!-- Status: quem editou, quando -->
    <div v-if="hasStatus" class="pageCard__status">
      <div v-if="lastEditorName" class="pageCard__statusItem">
        <CBIcon icon="luc-user" size="0.875rem" color="var(--text-tertiary)" />
        <CBLabel :text="lastEditorName" tag="span" size="xs" color="tertiary" />
      </div>
      <div v-if="lastEditDate" class="pageCard__statusItem">
        <CBIcon icon="luc-clock" size="0.875rem" color="var(--text-tertiary)" />
        <CBLabel :text="lastEditDate" tag="span" size="xs" color="tertiary" />
      </div>
    </div>

    <!-- Acao: so aparece se tem permissao canEdit -->
    <div class="pageCard__actions">
      <CBButton
        v-if="canEdit"
        :label="$t('admin.pageCard.edit')"
        size="lg"
        :bg-gradient="'var(--gradient-wine)'"
        :rounded="50"
        prepend-icon="luc-pencil"
        shine
        @click="handleEdit"
      />
      <CBBadge v-else :content="$t('admin.pageCard.noPermission')" variant="outline" size="xs" />
    </div>
  </CBCard>
</template>

<style scoped>
/* ============================================
   PAGE CARD
   ============================================ */
.pageCard {
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.pageCard::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 240px;
  height: 240px;
  background: var(--pageCard-color, var(--color-wine-rose));
  opacity: 0.04;
  border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
  transition: all 0.7s ease-in-out;
  z-index: 0;
  pointer-events: none;
}

.pageCard:hover {
  transform: translateY(-5px);
  border-color: rgba(var(--color-wine-rgb), 0.15);
  box-shadow: 0 15px 35px rgba(var(--color-wine-rgb), 0.08);
}

.pageCard:hover::before {
  transform: scale(1.35) rotate(10deg);
  opacity: 0.1;
}

.pageCard__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.pageCard__iconWrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--pageCard-gradient, var(--gradient-wine-rose));
  box-shadow: var(--pageCard-glow, var(--glow-magenta));
  transition: all 0.4s ease;
}

.pageCard:hover .pageCard__iconWrapper {
  transform: scale(1.1);
  box-shadow: var(--pageCard-glow-hover, var(--glow-magenta-hover));
}

.pageCard__titleGroup {
  flex: 1;
}

.pageCard__status {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(var(--color-wine-rgb), 0.06);
  position: relative;
  z-index: 1;
}

.pageCard__statusItem {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.pageCard__actions {
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 640px) {
  .pageCard__status {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
