import { test, expect } from '@playwright/test';

test('английская версия и переключатель языка', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('header a[hreflang="ru"]')).toHaveAttribute('href', '/');
  await page.goto('/');
  await expect(page.locator('header a[hreflang="en"]')).toHaveAttribute('href', '/en/');
});

test('alternate hreflang для обоих языков', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="alternate"][hreflang="ru"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
});

test('skip-link: первый Tab, Enter ведёт в main (Review Focus 4)', async ({ page, isMobile }) => {
  test.skip(isMobile, 'клавиатура — десктоп');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'К содержанию' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('якорь не прячется под sticky-шапкой (Review Focus 4)', async ({ page, isMobile }) => {
  test.skip(isMobile, 'навигация видна на десктопе');
  await page.goto('/');
  await page.locator('header nav a[href$="#pricing"]').click();
  await page.waitForTimeout(800);
  const header = await page.locator('header').boundingBox();
  const target = await page.locator('#pricing').boundingBox();
  expect(target!.y).toBeGreaterThanOrEqual(header!.height - 1);
  expect(target!.y).toBeLessThan(400);
});
