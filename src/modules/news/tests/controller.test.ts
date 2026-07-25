import { renderHook, act } from '@testing-library/react';
import { useNewsController } from '../hooks/useNewsController';
import { NewsRepository } from '../repositories/news.repository';

jest.mock('../repositories/news.repository', () => ({
  NewsRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('useNewsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch news posts successfully', async () => {
    const mockDtos = [
      { id: 1, title: 'Post 1', content: 'Content 1' },
      { id: 2, title: 'Post 2', content: 'Content 2' },
    ];
    (NewsRepository.getAll as jest.Mock).mockResolvedValue(mockDtos);

    const { result } = renderHook(() => useNewsController());

    await act(async () => {
      await result.current.fetchPosts(0, 100);
    });

    expect(NewsRepository.getAll).toHaveBeenCalledWith(0, 100);
    expect(result.current.posts.length).toBe(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch posts error', async () => {
    (NewsRepository.getAll as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useNewsController());

    await act(async () => {
      await result.current.fetchPosts();
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('should fetch single post by ID', async () => {
    const mockDto = { id: 5, title: 'Post 5', content: 'Content 5' };
    (NewsRepository.getById as jest.Mock).mockResolvedValue(mockDto);

    const { result } = renderHook(() => useNewsController());

    let post = null;
    await act(async () => {
      post = await result.current.getPostById(5);
    });

    expect(NewsRepository.getById).toHaveBeenCalledWith(5);
    expect(post).toEqual(expect.objectContaining({ id: 5, title: 'Post 5' }));
  });

  it('should create post successfully', async () => {
    const createData = { title: 'New Post', content: 'New Content' };
    const resDto = { id: 10, title: 'New Post', content: 'New Content' };
    (NewsRepository.create as jest.Mock).mockResolvedValue(resDto);

    const { result } = renderHook(() => useNewsController());

    await act(async () => {
      await result.current.createPost(createData);
    });

    expect(NewsRepository.create).toHaveBeenCalled();
    expect(result.current.posts[0].id).toBe(10);
  });

  it('should update post successfully', async () => {
    const mockDtos = [{ id: 2, title: 'Old Title', content: 'Content' }];
    (NewsRepository.getAll as jest.Mock).mockResolvedValue(mockDtos);

    const { result } = renderHook(() => useNewsController());

    await act(async () => {
      await result.current.fetchPosts();
    });

    (NewsRepository.update as jest.Mock).mockResolvedValue({ id: 2, title: 'Updated Title', content: 'Content' });

    await act(async () => {
      await result.current.updatePost(2, { title: 'Updated Title' });
    });

    expect(NewsRepository.update).toHaveBeenCalledWith(2, expect.objectContaining({ title: 'Updated Title' }));
    expect(result.current.posts[0].title).toBe('Updated Title');
  });

  it('should delete post successfully', async () => {
    const mockDtos = [{ id: 4, title: 'Post 4', content: 'Content' }];
    (NewsRepository.getAll as jest.Mock).mockResolvedValue(mockDtos);

    const { result } = renderHook(() => useNewsController());

    await act(async () => {
      await result.current.fetchPosts();
    });

    (NewsRepository.delete as jest.Mock).mockResolvedValue({ message: 'Deleted' });

    await act(async () => {
      await result.current.deletePost(4);
    });

    expect(NewsRepository.delete).toHaveBeenCalledWith(4);
    expect(result.current.posts.length).toBe(0);
  });
});
