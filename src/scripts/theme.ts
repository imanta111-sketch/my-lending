export type Theme = 'light' | 'dark';

/** Читает сохранённую тему; никогда не бросает исключение (приватный режим, блокировка данных). */
export function readStoredTheme(storage: Pick<Storage, 'getItem'> | null): string | null {
  try {
    return storage ? storage.getItem('theme') : null;
  } catch {
    return null;
  }
}

export function getInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

/** Выполняется inline в <head> до отрисовки; использует только функции выше. */
export function bootTheme(): void {
  let storage: Storage | null = null;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = getInitialTheme(readStoredTheme(storage), prefersDark);
}

/** Строка для <script is:inline>: функции сериализуются, чтобы логика жила в одном месте. */
export const themeBootScript = [readStoredTheme, getInitialTheme, bootTheme].map(String).join('\n') + '\nbootTheme();';

export function saveTheme(theme: Theme): void {
  try {
    window.localStorage.setItem('theme', theme);
  } catch {
    /* хранилище недоступно — тема действует до конца сессии */
  }
}
