export const locales = ['en', 'te', 'hi', 'ml'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  te: 'తెలుగు (Telugu)',
  hi: 'हिन्दी (Hindi)',
  ml: 'മലയാളം (Malayalam)',
};
