import cafe from '../assets/templates/cafe.svg';
import salon from '../assets/templates/salon.svg';
import coach from '../assets/templates/coach.svg';
import portfolio from '../assets/templates/portfolio.svg';
import type { Locale } from '../i18n';

export type TemplateCard = {
  id: 'cafe' | 'salon' | 'coach' | 'portfolio';
  niche: Record<Locale, string>;
  description: Record<Locale, string>;
  demoUrl: string | null;
  days: string;
  priceFrom: string;
  priceTo: string;
  image: ImageMetadata;
};

/** ТЗ §6.2. Ссылки на демо — вписать вместо null, когда демо готовы. */
export const templates: TemplateCard[] = [
  {
    id: 'cafe',
    niche: { ru: 'Кафе и кофейня', en: 'Café & coffee shop' },
    description: {
      ru: 'Меню, часы работы, карта и кнопка «Забронировать стол»',
      en: 'Menu, opening hours, map and a “Book a table” button',
    },
    demoUrl: null, days: '3–7', priceFrom: '250', priceTo: '750', image: cafe,
  },
  {
    id: 'salon',
    niche: { ru: 'Салон красоты', en: 'Beauty salon' },
    description: { ru: 'Услуги с ценами, мастера, онлайн-запись', en: 'Services with prices, your team, online booking' },
    demoUrl: null, days: '3–7', priceFrom: '250', priceTo: '750', image: salon,
  },
  {
    id: 'coach',
    niche: { ru: 'Коуч / эксперт', en: 'Coach / expert' },
    description: {
      ru: 'Обо мне, программы, отзывы, запись на консультацию',
      en: 'About you, programmes, reviews, consultation booking',
    },
    demoUrl: null, days: '3–7', priceFrom: '250', priceTo: '750', image: coach,
  },
  {
    id: 'portfolio',
    niche: { ru: 'Портфолио', en: 'Portfolio' },
    description: {
      ru: 'Работы, процесс, контакты — для дизайнеров, фотографов, мастеров',
      en: 'Work, process, contacts — for designers, photographers, makers',
    },
    demoUrl: null, days: '3–7', priceFrom: '250', priceTo: '750', image: portfolio,
  },
];
