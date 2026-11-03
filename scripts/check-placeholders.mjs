// Не даёт опубликовать сайт, пока в сборке остались плейсхолдеры XXX (ТЗ §10).
// Запуск: npm run check:launch (после npm run build)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @param {Record<string, string>} files @returns {{file: string, line: number, text: string}[]} */
export function findPlaceholders(files) {
  const found = [];
  for (const [file, content] of Object.entries(files)) {
    content.split('\n').forEach((text, i) => {
      if (text.includes('XXX')) found.push({ file, line: i + 1, text: text.trim() });
    });
  }
  return found;
}

function collectHtml(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? collectHtml(full) : name.endsWith('.html') ? [full] : [];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dist = join(process.cwd(), 'dist');
  const files = Object.fromEntries(collectHtml(dist).map((f) => [relative(dist, f), readFileSync(f, 'utf8')]));
  const found = findPlaceholders(files);
  if (found.length) {
    const byFile = Object.groupBy(found, (f) => f.file);
    console.error(`Найдено строк с плейсхолдером XXX: ${found.length}. Замените их в src/i18n и src/data:`);
    for (const [file, items] of Object.entries(byFile)) console.error(`  ${file}: ${items.length}`);
    process.exit(1);
  }
  console.log('Плейсхолдеров нет — можно публиковать.');
}
