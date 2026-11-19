import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const slugs = ['privychki', 'zapis', 'matematika'] as const;

for (const slug of slugs) {
  test(`/works/${slug}/ открывается и не пустая`, async ({ page }) => {
    const res = await page.goto(`/works/${slug}/`);
    expect(res!.status()).toBe(200);
    await expect(page.locator('body')).not.toBeEmpty();
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
