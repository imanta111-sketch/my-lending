import { test, expect } from '@playwright/test';

for (const [path, soon, follow] of [['/', 'Скоро', /Подписаться/], ['/en/', 'Soon', /Follow/]] as const) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => { await page.goto(path); });

    test('ровно один h1', async ({ page }) => {
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test('главная кнопка hero ведёт к форме и не меньше 44×44', async ({ page }) => {
      const cta = page.locator('#hero a.btn-primary').first();
      await expect(cta).toHaveAttribute('href', '#contact');
      const box = await cta.boundingBox();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test('ссылка подписки ведёт в Instagram', async ({ page }) => {
      await expect(page.locator('#hero').getByRole('link', { name: follow })).toHaveAttribute('href', /instagram\.com/);
    });

    test('4 карточки витрины с ценой и сроком', async ({ page }) => {
      const cards = page.locator('#showcase [data-template]');
      await expect(cards).toHaveCount(4);
      for (const card of await cards.all()) {
        await expect(card.locator('[data-price]')).toContainText('€');
        await expect(card.locator('[data-days]')).toBeVisible();
      }
    });

    test('карточка без демо показывает «скоро» и не ссылается на демо', async ({ page }) => {
      const card = page.locator('#showcase [data-template][data-demo="none"]').first();
      await expect(card).toContainText(soon);
      await expect(card.locator('a')).toHaveCount(0);
    });
  });
}
