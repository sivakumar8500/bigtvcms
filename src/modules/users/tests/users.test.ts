import { renderHook, act } from '@testing-library/react';
import { useUserController } from '../hooks/useUserController';
import { userSchema } from '../validators/user.validator';
import { apiClient } from '@/core/api/api-client';
import { UserRepository } from '../repositories/user.repository';
import { UserMapper } from '../mapper/user.mapper';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('User Validator Schema', () => {
  it('should validate a valid user object with role and length > 6', () => {
    const validData = {
      name: 'Sivakumar Ramakrishnan',
      username: 'sivakumar8500',
      password: 'password123',
      location: 'Andhra Pradesh',
      role: 'superadmin',
    };
    const result = userSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('superadmin');
    }
  });

  it('should default role to creator if omitted', () => {
    const validData = {
      name: 'Sivakumar Ramakrishnan',
      username: 'sivakumar8500',
      password: 'password123',
      location: 'Andhra Pradesh',
    };
    const result = userSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('creator');
    }
  });

  it('should pass validation if name, username, and password are 6 or more characters', () => {
    const validData = {
      name: 'Darren',
      username: 'darren',
      password: '123456',
      location: 'Andhra Pradesh',
      role: 'admin',
    };
    const result = userSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if name, username, or password are fewer than 6 characters', () => {
    const invalidData = {
      name: 'Alex',
      username: 'alex',
      password: '12345',
      location: 'Andhra Pradesh',
      role: 'admin',
    };
    const result = userSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('UserMapper', () => {
  it('should map DTO to domain model with role', () => {
    const dto = {
      id: 1,
      UserName: 'Sivakumar Ramakrishnan',
      location: 'Hyderabad',
      profile_pic: 'https://image.png',
      active: true,
      role: 'admin',
    };
    const domain = UserMapper.toDomain(dto);
    expect(domain.userId).toBe(1);
    expect(domain.name).toBe('Sivakumar Ramakrishnan');
    expect(domain.username).toBe('Sivakumar Ramakrishnan');
    expect(domain.location).toBe('Hyderabad');
    expect(domain.role).toBe('admin');
    expect(domain.isActive).toBe(true);
    expect(domain.imageUrl).toBe('https://image.png');
  });

  it('should map DTO list to domain model list', () => {
    const list = UserMapper.toDomainList([
      {
        id: 1,
        UserName: 'Sivakumar Ramakrishnan',
        location: 'Hyderabad',
        profile_pic: '',
        active: true,
        role: 'superadmin',
      },
    ]);
    expect(list).toHaveLength(1);
    expect(list[0].userId).toBe(1);
    expect(list[0].role).toBe('superadmin');
  });

  it('should create DTO from form with selected role', () => {
    const form = {
      name: 'Sivakumar Ramakrishnan',
      username: 'sivakumar',
      location: 'Hyderabad',
      role: 'superadmin',
    };
    const dto = UserMapper.toCreateDto(form, 'pic-url', true);
    expect(dto).toEqual({
      UserName: 'Sivakumar Ramakrishnan',
      location: 'Hyderabad',
      profile_pic: 'pic-url',
      active: true,
      password: '123456',
      role: 'superadmin',
      user_type: 'superadmin',
      language_code: null,
    });
  });
});

describe('UserRepository', () => {
  it('should call apiClient.get on getAll', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([]);
    const res = await UserRepository.getAll(10, 20);
    expect(apiClient.get).toHaveBeenCalledWith('/creators', { skip: 10, limit: 20 });
    expect(res).toEqual([]);
  });

  it('should call apiClient.post on create with role payload', async () => {
    const mockDto = { UserName: 'Test Creator', location: 'hyd', profile_pic: '', active: true, password: 'pwd', role: 'admin' };
    (apiClient.post as jest.Mock).mockResolvedValue({ id: 5, role: 'admin' });
    const res = await UserRepository.create(mockDto);
    expect(apiClient.post).toHaveBeenCalledWith('/creators', mockDto);
    expect(res).toEqual({ id: 5, role: 'admin' });
  });

  it('should call apiClient.put on update with role payload', async () => {
    const mockDto = { UserName: 'Test Creator', location: 'hyd', active: true, role: 'superadmin' };
    (apiClient.put as jest.Mock).mockResolvedValue({ id: 10, role: 'superadmin' });
    const res = await UserRepository.update(10, mockDto);
    expect(apiClient.put).toHaveBeenCalledWith('/creators/10', mockDto);
    expect(res).toEqual({ id: 10, role: 'superadmin' });
  });

  it('should call apiClient.delete on delete', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);
    await UserRepository.delete(15);
    expect(apiClient.delete).toHaveBeenCalledWith('/creators/15');
  });
});

