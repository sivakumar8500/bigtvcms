import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../use-pagination';
import { useSorting } from '../use-sorting';

describe('usePagination hook', () => {
  it('should initialize with default page and pageSize', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('should initialize with custom page and pageSize', () => {
    const { result } = renderHook(() => usePagination(3, 25));
    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(25);
  });

  it('should update page when handlePageChange is called', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.handlePageChange(5);
    });
    expect(result.current.page).toBe(5);
  });

  it('should update pageSize and reset page to 1 when handlePageSizeChange is called', () => {
    const { result } = renderHook(() => usePagination(3, 10));
    expect(result.current.page).toBe(3);

    act(() => {
      result.current.handlePageSizeChange(50);
    });
    expect(result.current.pageSize).toBe(50);
    expect(result.current.page).toBe(1);
  });

  it('should retain page when only pageSize changes to same value', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.handlePageChange(3);
    });
    act(() => {
      result.current.handlePageSizeChange(10);
    });
    expect(result.current.pageSize).toBe(10);
    expect(result.current.page).toBe(1);
  });
});

describe('useSorting hook', () => {
  it('should initialize with default sortBy and direction', () => {
    const { result } = renderHook(() => useSorting());
    expect(result.current.sort.sortBy).toBe('createdAt');
    expect(result.current.sort.direction).toBe('desc');
  });

  it('should initialize with custom sortBy and direction', () => {
    const { result } = renderHook(() => useSorting('nameEn', 'asc'));
    expect(result.current.sort.sortBy).toBe('nameEn');
    expect(result.current.sort.direction).toBe('asc');
  });

  it('should toggle direction when sorting same column', () => {
    const { result } = renderHook(() => useSorting('nameEn', 'asc'));
    act(() => {
      result.current.handleSort('nameEn');
    });
    expect(result.current.sort.direction).toBe('desc');

    act(() => {
      result.current.handleSort('nameEn');
    });
    expect(result.current.sort.direction).toBe('asc');
  });

  it('should sort desc when clicking a new column', () => {
    const { result } = renderHook(() => useSorting('nameEn', 'asc'));
    act(() => {
      result.current.handleSort('createdAt');
    });
    expect(result.current.sort.sortBy).toBe('createdAt');
    expect(result.current.sort.direction).toBe('desc');
  });

  it('should update sortBy when sorting a different column', () => {
    const { result } = renderHook(() => useSorting());
    act(() => {
      result.current.handleSort('nameEn');
    });
    expect(result.current.sort.sortBy).toBe('nameEn');
  });
});
