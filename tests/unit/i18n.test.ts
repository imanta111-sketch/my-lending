import { test, expect } from 'vitest';
import { getDict } from '../../src/i18n';

function shape(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shape);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)]));
  return typeof v;
}
function strings(v: unknown, path = ''): [string, string][] {
  if (typeof v === 'string') return [[path, v]];
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => strings(x, `${path}.${k}`));
  return [];
}

test('у ru и en одинаковая структура ключей и массивов', () => {
  expect(shape(getDict('en'))).toEqual(shape(getDict('ru')));
});

test('ни одна строка не пустая', () => {
  for (const loc of ['ru', 'en'] as const) {
    const empty = strings(getDict(loc)).filter(([, s]) => s.trim() === '').map(([p]) => `${loc}${p}`);
    expect(empty).toEqual([]);
  }
});
