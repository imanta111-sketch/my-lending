# Лендинг-портфолио AI-дизайнера

Двуязычный (RU / EN) статический сайт на Astro. Работает быстро, проходит проверки доступности, не использует cookie.
ТЗ: [docs/superpowers/specs/2026-11-03-landing-design.md](docs/superpowers/specs/2026-11-03-landing-design.md) · исследование: [research.md](research.md).

## Запуск у себя

```bash
npm i                # один раз
npm run dev          # сайт откроется на http://localhost:4321
```

## Где менять содержимое

| Что | Файл |
|---|---|
| Все тексты на русском | `src/i18n/ru.ts` |
| Все тексты на английском (структура должна совпадать с русской) | `src/i18n/en.ts` |
| Шаблоны в витрине: ниша, срок, цена, ссылка на демо | `src/data/templates.ts` (`demoUrl: null` → метка «Скоро») |
| Instagram, WhatsApp, Telegram, email | `src/data/contacts.ts` |
| Фото в hero и «Обо мне» | `src/assets/hero.svg` (замените на `.jpg`/`.webp` и поправьте импорт в `Hero.astro` и `About.astro`) |
| Картинки шаблонов | `src/assets/templates/*.svg` (скриншоты демо) |
| Цвета и шрифты | `src/styles/tokens.css` |
| Картинка для соцсетей | `npm run og` после смены имени или заголовка → `public/og.png` |

**Все места, которые надо заполнить, отмечены `XXX`.** Проверить, что ничего не забыто:

```bash
npm run build && npm run check:launch
```

## Проверки

```bash
npm test                 # unit + e2e (Playwright): тема, языки, форма, доступность (axe), 320px, анимации
npm run test:lh          # Lighthouse (нужен путь к Chrome, см. ниже)
```

Для Lighthouse на Windows можно взять Chromium из Playwright:

```bash
CHROME_PATH="$(node -e "import('@playwright/test').then(m=>console.log(m.chromium.executablePath()))")" npm run test:lh
```

## Публикация на Vercel

1. Залейте проект на GitHub, затем на vercel.com: **Add New → Project → Import** нужного репозитория.
2. Настройки сборки подтянутся из `vercel.json`. **Сборка не пройдёт, пока остались `XXX`**: так задумано.
3. Адрес сайта Vercel подставит сам (переменная `VERCEL_PROJECT_PRODUCTION_URL`). Если подключите свой домен, сделайте его основным (Settings → Domains), затем Redeploy. Локально `check:launch` напомнит про заглушку `example.netlify.app`, это нормально.
4. **Форма заявок работает через [Web3Forms](https://web3forms.com):** заявки приходят письмом на почту, к которой привязан ключ (`web3formsKey` в `src/data/contacts.ts`). После публикации отправьте тестовую заявку и проверьте почту, в том числе папку «Спам».
5. Аналитика без cookie (по желанию): Vercel → Settings → Environment Variables → `PUBLIC_ANALYTICS_SRC` и `PUBLIC_ANALYTICS_DOMAIN` (см. `.env.example`), затем Redeploy.

## Чек-лист перед запуском (ТЗ §10–11, research 5.5)

- [ ] Все `XXX` заменены, `npm run check:launch` зелёный
- [ ] Реальное фото, `npm run og` перезапущен
- [ ] Тест 5 секунд: покажите первый экран 3–5 людям и спросите: «Что здесь предлагают?»
- [ ] Пройдите сайт только клавиатурой (Tab, Enter)
- [ ] Включите «Уменьшение движения» в системе и проверьте, что анимаций нет
- [ ] Откройте сайт на недорогом Android через мобильный интернет
- [ ] Текст политики конфиденциальности проверен юристом
- [ ] Деятельность зарегистрирована в VID (Латвия) до первой оплаты
- [ ] Отправьте тестовую заявку и убедитесь, что письмо пришло
