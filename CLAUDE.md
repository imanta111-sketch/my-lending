# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual (RU/EN) static landing page for a freelance designer, built with Astro 5 and deployed on Vercel. No backend: the contact form posts to Web3Forms, and three vendored mini-apps are served as plain files.

## Commands

```bash
npm run dev                  # dev server on :4321
npm run build                # → dist/
npm test                     # vitest run && playwright test
npm run test:unit            # vitest only
npm run test:e2e             # playwright only
npm run check:launch         # scan dist/ for unfilled placeholders
npm run test:lh              # Lighthouse CI against dist/
npm run og                   # regenerate public/og.png after the name or title changes
```

Single test:

```bash
npx vitest run tests/unit/i18n.test.ts
npx playwright test tests/e2e/works.spec.ts
npx playwright test tests/e2e/works.spec.ts -g "язык страницы" --project=desktop
```

**`npm run build` must run before the e2e tests.** Playwright's `webServer` serves `dist/` via `astro preview`; without a build it fails to start. `npm test` alone does not build.

**Two Playwright projects** (`mobile`, `desktop`) run every spec, so each test reports twice.

## Gotchas that cost time

**`npm run check:launch` cannot pass locally.** `astro.config.mjs` falls back to `https://example.netlify.app` when `VERCEL_PROJECT_PRODUCTION_URL` is absent, and `scripts/check-placeholders.mjs` counts that string in the same tally as `XXX`. Locally, treat it as passing when every finding is `example.netlify.app`, and check `XXX` separately. On Vercel the env var supplies the real URL and the gate is real — `vercel.json` runs it as part of the build.

**On Windows, run commands from an uppercase drive path** (`C:\Projects\...`). From a lowercase `c:\` cwd, Vitest resolves itself under a differently-spelled path, loads twice and fails every suite with `Vitest failed to find the current suite` — nothing to do with the code.

## Architecture

### All user-facing text lives in the dictionaries

`src/i18n/ru.ts` and `src/i18n/en.ts` hold every string; components take a `locale` prop and read `getDict(locale)`. Components contain no copy.

`src/i18n/types.ts` derives `Dict` from the Russian dictionary (`Widen<typeof ru>`), so **`ru.ts` is the schema** — add or rename a key there first, then mirror it in `en.ts`. `tests/unit/i18n.test.ts` fails if the two differ in structure or if any string is empty, so partial edits are caught immediately.

### Locale routing

`prefixDefaultLocale: false` puts Russian at `/` and English at `/en/`. `localePath()` in `src/i18n/index.ts` maps a path to the other locale. Nav and footer hrefs come out **locale-prefixed** (`/#showcase`, `/en/#showcase`) — a selector like `a[href^="#"]` matches nothing; take the substring from `#`.

### Page composition

`src/components/Landing.astro` lists the sections in page order and is the only place to reorder them. The nav list in `nav.items` of both dictionaries should be kept in the same order.

Data separate from copy:

| What | Where |
|---|---|
| Showcase entries (title, description, link, screenshot) | `src/data/works.ts`, images from `src/assets/works/` |
| Instagram / WhatsApp / email, Web3Forms key | `src/data/contacts.ts` |

### The mini-apps under `public/works/`

`public/works/<slug>/index.html` are self-contained single-file pages served from the site's own origin at `/works/<slug>/`. They are not built by Astro — `public/` is copied into `dist/` wholesale. Rules that hold for all of them:

- The CSP in `vercel.json` (`default-src 'self'`, `font-src 'self'`) applies. They must not reference external URLs — no CDN scripts, no Google Fonts. `tests/e2e/works.spec.ts` asserts this.
- A literal `XXX` anywhere inside an app breaks `check:launch`.
- Their tests check that the page actually *renders* (a per-app selector), not just that it returns 200 — an app whose script dies still serves an empty shell. They also run with `localStorage` throwing, since the landing itself promises these apps work with site data blocked.

**Three kinds of app, with different editing rules:**

| Slug | Whose | What may be changed |
|---|---|---|
| `privychki` | the site owner's own product | anything — it is designed and maintained here |
| `privychki-v1` | frozen first version of the same product | nothing. It is kept only so the earlier design stays openable at `/works/privychki-v1/`; it carries `noindex` and is deliberately **not** in `src/data/works.ts`, so no showcase card points at it. Changes belong in `privychki`. |
| `zapis`, `matematika` | third-party, placed **as-is** | narrow edits only: strip external references, fix an attribute that breaks rendering or accessibility (`lang`, a malformed doctype), remove vendor metadata. Do not restructure them. |

Since these pages bypass Astro's asset pipeline, they cannot import `@fontsource-*`; `font-src 'self'` rules out a CDN. `privychki` therefore loads the subsets copied into `public/fonts/` (Golos Text cyrillic + latin, Unbounded cyrillic) via its own `@font-face`. That copy is the reason those files exist outside `node_modules` — the landing itself still gets its fonts through Astro.

### Quality gates

`tests/e2e/a11y.spec.ts` asserts zero axe WCAG 2.2 AA violations on a fixed page list in both colour schemes; `lighthouserc.json` asserts ≥0.9 performance and ≥0.95 accessibility / best-practices / SEO on `/` and `/en/`. **`/works/*` is deliberately in neither list** — the vendored apps cannot be held to the landing's bars. `privychki` is ours and does pass axe WCAG 2.2 AA in both schemes, but nothing enforces that yet — it was checked by hand. Adding just that one slug to `a11y.spec.ts`'s list would make it a real gate.

## Conventions

- Source comments are in Russian; commit messages are in English with a `feat:` / `fix:` / `content:` / `chore:` / `docs:` prefix.
- `content:` is used for copy-only changes, which are frequent here.
- Specs and implementation plans live in `docs/superpowers/specs/` and `docs/superpowers/plans/`, named `YYYY-MM-DD-<topic>`. Read the relevant spec before changing what a section promises the reader — several copy decisions (what the showcase claims, why Instagram links were removed, why the packages are named by deliverable) are recorded there with their reasoning.
- `README.md` is written for the site's owner, not for developers: it documents where to change content, not how the code works.
