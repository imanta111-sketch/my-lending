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
  hero: {
    eyebrow: 'AI designer · Latvia · RU / EN',
    title: 'A fast, ready-made website for your business — tailored in XXX days',
    subtitle: 'I build modern websites together with AI: faster than a site builder, without extra costs. I break down every technique openly on my Instagram.',
    cta: 'I want a site like this',
    secondary: 'See templates ↓',
    follow: 'Follow for tips →',
    trust: 'This site is my first case study: Lighthouse XXX/100 · no cookies · 2 languages',
    imageAlt: 'XXX — photo',
  },
  showcase: {
    title: 'Ready-made websites — pick your base',
    lead: 'Every template is a live website. You pick a base and send your texts and photos — I tailor the site to your business.',
    days: 'days',
    demo: 'View demo ↗',
    soon: 'Soon',
    notFound: 'Can’t find your niche? Describe your task — I’ll suggest the closest template.',
    notFoundCta: 'Describe my task',
  },
  process: {
    title: 'How it works — 4 steps',
    steps: [
      { title: 'Pick a template', text: 'Or describe what you need — I’ll find the closest one.' },
      { title: 'Send your materials', text: 'Texts, photos, logo. No texts yet? I’ll help you write them.' },
      { title: 'I tailor the site', text: 'Colours, fonts and sections for your business. I show you a draft, you request changes.' },
      { title: 'Launch', text: 'I connect your domain and hand over all access. The site is fully yours.' },
    ],
    cta: 'I want a site like this',
  },
  howBuilt: {
    title: 'How this site is built',
    lead: 'I learn in public. Every feature of this site is broken down in its own post.',
    link: 'Breakdown on Instagram ↗',
    items: [
      { title: 'Scroll animations in pure CSS', text: 'No heavy libraries — sections gently appear as you reach them.', href: 'https://www.instagram.com/p/XXX/' },
      { title: 'Smooth page transitions', text: 'Like in an app: pages flow into each other instead of flashing.', href: 'https://www.instagram.com/p/XXX/' },
      { title: 'Dark and light theme', text: 'The site follows your phone’s settings automatically.', href: 'https://www.instagram.com/p/XXX/' },
      { title: 'XXX/100 in Google Lighthouse', text: 'Opens fast, even on mobile data.', href: 'https://www.instagram.com/p/XXX/' },
      { title: 'No cookie banner', text: 'Analytics that doesn’t track visitors — and no pop-ups.', href: 'https://www.instagram.com/p/XXX/' },
    ],
  },
  about: {
    title: 'About me',
    text: 'Hi! I’m XXX, an AI designer based in Latvia. I started with websites on Tilda, and now I build them together with artificial intelligence: it’s faster, and the sites come out lighter and more modern. To be honest, I’m at the start of my journey. That’s why I show my process openly and treat every project as my main case study.',
    facts: ['Tilda → vibe coding', 'Russian, English', 'Online, worldwide'],
    imageAlt: 'XXX at work',
  },
  footer: {
    made: 'Made with AI and care',
    privacy: 'Privacy policy',
    noCookies: 'No cookies on this site',
    howBuilt: 'How this site is built',
  },
};
