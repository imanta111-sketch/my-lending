import { test, expect } from '@playwright/test';

for (const path of ['/', '/en/'] as const) {
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

    test('в первом экране нет призыва подписаться', async ({ page }) => {
      await expect(page.locator('#hero').getByText(/подпис/i)).toHaveCount(0);
      await expect(page.locator('#hero a[href*="instagram.com"]')).toHaveCount(0);
    });

    test('3 карточки витрины, у каждой работающая ссылка и нет цены', async ({ page }) => {
      const cards = page.locator('#showcase [data-work]');
      await expect(cards).toHaveCount(3);
      for (const card of await cards.all()) {
        await expect(card.locator('a')).toHaveCount(1);
        await expect(card.locator('[data-price]')).toHaveCount(0);
      }
    });

    test('нет метки «скоро» и карточек без ссылки', async ({ page }) => {
      await expect(page.locator('#showcase').getByText(/Скоро|Soon/)).toHaveCount(0);
    });

    test('на странице не осталось обещания выбрать шаблон', async ({ page }) => {
      await expect(page.locator('#hero, #process, #contact').getByText(/шаблон|template/i)).toHaveCount(0);
      await expect(page.locator('#hero')).toContainText(/тоже моя работа|my work too/);
    });

    test('каждый пункт меню ведёт на существующую секцию', async ({ page }) => {
      const items = page.locator('header nav a');
      expect(await items.count()).toBeGreaterThanOrEqual(4);
      for (const a of await items.all()) {
        const href = await a.getAttribute('href');
        expect(href).toContain('#');
        await expect(page.locator(href!.slice(href!.indexOf('#')))).toHaveCount(1);
      }
    });
  });
}

test('в hero настоящее фото с именем в alt', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero img')).toHaveAttribute('alt', /Rita Romanovskaia/);
  await expect(page.locator('#hero img')).toHaveAttribute('src', /me\./);
});
