# Витрина реальных работ — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить витрину шаблонов с метками «Скоро» на витрину реальных работ с живыми ссылками, переписать «Обо мне» и убрать со страницы всё, что отправляет читателя в несуществующий каталог шаблонов.

**Architecture:** Мини-приложения кладутся статическими файлами в `public/works/<slug>/index.html` и отдаются с того же домена. `src/data/templates.ts` заменяется на `src/data/works.ts`, `Showcase.astro` рендерит карточки без цены и срока, словарь `showcase` переименовывается в `works` в обоих языках. Остальные правки — текстовые, в `src/i18n/ru.ts` и `src/i18n/en.ts`.

**Tech Stack:** Astro 5, TypeScript, Playwright (e2e), Vitest (unit), Vercel.

**Spec:** [docs/superpowers/specs/2026-11-19-landing-works-design.md](../specs/2026-11-19-landing-works-design.md)

## Global Constraints

- Правка любого ключа в `src/i18n/ru.ts` повторяется в `src/i18n/en.ts`: `tests/unit/i18n.test.ts` требует совпадения структуры и запрещает пустые строки.
- Суммы в пакетах не меняются: €250–400, €450–750, €650–1000.
- `hero.title` не меняется — обещание «адаптирую за 3–7 дней» остаётся.
- Мини-приложения кладутся как есть. Единственные разрешённые правки их HTML: убрать внешние `<link>`/`<script>` и литерал `XXX`.
- Страницы `/works/*` не добавляются ни в `pages` в `tests/e2e/a11y.spec.ts`, ни в `url` в `lighthouserc.json`.
- CSP в `vercel.json` не меняется.
- Ни одной карточки без работающей ссылки.
- `npm run build && npm run check:launch && npm test` зелёные на каждом коммите.

## Review Focus

- Приложение тянет внешний файл (шрифты, CDN) — CSP `default-src 'self'` его молча блокирует, и страница выглядит сломанной. → тест в задаче 1.
- Ссылка карточки ведёт в 404: опечатка в слаге или папка не попала в `dist/`. → тест в задаче 2.
- Литерал `XXX` внутри приложения валит `npm run check:launch`, потому что `public/` копируется в `dist/` целиком. → тест в задаче 1.
- Английская карточка ведёт на приложение с русским интерфейсом без предупреждения. → тест в задаче 2.
- Пункт меню и `id` секции витрины разошлись, и ссылка в шапке никуда не ведёт. → тест в задаче 2.

---

### Задача 1: Приложения в `public/works/`

**Выполняет Клод в основной сессии:** HTML лежит в артефактах Claude, у исполнителя-субагента доступа к ним нет. Остальные задачи такого ограничения не имеют.

**Files:**
- Create: `public/works/privychki/index.html` — тренажёр полезных привычек
- Create: `public/works/zapis/index.html` — запись на маникюр
- Create: `public/works/matematika/index.html` — тренажёр по математике
- Modify: `src/i18n/ru.ts`, `src/i18n/en.ts` — новая строка в `privacy.sections`
- Test: `tests/e2e/works.spec.ts` (создать)

**Interfaces:**
- Consumes: ничего.
- Produces: три пути `/works/privychki/`, `/works/zapis/`, `/works/matematika/` — задача 2 ссылается на них из `src/data/works.ts`.

Источники: тренажёр привычек — `https://imanta111-sketch.github.io/trenazher-poleznyh-privychek/` (проверен, отвечает 200) либо одноимённый артефакт; запись на маникюр — артефакт «Запись на маникюр»; математика — артефакт «Математика, 1 четверть (4–5 классы)», версия от 16 октября.

- [ ] **Шаг 1: Написать падающий тест**

