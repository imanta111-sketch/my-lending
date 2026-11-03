import { test, expect } from 'vitest';
import { findPlaceholders } from '../../scripts/check-placeholders.mjs';

test('находит XXX с номером строки', () => {
  const found = findPlaceholders({ 'a.html': 'ok', 'b.html': 'first\nprice €XXX–XXX' });
  expect(found).toEqual([{ file: 'b.html', line: 2, text: 'price €XXX–XXX' }]);
});

test('чистые файлы — пустой список', () => {
  expect(findPlaceholders({ 'a.html': '<p>€300</p>' })).toEqual([]);
});

test('находит адрес-заглушку example.netlify.app', () => {
  const found = findPlaceholders({ 'a.html': '<link rel="canonical" href="https://example.netlify.app/">' });
  expect(found).toHaveLength(1);
});
