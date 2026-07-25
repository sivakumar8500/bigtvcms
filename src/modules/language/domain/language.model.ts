export interface LanguageNameMap {
  en: string;
  hi?: string;
  ml?: string;
  te?: string;
}

export interface Language {
  languageId: number;
  languageName: string;
  code: string;
  slogan: string;
  isSystemActive: boolean;
  nameEn: string;
  nameTe: string;
  nameHi: string;
  nameMl: string;
  symbol: string;
  imageUrl?: string;
  nameMap?: LanguageNameMap;
}
