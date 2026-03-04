<script setup lang="ts">
/**
 * 🧩 Projetos — Página em construção.
 */

import { CBIcon, CBLabel } from '@cb/components';

useSeoMeta({
  title: 'Projetos | Elas Podem',
  description: 'Conheça os projetos do Instituto Elas Podem.',
});
</script>

<template>
  <div class="underConstruction">
    <CBIcon icon="luc-construction" size="3rem" color="var(--color-wine-rose)" />
    <CBLabel
      text="Projetos"
      tag="h2"
      weight="bold"
      size="2xl"
      color="primary"
    />
    <CBLabel
      text="Esta página está em construção."
      size="md"
      color="secondary"
    />
  </div>
</template>

<style scoped>
.underConstruction {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
  user-select: none;
}
</style>
