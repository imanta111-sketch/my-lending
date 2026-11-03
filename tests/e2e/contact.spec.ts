import { test, expect } from '@playwright/test';

for (const [path, privacy, promise] of [['/', '/privacy', /в течение дня/], ['/en/', '/en/privacy', /within one day/]] as const) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => { await page.goto(path); });

    test('форма настроена для Netlify Forms', async ({ page }) => {
      const form = page.locator('#contact form');
      await expect(form).toHaveAttribute('data-netlify', 'true');
      await expect(form).toHaveAttribute('netlify-honeypot', 'bot-field');
      await expect(form).toHaveAttribute('method', /post/i);
      await expect(form.locator('input[type=hidden][name="form-name"]')).toHaveValue('contact');
    });

    test('у полей видимые подписи, а не только placeholder', async ({ page }) => {
      for (const name of ['name', 'contact', 'message']) {
        const field = page.locator(`#contact :is(input,textarea)[name="${name}"]`);
        const id = await field.getAttribute('id');
        const label = page.locator(`#contact label[for="${id}"]`);
        await expect(label).toBeVisible();
        await expect(label).not.toHaveText('');
      }
    });

    test('пустую форму отправить нельзя (Review Focus 5)', async ({ page }) => {
      const url = page.url();
      await page.locator('#contact button[type=submit]').click();
      expect(page.url()).toBe(url);
      expect(await page.locator('#contact :invalid').count()).toBeGreaterThanOrEqual(4);
    });

    test('без согласия форма не отправляется (Review Focus 5)', async ({ page }) => {
      await page.fill('#contact [name=name]', 'Анна');
      await page.fill('#contact input[name=contact]', '@anna');
      await page.fill('#contact [name=message]', 'Сайт для кофейни');
      const url = page.url();
      await page.locator('#contact button[type=submit]').click();
      await expect(page.locator('#contact [name=consent]')).toHaveJSProperty('validity.valid', false);
      expect(page.url()).toBe(url);
    });

    test('honeypot скрыт от людей и вне табуляции', async ({ page }) => {
      const bot = page.locator('#contact [name="bot-field"]');
      await expect(bot).toBeHidden();
      await expect(bot).toHaveAttribute('tabindex', '-1');
    });

    test('согласие ссылается на политику', async ({ page }) => {
      await expect(page.locator('#contact .consent a')).toHaveAttribute('href', privacy);
    });

    test('4 канала связи, каждый не ниже 44px', async ({ page }) => {
      for (const prefix of ['https://ig.me/m/', 'https://wa.me/', 'https://t.me/', 'mailto:']) {
        const link = page.locator(`#contact .channels a[href^="${prefix}"]`);
        await expect(link).toHaveCount(1);
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('обещание срока ответа', async ({ page }) => {
      await expect(page.locator('#contact')).toContainText(promise);
    });
  });
}

for (const p of ['/privacy', '/en/privacy', '/thanks', '/en/thanks']) {
  test(`${p} открывается с одним h1`, async ({ page }) => {
    const res = await page.goto(p);
    expect(res!.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('/thanks не индексируется', async ({ page }) => {
  await page.goto('/thanks');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);
});
