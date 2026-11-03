import { test, expect } from '@playwright/test';

function lum(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

for (const scheme of ['light', 'dark'] as const) {
  test.describe(scheme, () => {
    test.use({ colorScheme: scheme });
    test('рамки полей формы контрастнее 3:1 к фону формы (WCAG 1.4.11)', async ({ page }) => {
      await page.goto('/');
      const [border, surface] = await page.evaluate(() => {
        const toRgb = (c: string) => {
          const el = document.createElement('div'); el.style.color = c; document.body.append(el);
          const v = getComputedStyle(el).color; el.remove();
          const m = v.match(/[\d.]+/g)!.map(Number);
          const rgb = v.startsWith('color(srgb') ? m.slice(0, 3).map((x) => x * 255) : m.slice(0, 3);
          const a = v.startsWith('color(srgb') ? (m[3] ?? 1) : (m[3] ?? 1);
          return [...rgb, a];
        };
        const input = document.querySelector('#contact input[name=name]')!;
        const form = document.querySelector('#contact form')!;
        const b = toRgb(getComputedStyle(input).borderTopColor);
        const under = toRgb(getComputedStyle(input).backgroundColor);
        const visible = b.slice(0, 3).map((c, i) => c * b[3] + under[i] * (1 - b[3]));
        return [visible, toRgb(getComputedStyle(form).backgroundColor).slice(0, 3)];
      });
      expect(ratio(border, surface)).toBeGreaterThanOrEqual(3);
    });
  });
}

test('кнопка темы называет состояние однозначно', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Тёмная тема', exact: true })).toHaveCount(1);
  await page.goto('/en/');
  await expect(page.getByRole('button', { name: 'Dark theme', exact: true })).toHaveCount(1);
});
