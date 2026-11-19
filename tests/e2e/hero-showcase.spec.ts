import { test, expect } from '@playwright/test';

for (const [path, follow] of [['/', /Подписаться/], ['/en/', /Follow/]] as const) {
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

    test('4 карточки витрины, у каждой работающая ссылка и нет цены', async ({ page }) => {
      const cards = page.locator('#showcase [data-work]');
      await expect(cards).toHaveCount(4);
      for (const card of await cards.all()) {
        await expect(card.locator('a')).toHaveCount(1);
        await expect(card.locator('[data-price]')).toHaveCount(0);
      }
    });

    test('нет метки «скоро» и карточек без ссылки', async ({ page }) => {
      await expect(page.locator('#showcase').getByText(/Скоро|Soon/)).toHaveCount(0);
    });

    test('пункт меню витрины ведёт на существующую секцию', async ({ page }) => {
      const href = await page.locator('header nav a').first().getAttribute('href');
      expect(href).toContain('#');
      await expect(page.locator(href!.slice(href!.indexOf('#')))).toHaveCount(1);
    });
  });
}

test('в hero настоящее фото с именем в alt', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero img')).toHaveAttribute('alt', /Rita Romanovskaia/);
  await expect(page.locator('#hero img')).toHaveAttribute('src', /me\./);
});
