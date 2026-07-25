import { renderHook, act } from '@testing-library/react';
import { useLanguageController } from '../hooks/useLanguageController';
import { languageSchema } from '../validators/language.validator';
import { LanguageMapper } from '../mapper/language.mapper';
import { LanguageRepository } from '../repositories/language.repository';
import { apiClient } from '@/core/api/api-client';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Language Validator Schema', () => {
  it('should validate a valid language object', () => {
    const validData = {
      nameEn: 'English',
      nameTe: 'ఇంగ్లీష్',
      nameHi: 'अंग्रेज़ी',
      nameMl: 'ഇംഗ്ലീഷ്',
      code: 'en',
      symbol: 'A',
    };
    const result = languageSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if code is missing', () => {
    const invalidData = {
      nameEn: 'English',
      nameTe: 'ఇంగ్లీష్',
      nameHi: 'अंग्रेज़ी',
      nameMl: 'ഇംഗ്ലീഷ്',
      code: '',
    };
    const result = languageSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Language Mapper', () => {
  it('should map LanguageResponseDto to Language domain model correctly', () => {
    const dto = {
      id: 7,
      code: 'te',
      name: {
        en: 'Telugu',
        hi: 'तेलुगु',
        ml: 'തെലുങ്ക്',
        te: 'తెలుగు',
      },
      status: true,
      symbol: 'అ',
    };
    const domain = LanguageMapper.toDomain(dto);
    expect(domain.languageId).toBe(7);
    expect(domain.code).toBe('te');
    expect(domain.nameEn).toBe('Telugu');
    expect(domain.nameTe).toBe('తెలుగు');
    expect(domain.symbol).toBe('అ');
    expect(domain.isSystemActive).toBe(true);
  });
});

describe('Language Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call apiClient.get on getAll', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([]);
    await LanguageRepository.getAll(0, 100);
    expect(apiClient.get).toHaveBeenCalledWith('/languages', { skip: 0, limit: 100 });
  });

  it('should return res.data, res.languages, res.items or fallback array on getAll', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [{ id: 1, code: 'en' }] });
    expect(await LanguageRepository.getAll(0, 100)).toEqual([{ id: 1, code: 'en' }]);

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ languages: [{ id: 2, code: 'te' }] });
    expect(await LanguageRepository.getAll(0, 100)).toEqual([{ id: 2, code: 'te' }]);

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ items: [{ id: 3, code: 'hi' }] });
    expect(await LanguageRepository.getAll(0, 100)).toEqual([{ id: 3, code: 'hi' }]);

    (apiClient.get as jest.Mock).mockResolvedValueOnce({});
    expect(await LanguageRepository.getAll(0, 100)).toEqual([]);
  });

  it('should call apiClient.post on create', async () => {
    const payload = {
      code: 'te',
      name: { en: 'Telugu', te: 'తెలుగు', hi: 'तेलुगु', ml: 'തെലുങ്ക്' },
      status: true,
      symbol: 'అ',
    };
    (apiClient.post as jest.Mock).mockResolvedValue({ id: 7, ...payload });
    await LanguageRepository.create(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/languages', payload);
  });

  it('should call apiClient.put on update', async () => {
    const payload = { status: false };
    (apiClient.put as jest.Mock).mockResolvedValue({ id: 7, ...payload });
    await LanguageRepository.update(7, payload);
    expect(apiClient.put).toHaveBeenCalledWith('/languages/7', payload);
  });

  it('should call apiClient.delete on delete', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);
    await LanguageRepository.delete(7);
    expect(apiClient.delete).toHaveBeenCalledWith('/languages/7');
  });
});

describe('useLanguageController hook', () => {
  const mockLanguages = [
    {
      id: 7,
      code: 'te',
      name: { en: 'Telugu', te: 'తెలుగు', hi: 'तेलुगु', ml: 'തെലുങ്ക്' },
      status: true,
      symbol: 'అ',
    },
    {
      id: 8,
      code: 'en',
      name: { en: 'English', te: 'ఆంగ్లం', hi: 'अंग्रेज़ी', ml: 'ഇംഗ്ലീഷ്' },
      status: true,
      symbol: 'A',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.get as jest.Mock).mockResolvedValue(mockLanguages);
  });

  it('should fetch languages on mount', async () => {
    const { result } = renderHook(() => useLanguageController());
    await act(async () => {});
    expect(result.current.rows.length).toBe(2);
    expect(result.current.rows[0].code).toBe('te');
  });

  it('should handle optimistic toggle and call update API', async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({ id: 7, status: false });
    const { result } = renderHook(() => useLanguageController());
    await act(async () => {});

    await act(async () => {
      await result.current.toggleActive(7);
    });

    expect(apiClient.put).toHaveBeenCalledWith('/languages/7', { status: false });
  });

  it('should handle create language on form submit', async () => {
    const newLangDto = {
      id: 11,
      code: 'ss',
      name: { en: 'english', te: 'telugu', hi: 'hindhi', ml: 'malayalam' },
      status: true,
      symbol: 'ह',
    };
    (apiClient.post as jest.Mock).mockResolvedValue(newLangDto);
    const { result } = renderHook(() => useLanguageController());
    await act(async () => {});

    act(() => {
      result.current.handleFieldChange('code', 'ss');
      result.current.handleFieldChange('nameEn', 'english');
      result.current.handleFieldChange('nameTe', 'telugu');
      result.current.handleFieldChange('nameHi', 'hindhi');
      result.current.handleFieldChange('nameMl', 'malayalam');
      result.current.handleFieldChange('symbol', 'ह');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(apiClient.post).toHaveBeenCalledWith('/languages', {
      code: 'ss',
      name: { en: 'english', te: 'telugu', hi: 'hindhi', ml: 'malayalam' },
      status: true,
      symbol: 'ह',
    });
  });

  it('should handle create language without nameHi on form submit', async () => {
    const newLangDto = {
      id: 12,
      code: 'kn',
      name: { en: 'Kannada', te: 'కన్నడ', hi: '', ml: 'കന്നഡ' },
      status: true,
      symbol: 'ക',
    };
    (apiClient.post as jest.Mock).mockResolvedValue(newLangDto);
    const { result } = renderHook(() => useLanguageController());
    await act(async () => {});

    act(() => {
      result.current.handleFieldChange('code', 'kn');
      result.current.handleFieldChange('nameEn', 'Kannada');
      result.current.handleFieldChange('nameTe', 'కన్నడ');
      result.current.handleFieldChange('nameMl', 'കന്നഡ');
      result.current.handleFieldChange('symbol', 'ക');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(apiClient.post).toHaveBeenCalledWith('/languages', {
      code: 'kn',
      name: { en: 'Kannada', te: 'కన్నడ', hi: '', ml: 'കന്നഡ' },
      status: true,
      symbol: 'ക',
    });
  });

  it('should handle delete language', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useLanguageController());
    await act(async () => {});

    await act(async () => {
      await result.current.deleteLanguage(7);
    });

    expect(apiClient.delete).toHaveBeenCalledWith('/languages/7');
    expect(result.current.rows.length).toBe(1);
  });
});
