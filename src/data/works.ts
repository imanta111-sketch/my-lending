import privychki from '../assets/works/privychki.png';
import zapis from '../assets/works/zapis.png';
import matematika from '../assets/works/matematika.png';
import thisSite from '../assets/works/this-site.png';
import type { Locale } from '../i18n';

export type Work = {
  id: 'privychki' | 'zapis' | 'matematika' | 'this-site';
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  /** Путь внутри сайта: страница приложения или якорь на секцию. */
  href: string;
  /** true — открывать в новой вкладке, чтобы лендинг остался у человека открытым. */
  newTab: boolean;
  image: ImageMetadata;
};

export const works: Work[] = [
  {
    id: 'privychki',
    title: { ru: 'Тренажёр полезных привычек', en: 'Good-habits tracker' },
    description: {
      ru: 'Мини-приложение для родителей и детей: ребёнок отмечает дела за день, копит баллы и обменивает их на награду. Открывается на телефоне, ничего не надо устанавливать.',
      en: 'A mini-app for parents and children: the child ticks off the day’s tasks, collects points and trades them for a reward. Opens on a phone, nothing to install.',
    },
    href: '/works/privychki/',
    newTab: true,
    image: privychki,
  },
  {
    id: 'zapis',
    title: { ru: 'Запись на маникюр', en: 'Nail-salon booking' },
    description: {
      ru: 'Прототип записи к мастеру: клиент занимает свободное время или вписывается на нужный день, мастер подтверждает. Можно посмотреть и со стороны клиента, и со стороны мастера.',
      en: 'A booking prototype: the client takes a free slot or asks for a day, and the specialist confirms it. You can switch between the client’s and the specialist’s side.',
    },
    href: '/works/zapis/',
    newTab: true,
    image: zapis,
  },
  {
    id: 'matematika',
    title: { ru: 'Тренажёр по математике', en: 'Maths trainer' },
    description: {
      ru: 'Задания за первую четверть для 4 и 5 классов: ребёнок выбирает тему, решает примеры и видит свой уровень от 1 до 5. Прогресс сохраняется, можно продолжить с того же места.',
      en: 'First-term exercises for ages 9–11: the child picks a topic, solves problems and sees a level from 1 to 5. Progress is kept, so they can pick up where they left off.',
    },
    href: '/works/matematika/',
    newTab: true,
    image: matematika,
  },
  {
    id: 'this-site',
    title: { ru: 'Этот сайт', en: 'This very site' },
    description: {
      ru: 'Тот самый лендинг, который вы читаете: быстрый, с тёмной темой и без cookie. Разбор — чуть ниже.',
      en: 'The landing page you are reading: fast, with a dark theme and no cookies. The breakdown is just below.',
    },
    href: '#how-built',
    newTab: false,
    image: thisSite,
  },
];