```ts
// tests/e2e/works.spec.ts
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const slugs = ['privychki', 'zapis', 'matematika'] as const;

for (const slug of slugs) {
  test(`/works/${slug}/ открывается и не пустая`, async ({ page }) => {
    const res = await page.goto(`/works/${slug}/`);
    expect(res!.status()).toBe(200);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test(`/works/${slug}/ без внешних запросов и без XXX`, () => {
    const html = readFileSync(`public/works/${slug}/index.html`, 'utf8');
    expect(html).not.toMatch(/(?:src|href)\s*=\s*["']https?:\/\//i);
    expect(html).not.toContain('XXX');
  });
}
```

- [ ] **Шаг 2: Запустить, убедиться что падает**

Run: `npx playwright test tests/e2e/works.spec.ts`
Expected: FAIL — все шесть тестов, страницы отдают 404, файлов нет.

- [ ] **Шаг 3: Положить три файла**

Достать HTML каждого приложения и сохранить как `public/works/<slug>/index.html`. Убрать из «Записи на маникюр» две строки — `<link rel="preconnect" href="https://fonts.gstatic.com" …>` и `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text…">`; запасные стеки (`system-ui`, `-apple-system`, `Segoe UI`) в CSS уже прописаны. В остальных приложениях проверить то же и убрать найденное. Больше ничего в их коде не менять.

- [ ] **Шаг 4: Запустить тест, убедиться что проходит**

Run: `npm run build && npx playwright test tests/e2e/works.spec.ts`
Expected: PASS, шесть тестов.

- [ ] **Шаг 5: Строка в политике конфиденциальности**

В `privacy.sections` обоих словарей добавить запись между «Cookie» и концом списка. Русский смысл: приложения в разделе «Работы» сохраняют ваши отметки только в вашем браузере, никуда их не отправляют и ни с кем не делятся. Заголовок — про приложения и ваши данные. Английский — по смыслу.

- [ ] **Шаг 6: Проверить сборку и словари**

Run: `npm run build && npm run check:launch && npm test`
Expected: PASS, в том числе `tests/unit/i18n.test.ts`.

- [ ] **Шаг 7: Коммит**

```bash
git add public/works tests/e2e/works.spec.ts src/i18n/ru.ts src/i18n/en.ts
git commit -m "feat: host the three mini-apps under /works/"
```

---

### Задача 2: Витрина «Мои работы»

**Files:**
- Create: `src/data/works.ts`
- Create: `src/assets/works/privychki.png`, `zapis.png`, `matematika.png`, `this-site.png` (640×420)
- Delete: `src/data/templates.ts`, `src/assets/templates/*.svg`
- Modify: `src/components/Showcase.astro`, `src/i18n/ru.ts`, `src/i18n/en.ts`, `README.md`
- Test: `tests/e2e/hero-showcase.spec.ts` (переписать витринную часть), `tests/e2e/works.spec.ts` (дополнить)

**Interfaces:**
- Consumes: пути из задачи 1.
- Produces:

```ts
// src/data/works.ts
export type Work = {
  id: 'privychki' | 'zapis' | 'matematika' | 'this-site';
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  href: string;        // '/works/privychki/' или '#how-built'
  newTab: boolean;     // true → target="_blank" rel="noopener"
  image: ImageMetadata;
};
export const works: Work[];
```

Словарь `showcase` переименовывается в `works` с ключами: `title`, `lead`, `open`, `howBuilt`, `langNote`, `bridge`. Ключи `days`, `demo`, `soon`, `notFound`, `notFoundCta` удаляются.

Русские значения: `title` — «Мои работы»; `lead` — «Всё это собрано мной — можно открыть и потыкать.»; `open` — «Открыть ↗»; `howBuilt` — «Как он сделан ↓»; `langNote` — «Интерфейс на русском»; `bridge` — «Нужно что-то похожее? Расскажите о задаче →».

Состав витрины и тексты карточек:

