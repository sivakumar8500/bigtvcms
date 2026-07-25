import { Locale, defaultLocale } from '../config';

export type Multilingual<T> = Record<Locale, T>;

export function getLocalizedValue<T>(field: Multilingual<T> | undefined, currentLocale: string): T | undefined {
  if (!field) return undefined;
  
  // Explicitly select active language key
  const val = field[currentLocale as Locale];
  if (val !== undefined && val !== null) {
    return val;
  }

  // Fallback to default language
  return field[defaultLocale];
}
