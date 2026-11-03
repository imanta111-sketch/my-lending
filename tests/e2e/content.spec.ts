import { test, expect } from '@playwright/test';

for (const path of ['/', '/en/']) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => { await page.goto(path); });

    test('процесс — нумерованный список из 4 шагов и CTA', async ({ page }) => {
      await expect(page.locator('#process ol > li')).toHaveCount(4);
      await expect(page.locator('#process a.btn-primary')).toHaveAttribute('href', '#contact');
    });

    test('«Как сделан этот сайт» — не меньше 4 пунктов со ссылкой на Instagram', async ({ page }) => {
      const items = page.locator('#how-built li');
      expect(await items.count()).toBeGreaterThanOrEqual(4);
      for (const item of await items.all()) {
        await expect(item.locator('a')).toHaveAttribute('href', /instagram\.com/);
      }
    });

    test('«Обо мне» — фото с alt и упоминание Tilda', async ({ page }) => {
      const img = page.locator('#about img');
      await expect(img).toHaveAttribute('alt', /\S/);
      await expect(page.locator('#about')).toContainText('Tilda');
    });
  });
}
