import { renderHook, act } from '@testing-library/react';
import { useReelsController } from '../hooks/useReelsController';
import { reelSchema } from '../validators/reels.validator';

describe('Reel Validator Schema', () => {
  it('should validate a valid reel object', () => {
    const validData = {
      titleEn: 'Hyderabad Biryani Tour',
      titleTe: 'హైదరాబాద్ బిర్యానీ టూర్',
      titleHi: 'हैदराबाद बिरयानी टूर',
      titleMl: 'ഹൈദരാബാദ് ബിരിയാണി ടൂർ',
      duration: '0:30',
    };
    const result = reelSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if duration is missing', () => {
    const invalidData = {
      titleEn: 'Hyderabad Biryani Tour',
      titleTe: 'హైదరాబాద్ బిర్యానీ టూర్',
      titleHi: 'हैदराबाद बिरयानी टूर',
      titleMl: 'ഹൈദരാബാദ് ബിരിയാണി ടൂർ',
      duration: '',
    };
    const result = reelSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('useReelsController hook', () => {
  it('should initialize with default states', () => {
    const { result } = renderHook(() => useReelsController());
    expect(result.current.rows.length).toBeGreaterThan(0);
    expect(result.current.filterTitle).toBe('');
    expect(result.current.page).toBe(1);
    expect(result.current.drawerOpen).toBe(false);
  });

  it('should update filter title and reset page to 1', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setFilterTitle('Biryani');
    });
    expect(result.current.filterTitle).toBe('Biryani');
    expect(result.current.page).toBe(1);
  });

  it('should toggle publish state', () => {
    const { result } = renderHook(() => useReelsController());
    const initialPublishState = result.current.rows[0].isPublished;
    act(() => {
      result.current.togglePublish(result.current.rows[0].reelId);
    });
    expect(result.current.rows[0].isPublished).toBe(!initialPublishState);
  });

  it('should open and close drawer properly', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.setDrawerOpen(true);
    });
    expect(result.current.drawerOpen).toBe(true);

    act(() => {
      result.current.handleCloseDrawer();
    });
    expect(result.current.drawerOpen).toBe(false);
  });

  it('should handle edit click and fill form', () => {
    const { result } = renderHook(() => useReelsController());
    const firstReel = result.current.rows[0];
    act(() => {
      result.current.handleEditClick(firstReel);
    });
    expect(result.current.isEditMode).toBe(true);
    expect(result.current.form.titleEn).toBe(firstReel.titleEn);
  });

  it('should handle form field change', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.handleFieldChange('titleEn', 'New Reel Title');
    });
    expect(result.current.form.titleEn).toBe('New Reel Title');
  });

  it('should validation fail on submit if fields are empty', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('should add a reel on successful submit', () => {
    const { result } = renderHook(() => useReelsController());
    act(() => {
      result.current.handleFieldChange('titleEn', 'Metro Launch');
    });
    act(() => {
      result.current.handleFieldChange('titleTe', 'మెట్రో ప్రారంభం');
    });
    act(() => {
      result.current.handleFieldChange('titleHi', 'मेट्रो शुभारंभ');
    });
    act(() => {
      result.current.handleFieldChange('titleMl', 'മെട്രോ ഉദ്ഘാടനം');
    });
    act(() => {
      result.current.handleFieldChange('duration', '1:00');
    });
    act(() => {
      result.current.handleSubmit();
    });
    expect(result.current.rows.some((r) => r.titleEn === 'Metro Launch')).toBe(true);
  });

  it('should delete a reel on deleteReel', () => {
    const { result } = renderHook(() => useReelsController());
    const initialLen = result.current.rows.length;
    const targetId = result.current.rows[0].reelId;
    act(() => {
      result.current.deleteReel(targetId);
    });
    expect(result.current.rows.length).toBe(initialLen - 1);
    expect(result.current.rows.some((r) => r.reelId === targetId)).toBe(false);
  });
});

