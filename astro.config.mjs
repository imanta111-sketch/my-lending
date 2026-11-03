import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.netlify.app',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
