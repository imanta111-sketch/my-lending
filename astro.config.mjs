import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Заменить на реальный адрес после подключения Netlify
  site: 'https://example.netlify.app',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thanks'),
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru-RU', en: 'en-US' } },
    }),
  ],
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
