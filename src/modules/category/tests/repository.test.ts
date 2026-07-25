import { CategoryRepository } from '../repositories/category.repository';
import { apiClient } from '@/core/api/api-client';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('CategoryRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call apiClient.get on getAll', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([]);
    const res = await CategoryRepository.getAll('te');
    expect(apiClient.get).toHaveBeenCalledWith('/admin/categories', { lang: 'te' });
    expect(res).toEqual([]);
  });

  it('should call apiClient.post on create', async () => {
    const mockDto = { name_en: 'test', name_te: 'test', name_hi: 'test', name_ml: 'test' };
    (apiClient.post as jest.Mock).mockResolvedValue({ message: 'Success' });
    const res = await CategoryRepository.create(mockDto);
    expect(apiClient.post).toHaveBeenCalledWith('/admin/categories/create', mockDto);
    expect(res).toEqual({ message: 'Success' });
  });

  it('should call apiClient.put on update', async () => {
    const mockDto = { name_en: 'test', name_te: 'test', name_hi: 'test', name_ml: 'test', is_active: true };
    (apiClient.put as jest.Mock).mockResolvedValue({ message: 'Success' });
    const res = await CategoryRepository.update(297, mockDto);
    expect(apiClient.put).toHaveBeenCalledWith('/admin/categories/297', mockDto);
    expect(res).toEqual({ message: 'Success' });
  });

  it('should call apiClient.delete on delete', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ message: 'Category id=297 deleted successfully' });
    const res = await CategoryRepository.delete(297);
    expect(apiClient.delete).toHaveBeenCalledWith('/admin/categories/297');
    expect(res).toEqual({ message: 'Category id=297 deleted successfully' });
  });
});
