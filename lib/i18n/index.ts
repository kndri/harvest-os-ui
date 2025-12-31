import en from './dictionaries/en.json';
import fr from './dictionaries/fr.json';

const dictionaries = { en, fr };

export function getDictionary(locale: 'en' | 'fr' = 'en') {
  return dictionaries[locale] || dictionaries.en;
}

export function getLocalizedText(
  enText: string | null | undefined,
  frText: string | null | undefined,
  locale: 'en' | 'fr' = 'en'
): string {
  if (locale === 'fr' && frText) {
    return frText;
  }
  return enText || '';
}

export type Locale = 'en' | 'fr';
