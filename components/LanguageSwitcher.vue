<script setup lang="ts">
import { computed } from 'vue';
import { CBButton } from '@cb/components';
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
    <CBButton
      v-for="loc in availableLocales"
      :key="loc.code"
      :label="loc.name"
      variant="outline"
      size="sm"
      :rounded="8"
      :color="'var(--cb-secondary)'"
      class="languageBtn"
      @click="switchLanguage(loc.code)"
    />
  </div>
</template>

<style scoped>
.languageSwitcher {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
