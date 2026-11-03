import { describe, test, expect } from 'vitest';
import { getInitialTheme, readStoredTheme } from '../../src/scripts/theme';

describe('getInitialTheme', () => {
  test('сохранённый выбор важнее системы', () => {
    expect(getInitialTheme('dark', false)).toBe('dark');
    expect(getInitialTheme('light', true)).toBe('light');
  });
  test('без сохранённого выбора берётся системная тема', () => {
    expect(getInitialTheme(null, true)).toBe('dark');
    expect(getInitialTheme(null, false)).toBe('light');
  });
  test('мусор в хранилище игнорируется', () => {
    expect(getInitialTheme('garbage', false)).toBe('light');
  });
});

describe('readStoredTheme', () => {
  test('заблокированное хранилище не бросает исключение', () => {
    expect(readStoredTheme({ getItem: () => { throw new Error('blocked'); } })).toBeNull();
  });
  test('отсутствующее хранилище', () => {
    expect(readStoredTheme(null)).toBeNull();
  });
  test('читает ключ theme', () => {
    expect(readStoredTheme({ getItem: (k: string) => (k === 'theme' ? 'dark' : null) })).toBe('dark');
  });
});
