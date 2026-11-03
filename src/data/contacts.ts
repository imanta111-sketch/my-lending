/** Контакты (ТЗ §10). Пустая строка — канал не показывается на сайте. */
export const contacts = {
  instagram: 'ritaexpert50', // ник без @
  whatsapp: '37122441485', // номер в международном формате без + и пробелов
  telegram: '', // нет
  email: 'imanta111@gmail.com',
};

/** Ключ Web3Forms: куда пересылать заявки с формы (не секретный, web3forms.com). */
export const web3formsKey = '7463ee19-38db-43b6-b13d-686ec6c7d96f';

export const links = {
  instagram: `https://www.instagram.com/${contacts.instagram}/`,
  instagramDm: `https://ig.me/m/${contacts.instagram}`,
  whatsapp: `https://wa.me/${contacts.whatsapp}`,
  telegram: contacts.telegram ? `https://t.me/${contacts.telegram}` : '',
  email: `mailto:${contacts.email}`,
};
