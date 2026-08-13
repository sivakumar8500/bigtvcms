import { TagsRepository } from '../repositories/tags.repository';
import { apiClient } from '@/core/api/api-client';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('TagsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call apiClient.get on getAll', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([]);
    const res = await TagsRepository.getAll('te');
    expect(apiClient.get).toHaveBeenCalledWith('/aitags', { lang: 'te' });
    expect(res).toEqual([]);
  });

  it('should call apiClient.post on create', async () => {
    const mockDto = { translations: { en: 'test', te: 'test', ml: 'test' } };
    (apiClient.post as jest.Mock).mockResolvedValue({ message: 'Success' });
    const res = await TagsRepository.create(mockDto);
    expect(apiClient.post).toHaveBeenCalledWith('/aitags/create', mockDto);
    expect(res).toEqual({ message: 'Success' });
  });

  it('should call apiClient.put on update', async () => {
    const mockDto = { translations: { en: 'test', te: 'test', ml: 'test' }, is_active: true };
    (apiClient.put as jest.Mock).mockResolvedValue({ message: 'Success' });
    const res = await TagsRepository.update(3, mockDto);
    expect(apiClient.put).toHaveBeenCalledWith('/aitags/3', mockDto);
    expect(res).toEqual({ message: 'Success' });
  });

  it('should call apiClient.delete on delete', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ message: 'Success' });
    const res = await TagsRepository.delete(3);
    expect(apiClient.delete).toHaveBeenCalledWith('/aitags/3');
    expect(res).toEqual({ message: 'Success' });
  });
});
