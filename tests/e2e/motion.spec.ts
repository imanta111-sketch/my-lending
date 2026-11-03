import { test, expect } from '@playwright/test';

const animationNames = (page: import('@playwright/test').Page) =>
  page.locator('.reveal').evaluateAll((els) => els.map((e) => getComputedStyle(e).animationName));

test.describe('уменьшение движения включено', () => {
  test.use({ reducedMotion: 'reduce' });
  test('у .reveal нет анимации', async ({ page }) => {
    await page.goto('/');
    const names = await animationNames(page);
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => n === 'none')).toBe(true);
  });
});

test.describe('движение разрешено', () => {
  test.use({ reducedMotion: 'no-preference' });
  test('у .reveal есть анимация, привязанная к прокрутке', async ({ page }) => {
    await page.goto('/');
    const names = await animationNames(page);
    expect(names.every((n) => n === 'reveal')).toBe(true);
    const timeline = await page.locator('.reveal').first().evaluate((e) => getComputedStyle(e).animationTimeline);
    expect(timeline).toContain('view');
  });
});

test.describe('JavaScript выключен (Review Focus 2)', () => {
  test.use({ javaScriptEnabled: false, reducedMotion: 'no-preference' });

  test('пройденные карточки витрины полностью видны', async ({ page }) => {
    await page.goto('/');
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    for (const card of await page.locator('#showcase .reveal').all()) {
      await expect(card).toHaveCSS('opacity', '1');
    }
  });

  test('форма отправляется без JS и ведёт на /thanks', async ({ page }) => {
    // Не шлём настоящую заявку: подменяем Web3Forms редиректом, как делает сервис
    await page.route('https://api.web3forms.com/submit', async (route) => {
      const body = new URLSearchParams(route.request().postData() ?? '');
      expect(body.get('name')).toBe('Анна');
      const target = new URL(body.get('redirect')!);
      await route.fulfill({ status: 303, headers: { location: `http://localhost:4321${target.pathname}` } });
    });
    await page.goto('/');
    await page.fill('#contact input[name=name]', 'Анна');
    await page.fill('#contact input[name=contact]', '@anna');
    await page.fill('#contact textarea[name=message]', 'Сайт для кофейни');
    await page.check('#contact input[name=consent]');
    await page.locator('#contact button[type=submit]').click();
    await page.waitForURL(/\/thanks/);
  });
});
