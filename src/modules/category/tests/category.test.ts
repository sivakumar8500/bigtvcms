import { renderHook, act } from '@testing-library/react';
import { useCategoryController } from '../hooks/useCategoryController';
import { categorySchema } from '../validators/category.validator';
import { CategoryRepository } from '../repositories/category.repository';

jest.mock('../repositories/category.repository', () => ({
  CategoryRepository: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/core/storage/language-store', () => ({
  useLanguageStore: () => ({
    language: 'te',
  }),
}));

describe('Category Validator Schema', () => {
  it('should validate a valid category object', () => {
    const validData = {
      nameEn: 'Business',
      nameTe: 'బిజినెస్',
      nameHi: 'व्यापार',
      nameMl: 'ബിസിനസ്',
      icon: '💼',
    };
    const result = categorySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if a multilingual name is empty', () => {
    const invalidData = {
      nameEn: '',
      nameTe: 'బిజినెస్',
      nameHi: 'व्यापार',
      nameMl: 'ബിസിനസ്',
    };
    const result = categorySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('useCategoryController hook with API integration', () => {
  const mockCategoriesDto = [
    {
      categoryId: 296,
      categoryName: 'అందం ',
      categoryNameTranslations: {
        en: 'Beauty',
        te: 'అందం ',
        hi: 'सुंदरता',
        ml: 'സൗന്ദര്യം',
      },
      imageUrl: 'https://example.com/beauty.png',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (CategoryRepository.getAll as jest.Mock).mockResolvedValue(mockCategoriesDto);
  });

  it('should initialize with api data on mount', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    expect(CategoryRepository.getAll).toHaveBeenCalledWith('te');
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].categoryId).toBe(296);
    expect(result.current.rows[0].nameEn).toBe('Beauty');
  });

  it('should update filter text and reset page to 1', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.page).toBe(2);

    act(() => {
      result.current.setFilterText('Beauty');
    });
    expect(result.current.filterText).toBe('Beauty');
    expect(result.current.page).toBe(1);
  });

  it('should toggle follow state and call update API', async () => {
    (CategoryRepository.update as jest.Mock).mockResolvedValue({ message: 'Success' });
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    await act(async () => {
      await result.current.toggleFollow(296);
    });

    expect(result.current.rows[0].isFollowed).toBe(true);
    expect(CategoryRepository.update).toHaveBeenCalledWith(296, expect.objectContaining({
      is_active: true,
    }));
  });

  it('should rollback follow state if update API fails', async () => {
    (CategoryRepository.update as jest.Mock).mockRejectedValue(new Error('Update failed'));
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    await act(async () => {
      await result.current.toggleFollow(296);
    });

    // Should rollback to false
    expect(result.current.rows[0].isFollowed).toBe(false);
  });

  it('should open and close drawer properly', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    act(() => {
      result.current.setDrawerOpen(true);
    });
    expect(result.current.drawerOpen).toBe(true);

    act(() => {
      result.current.handleCloseDrawer();
    });
    expect(result.current.drawerOpen).toBe(false);
  });

  it('should handle edit click and fill form', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    act(() => {
      result.current.handleEditClick(result.current.rows[0]);
    });
    expect(result.current.isEditMode).toBe(true);
    expect(result.current.form.nameEn).toBe('Beauty');
  });

  it('should handle form field change', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    act(() => {
      result.current.handleFieldChange('nameEn', 'New Name');
    });
    expect(result.current.form.nameEn).toBe('New Name');
  });

  it('should validation fail on submit if fields are empty', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it('should call create API and add category on submit in create mode', async () => {
    const newCategoryDto = {
      categoryId: 297,
      categoryName: 'Fashion',
      categoryNameTranslations: {
        en: 'Fashion',
        te: 'ఫ్యాషన్',
        hi: 'फैशन',
        ml: 'ഫാഷൻ',
      },
    };
    (CategoryRepository.create as jest.Mock).mockResolvedValue({
      message: 'Category created successfully',
      data: newCategoryDto,
    });

    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    act(() => {
      result.current.handleFieldChange('nameEn', 'Fashion');
      result.current.handleFieldChange('nameTe', 'ఫ్యాషన్');
      result.current.handleFieldChange('nameHi', 'फैशन');
      result.current.handleFieldChange('nameMl', 'ഫാഷൻ');
      result.current.handleFieldChange('icon', '👗');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(CategoryRepository.create).toHaveBeenCalled();
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.rows[0].categoryId).toBe(297);
  });

  it('should call delete API and delete category on deleteCategory', async () => {
    (CategoryRepository.delete as jest.Mock).mockResolvedValue({ message: 'Deleted' });
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useCategoryController());
      result = hook.result;
    });

    await act(async () => {
      await result.current.deleteCategory(296);
    });

    expect(CategoryRepository.delete).toHaveBeenCalledWith(296);
    expect(result.current.rows).toHaveLength(0);
  });
});
