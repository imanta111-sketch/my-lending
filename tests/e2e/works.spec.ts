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