| id | title (ru) | description (ru) | href | newTab |
|---|---|---|---|---|
| `privychki` | Тренажёр полезных привычек | Мини-приложение для родителей и детей: ребёнок отмечает дела за день, копит баллы и обменивает их на награду. Открывается на телефоне, ничего не надо устанавливать. | `/works/privychki/` | да |
| `zapis` | Запись на маникюр | Прототип записи к мастеру: клиент занимает свободное время или вписывается на нужный день, мастер подтверждает. Можно посмотреть и со стороны клиента, и со стороны мастера. | `/works/zapis/` | да |
| `matematika` | Тренажёр по математике | Написать по образцу остальных (что это, для кого, одна строка), прочитав `public/works/matematika/index.html` — он уже лежит на диске после задачи 1. | `/works/matematika/` | да |
| `this-site` | Этот сайт | Тот самый лендинг, который вы читаете: быстрый, с тёмной темой и без cookie. Разбор — чуть ниже. | `#how-built` | нет |

- [ ] **Шаг 1: Написать падающие тесты**

Витринную часть `tests/e2e/hero-showcase.spec.ts` заменить: тест «4 карточки витрины с ценой и сроком» и тест «карточка без демо показывает «скоро»» удалить, вместо них —

```ts
test('4 карточки витрины, у каждой работающая ссылка и нет цены', async ({ page }) => {
  const cards = page.locator('#showcase [data-work]');
  await expect(cards).toHaveCount(4);
  for (const card of await cards.all()) {
    await expect(card.locator('a')).toHaveCount(1);
    await expect(card.locator('[data-price]')).toHaveCount(0);
  }
});

test('нет метки «скоро» и карточек без ссылки', async ({ page }) => {
  await expect(page.locator('#showcase').getByText(/Скоро|Soon/)).toHaveCount(0);
});

test('пункт меню витрины ведёт на существующую секцию', async ({ page }) => {
  const href = await page.locator('header nav a[href^="#"]').first().getAttribute('href');
  await expect(page.locator(href!)).toHaveCount(1);
});
```

В `tests/e2e/works.spec.ts` дописать:

```ts
test('ссылки витрины ведут на существующие страницы', async ({ page }) => {
  await page.goto('/');
  for (const a of await page.locator('#showcase [data-work] a[href^="/works/"]').all()) {
    const res = await page.request.get((await a.getAttribute('href'))!);
    expect(res.status()).toBe(200);
  }
});

test('английская витрина предупреждает про русский интерфейс', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('#showcase [data-work]').first()).toContainText(/Russian/i);
});
```

- [ ] **Шаг 2: Запустить, убедиться что падает**

Run: `npx playwright test tests/e2e/hero-showcase.spec.ts tests/e2e/works.spec.ts`
Expected: FAIL — селектор `[data-work]` ничего не находит, метка «Скоро» на месте.

- [ ] **Шаг 3: Снять скриншоты**

Поднять `npm run dev`, снять четыре снимка 640×420: три страницы `/works/<slug>/` и первый экран самого сайта, сохранить в `src/assets/works/`. Чем снимать — на выбор исполнителя.

- [ ] **Шаг 4: Создать `src/data/works.ts`**

Тип `Work` и массив `works` из блока Interfaces, в том порядке. Описание для `matematika` написать, открыв приложение.

- [ ] **Шаг 5: Переименовать словарь и переписать `Showcase.astro`**

В обоих словарях `showcase` → `works` с новыми ключами; в `nav.items` первый пункт: `label` «Работы» / «Work», `href` оставить `#showcase`. В компоненте: `getDict(locale).works`, импорт `works` вместо `templates`, атрибут `data-work={w.id}` вместо `data-template`, из карточки убрать `.meta` с ценой и сроком и ветку `t.soon`. Ссылка: `t.open` для `newTab` (с `target="_blank" rel="noopener"`), `t.howBuilt` для `#how-built` без `target`. Под заголовком карточки показывать `t.langNote` только при `locale === 'en'`. Строку `.not-found` заменить на `t.bridge` со ссылкой на `#contact`. Стили не трогать, кроме удаления правил для `.meta` и `.soon`.

- [ ] **Шаг 6: Удалить старые данные и картинки**

