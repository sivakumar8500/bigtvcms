import { renderHook, act } from '@testing-library/react';
import { usePostTypeController } from '../hooks/usePostTypeController';
import { postTypeSchema } from '../validators/post-type.validator';
import { apiClient } from '@/core/api/api-client';
import { PostTypeRepository } from '../repositories/post-type.repository';
import { PostTypeMapper } from '../mapper/post-type.mapper';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('PostType Validator Schema', () => {
  it('should validate a valid post type object', () => {
    const validData = {
      typename: 'News',
      typeStatus: true,
    };
    const result = postTypeSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.typename).toBe('News');
      expect(result.data.typeStatus).toBe(true);
    }
  });

  it('should fail validation when typename is empty', () => {
    const invalidData = {
      typename: '   ',
      typeStatus: true,
    };
    const result = postTypeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('PostType Mapper', () => {
  it('should map DTO to domain correctly', () => {
    const dto = {
      typeId: 1,
      typename: 'Hai',
      typeStatus: true,
      language_code: null,
      created_at: '2026-07-20T10:26:17',
      updated_at: '2026-07-20T10:26:17',
    };
    const domain = PostTypeMapper.toDomain(dto);
    expect(domain.typeId).toBe(1);
    expect(domain.typename).toBe('Hai');
    expect(domain.typeStatus).toBe(true);
    expect(domain.language_code).toBeNull();
  });

  it('should map list of DTOs correctly', () => {
    const dtos = [
      { typeId: 1, typename: 'Hai', typeStatus: true },
      { typeId: 2, typename: 'siva', typeStatus: false },
    ];
    const domainList = PostTypeMapper.toDomainList(dtos);
    expect(domainList.length).toBe(2);
    expect(domainList[0].typename).toBe('Hai');
    expect(domainList[1].typename).toBe('siva');
  });

  it('should handle invalid or non-array DTO list', () => {
    expect(PostTypeMapper.toDomainList(null as any)).toEqual([]);
  });
});

describe('PostType Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call apiClient.get on getAll', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([]);
    await PostTypeRepository.getAll(0, 100);
    expect(apiClient.get).toHaveBeenCalledWith('/post-types', { skip: 0, limit: 100 });
  });

  it('should call apiClient.post on create', async () => {
    const mockDto = { typename: 'Hai', typeStatus: true };
    (apiClient.post as jest.Mock).mockResolvedValue({ typeId: 1, ...mockDto });
    await PostTypeRepository.create(mockDto);
    expect(apiClient.post).toHaveBeenCalledWith('/post-types', mockDto);
  });

  it('should call apiClient.put on update', async () => {
    const mockDto = { typename: 'siva', typeStatus: true };
    (apiClient.put as jest.Mock).mockResolvedValue({ typeId: 1, ...mockDto });
    await PostTypeRepository.update(1, mockDto);
    expect(apiClient.put).toHaveBeenCalledWith('/post-types/1', mockDto);
  });

  it('should call apiClient.delete on delete', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);
    await PostTypeRepository.delete(1);
    expect(apiClient.delete).toHaveBeenCalledWith('/post-types/1');
  });
});

describe('usePostTypeController', () => {
  const mockPostTypes = [
    { typeId: 1, typename: 'Hai', typeStatus: true },
    { typeId: 2, typename: 'siva', typeStatus: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.get as jest.Mock).mockResolvedValue(mockPostTypes);
  });

  it('should fetch and load post types on mount', async () => {
    const { result } = renderHook(() => usePostTypeController());
    await act(async () => {});
    expect(result.current.rows.length).toBe(2);
    expect(result.current.rows[0].typename).toBe('Hai');
  });

  it('should filter post types by name and status', async () => {
    const { result } = renderHook(() => usePostTypeController());
    await act(async () => {});

    act(() => {
      result.current.setFilterName('siva');
    });
    expect(result.current.paginatedData.length).toBe(1);
    expect(result.current.paginatedData[0].typename).toBe('siva');

    act(() => {
      result.current.setFilterName('');
      result.current.setFilterStatus('active');
    });
    expect(result.current.paginatedData.length).toBe(1);
    expect(result.current.paginatedData[0].typeStatus).toBe(true);
  });

  it('should toggle active status optimistic update and call update API', async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({ typeId: 1, typename: 'Hai', typeStatus: false });
    const { result } = renderHook(() => usePostTypeController());
    await act(async () => {});

    await act(async () => {
      await result.current.toggleActive(1);
    });

    expect(apiClient.put).toHaveBeenCalledWith('/post-types/1', { typename: 'Hai', typeStatus: false });
    expect(result.current.rows.find((r) => r.typeId === 1)?.typeStatus).toBe(false);
  });

  it('should revert status toggle if update API fails', async () => {
    (apiClient.put as jest.Mock).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => usePostTypeController());
    await act(async () => {});

    await act(async () => {
      await result.current.toggleActive(1);
    });

    expect(result.current.rows.find((r) => r.typeId === 1)?.typeStatus).toBe(true);
  });

  it('should delete post type optimistic update and call delete API', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => usePostTypeController());
    await act(async () => {});

    await act(async () => {
      await result.current.deletePostType(1);
    });

    expect(apiClient.delete).toHaveBeenCalledWith('/post-types/1');
    expect(result.current.rows.length).toBe(1);
  });

  it('should handle open drawer, edit mode, and submit new post type', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({ typeId: 3, typename: 'NewType', typeStatus: true });
    const { result } = renderHook(() => usePostTypeController());
    await act(async () => {});

    act(() => {
      result.current.handleOpenAddDrawer();
    });
    expect(result.current.drawerOpen).toBe(true);
    expect(result.current.isEditMode).toBe(false);

    act(() => {
      result.current.handleFieldChange('typename', 'NewType');
    });

    let success = false;
    await act(async () => {
      success = await result.current.handleSubmit();
    });

    expect(success).toBe(true);
    expect(result.current.drawerOpen).toBe(false);
    expect(apiClient.post).toHaveBeenCalledWith('/post-types', { typename: 'NewType', typeStatus: true });
  });

  it('should handle update post type submit in edit mode', async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({ typeId: 1, typename: 'UpdatedType', typeStatus: true });
    const { result } = renderHook(() => usePostTypeController());
    await act(async () => {});

    act(() => {
      result.current.handleEditClick(mockPostTypes[0]);
    });
    expect(result.current.isEditMode).toBe(true);

    act(() => {
      result.current.handleFieldChange('typename', 'UpdatedType');
    });

    let success = false;
    await act(async () => {
      success = await result.current.handleSubmit();
    });

    expect(success).toBe(true);
    expect(apiClient.put).toHaveBeenCalledWith('/post-types/1', { typename: 'UpdatedType', typeStatus: true });
  });
});
