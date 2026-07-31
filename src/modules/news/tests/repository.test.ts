import { NewsRepository } from '../repositories/news.repository';
import { apiClient } from '@/core/api/api-client';

jest.mock('@/core/api/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('NewsRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all news posts with skip and limit params', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', content: 'Content 1' },
      { id: 2, title: 'Post 2', content: 'Content 2' },
    ];
    (apiClient.get as jest.Mock).mockResolvedValue(mockPosts);

    const result = await NewsRepository.getAll(0, 100);

    expect(apiClient.get).toHaveBeenCalledWith('/news-posts', { skip: 0, limit: 100 });
    expect(result).toEqual(mockPosts);
  });

  it('should fetch a single news post by ID', async () => {
    const mockPost = { id: 2, title: 'Post 2', content: 'Content 2' };
    (apiClient.get as jest.Mock).mockResolvedValue(mockPost);

    const result = await NewsRepository.getById(2);

    expect(apiClient.get).toHaveBeenCalledWith('/news-posts/2');
    expect(result).toEqual(mockPost);
  });

  it('should create a new news post', async () => {
    const createDto = {
      title: 'New Title',
      notificationtitle: 'New Title',
      imagetitel: 'New Title',
      content: 'New Content',
      created: '2026-07-22T05:00:00.000Z',
      post_name: 'new-title',
      totalLikes: 0,
      totalViews: 0,
      totalComments: 0,
      image_url: 'http://example.com/img.jpg',
      video_url: '',
      video_platform: '',
      gallery: [],
      type: 'Standard',
      totalShares: 0,
      isReporter: false,
      reportedBy: '',
      categoryName: ['General'],
      postUrl: '',
      subType: '',
      isStickyPost: false,
      linkURLAndroid: '',
      linkURLIos: '',
      links: '',
      isBookmarked: [],
      postOrder: 0,
      draft: false,
      trash: false,
      schedule: '2026-07-22T05:00:00.000Z',
      language_id: 1,
      category_ids: [1],
      location_ids: [1],
      post_type: 'Standard',
    };
    const createdResponse = { ...createDto, id: 10, createdAt: '2026-07-22T05:01:00.000Z', updatedAt: '2026-07-22T05:01:00.000Z' };
    (apiClient.post as jest.Mock).mockResolvedValue(createdResponse);

    const result = await NewsRepository.create(createDto);

    expect(apiClient.post).toHaveBeenCalledWith(
      '/news-posts',
      expect.not.objectContaining({ post_name: expect.anything(), post_type: expect.anything() })
    );
    expect(result).toEqual(createdResponse);
  });

  it('should update a news post by ID', async () => {
    const updateDto = { trash: true, schedule: '2026-07-22T05:07:02.102Z' };
    const updatedResponse = { id: 2, title: 'Updated', trash: true, schedule: '2026-07-22T05:07:02.102Z' };
    (apiClient.put as jest.Mock).mockResolvedValue(updatedResponse);

    const result = await NewsRepository.update(2, updateDto);

    expect(apiClient.put).toHaveBeenCalledWith('/news-posts/2', updateDto);
    expect(result).toEqual(updatedResponse);
  });

  it('should delete a news post by ID', async () => {
    const deleteResponse = { message: 'Post 4 deleted successfully' };
    (apiClient.delete as jest.Mock).mockResolvedValue(deleteResponse);

    const result = await NewsRepository.delete(4);

    expect(apiClient.delete).toHaveBeenCalledWith('/news-posts/4');
    expect(result).toEqual(deleteResponse);
  });
});
