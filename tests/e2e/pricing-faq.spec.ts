import { test, expect } from '@playwright/test';

for (const path of ['/', '/en/']) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => { await page.goto(path); });

    test('3 пакета с ценой «от–до» и составом', async ({ page }) => {
      const plans = page.locator('#pricing [data-plan]');
      await expect(plans).toHaveCount(3);
      for (const plan of await plans.all()) {
        await expect(plan.locator('[data-price]')).toContainText(/€.+–.+/);
        expect(await plan.locator('li').count()).toBeGreaterThanOrEqual(3);
      }
      await expect(page.locator('#pricing a.btn-primary')).toHaveAttribute('href', '#contact');
    });

    test('FAQ на <details>, не меньше 6 вопросов', async ({ page }) => {
      expect(await page.locator('#pricing details').count()).toBeGreaterThanOrEqual(6);
    });

    test('FAQ открывается кликом и закрывается с клавиатуры', async ({ page }) => {
      const first = page.locator('#pricing details').first();
      const summary = first.locator('summary');
      await summary.click();
      await expect(first).toHaveAttribute('open', '');
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(first).not.toHaveAttribute('open', '');
    });
  });
}
