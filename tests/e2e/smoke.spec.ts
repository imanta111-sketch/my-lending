import { test, expect } from '@playwright/test';

test('главная отдаётся на русском', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page).toHaveTitle(/.+/);
});

test('без настроенной аналитики нет внешних скриптов и cookie', async ({ page, context }) => {
  await page.goto('/');
  const external = await page.locator('script[src]').evaluateAll((els) =>
    els.map((e) => (e as HTMLScriptElement).src).filter((s) => !s.startsWith(location.origin)),
  );
  expect(external).toEqual([]);
  expect(await context.cookies()).toEqual([]);
});

test('favicon и Open Graph', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\/.+\.png$/);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'ru_RU');
});

test('OG-картинка и карта сайта доступны', async ({ request }) => {
  expect((await request.get('/og.png')).status()).toBe(200);
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
});
