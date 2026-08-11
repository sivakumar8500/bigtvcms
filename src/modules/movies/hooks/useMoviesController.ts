import { useState, useEffect, useMemo } from 'react';
import { MovieItem } from '../domain/movies.model';
import { MoviesRepository } from '../repositories/movies.repository';
import { MoviesUploadService } from '../services/movies-upload.service';

export const useMoviesController = () => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTabState] = useState<'movie' | 'series' | 'trailer'>('series');
  const [page, setPage] = useState<number>(1);
  const recordsPerPage = 10;

  // Upload states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Filters
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [filterId, setFilterId] = useState<string>('');
  const [filterLang, setFilterLang] = useState<string>('te');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<Partial<MovieItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setActiveTab = (tab: 'movie' | 'series' | 'trailer') => {
    setActiveTabState(tab);
    setPage(1);
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const data = await MoviesRepository.getAll();
      setMovies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const counts = useMemo(() => {
    const movieCount = movies.filter((m) => (m.contentType || 'movie') === 'movie').length;
    const seriesCount = movies.filter((m) => m.contentType === 'series').length;
    const trailerCount = movies.filter((m) => m.contentType === 'trailer').length;
    return { movie: movieCount, series: seriesCount, trailer: trailerCount };
  }, [movies]);

  const filteredData = useMemo(() => {
    return movies.filter((m) => {
      const itemType = m.contentType || 'movie';
      if (itemType !== activeTab) return false;

      const matchTitle = filterTitle
        ? (m.movieTitle || '').toLowerCase().includes(filterTitle.toLowerCase()) ||
          (m.titleEn || '').toLowerCase().includes(filterTitle.toLowerCase()) ||
          (m.titleTe || '').toLowerCase().includes(filterTitle.toLowerCase()) ||
          (m.title || '').toLowerCase().includes(filterTitle.toLowerCase())
        : true;
      const matchId = filterId ? String(m.id || m.movieId || '').toLowerCase().includes(filterId.trim().toLowerCase().replace(/^#/, '')) : true;
      return matchTitle && matchId;
    });
  }, [movies, activeTab, filterTitle, filterId]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (page - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, page]);

  const togglePublish = async (id: string | number) => {
    await MoviesRepository.togglePublish(id);
    setMovies((prev) =>
      prev.map((m) => (m.id === id || m.movieId === id ? { ...m, isPublished: !m.isPublished, status: !m.isPublished ? 'published' : 'draft' } : m))
    );
  };

  const handleFieldChange = (field: keyof MovieItem, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  const handleEditClick = (movie: MovieItem) => {
    setIsEditMode(true);
    setEditingId(movie.id || movie.movieId || null);
    setForm(movie);
    setErrors({});
    setDrawerOpen(true);
  };

  const handleFileUpload = async (file: File, folder: string = 'images') => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await MoviesUploadService.uploadMovieFile(file, folder);
      return res.file_url;
    } catch (err: any) {
      console.error('Movie file upload failed:', err);
      setUploadError(err?.message || 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setIsEditMode(false);
    setEditingId(null);
    setForm({});
    setErrors({});
    setUploadError(null);
  };

  const handleSubmit = async () => {
    const movieTitle = form.title || form.movieTitle || form.titleEn;
    if (!movieTitle) {
      setErrors({ title: 'Movie title is required' });
      return;
    }

    const poster = form.poster || form.posterUrl || form.imageUrl || '';
    const banner = form.banner || form.bannerUrl || poster;
    const thumbnail = form.thumbnail || poster;

    const payload: Partial<MovieItem> = {
      contentType: form.contentType || activeTab,
      title: movieTitle,
      movieTitle: movieTitle,
      description: form.description || '',
      poster,
      posterUrl: poster,
      imageUrl: poster,
      banner,
      bannerUrl: banner,
      thumbnail,
      videoUrl: form.videoUrl || '',
      genres: Array.isArray(form.genres) ? form.genres : form.genre ? [form.genre] : ['Sci-Fi', 'Action'],
      languages: Array.isArray(form.languages) ? form.languages : form.language ? [form.language] : ['English', 'Spanish'],
      duration: form.duration || (form.durationMinutes ? Math.round(form.durationMinutes / 60) : 2),
      releaseDate: form.releaseDate || '2010-07-16',
      rating: Number(form.rating) || 8.8,
      ageRestriction: form.ageRestriction || 'PG-13',
      featured: form.featured ?? true,
      isPremium: form.isPremium ?? true,
      status: form.status || 'published',
      isPublished: (form.status || 'published') === 'published',
    };

    if (isEditMode && editingId) {
      await MoviesRepository.update(editingId, payload);
    } else {
      await MoviesRepository.add(payload);
    }

    handleCloseDrawer();
    fetchMovies();
  };

  const deleteMovie = async (id: string | number) => {
    const item = movies.find((m) => m.id === id || m.movieId === id);
    await MoviesRepository.delete(id, item?.contentType || 'movie');
    setMovies((prev) => prev.filter((m) => m.id !== id && m.movieId !== id));
  };

  return {
    activeTab,
    setActiveTab,
    counts,
    paginatedData,
    loading,
    page,
    totalPages,
    setPage,
    filterTitle,
    setFilterTitle,
    filterId,
    setFilterId,
    filterLang,
    setFilterLang,
    togglePublish,
    drawerOpen,
    setDrawerOpen,
    isEditMode,
    form,
    errors,
    isUploading,
    uploadError,
    handleFileUpload,
    handleFieldChange,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteMovie,
  };
};

