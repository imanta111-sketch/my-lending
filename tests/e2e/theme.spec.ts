import { test, expect } from '@playwright/test';

test.describe('тёмная система', () => {
  test.use({ colorScheme: 'dark' });
  test('тема берётся из системы', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
  test('переключатель меняет тему и запоминает выбор', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /тем/i });
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
  test('кнопка темы не меньше 44×44', async ({ page }) => {
    await page.goto('/');
    const box = await page.getByRole('button', { name: /тем/i }).boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
  test('фон страницы меняется вместе с темой', async ({ page }) => {
    await page.goto('/');
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(await bg()).toBe('rgb(14, 14, 16)');
    await page.getByRole('button', { name: /тем/i }).click();
    await expect.poll(bg).toBe('rgb(240, 238, 233)');
  });
});

test.describe('localStorage заблокирован (Review Focus 1)', () => {
  test.use({ colorScheme: 'dark' });
  test('тема из системы, переключатель работает, без ошибок', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
    });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: /тем/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(errors).toEqual([]);
  });
});
