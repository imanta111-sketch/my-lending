import { test, expect } from '@playwright/test';

test('главная отдаётся на русском', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page).toHaveTitle(/.+/);
});
