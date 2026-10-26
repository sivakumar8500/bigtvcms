'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  VideoTag,
  TagVideo,
  LanguageCode,
  TagLanguage,
  SegregatedVideoTags,
} from '../domain/LiveTvVideo';
import { useLanguageStore } from '@/core/storage/language-store';
import {
  liveTvVideosRepository,
  CreateVideoTagDto,
  UpdateVideoTagDto,
} from '../repositories/live-tv-videos.repository';

export function useLiveTvVideosController(initialLanguage?: LanguageCode) {
  const { language: appLanguage } = useLanguageStore();

  const resolveLanguage = (): LanguageCode => {
    if (initialLanguage) return initialLanguage;
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlLang = (
          params.get('lang') ||
          params.get('language') ||
          params.get('lan') ||
          params.get('from') ||
          ''
        ).toLowerCase().trim();
        if (urlLang === 'ml' || urlLang === 'malayala' || urlLang === 'malayalam') return 'ml';
        if (urlLang === 'te' || urlLang === 'telugu') return 'te';
        if (urlLang === 'en' || urlLang === 'english') return 'en';
        if (urlLang === 'all') return 'all';
      } catch (e) {}
    }
    const currentLang = (appLanguage || '').toLowerCase().trim();
    if (currentLang === 'ml' || currentLang === 'malayala' || currentLang === 'malayalam') {
      return 'ml';
    }
    if (currentLang === 'te' || currentLang === 'telugu') {
      return 'te';
    }
    return 'te';
  };

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(resolveLanguage);

  useEffect(() => {
    const currentLang = (appLanguage || '').toLowerCase().trim();
    if ((currentLang === 'ml' || currentLang === 'malayala' || currentLang === 'malayalam') && selectedLanguage !== 'ml') {
      setSelectedLanguage('ml');
    } else if ((currentLang === 'te' || currentLang === 'telugu') && selectedLanguage !== 'te') {
      setSelectedLanguage('te');
    }
  }, [appLanguage]);
  const [tags, setTags] = useState<VideoTag[]>([]);
  const [segregatedTags, setSegregatedTags] = useState<SegregatedVideoTags>({
    te: [],
    ml: [],
    en: [],
  });
  const [selectedTagSlug, setSelectedTagSlug] = useState<string>('');

  const [videos, setVideos] = useState<TagVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
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

  const [editVideoModalOpen, setEditVideoModalOpen] = useState(false);
  const [activeVideoForEdit, setActiveVideoForEdit] = useState<TagVideo | null>(null);

  // 1. Fetch tags for current language
  const fetchTags = useCallback(
    async (lang: LanguageCode = selectedLanguage) => {
      setLoading(true);
      try {
        if (lang === 'all') {
          const [allTags, segregated] = await Promise.all([
            liveTvVideosRepository.getVideoTags('all'),
            liveTvVideosRepository.getSegregatedVideoTags(),
          ]);
          setTags(allTags || []);
          setSegregatedTags(segregated || { te: [], ml: [], en: [] });
          if (allTags && allTags.length > 0) {
            setSelectedTagSlug((prev) => (allTags.some((t) => t.slug === prev) ? prev : allTags[0].slug));
          } else {
            setSelectedTagSlug('');
            setVideos([]);
          }
        } else {
          const fetchedTags = await liveTvVideosRepository.getVideoTags(lang);
          // Strict client-side filter: Ensure ONLY tags belonging to this language are retained
          const strictlyFiltered = (fetchedTags || []).filter((t) => (t.language || 'te') === lang);
          setTags(strictlyFiltered);
          if (strictlyFiltered && strictlyFiltered.length > 0) {
            setSelectedTagSlug((prev) =>
              strictlyFiltered.some((t) => t.slug === prev) ? prev : strictlyFiltered[0].slug
            );
          } else {
            setSelectedTagSlug('');
            setVideos([]);
          }
        }
      } catch (err: any) {
        setActionError(err.message || 'Failed to load video tags');
      } finally {
        setLoading(false);
      }
    },
    [selectedLanguage]
  );

  useEffect(() => {
    fetchTags(selectedLanguage);
  }, [selectedLanguage, fetchTags]);

  // 2. Fetch videos when selected tag changes
  const loadTagVideos = useCallback(
    async (slug: string, lang: LanguageCode = selectedLanguage) => {
      if (!slug) {
        setVideos([]);
        return;
      }
      setLoading(true);
      setActionError(null);
      try {
        const fetchedVideos = await liveTvVideosRepository.getTagVideos(slug, lang);
        setVideos(fetchedVideos || []);
      } catch (err: any) {
        setActionError(err.message || 'Failed to load videos for the selected tag');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedLanguage]
  );

  useEffect(() => {
    if (selectedTagSlug && tags.some((t) => t.slug === selectedTagSlug)) {
      loadTagVideos(selectedTagSlug, selectedLanguage);
    } else {
      setVideos([]);
    }
  }, [selectedTagSlug, tags, selectedLanguage, loadTagVideos]);

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
  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    setPage(1);
    setSearchQuery('');
  };

  const handleTagSelect = (slug: string) => {
    setSelectedTagSlug(slug);
    setPage(1);
  };

  const handleCreateTag = async (
    nameOrPayload: CreateVideoTagDto | string,
    slug?: string,
    file?: File | null
  ) => {
    setActionError(null);
    try {
      const payload: CreateVideoTagDto =
        typeof nameOrPayload === 'string'
          ? {
              name: nameOrPayload,
              slug: slug || '',
              description: '',
              language: (selectedLanguage === 'all' ? 'te' : selectedLanguage) as TagLanguage,
              thumbnail: file || null,
            }
          : nameOrPayload;

      const newTag = await liveTvVideosRepository.createVideoTag(payload);
      const tagLang = newTag.language || 'te';

      // If active view is 'all', add to tags and segregated
      if (selectedLanguage === 'all') {
        setTags((prev) => [...prev, newTag]);
        setSegregatedTags((prev) => ({
          ...prev,
          [tagLang]: [...(prev[tagLang] || []), newTag],
        }));
        setSelectedTagSlug(newTag.slug);
      } else if (tagLang === selectedLanguage) {
        // Tag language matches active single-language view
        setTags((prev) => [...prev, newTag]);
        setSelectedTagSlug(newTag.slug);
      }

      setActionSuccess('Video tag created successfully');
      setCreateTagModalOpen(false);
      return newTag;
    } catch (err: any) {
      setActionError(err.message || 'Failed to create video tag');
      throw err;
    }
  };

  const handleUpdateTag = async (
    slug: string,
    nameOrPayload: UpdateVideoTagDto | string,
    file?: File | null
  ) => {
    setActionError(null);
    try {
      const payload: UpdateVideoTagDto =
        typeof nameOrPayload === 'string'
          ? {
              name: nameOrPayload,
              thumbnail: file || null,
            }
          : nameOrPayload;

      const updatedTag = await liveTvVideosRepository.updateVideoTag(slug, payload);
      const updatedLang = updatedTag.language || 'te';

      if (selectedLanguage === 'all') {
        setTags((prev) =>
          prev.map((t) => (t.slug === slug ? { ...t, ...updatedTag } : t))
        );
        setSegregatedTags((prev) => {
          const next: SegregatedVideoTags = {
            te: prev.te.filter((t) => t.slug !== slug),
            ml: prev.ml.filter((t) => t.slug !== slug),
            en: prev.en.filter((t) => t.slug !== slug),
          };
          if (!next[updatedLang]) next[updatedLang] = [];
          next[updatedLang].push(updatedTag);
          return next;
        });
      } else if (updatedLang !== selectedLanguage) {
        // Tag language changed away from the current language tab; remove it immediately
        const remaining = tags.filter((t) => t.slug !== slug);
        setTags(remaining);
        if (selectedTagSlug === slug) {
          setSelectedTagSlug(remaining.length > 0 ? remaining[0].slug : '');
          if (remaining.length === 0) {
            setVideos([]);
          }
        }
      } else {
        setTags((prev) =>
          prev.map((t) => (t.slug === slug ? { ...t, ...updatedTag } : t))
        );
      }

      setActionSuccess('Video tag updated successfully');
      setEditTagModalOpen(false);
      return updatedTag;
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
      setSegregatedTags((prev) => ({
        te: prev.te.filter((t) => t.slug !== slug),
        ml: prev.ml.filter((t) => t.slug !== slug),
        en: prev.en.filter((t) => t.slug !== slug),
      }));
      if (selectedTagSlug === slug) {
        setSelectedTagSlug(remainingTags.length > 0 ? remainingTags[0].slug : '');
        if (remainingTags.length === 0) {
          setVideos([]);
        }
      }
      setActionSuccess('Video tag deleted successfully');
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete video tag');
    }
  };

  const handleDailySync = async (slug: string) => {
    if (!slug) return;
    setIsSyncing(true);
    setActionError(null);
    try {
      const res = await liveTvVideosRepository.syncTagVideos(slug);
      setActionSuccess(res?.message || `Videos synced successfully for ${slug}`);
      await loadTagVideos(slug);
    } catch (err: any) {
      setActionError(err.message || 'Failed to sync videos');
    } finally {
      setIsSyncing(false);
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

  const handleOpenEditVideoModal = (video: TagVideo) => {
    setActiveVideoForEdit(video);
    setEditVideoModalOpen(true);
  };

  const handleUpdateVideo = async (videoId: string, fileName: string, viewCount: number) => {
    if (!selectedTagSlug) return;
    setActionError(null);
    try {
      const updatedVideo = await liveTvVideosRepository.updateVideoFromTag(
        selectedTagSlug,
        videoId,
        fileName,
        viewCount
      );
      setVideos((prev) => prev.map((v) => (v.id === videoId ? updatedVideo : v)));
      setActionSuccess('Video updated successfully');
      setEditVideoModalOpen(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update video');
      throw err;
    }
  };

  return {
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    tags,
    segregatedTags,
    selectedTagSlug,
    handleTagSelect,
    videos,
    loading,
    isSyncing,
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
    editVideoModalOpen,
    setEditVideoModalOpen,
    activeTagForEdit,
    activeVideoForPlayer,
    activeVideoForEdit,
    // Handlers
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleDailySync,
    handlePlayVideo,
    handleDeleteVideo,
    handleOpenEditTagModal,
    handleOpenEditVideoModal,
    handleUpdateVideo,
    fetchTags,
    loadTagVideos,
  };
}
