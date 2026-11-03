// Рисует public/og.png (1200×630) из текстов словаря. Запуск после смены имени/заголовка: npm run og
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const ru = readFileSync('src/i18n/ru.ts', 'utf8');
const pick = (key) => ru.match(new RegExp(`${key}: '([^']+)'`))?.[1] ?? '';
const name = pick('name');
const title = pick('title');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Onest; src: url(${new URL('../node_modules/@fontsource-variable/onest/files/onest-cyrillic-wght-normal.woff2', import.meta.url)}); font-weight: 100 900; }
body { margin: 0; width: 1200px; height: 630px; background: #F0EEE9; color: #141414; font-family: Onest, sans-serif;
  display: flex; flex-direction: column; justify-content: space-between; padding: 72px; box-sizing: border-box; }
.top { font: 500 28px monospace; color: #5C5A55; } h1 { font-size: 76px; line-height: .98; margin: 0; letter-spacing: -0.02em; max-width: 1000px; }
.dot { width: 72px; height: 72px; border-radius: 20px; background: #3B5BFF; display: grid; place-items: center; }
.dot i { width: 28px; height: 28px; border-radius: 50%; background: #C6FF3D; display: block; }
.row { display: flex; justify-content: space-between; align-items: center; font-size: 32px; font-weight: 700; }
</style></head><body><div class="top">AI-дизайнер · Латвия · RU / EN</div><h1>${title}</h1>
<div class="row"><span>${name}</span><div class="dot"><i></i></div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png готов');
