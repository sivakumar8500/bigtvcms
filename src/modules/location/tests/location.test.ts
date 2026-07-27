import { renderHook, act } from '@testing-library/react';
import { useLocationController } from '../hooks/useLocationController';
import { createLocationSchema, locationSchema } from '../validators/location.validator';
import { LocationMapper } from '../mapper/location.mapper';
import { LocationRepository } from '../repositories/location.repository';
import { apiClient } from '@/core/api/api-client';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Location Validator Schema', () => {
  it('should validate a valid location object with all active languages', () => {
    const validData = {
      stateEn: 'Telangana',
      stateTe: 'తెలంగాణ',
      stateHi: 'तेलंगाना',
      stateMl: 'തെലങ്കാന',
    };
    const result = locationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if an active language state name is empty', () => {
    const invalidData = {
      stateEn: '',
      stateTe: 'తెలంగాణ',
      stateHi: 'तेलंगाना',
      stateMl: 'തെലങ്കാന',
    };
    const result = locationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should only require active languages when created via createLocationSchema', () => {
    const schemaEnTeOnly = createLocationSchema(['en', 'te']);
    const partialData = {
      stateEn: 'Telangana',
      stateTe: 'తెలంగాణ',
      stateHi: '',
      stateMl: '',
    };
    const result = schemaEnTeOnly.safeParse(partialData);
    expect(result.success).toBe(true);
  });
});

describe('Location Mapper', () => {
  it('should map StateResponseDto to LocationState domain model correctly', () => {
    const dto = {
      stateId: 19,
      stateName: 'తెలంగాణ',
      stateNameTranslations: {
        en: 'Telangana',
        te: 'తెలంగాణ',
        ml: 'തെലങ്കാന',
      },
      value: 'telangana',
      isActive: true,
      status: true,
    };
    const domain = LocationMapper.toDomain(dto);
    expect(domain.stateId).toBe(19);
    expect(domain.stateEn).toBe('Telangana');
    expect(domain.stateTe).toBe('తెలంగాణ');
    expect(domain.isFollowed).toBe(true);
  });
});

describe('Location Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call apiClient.get on getAll with number or string param', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([]);
    await LocationRepository.getAll(0, 100);
    expect(apiClient.get).toHaveBeenCalledWith('/admin/states', { skip: 0, limit: 100 });

    await LocationRepository.getAll('te');
    expect(apiClient.get).toHaveBeenCalledWith('/admin/states', { lang: 'te', skip: 0, limit: 100 });
  });

  it('should return res.data, res.states, res.items, fallback, or catch fallback on getAll', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: [{ stateId: 1 }] });
    expect(await LocationRepository.getAll(0, 100)).toEqual([{ stateId: 1 }]);

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ states: [{ stateId: 2 }] });
    expect(await LocationRepository.getAll(0, 100)).toEqual([{ stateId: 2 }]);

    (apiClient.get as jest.Mock).mockResolvedValueOnce({ items: [{ stateId: 3 }] });
    expect(await LocationRepository.getAll(0, 100)).toEqual([{ stateId: 3 }]);

    (apiClient.get as jest.Mock).mockResolvedValueOnce({});
    expect(await LocationRepository.getAll(0, 100)).toEqual([]);

    // Test catch fallback /locations
    (apiClient.get as jest.Mock)
      .mockRejectedValueOnce(new Error('500 Server Error'))
      .mockResolvedValueOnce([{ stateId: 4 }]);
    expect(await LocationRepository.getAll(0, 100)).toEqual([{ stateId: 4 }]);

    (apiClient.get as jest.Mock)
      .mockRejectedValueOnce(new Error('500 Server Error'))
      .mockResolvedValueOnce({ data: [{ stateId: 5 }] });
    expect(await LocationRepository.getAll(0, 100)).toEqual([{ stateId: 5 }]);

    (apiClient.get as jest.Mock)
      .mockRejectedValueOnce(new Error('500 Server Error'))
      .mockResolvedValueOnce({});
    expect(await LocationRepository.getAll(0, 100)).toEqual([]);
  });

  it('should call apiClient.post on create', async () => {
    const payload = {
      translations: {
        en: 'Telangana',
        te: 'తెలంగాణ',
        ml: 'തെലങ്കാന',
      },
      is_active: true,
    };
    (apiClient.post as jest.Mock).mockResolvedValue({
      message: 'State created successfully',
      data: { state_id: 140, state_name: 'Telangana', isActive: true },
    });
    await LocationRepository.create(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/admin/states/create', payload);
  });

  it('should call apiClient.put on update', async () => {
    const payload = { translations: { en: 'Telangana' }, is_active: false };
    (apiClient.put as jest.Mock).mockResolvedValue({ state_id: 19, ...payload });
    await LocationRepository.update(19, payload);
    expect(apiClient.put).toHaveBeenCalledWith('/admin/states/19', payload);
  });

  it('should call apiClient.delete on delete', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);
    await LocationRepository.delete(19);
    expect(apiClient.delete).toHaveBeenCalledWith('/admin/states/19');
  });
});

describe('useLocationController hook', () => {
  const mockStates = [
    {
      state_id: 19,
      state_name: 'తెలంగాణ',
      stateNameTranslations: { en: 'Telangana', te: 'తెలంగాణ', ml: 'തെലങ്കാന' },
      value: 'telangana',
      isActive: true,
    },
    {
      state_id: 21,
      state_name: 'ఆంధ్రప్రదేశ్',
      stateNameTranslations: { en: 'Andhra Pradesh', te: 'ఆంధ్రప్రదేశ్', ml: 'ആന്ധ്രാപ്രദേശ്' },
      value: 'andhrapradesh',
      isActive: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.get as jest.Mock).mockResolvedValue(mockStates);
  });

  it('should fetch states from /admin/states on mount', async () => {
    const { result } = renderHook(() => useLocationController());
    await act(async () => {});
    expect(result.current.rows.length).toBe(2);
    expect(result.current.rows[0].stateEn).toBe('Telangana');
  });

  it('should toggle follow state and call update API', async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({ state_id: 19, isActive: false });
    const { result } = renderHook(() => useLocationController());
    await act(async () => {});

    await act(async () => {
      await result.current.toggleFollow(19);
    });

    expect(apiClient.put).toHaveBeenCalledWith('/admin/states/19', expect.objectContaining({
      is_active: false,
    }));
  });

  it('should create new location on submit', async () => {
    const newDto = {
      state_id: 139,
      state_name: 'కేరళ',
      stateNameTranslations: { en: 'Kerala', te: 'కేరళ', ml: 'കേരളം' },
      value: 'kerala',
      isActive: true,
    };
    (apiClient.post as jest.Mock).mockResolvedValue(newDto);
    const { result } = renderHook(() => useLocationController());
    await act(async () => {});

    act(() => {
      result.current.handleFieldChange('stateEn', 'Kerala');
      result.current.handleFieldChange('stateTe', 'కేరళ');
      result.current.handleFieldChange('stateHi', 'केरल');
      result.current.handleFieldChange('stateMl', 'കേരളം');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(apiClient.post).toHaveBeenCalledWith('/admin/states/create', expect.objectContaining({
      translations: {
        en: 'Kerala',
        te: 'కేరళ',
        ml: 'കേരളം',
      },
      is_active: true,
    }));
  });

  it('should delete a location on deleteLocation', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useLocationController());
    await act(async () => {});

    await act(async () => {
      await result.current.deleteLocation(19);
    });

    expect(apiClient.delete).toHaveBeenCalledWith('/admin/states/19');
    expect(result.current.rows.length).toBe(1);
  });
});
