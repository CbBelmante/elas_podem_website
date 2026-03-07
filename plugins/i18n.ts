import { createI18n } from 'vue-i18n';
import ptBR from '../locales/pt-BR.json';
import en from '../locales/en.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- defineNuxtPlugin tipo resolvido pelo Nuxt auto-import
export default defineNuxtPlugin(({ vueApp }: any) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'pt-BR',
    fallbackLocale: 'pt-BR',
    messages: {
      'pt-BR': ptBR,
      en: en,
    },
  });

  vueApp.use(i18n);

  return {
    provide: {
      i18n,
    },
  };
});
