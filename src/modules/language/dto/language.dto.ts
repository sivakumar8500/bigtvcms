export interface LanguageNameMap {
  en: string;
  hi?: string;
  ml?: string;
  te?: string;
}

export interface CreateLanguageDto {
  code: string;
  name: LanguageNameMap;
  status: boolean;
  symbol: string;
}

export interface UpdateLanguageDto {
  code?: string;
  name?: LanguageNameMap;
  status?: boolean;
  symbol?: string;
}

export interface LanguageResponseDto {
  id: number;
  code: string;
  name: LanguageNameMap;
  status: boolean;
  symbol: string;
}
