import axios from 'axios';
import { MovieItem, CreateMovieDto, MovieApiData } from '../domain/movies.model';

const LOCAL_BACKEND_URL = 'http://localhost:8000/api/admin/content/movie';
const REMOTE_API_URL = 'https://api.chotanews.com/api/admin/content/movie';
const PROXY_API_URL = '/api/api/admin/content/movie';
const LOCAL_STORAGE_KEY = 'bigtv_cms_movies_list';

const MOCK_INITIAL_MOVIES: MovieItem[] = [
  {
    id: '1',
    movieId: '1',
    contentType: 'movie',
    title: 'Kalki 2898 AD',
    movieTitle: 'Kalki 2898 AD',
    titleEn: 'Kalki 2898 AD',
    titleTe: 'కల్కి 2898 AD',
    titleHi: 'कल्कि 2898 AD',
    titleMl: 'കൽക്കി 2898 എഡി',
    description: 'A modern avatar of Vishnu descends to protect humanity from dark forces.',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
    videoUrl: 'https://bigtv-app.b1656d3be9835befd7b0266af4373b81.r2.cloudflarestorage.com/movies/videos/video.mp4',
    trailerUrl: 'https://bigtv-app.b1656d3be9835befd7b0266af4373b81.r2.cloudflarestorage.com/movies/videos/video.mp4',
    genres: ['Sci-Fi', 'Action'],
    genre: 'Sci-Fi / Action',
    languages: ['Telugu', 'English', 'Hindi', 'Malayalam'],
    language: 'Telugu',
    duration: 3,
    durationMinutes: 180,
    releaseDate: '2024-06-27',
    releaseYear: 2024,
    rating: 8.9,
    ageRestriction: 'U/A 13+',
    featured: true,
    isPremium: true,
    status: 'published',
    isPublished: true,
    createdAt: '2026-08-01T10:00:00',
    updatedAt: '2026-08-01T10:00:00',
  },
  {
    id: '7c740c5e-521c-4ec2-afc1-1136dccd3868',
    movieId: '7c740c5e-521c-4ec2-afc1-1136dccd3868',
    contentType: 'movie',
    title: 'Nikhil Kumar',
    movieTitle: 'Nikhil Kumar',
    titleEn: 'Nikhil Kumar',
    titleTe: 'నిఖిల్ కుమార్',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    poster: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
    posterUrl: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
    imageUrl: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
    banner: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
    bannerUrl: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
    thumbnail: 'https://marvel-b1-cdn.bc0a.com/f00000000280066/cover.hoopladigital.com/asy_asy3612_640.jpeg',
    videoUrl: 'https://streamable.com/f673g4',
    trailerUrl: 'https://streamable.com/f673g4',
    genres: ['Sci-Fi', 'Action'],
    genre: 'Sci-Fi, Action',
    languages: ['English', 'Spanish'],
    language: 'English',
    duration: 2,
    durationMinutes: 120,
    releaseDate: '2010-07-16',
    releaseYear: 2010,
    rating: 8.8,
    ageRestriction: 'PG-13',
    featured: true,
    isPremium: true,
    status: 'published',
    isPublished: true,
    createdAt: '2026-08-04T07:34:32',
    updatedAt: '2026-08-04T07:34:32',
  },
  {
    id: 'series-101',
    movieId: 'series-101',
    contentType: 'series',
    title: 'Kalki & Mahabharata Legend Series',
    movieTitle: 'Kalki & Mahabharata Legend Series',
    titleEn: 'Kalki & Mahabharata Legend Series',
    titleTe: 'కల్కి & మహాభారత లెజెండ్ సిరీస్',
    titleHi: 'कल्कि और महाभारत लीजेंड सीरीज',
    titleMl: 'കൽക്കി & മഹാഭാരതം ലെജൻഡ് സീരീസ്',
    description: 'An epic sci-fi web series following modern avatars and ancient mythology.',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400',
    genres: ['Sci-Fi', 'Mythology', 'Action'],
    genre: 'Sci-Fi / Mythology',
    languages: ['Telugu', 'English', 'Hindi'],
    language: 'Telugu',
    seasonsCount: 2,
    episodesCount: 12,
    releaseDate: '2025-01-01',
    releaseYear: 2025,
    rating: 8.5,
    ageRestriction: 'U/A 13+',
    featured: true,
    status: 'published',
    isPublished: true,
    createdAt: '2026-08-02T10:00:00',
    updatedAt: '2026-08-02T10:00:00',
  },
  {
    id: 'series-102',
    movieId: 'series-102',
    contentType: 'series',
    title: 'Devara Chronicles',
    movieTitle: 'Devara Chronicles',
    titleEn: 'Devara Chronicles',
    titleTe: 'దేవర క్రానికల్స్',
    titleHi: 'देवरा क्रॉनिकल्स',
    titleMl: 'ദേവര ക്രോണിക്കിൾസ്',
    description: 'High-stakes sea action series following ruthless coastal legends.',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400',
    genres: ['Action', 'Drama'],
    genre: 'Action / Drama',
    languages: ['Telugu', 'Hindi', 'Malayalam'],
    language: 'Telugu',
    seasonsCount: 1,
    episodesCount: 8,
    releaseDate: '2024-09-27',
    releaseYear: 2024,
    rating: 8.4,
    ageRestriction: 'U/A 16+',
    featured: true,
    status: 'published',
    isPublished: true,
    createdAt: '2026-08-03T10:00:00',
    updatedAt: '2026-08-03T10:00:00',
  },
  {
    id: 'tr-301',
    movieId: 'tr-301',
    contentType: 'trailer',
    title: 'Kalki 2898 AD Official Trailer',
    movieTitle: 'Kalki 2898 AD Official Trailer',
    titleEn: 'Kalki 2898 AD Official Trailer',
    titleTe: 'కల్కి 2898 AD ఆఫీషియల్ ట్రైలర్',
    titleHi: 'कल्कि 2898 AD आधिकारिक ट्रेलर',
    titleMl: 'കൽക്കി 2898 എഡി ഒഫീഷ്യൽ ട്രെയിലർ',
    description: 'Official theatrical trailer of Kalki 2898 AD.',
    parentTitle: 'Kalki 2898 AD',
    parentId: '1',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400',
    videoUrl: 'https://bigtv-app.b1656d3be9835befd7b0266af4373b81.r2.cloudflarestorage.com/movies/videos/video.mp4',
    genres: ['Trailer', 'Sci-Fi'],
    genre: 'Trailer',
    languages: ['Telugu', 'English', 'Hindi'],
    language: 'Telugu',
    duration: 3,
    durationMinutes: 3,
    releaseDate: '2024-06-10',
    releaseYear: 2024,
    rating: 9.0,
    ageRestriction: 'U/A 13+',
    featured: true,
    status: 'published',
    isPublished: true,
    createdAt: '2026-08-04T10:00:00',
    updatedAt: '2026-08-04T10:00:00',
  },
  {
    id: 'tr-302',
    movieId: 'tr-302',
    contentType: 'trailer',
    title: 'Pushpa 2 The Rule Glimpse Trailer',
    movieTitle: 'Pushpa 2 The Rule Glimpse Trailer',
    titleEn: 'Pushpa 2 The Rule Glimpse Trailer',
    titleTe: 'పుష్ప 2 ది రూల్ గ్లింప్స్ ట్రైలర్',
    titleHi: 'पुष्पा 2 द रूल ग्लिम्स ट्रेलर',
    titleMl: 'പുഷ്പ 2 ദി റൂൾ ഗ്ലിംപ്സ് ട്രെയിലർ',
    description: 'Special birthday glimpse trailer of Pushpa 2: The Rule.',
    parentTitle: 'Pushpa 2: The Rule',
    parentId: '2',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400',
    videoUrl: 'https://bigtv-app.b1656d3be9835befd7b0266af4373b81.r2.cloudflarestorage.com/movies/videos/video.mp4',
    genres: ['Trailer', 'Action'],
    genre: 'Trailer',
    languages: ['Telugu', 'Hindi'],
    language: 'Telugu',
    duration: 2,
    durationMinutes: 2,
    releaseDate: '2024-04-08',
    releaseYear: 2024,
    rating: 8.7,
    ageRestriction: 'U/A 16+',
    featured: true,
    status: 'published',
    isPublished: true,
    createdAt: '2026-08-04T11:00:00',
    updatedAt: '2026-08-04T11:00:00',
  },
];

