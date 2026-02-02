import { createI18n } from 'vue-i18n';
import ptBR from '../locales/pt-BR.json';
import en from '../locales/en.json';
import es from '../locales/es.json';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'pt-BR',
    fallbackLocale: 'pt-BR',
    messages: {
      'pt-BR': ptBR,
      en: en,
      es: es,
    },
  });

  vueApp.use(i18n);

  return {
    provide: {
      i18n,
    },
  };
});
