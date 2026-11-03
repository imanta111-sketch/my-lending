import { ru } from './ru';
import { en } from './en';
import type { Dict, Locale } from './types';

export type { Dict, Locale };

const dicts: Record<Locale, Dict> = { ru, en };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

/** Путь страницы на другом языке: '/' ↔ '/en/', '/privacy' ↔ '/en/privacy'. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.replace(/^\/en(\/|$)/, '/');
  return locale === 'en' ? `/en${clean === '/' ? '/' : clean}` : clean;
}