describe('useUserController hook', () => {
  const mockCreatorsDto = [
    {
      id: 1,
      UserName: 'Sivakumar Ramakrishnan',
      location: 'Hyderabad',
      profile_pic: 'https://images.unsplash.com/photo-1660067262025-271603ac1283?w=600',
      active: true,
      role: 'admin',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.get as jest.Mock).mockResolvedValue(mockCreatorsDto);
    (apiClient.put as jest.Mock).mockResolvedValue({
      id: 1,
      UserName: 'Sivakumar Ramakrishnan',
      location: 'Hyderabad',
      profile_pic: 'https://images.unsplash.com/photo-1660067262025-271603ac1283?w=600',
      active: true,
      role: 'admin',
    });
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);
  });

  it('should initialize and load creators from API', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useUserController());
      result = hook.result;
    });

    expect(apiClient.get).toHaveBeenCalledWith('/creators', { skip: 0, limit: 100 });
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].userId).toBe(1);
    expect(result.current.rows[0].name).toBe('Sivakumar Ramakrishnan');
    expect(result.current.rows[0].role).toBe('admin');
  });

  it('should pre-select first location item as initial location for form', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useUserController());
      result = hook.result;
    });

    expect(result.current.form.location).toBe(result.current.locationsOptions[0]);
  });

  it('should filter creators by filterStatus and filterRole', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useUserController());
      result = hook.result;
    });

    act(() => {
      result.current.setFilterStatus('inactive');
    });
    expect(result.current.filtered).toHaveLength(0);

    act(() => {
      result.current.setFilterStatus('active');
      result.current.setFilterRole('admin');
    });
    expect(result.current.filtered).toHaveLength(1);

    act(() => {
      result.current.setFilterRole('creator');
    });
    expect(result.current.filtered).toHaveLength(0);

    act(() => {
      result.current.setFilterName('Sivakumar');
      result.current.handleClearFilters();
    });
    expect(result.current.filterName).toBe('');
    expect(result.current.filterStatus).toBe('all');
    expect(result.current.filterRole).toBe('all');
    expect(result.current.filtered).toHaveLength(1);
  });

  it('should require profile image on submit when empty', async () => {
    let result: any;
    await act(async () => {
      const hook = renderHook(() => useUserController());
      result = hook.result;
    });

    act(() => {
      result.current.handleFieldChange('name', 'Test User Long Name');
      result.current.handleFieldChange('username', 'test_user');
      result.current.handleFieldChange('password', 'testPassword123');
      result.current.handleFieldChange('location', 'Kerala');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.image).toBe('Profile image is required');
  });

  it('should call create API with role payload on successful submit when image is provided', async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      id: 2,
      UserName: 'Test User Long Name',
      location: 'Kerala',
      profile_pic: 'data:image/png;base64,123',
      active: true,
      role: 'superadmin',
      user_type: 'superadmin',
      language_code: 'te',
    });

    let result: any;
    await act(async () => {
      const hook = renderHook(() => useUserController());
      result = hook.result;
    });

    act(() => {
      result.current.handleFieldChange('name', 'Test User Long Name');
      result.current.handleFieldChange('username', 'test_user');
      result.current.handleFieldChange('password', 'testPassword123');
      result.current.handleFieldChange('location', 'Kerala');
      result.current.handleFieldChange('role', 'superadmin');
      result.current.handleFieldChange('languageCode', 'te');
      result.current.handleImageUploaded('data:image/png;base64,123');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/creators',
      expect.objectContaining({
        UserName: 'Test User Long Name',
        location: 'Kerala',
        role: 'superadmin',
        user_type: 'superadmin',
        language_code: 'te',
      })
    );
    expect(result.current.rows.some((u: any) => u.name === 'Test User Long Name' && u.role === 'superadmin')).toBe(true);
  });

  it('should toggle active status and revert on API failure', async () => {
    (apiClient.put as jest.Mock).mockRejectedValue(new Error('Network error'));

    let result: any;
    await act(async () => {
      const hook = renderHook(() => useUserController());
      result = hook.result;
    });

    const targetUser = result.current.rows[0];
    const initialActive = targetUser.isActive;

    await act(async () => {
      await result.current.toggleActive(targetUser.userId);
    });

    // Reverted back to initial state after error
    expect(result.current.rows[0].isActive).toBe(initialActive);
  });

  it('should handle edit user and save changes via API', async () => {
    (apiClient.put as jest.Mock).mockResolvedValue({
      id: 1,
      UserName: 'Sivakumar Updated Name',
      location: 'Telangana',
      profile_pic: 'https://image.jpg',
      active: true,
      role: 'admin',
      user_type: 'admin',
      language_code: 'en',
    });

    let result: any;
    await act(async () => {
      const hook = renderHook(() => useUserController());
      result = hook.result;
    });

    const targetUser = result.current.rows[0];

    act(() => {
      result.current.handleEditClick(targetUser);
    });

    expect(result.current.isEditMode).toBe(true);

    act(() => {
      result.current.handleFieldChange('name', 'Sivakumar Updated Name');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(apiClient.put).toHaveBeenCalledWith(
      `/creators/${targetUser.userId}`,
      expect.objectContaining({
        UserName: 'Sivakumar Updated Name',
      })
    );
    expect(result.current.drawerOpen).toBe(false);
  });

  it('should delete user and revert on API failure', async () => {
    (apiClient.delete as jest.Mock).mockRejectedValue(new Error('Delete error'));

    let result: any;
    await act(async () => {
      const hook = renderHook(() => useUserController());
      result = hook.result;
    });

    const countBefore = result.current.rows.length;
    const targetId = result.current.rows[0].userId;

    await act(async () => {
      await result.current.deleteUser(targetId);
    });

    expect(result.current.rows.length).toBe(countBefore);
  });
});

