import { EpaperRepository } from '../epaper.repository';
import { apiClient } from '@/core/api/api-client';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('EpaperRepository', () => {
  const mockEpaper = {
    id: 'epaper_5f98848d',
    name: 'ChotaNews ePaper',
    logo: 'https://example.com/logo.jpg',
    editionName: 'Hyderabad',
    language: 'te',
    publishDate: '2026-07-30',
    status: 'published',
    paperImages: ['https://example.com/page1.jpg'],
    createdAt: '2026-07-31T05:07:30',
    updatedAt: '2026-07-31T05:07:30',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all epapers with default skip and limit', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([mockEpaper]);

    const result = await EpaperRepository.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/epapers', { skip: 0, limit: 100 });
    expect(result).toEqual([mockEpaper]);
  });

  it('fetches all epapers with custom skip and limit', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([mockEpaper]);

    const result = await EpaperRepository.getAll(10, 20);

    expect(apiClient.get).toHaveBeenCalledWith('/epapers', { skip: 10, limit: 20 });
    expect(result).toEqual([mockEpaper]);
  });

  it('fetches single epaper by id', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue(mockEpaper);

    const result = await EpaperRepository.getById('epaper_5f98848d');

    expect(apiClient.get).toHaveBeenCalledWith('/epapers/epaper_5f98848d');
    expect(result).toEqual(mockEpaper);
  });

  it('creates an epaper', async () => {
    const createDto = {
      name: 'ChotaNews ePaper',
      editionName: 'Hyderabad',
      language: 'te',
      publishDate: '2026-07-30',
    };
    (apiClient.post as jest.Mock).mockResolvedValue(mockEpaper);

    const result = await EpaperRepository.create(createDto);

    expect(apiClient.post).toHaveBeenCalledWith('/epapers', createDto);
    expect(result).toEqual(mockEpaper);
  });

  it('updates an epaper', async () => {
    const updateDto = { name: 'Updated ePaper' };
    (apiClient.put as jest.Mock).mockResolvedValue({ ...mockEpaper, ...updateDto });

    const result = await EpaperRepository.update('epaper_5f98848d', updateDto);

    expect(apiClient.put).toHaveBeenCalledWith('/epapers/epaper_5f98848d', updateDto);
    expect(result.name).toBe('Updated ePaper');
  });

  it('deletes an epaper', async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({ message: 'Deleted' });

    const result = await EpaperRepository.delete('epaper_5f98848d');

    expect(apiClient.delete).toHaveBeenCalledWith('/epapers/epaper_5f98848d');
    expect(result).toEqual({ message: 'Deleted' });
  });
});