export class MoviesRepository {
  private static getTargetUrl(pathExtension: string = ''): string {
    const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    let baseUrl = LOCAL_BACKEND_URL;
    if (envBase) {
      baseUrl = `${envBase.replace(/\/$/, '')}/admin/content/movie`;
    } else if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      baseUrl = PROXY_API_URL;
    }
    return pathExtension ? `${baseUrl}/${pathExtension}` : baseUrl;
  }

  private static mapApiToItem(apiData: any, defaultContentType?: 'movie' | 'series' | 'trailer' | 'episode'): MovieItem {
    const id = apiData.id || apiData.movieId || `mov_${Math.random().toString(36).substr(2, 9)}`;
    const title = apiData.title || apiData.movieTitle || 'Untitled Movie';
    const poster = apiData.poster || apiData.posterUrl || apiData.poster_url || apiData.imageUrl || '';
    const banner = apiData.banner || apiData.bannerUrl || apiData.banner_url || poster;
    const thumbnail = apiData.thumbnail || poster;

    const contentType: 'movie' | 'series' | 'trailer' | 'episode' =
      apiData.contentType ||
      apiData.type ||
      defaultContentType ||
      (Array.isArray(apiData.episodes) || String(id).startsWith('series') || String(id).startsWith('ser')
        ? 'series'
        : String(id).startsWith('tr') || String(id).startsWith('trailer')
        ? 'trailer'
        : 'movie');
    
    const genres = Array.isArray(apiData.genres)
      ? apiData.genres
      : apiData.genre
      ? [apiData.genre]
      : ['Sci-Fi', 'Action'];
      
    const languages = Array.isArray(apiData.languages)
      ? apiData.languages
      : apiData.language
      ? [apiData.language]
      : ['Telugu'];

    const status = apiData.status || (apiData.isPublished ? 'published' : 'draft');
    const isPublished = status === 'published' || status === 'active';

    const durationMins = typeof apiData.duration === 'number' && apiData.duration < 10 
      ? apiData.duration * 60 
      : (apiData.durationMinutes || apiData.duration_minutes || 120);

    const episodesCount = Array.isArray(apiData.episodes)
      ? apiData.episodes.length
      : (apiData.episodesCount ?? apiData.episodes_count ?? 8);

    return {
      id,
      movieId: id,
      contentType,
      title,
      movieTitle: title,
      titleEn: apiData.titleEn || title,
      titleTe: apiData.titleTe,
      titleHi: apiData.titleHi,
      titleMl: apiData.titleMl,
      description: apiData.description || '',
      poster,
      posterUrl: poster,
      imageUrl: poster,
      banner,
      bannerUrl: banner,
      thumbnail,
      videoUrl: apiData.videoUrl || apiData.video_url || '',
      trailerUrl: apiData.trailerUrl || apiData.trailer_url || apiData.videoUrl || '',
      genres,
      genre: genres.join(', '),
      languages,
      language: languages[0] || 'Telugu',
      duration: apiData.duration ?? 2,
      durationMinutes: durationMins,
      releaseDate: apiData.releaseDate || apiData.release_date || `${apiData.releaseYear || 2024}-01-01`,
      releaseYear: apiData.releaseDate ? parseInt(apiData.releaseDate.split('-')[0]) : (apiData.releaseYear || 2024),
      rating: apiData.rating ?? 8.0,
      ageRestriction: apiData.ageRestriction || 'PG-13',
      featured: apiData.featured ?? true,
      isPremium: apiData.isPremium ?? true,
      status,
      isPublished,
      parentTitle: apiData.parentTitle || apiData.parent_title,
      parentId: apiData.parentId || apiData.parent_id,
      seasonsCount: apiData.seasonsCount ?? apiData.seasons_count ?? 1,
      episodesCount,
      episodes: Array.isArray(apiData.episodes) ? apiData.episodes : [],
      trailers: Array.isArray(apiData.trailers) ? apiData.trailers : [],
      createdAt: apiData.createdAt || apiData.created_at || new Date().toISOString(),
      updatedAt: apiData.updatedAt || apiData.updated_at || new Date().toISOString(),
    };
  }

  private static mapItemToCreateDto(item: Partial<MovieItem>): CreateMovieDto {
    const poster = item.poster || item.posterUrl || item.imageUrl || '';
    const banner = item.banner || item.bannerUrl || poster;
    const thumbnail = item.thumbnail || poster;
    const genres = Array.isArray(item.genres) && item.genres.length > 0
      ? item.genres
      : item.genre
      ? item.genre.split(',').map((g) => g.trim())
      : ['Sci-Fi', 'Action'];
    const languages = Array.isArray(item.languages) && item.languages.length > 0
      ? item.languages
      : item.language
      ? [item.language]
      : ['English', 'Spanish'];

    return {
      title: item.title || item.movieTitle || item.titleEn || 'Untitled Movie',
      description: item.description || '',
      poster,
      banner,
      thumbnail,
      videoUrl: item.videoUrl || '',
      genres,
      languages,
      duration: typeof item.duration === 'number' ? item.duration : (item.durationMinutes ? Math.round(item.durationMinutes / 60) : 2),
      releaseDate: item.releaseDate || `${item.releaseYear || 2024}-07-16`,
      rating: Number(item.rating) || 8.8,
      ageRestriction: item.ageRestriction || 'PG-13',
      featured: item.featured ?? true,
      isPremium: item.isPremium ?? true,
      status: item.status || (item.isPublished !== false ? 'published' : 'draft'),
    };
  }

  private static getStoredFallback(): MovieItem[] {
    if (typeof window === 'undefined') return MOCK_INITIAL_MOVIES;
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return MOCK_INITIAL_MOVIES;
  }

  private static saveStoredFallback(items: MovieItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }

  private static parseApiResponse(data: any[], defaultContentType?: 'movie' | 'series' | 'trailer' | 'episode'): MovieItem[] {
    const result: MovieItem[] = [];
    data.forEach((item: any) => {
      const movie = MoviesRepository.mapApiToItem(item, defaultContentType);
      result.push(movie);
      if (Array.isArray(item.trailers) && item.trailers.length > 0) {
        item.trailers.forEach((tr: any) => {
          const trailerItem = MoviesRepository.mapApiToItem({
            ...tr,
            contentType: 'trailer',
            parentTitle: movie.title,
            parentId: String(movie.id),
          });
          result.push(trailerItem);
        });
      }
    });
    return result;
  }

  static async getAll(): Promise<MovieItem[]> {
    const baseUrl = 'https://api.chotanews.com/api/content';

    const getHeaders = () => {
      if (typeof window === 'undefined') return {};
      const token = localStorage.getItem('access_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    };
    const headers = getHeaders();

    const endpoints = [
      { url: `${baseUrl}?type=series`, defaultType: 'series' as const },
    ];

    let combinedItems: MovieItem[] = [];
    const seenIds = new Set<string | number>();

    for (const ep of endpoints) {
      try {
        const response = await axios.get(ep.url, { headers });
        const data = response.data?.data || response.data;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = this.parseApiResponse(data, ep.defaultType);
          mapped.forEach((item) => {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              combinedItems.push(item);
            }
          });
        }
      } catch (error) {
        console.warn(`API getAll failed on ${ep.url}, trying next endpoint...`);
      }
    }

    // Merge locally created / stored series & trailers
    if (typeof window !== 'undefined') {
      try {
        const storedAdminSeries = localStorage.getItem('bigtv_cms_admin_series');
        if (storedAdminSeries) {
          const parsed = JSON.parse(storedAdminSeries);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped = this.parseApiResponse(parsed, 'series');
            mapped.forEach((item) => {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                combinedItems.push(item);
              }
            });
          }
        }
      } catch (e) {}

      try {
        const storedAdminTrailers = localStorage.getItem('bigtv_cms_admin_trailers');
        if (storedAdminTrailers) {
          const parsed = JSON.parse(storedAdminTrailers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped = this.parseApiResponse(parsed, 'trailer');
            mapped.forEach((item) => {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                combinedItems.push(item);
              }
            });
          }
        }
      } catch (e) {}
    }

    // Fallback if no series items exist
    const hasSeries = combinedItems.some((item) => item.contentType === 'series');
    if (!hasSeries) {
      const mockSeries = MOCK_INITIAL_MOVIES.filter((m) => m.contentType === 'series');
      mockSeries.forEach((s) => {
        if (!seenIds.has(s.id)) {
          seenIds.add(s.id);
          combinedItems.push(s);
        }
      });
    }

    // Fallback if no trailer items exist
    const hasTrailers = combinedItems.some((item) => item.contentType === 'trailer');
    if (!hasTrailers) {
      const mockTrailers = MOCK_INITIAL_MOVIES.filter((m) => m.contentType === 'trailer');
      mockTrailers.forEach((tr) => {
        if (!seenIds.has(tr.id)) {
          seenIds.add(tr.id);
          combinedItems.push(tr);
        }
      });
    }

    if (combinedItems.length > 0) {
      this.saveStoredFallback(combinedItems);
      return combinedItems;
    }

    return this.getStoredFallback();
  }

  static async add(movie: Partial<MovieItem>): Promise<MovieItem> {
    const dto = this.mapItemToCreateDto(movie);
    const targetUrl = this.getTargetUrl();

    try {
      const response = await axios.post(targetUrl, dto);
      const resData = response.data?.data || response.data;
      if (resData && (resData.id || resData.title)) {
        const created = this.mapApiToItem(resData);
        const list = this.getStoredFallback();
        this.saveStoredFallback([created, ...list]);
        return created;
      }
    } catch (error) {
      console.warn(`API add failed on ${targetUrl}, trying direct URL...`, error);
      if (targetUrl !== REMOTE_API_URL) {
        try {
          const fallbackRes = await axios.post(REMOTE_API_URL, dto);
          const resData = fallbackRes.data?.data || fallbackRes.data;
          if (resData && (resData.id || resData.title)) {
            const created = this.mapApiToItem(resData);
            const list = this.getStoredFallback();
            this.saveStoredFallback([created, ...list]);
            return created;
          }
        } catch (e) {}
      }
    }

    // Local fallback
    const list = this.getStoredFallback();
    const newId = `mov_${Date.now()}`;
    const newMovie: MovieItem = {
      ...this.mapApiToItem(dto),
      id: newId,
      movieId: newId,
    };
    this.saveStoredFallback([newMovie, ...list]);
    return newMovie;
  }

  static async update(id: string | number, movie: Partial<MovieItem>): Promise<MovieItem | null> {
    const dto = this.mapItemToCreateDto(movie);
    const targetUrl = this.getTargetUrl(String(id));

    try {
      const response = await axios.put(targetUrl, dto);
      const resData = response.data?.data || response.data;
      if (resData) {
        const updated = this.mapApiToItem(resData);
        const list = this.getStoredFallback();
        const updatedList = list.map((m) => (m.id === id || m.movieId === id ? updated : m));
        this.saveStoredFallback(updatedList);
        return updated;
      }
    } catch (error) {
      console.warn(`API update for ID ${id} failed:`, error);
    }

    const list = this.getStoredFallback();
    const idx = list.findIndex((m) => m.id === id || m.movieId === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...this.mapApiToItem({ ...dto, id }) };
    list[idx] = updated;
    this.saveStoredFallback(list);
    return updated;
  }

  static async delete(id: string | number, contentType?: string): Promise<boolean> {
    let targetUrl = this.getTargetUrl(String(id));

    if (contentType === 'series') {
      const envBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.chotanews.com/api';
      targetUrl = `${envBase.replace(/\/$/, '')}/admin/content?type=series&id=${id}`;
    }

    try {
      await axios.delete(targetUrl);
    } catch (error) {
      console.warn(`API delete for ID ${id} failed:`, error);
    }
    const list = this.getStoredFallback();
    const filtered = list.filter((m) => m.id !== id && m.movieId !== id);
    this.saveStoredFallback(filtered);
    return true;
  }

  static async togglePublish(id: string | number): Promise<MovieItem | null> {
    const list = this.getStoredFallback();
    const item = list.find((m) => m.id === id || m.movieId === id);
    const newStatus = item?.status === 'published' ? 'draft' : 'published';
    return this.update(id, { status: newStatus, isPublished: newStatus === 'published' });
  }
}
