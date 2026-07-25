import { useState, useCallback } from 'react';
import { NewsPost } from '../domain/news.model';
import { NewsRepository } from '../repositories/news.repository';
import { NewsMapper } from '../mapper/news.mapper';

export function useNewsController() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (skip: number = 0, limit: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const dtos = await NewsRepository.getAll(skip, limit);
      const mapped = (dtos || []).map((dto) => NewsMapper.toDomain(dto));
      setPosts(mapped);
      return mapped;
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to fetch news posts';
      setError(errMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
      const resDto = await NewsRepository.create(dto);
      const createdPost = NewsMapper.toDomain(resDto);
      setPosts((prev) => [createdPost, ...prev]);
      return createdPost;
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to create news post';
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
    fetchPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
  };
}
