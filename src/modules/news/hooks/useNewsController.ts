import { useState, useCallback } from 'react';
import { NewsPost } from '../domain/news.model';
import { NewsRepository } from '../repositories/news.repository';
import { NewsMapper } from '../mapper/news.mapper';
import { validateCreateNewsPost } from '../validators/news.validator';

export function useNewsController() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPosts = useCallback(async (skip: number = 0, limit: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const dtos = await NewsRepository.getAll(skip, limit);
      const mapped = (dtos || []).map((dto) => NewsMapper.toDomain(dto));
      setPosts(mapped);
      const isFullBatch = (dtos || []).length === limit;
      setHasMore(isFullBatch);
      const currentPageNum = Math.floor(skip / limit) + 1;
      setPage(currentPageNum);
      if (isFullBatch) {
        setTotalPages((prev) => Math.max(prev, currentPageNum + 1));
      } else {
        setTotalPages(currentPageNum);
      }
      return mapped;
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to fetch news posts';
      setError(errMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPage = useCallback(async (pageNumber: number = 1, limit: number = 100) => {
    const skip = Math.max(0, pageNumber - 1) * limit;
    return fetchPosts(skip, limit);
  }, [fetchPosts]);

  const getPostById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const dto = await NewsRepository.getById(id);
      const post = NewsMapper.toDomain(dto);
      return post;
    } catch (err: any) {
      const errMsg = err?.message || `Failed to fetch post #${id}`;
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data: Partial<NewsPost>) => {
    setLoading(true);
    setError(null);
    try {
      const dto = NewsMapper.toCreateDto(data);
      validateCreateNewsPost(dto);
      const resDto = await NewsRepository.create(dto);
      const createdPost = NewsMapper.toDomain(resDto);
      setPosts((prev) => [createdPost, ...prev]);
      return createdPost;
    } catch (err: any) {
      const errMsg = err?.errors?.[0]?.message || err?.message || 'Failed to create news post';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id: number, data: Partial<NewsPost>) => {
    setLoading(true);
    setError(null);
    try {
      const dto = NewsMapper.toUpdateDto(data);
      const resDto = await NewsRepository.update(id, dto);
      const updatedPost = NewsMapper.toDomain(resDto);
      setPosts((prev) => prev.map((p) => (p.id === id ? updatedPost : p)));
      return updatedPost;
    } catch (err: any) {
      const errMsg = err?.message || `Failed to update post #${id}`;
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await NewsRepository.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      const errMsg = err?.message || `Failed to delete post #${id}`;
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    setPosts,
    loading,
    error,
    page,
    setPage,
    totalPages,
    hasMore,
    fetchPosts,
    fetchPage,
    getPostById,
    createPost,
    updatePost,
    deletePost,
  };
}
