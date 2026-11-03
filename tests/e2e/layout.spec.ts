import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 320, height: 640 } });

for (const p of ['/', '/en/', '/privacy', '/en/privacy']) {
  test(`${p}: нет горизонтального скролла на 320px (Review Focus 3)`, async ({ page }) => {
    await page.goto(p);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(320);
  });
}
