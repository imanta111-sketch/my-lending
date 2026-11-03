/** Заменить XXX реальными данными (ТЗ §10). */
export const contacts = {
  instagram: 'XXX', // ник без @
  whatsapp: 'XXX', // номер в международном формате без + и пробелов
  telegram: 'XXX', // ник без @
  email: 'XXX',
};

export const links = {
  instagram: `https://www.instagram.com/${contacts.instagram}/`,
  instagramDm: `https://ig.me/m/${contacts.instagram}`,
  whatsapp: `https://wa.me/${contacts.whatsapp}`,
  telegram: `https://t.me/${contacts.telegram}`,
  email: `mailto:${contacts.email}`,
};
