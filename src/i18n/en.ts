import type { Dict } from './types';

export const en: Dict = {
  meta: {
    name: 'XXX',
    title: 'XXX — fast, modern websites built with AI',
    description: 'Ready-made websites for small businesses and experts, tailored to you in a few days. AI designer based in Latvia, RU / EN.',
    altLabel: 'RU',
    altName: 'Русская версия',
  },
  nav: {
    label: 'Main navigation',
    skip: 'Skip to content',
    theme: 'Toggle theme',
    items: [
      { href: '#showcase', label: 'Templates' },
      { href: '#process', label: 'How it works' },
      { href: '#about', label: 'About' },
      { href: '#pricing', label: 'Pricing' },
      { href: '#contact', label: 'Contact' },
    ],
  },
  footer: {
    made: 'Made with AI and care',
    privacy: 'Privacy policy',
    noCookies: 'No cookies on this site',
    howBuilt: 'How this site is built',
  },
};