`src/data/templates.ts` и `src/assets/templates/*.svg`. Проверить, что на них больше никто не ссылается: `grep -rn "templates" src/`.

- [ ] **Шаг 7: Запустить тесты**

Run: `npm run build && npm run check:launch && npm test`
Expected: PASS всё, включая `tests/e2e/motion.spec.ts` (он ищет `#showcase .reveal` — класс `reveal` на карточках сохранить).

- [ ] **Шаг 8: Поправить README**

В таблице «Где менять содержимое» строка про `src/data/templates.ts` → `src/data/works.ts`, описание: работы в витрине — название, описание, ссылка. Строку про `demoUrl: null` убрать. Добавить строку: мини-приложения лежат в `public/works/<slug>/index.html`.

- [ ] **Шаг 9: Коммит**

```bash
git add -A src/data src/assets src/components/Showcase.astro src/i18n tests README.md
git commit -m "feat: replace the template catalogue with a showcase of real work"
```

---

### Задача 3: «Обо мне»

**Files:**
- Modify: `src/components/About.astro:13`, `src/i18n/ru.ts`, `src/i18n/en.ts`
- Test: `tests/e2e/content.spec.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: `about.text` становится `string[]` вместо `string`.

- [ ] **Шаг 1: Написать падающий тест**

В `tests/e2e/content.spec.ts` тест «Обо мне» — убрать проверку `toContainText('Tilda')`, добавить:

```ts
await expect(page.locator('#about .text')).toHaveCount(3);
await expect(page.locator('#about')).not.toContainText(/в начале пути|start of my journey/);
```

- [ ] **Шаг 2: Запустить, убедиться что падает**

Run: `npx playwright test tests/e2e/content.spec.ts`
Expected: FAIL — абзац один, а не три.

- [ ] **Шаг 3: Заменить текст и подписи**

`about.text` — массив из трёх абзацев, русский текст дословно из ТЗ §3. `about.facts`: «Tilda → вайбкодинг» → «Ещё: логотипы, баннеры, чат-боты», две остальные без изменений. Английский — перевод по смыслу; «Tilda → vibe coding» тоже уходит.

- [ ] **Шаг 4: Перебрать абзацы в `About.astro`**

Строку `<p class="text">{t.text}</p>` заменить на перебор массива, класс `text` на каждом абзаце.

- [ ] **Шаг 5: Запустить тесты**

Run: `npm run build && npm test`
Expected: PASS.

- [ ] **Шаг 6: Коммит**

```bash
git add src/i18n src/components/About.astro tests/e2e/content.spec.ts
git commit -m "content: rewrite About without resume filler"
```

---

### Задача 4: Первый экран, процесс и остальные упоминания шаблонов

**Files:**
- Modify: `src/i18n/ru.ts`, `src/i18n/en.ts`
- Test: `tests/e2e/hero-showcase.spec.ts`

**Interfaces:**
- Consumes: ничего. Только текстовые значения, структура словаря не меняется.
- Produces: ничего.

Замены по ТЗ §4 и §6, русские значения:

| Ключ | Стало |
|---|---|
| `hero.trust` | Этот сайт — тоже моя работа: Lighthouse 90+/100 · без cookie · два языка |
| `hero.secondary` | Смотреть работы ↓ |
| `process.steps[0].title` | Рассказываете о задаче |
| `process.steps[0].text` | Что за бизнес, что сайт должен делать, на кого рассчитан. Нет текстов — помогу составить. |
| `meta.description` | без слова «готовые»: про сайты-визитки для малого бизнеса и экспертов за несколько дней, AI-дизайнер из Латвии, RU / EN |
| `contact.messageHint` | Например: сайт для кофейни — меню, часы работы и карта |
| `howBuilt.lead` | без учёбы на виду: одна строка о том, чем этот сайт отличается от конструктора |

`hero.title`, `hero.subtitle`, шаги 2–4 и `howBuilt.items` не меняются.

- [ ] **Шаг 1: Написать падающий тест**

В `tests/e2e/hero-showcase.spec.ts` добавить:

```ts
test('на странице не осталось обещания выбрать шаблон', async ({ page }) => {
  await expect(page.locator('#hero, #process, #contact').getByText(/шаблон|template/i)).toHaveCount(0);
  await expect(page.locator('#hero')).toContainText(/тоже моя работа|my work too/);
});
```

- [ ] **Шаг 2: Запустить, убедиться что падает**

Run: `npx playwright test tests/e2e/hero-showcase.spec.ts -g "шаблон"`
Expected: FAIL — «Смотреть шаблоны ↓» и «Выбираете шаблон» на месте.

- [ ] **Шаг 3: Заменить значения в обоих словарях**

По таблице выше. Английские формулировки — по смыслу; слово `template` должно уйти из `hero`, `process`, `meta` и `contact`.

- [ ] **Шаг 4: Запустить тесты**

Run: `npm run build && npm run check:launch && npm test`
Expected: PASS. `tests/e2e/content.spec.ts` требует ровно 4 шага в `#process` и ссылку на Instagram в каждом пункте `#how-built` — и то и другое сохраняется.

