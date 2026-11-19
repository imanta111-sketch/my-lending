import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const slugs = ['privychki', 'zapis', 'matematika'] as const;

/** Что должно появиться на странице, если приложение действительно ожило, а не просто отдалось. */
const alive: Record<(typeof slugs)[number], string> = {
  privychki: '#days input[type="checkbox"]',
  zapis: '#app h2',
  matematika: '#app button',
};

for (const slug of slugs) {
  test(`/works/${slug}/ открывается и оживает`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(`/works/${slug}/`);
    expect(res!.status()).toBe(200);
    await expect(page.locator(alive[slug]).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`/works/${slug}/ работает при заблокированном хранилище`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
    });
    await page.goto(`/works/${slug}/`);
    await expect(page.locator(alive[slug]).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`/works/${slug}/ объявляет язык страницы`, () => {
    const html = readFileSync(`public/works/${slug}/index.html`, 'utf8');
    expect(html).toMatch(/<html[^>]*\slang=/i);
    expect(html).not.toMatch(/claude:/i);
  });

  test(`/works/${slug}/ без внешних запросов и без XXX`, () => {
    const html = readFileSync(`public/works/${slug}/index.html`, 'utf8');
    expect(html).not.toMatch(/(?:src|href)\s*=\s*["']https?:\/\//i);
    expect(html).not.toContain('XXX');
  });
}

test('ссылки витрины ведут на существующие страницы', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('#showcase [data-work] a[href^="/works/"]');
  expect(await links.count()).toBeGreaterThan(0);
  for (const a of await links.all()) {
    const res = await page.request.get((await a.getAttribute('href'))!);
    expect(res.status()).toBe(200);
  }
});

test('английская витрина предупреждает про русский интерфейс', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('#showcase [data-work]').first()).toContainText(/Russian/i);
});
