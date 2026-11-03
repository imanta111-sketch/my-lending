import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/en/', '/privacy', '/en/privacy', '/thanks'];

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`тема ${scheme}`, () => {
    test.use({ colorScheme: scheme, reducedMotion: 'reduce' });
    for (const p of pages) {
      test(`${p}: нет нарушений WCAG 2.2 AA`, async ({ page }) => {
        await page.goto(p);
        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
      });
    }
  });
}
