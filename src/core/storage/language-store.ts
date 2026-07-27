import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'ml';

export interface StoredLanguage {
  languageId: number;
  languageName: string;
  code: string;
  slogan: string;
  isSystemActive: boolean;
  nameEn: string;
  nameTe: string;
  nameHi: string;
  nameMl: string;
  imageUrl?: string;
  symbol?: string;
}

export interface StoredCategory {
  categoryId: number;
  nameEn: string;
  nameTe: string;
  nameHi: string;
  nameMl: string;
  icon: string;
  isFollowed: boolean;
}

export interface StoredTag {
  aitagid: number;
  aitagname: string;
  tagEn: string;
  tagTe: string;
  tagHi: string;
  tagMl: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface StoredLocation {
  stateId: number;
  stateName: string;
  isFollowed: boolean;
  stateEn: string;
  stateTe: string;
  stateHi: string;
  stateMl: string;
  imageUrl?: string;
}

interface LanguageState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  activeLanguages: SupportedLanguage[];
  toggleLanguageActive: (code: SupportedLanguage) => void;
  systemLanguages: StoredLanguage[];
  setSystemLanguages: (langs: StoredLanguage[]) => void;
  setActiveLanguages: (codes: SupportedLanguage[]) => void;
  categories: StoredCategory[];
  setCategories: (cats: StoredCategory[]) => void;
  tags: StoredTag[];
  setTags: (tags: StoredTag[]) => void;
  locations: StoredLocation[];
  setLocations: (locs: StoredLocation[]) => void;
}

const defaultSystemLanguages: StoredLanguage[] = [
  {
    languageId: 7,
    languageName: 'Telugu',
    code: 'te',
    slogan: 'ఆంధ్రప్రదేశ్ & తెలంగాణ వార్తలు',
    isSystemActive: true,
    nameEn: 'Telugu',
    nameTe: 'తెలుగు',
    nameHi: 'तेलुगु',
    nameMl: 'തെലുങ്ക്',
    symbol: 'అ',
  },
  {
    languageId: 8,
    languageName: 'English',
    code: 'en',
    slogan: 'World Standard Edition',
    isSystemActive: true,
    nameEn: 'English',
    nameTe: 'ఆంగ్లం',
    nameHi: 'अंग्रेज़ी',
    nameMl: 'ഇംഗ്ലീഷ്',
    symbol: 'A',
  },
  {
    languageId: 9,
    languageName: 'Malayalam',
    code: 'ml',
    slogan: 'കേരള ప్రాദേശിക വാർത്തകൾ',
    isSystemActive: true,
    nameEn: 'Malayalam',
    nameTe: 'మలയാളం',
    nameHi: 'मलयालम',
    nameMl: 'മലയാളം',
    symbol: 'മ',
  },
  {
    languageId: 10,
    languageName: 'Kanada',
    code: 'kn',
    slogan: 'कनाद',
    isSystemActive: true,
    nameEn: 'Kanada',
    nameTe: 'కనాద్',
    nameHi: 'कनाद',
    nameMl: 'കനാദ്',
    symbol: 'ह',
  },
  {
    languageId: 11,
    languageName: 'english',
    code: 'ss',
    slogan: '',
    isSystemActive: true,
    nameEn: 'english',
    nameTe: 'telugu',
    nameHi: 'hindhi',
    nameMl: 'malayalam',
    symbol: 'ह',
  },
];

const defaultLocations: StoredLocation[] = [
  {
    stateId: 19,
    stateName: 'తెలంగాణ',
    isFollowed: false,
    stateEn: 'Telangana',
    stateTe: 'తెలంగాణ',
    stateHi: 'तेलंगाना',
    stateMl: 'തെലങ്കാന',
  },
  {
    stateId: 21,
    stateName: 'ఆంధ్రప్రదేశ్',
    isFollowed: false,
    stateEn: 'Andhra Pradesh',
    stateTe: 'ఆంధ్రప్రదేశ్',
    stateHi: 'आंध्र प्रदेश',
    stateMl: 'ఆന്ധ്രാప్రദേശ്',
  },
];

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      activeLanguages: ['en', 'te', 'hi', 'ml'],
      systemLanguages: defaultSystemLanguages,
      categories: [],
      tags: [],
      locations: defaultLocations,
      setLanguage: (lang) => {
        // Persist language setting inside cookie for next-intl server loading
        if (typeof document !== 'undefined') {
          document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        }
        set({ language: lang });
      },
      setActiveLanguages: (codes) => {
        const current = get().activeLanguages;
        if (current.length === codes.length && current.every((c, i) => c === codes[i])) {
          return;
        }
        set({ activeLanguages: codes });
      },
      setSystemLanguages: (langs) => {
        const current = get().systemLanguages;
        if (
          current.length === langs.length &&
          current.every((l, i) => l.languageId === langs[i]?.languageId && l.isSystemActive === langs[i]?.isSystemActive)
        ) {
          return;
        }
        set({ systemLanguages: langs });
      },
      setCategories: (cats) => {
        set({ categories: cats });
      },
      setTags: (tags) => {
        set({ tags });
      },
      setLocations: (locs) => {
        set({ locations: locs });
      },
      toggleLanguageActive: (code) => {
        const currentActive = get().activeLanguages;
        let newActive: SupportedLanguage[];

        if (currentActive.includes(code)) {
          // Deactivate
          newActive = currentActive.filter((c) => c !== code);
          // If the deactivated language is the currently selected language, fallback to the first remaining active language, or 'en'
          if (get().language === code) {
            const fallback = newActive.length > 0 ? newActive[0] : 'en';
            if (typeof document !== 'undefined') {
              document.cookie = `NEXT_LOCALE=${fallback}; path=/; max-age=31536000; SameSite=Lax`;
            }
            set({ language: fallback });
          }
        } else {
          // Activate
          newActive = [...currentActive, code];
        }

        set({ activeLanguages: newActive });
        // Also sync isSystemActive property in systemLanguages
        const updatedSystem = get().systemLanguages.map((lang) => ({
          ...lang,
          isSystemActive: newActive.includes(lang.code as SupportedLanguage),
        }));
        set({ systemLanguages: updatedSystem });
      },
    }),
    {
      name: 'bigtv-language-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