- [ ] **Шаг 5: Коммит**

```bash
git add src/i18n tests/e2e/hero-showcase.spec.ts
git commit -m "content: drop the template-catalogue promise from hero, process and meta"
```

---

### Задача 5: Пакеты в ценах

**Files:**
- Modify: `src/i18n/ru.ts`, `src/i18n/en.ts`
- Test: `tests/e2e/pricing-faq.spec.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: ничего. Структура `pricing.plans` не меняется: три записи, у каждой `name`, `priceFrom`, `priceTo`, `popular`, `includes`.

Названия и суммы по ТЗ §5: **Визитка** €250–400, **Лендинг под задачу** €450–750 (`popular: 'yes'`), **Лендинг с поддержкой** €650–1000. В `includes` первого пакета убрать «Ваши цвета» и всё про шаблон, оставить не меньше трёх пунктов: материалы заказчика, адаптация под телефон, подключение домена. Второй и третий пакеты продолжают наследовать формулировкой «Всё из первого пакета» / «Всё из второго пакета». `pricing.banner` → «Первым 5 клиентам — скидка 25% в обмен на честный отзыв и разрешение показать ваш сайт в портфолио».

- [ ] **Шаг 1: Написать падающий тест**

```ts
test('пакеты названы по результату, без шаблонов и без «первых проектов»', async ({ page }) => {
  await expect(page.locator('#pricing')).toContainText(/Визитка|Business card/);
  await expect(page.locator('#pricing').getByText(/шаблон|template/i)).toHaveCount(0);
  await expect(page.locator('#pricing .banner')).toContainText(/5 клиентам|5 clients/);
});
```

Отдельно: ответ FAQ «Сколько правок можно внести?» ссылается на старое название — «В пакете „Адаптация под бизнес“ — 2 круга правок». Заменить на новое название пакета. Вопрос «Чем это лучше Tilda?» остаётся как есть, слова «шаблон» в нём нет.

- [ ] **Шаг 2: Запустить, убедиться что падает**

Run: `npx playwright test tests/e2e/pricing-faq.spec.ts -g "по результату"`
Expected: FAIL — пакет называется «Шаблон как есть».

- [ ] **Шаг 3: Переписать `pricing.plans` и `pricing.banner`**

В обоих словарях. Суммы прежние. Проверить, что ни один ответ в `pricing.faq` не отправляет читателя к витрине шаблонов; такие ответы поправить.

- [ ] **Шаг 4: Запустить тесты**

Run: `npm run build && npm run check:launch && npm test`
Expected: PASS. `tests/e2e/pricing-faq.spec.ts` требует три пакета, цену вида `€x–y` и не меньше трёх пунктов состава в каждом.

- [ ] **Шаг 5: Коммит**

```bash
git add src/i18n tests/e2e/pricing-faq.spec.ts
git commit -m "content: rename the packages by what the client gets"
```
