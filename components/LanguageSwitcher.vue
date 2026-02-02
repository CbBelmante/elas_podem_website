<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const allLocales = [
  { code: 'pt-BR', name: 'PT' },
  { code: 'en', name: 'EN' },
  { code: 'es', name: 'ES' },
];

const availableLocales = computed(() => {
  return allLocales.filter((i) => i.code !== locale.value);
});

const switchLanguage = (code: string) => {
  locale.value = code;
};
</script>

<template>
  <div class="languageSwitcher">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      class="languageBtn"
      @click="switchLanguage(loc.code)"
    >
      {{ loc.name }}
    </button>
  </div>
</template>

<style scoped>
.languageSwitcher {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.languageBtn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cb-secondary);
  background: var(--badge-bg);
  border: 1px solid var(--badge-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.languageBtn:hover {
  background: var(--badge-bg-hover);
  border-color: var(--border-hover);
  transform: translateY(-2px);
}
</style>
