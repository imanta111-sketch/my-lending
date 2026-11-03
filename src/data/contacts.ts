/** Контакты (ТЗ §10). Пустая строка — канал не показывается на сайте. */
export const contacts = {
  instagram: 'ritaexpert50', // ник без @
  whatsapp: '37122441485', // номер в международном формате без + и пробелов
  telegram: '', // нет
  email: 'imanta111@gmail.com',
};

export const links = {
  instagram: `https://www.instagram.com/${contacts.instagram}/`,
  instagramDm: `https://ig.me/m/${contacts.instagram}`,
  whatsapp: `https://wa.me/${contacts.whatsapp}`,
  telegram: contacts.telegram ? `https://t.me/${contacts.telegram}` : '',
  email: `mailto:${contacts.email}`,
};
