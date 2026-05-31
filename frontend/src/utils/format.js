import { format } from 'date-fns';
import { uz, ru, enUS } from 'date-fns/locale';

const locales = { uz, ru, en: enUS };

export const formatDate = (date, lang = 'uz', pattern = 'd MMMM yyyy') => {
  if (!date) return '';
  return format(new Date(date), pattern, { locale: locales[lang] || uz });
};

export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'HH:mm');
};

export const pickLocalized = (obj, lang = 'uz') => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.uz || obj.en || obj.ru || '';
};
