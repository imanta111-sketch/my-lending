import { test, expect } from '@playwright/test';

for (const path of ['/', '/en/']) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => { await page.goto(path); });

    test('процесс — нумерованный список из 4 шагов и CTA', async ({ page }) => {
      await expect(page.locator('#process ol > li')).toHaveCount(4);
      await expect(page.locator('#process a.btn-primary')).toHaveAttribute('href', '#contact');
    });

    test('«Как сделан этот сайт» — не меньше 4 пунктов и никого никуда не отсылает', async ({ page }) => {
      const items = page.locator('#how-built li');
      expect(await items.count()).toBeGreaterThanOrEqual(4);
      await expect(page.locator('#how-built a[href*="instagram.com"]')).toHaveCount(0);
      await expect(page.locator('#how-built a[target="_blank"]')).toHaveCount(0);
    });

    test('«Обо мне» — фото с alt, три абзаца и без линии новичка', async ({ page }) => {
      const img = page.locator('#about img');
      await expect(img).toHaveAttribute('alt', /\S/);
      await expect(page.locator('#about .text')).toHaveCount(3);
      await expect(page.locator('#about')).not.toContainText(/в начале пути|start of my journey/);
    });
  });
}
