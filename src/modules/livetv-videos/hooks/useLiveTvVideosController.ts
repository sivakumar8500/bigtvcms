'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { VideoTag, TagVideo } from '../domain/LiveTvVideo';
import { liveTvVideosRepository } from '../repositories/live-tv-videos.repository';

export function useLiveTvVideosController() {
  const [tags, setTags] = useState<VideoTag[]>([]);
  const [selectedTagSlug, setSelectedTagSlug] = useState<string>('');
  
  const [videos, setVideos] = useState<TagVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Modals state
  const [createTagModalOpen, setCreateTagModalOpen] = useState(false);
  const [editTagModalOpen, setEditTagModalOpen] = useState(false);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  
  const [activeTagForEdit, setActiveTagForEdit] = useState<VideoTag | null>(null);
  const [activeVideoForPlayer, setActiveVideoForPlayer] = useState<TagVideo | null>(null);

  // 1. Fetch tags on mount
  const fetchTags = useCallback(async () => {
    try {
      const fetchedTags = await liveTvVideosRepository.getVideoTags();
      setTags(fetchedTags);
      if (fetchedTags.length > 0 && !selectedTagSlug) {
        setSelectedTagSlug(fetchedTags[0].slug);
      }
    } catch (err: any) {
      setActionError('Failed to load video tags');
    }
  }, [selectedTagSlug]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // 2. Fetch videos when selected tag changes
  const loadTagVideos = useCallback(async (slug: string) => {
    if (!slug) return;
    setLoading(true);
    setActionError(null);
    try {
      const fetchedVideos = await liveTvVideosRepository.getTagVideos(slug);
      setVideos(fetchedVideos || []);
    } catch (err: any) {
      setActionError(err.message || 'Failed to load videos for the selected tag');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTagVideos(selectedTagSlug);
  }, [selectedTagSlug, loadTagVideos]);

  // Filtered and paginated videos
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const q = searchQuery.toLowerCase();
    return videos.filter((v) => v.fileName.toLowerCase().includes(q));
  }, [videos, searchQuery]);

  const totalPages = Math.ceil(filteredVideos.length / rowsPerPage) || 1;
  const paginatedVideos = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredVideos.slice(start, start + rowsPerPage);
  }, [filteredVideos, page, rowsPerPage]);

  const stats = useMemo(() => {
    return { total: videos.length };
  }, [videos]);

  // Actions
  const handleTagSelect = (slug: string) => {
    setSelectedTagSlug(slug);
    setPage(1);
  };

  const handleCreateTag = async (name: string, slug: string) => {
    setActionError(null);
    try {
      const newTag = await liveTvVideosRepository.createVideoTag(name, slug);
      setTags((prev) => [...prev, newTag]);
      setSelectedTagSlug(newTag.slug); // Auto-select new tag
      setActionSuccess('Video tag created successfully');
      setCreateTagModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to create video tag');
      throw err;
    }
  };

  const handleUpdateTag = async (slug: string, name: string) => {
    setActionError(null);
    try {
      const updatedTag = await liveTvVideosRepository.updateVideoTag(slug, name);
      setTags((prev) => prev.map((t) => (t.slug === slug ? updatedTag : t)));
      setActionSuccess('Video tag updated successfully');
      setEditTagModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update video tag');
      throw err;
    }
  };

  const handleDeleteTag = async (slug: string) => {
    setActionError(null);
    try {
      await liveTvVideosRepository.deleteVideoTag(slug);
      const remainingTags = tags.filter((t) => t.slug !== slug);
      setTags(remainingTags);
      if (selectedTagSlug === slug) {
        setSelectedTagSlug(remainingTags.length > 0 ? remainingTags[0].slug : '');
      }
      setActionSuccess('Video tag deleted successfully');
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete video tag');
    }
  };

  const handlePlayVideo = (video: TagVideo) => {
    setActiveVideoForPlayer(video);
    setPlayerModalOpen(true);
  };

  const handleDeleteVideo = async (fileName: string) => {
    if (!selectedTagSlug) return;
    setActionError(null);
    try {
      await liveTvVideosRepository.deleteVideoFromTag(selectedTagSlug, fileName);
      setVideos((prev) => prev.filter((v) => v.fileName !== fileName));
      setActionSuccess('Video deleted successfully');
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete video');
    }
  };

  const handleOpenEditTagModal = (tag: VideoTag) => {
    setActiveTagForEdit(tag);
    setEditTagModalOpen(true);
  };

  return {
    tags,
    selectedTagSlug,
    handleTagSelect,
    videos,
    loading,
    actionError,
    actionSuccess,
    setActionError,
    setActionSuccess,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    totalPages,
    paginatedVideos,
    stats,
    // Modals
    createTagModalOpen,
    setCreateTagModalOpen,
    editTagModalOpen,
    setEditTagModalOpen,
    playerModalOpen,
    setPlayerModalOpen,
    activeTagForEdit,
    activeVideoForPlayer,
    // Handlers
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handlePlayVideo,
    handleDeleteVideo,
    handleOpenEditTagModal,
  };
}
