import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // На Netlify адрес берётся из переменной URL автоматически; заглушку ловит npm run check:launch
  site: process.env.URL ?? 'https://example.netlify.app',
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
