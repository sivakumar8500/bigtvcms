/**
 * Language Store Tests
 *
 * Tests the Zustand language store (useLanguageStore) which persists
 * the UI language preference in localStorage and sets a cookie.
 */

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import { useLanguageStore } from '../language-store';

beforeEach(() => {
  localStorageMock.clear();
  // Reset Zustand store to initial state between tests
  useLanguageStore.setState({ 
    language: 'en',
    activeLanguages: ['en', 'te', 'hi', 'ml']
  });
});

describe('useLanguageStore', () => {
  it('should have default language as "en"', () => {
    const { language, activeLanguages } = useLanguageStore.getState();
    expect(language).toBe('en');
    expect(activeLanguages).toEqual(['en', 'te', 'hi', 'ml']);
  });

  it('should toggle language active/inactive', () => {
    useLanguageStore.getState().toggleLanguageActive('te');
    expect(useLanguageStore.getState().activeLanguages).not.toContain('te');

    useLanguageStore.getState().toggleLanguageActive('te');
    expect(useLanguageStore.getState().activeLanguages).toContain('te');
  });

  it('should fallback to another active language if current language is deactivated', () => {
    // Current is 'en'
    useLanguageStore.getState().toggleLanguageActive('en');
    expect(useLanguageStore.getState().language).not.toBe('en');
    expect(useLanguageStore.getState().activeLanguages).not.toContain('en');
    // It should have chosen one of ['te', 'hi', 'ml']
    expect(['te', 'hi', 'ml']).toContain(useLanguageStore.getState().language);
  });

  it('should update language to Telugu', () => {
    useLanguageStore.getState().setLanguage('te');
    expect(useLanguageStore.getState().language).toBe('te');
  });

  it('should update language to Hindi', () => {
    useLanguageStore.getState().setLanguage('hi');
    expect(useLanguageStore.getState().language).toBe('hi');
  });

  it('should update language to Malayalam', () => {
    useLanguageStore.getState().setLanguage('ml');
    expect(useLanguageStore.getState().language).toBe('ml');
  });

  it('should set NEXT_LOCALE cookie when language changes', () => {
    useLanguageStore.getState().setLanguage('te');
    expect(document.cookie).toContain('NEXT_LOCALE=te');
  });

  it('should allow switching back to English', () => {
    useLanguageStore.getState().setLanguage('hi');
    useLanguageStore.getState().setLanguage('en');
    expect(useLanguageStore.getState().language).toBe('en');
  });
});
