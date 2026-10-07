import { useState, useEffect, useCallback } from 'react';
import { Reel, CreateYouTubeVideoPayload } from '../domain/reels.model';
import { reelSchema } from '../validators/reels.validator';
import { ReelsService } from '../services/reelsService';

export function extractYouTubeVideoId(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : '';
}

const initialReels: Reel[] = [
  {
    reelId: 101,
    reelTitle: 'హైదరాబాద్ బిర్యానీ టూర్',
    duration: '0:30',
    views: '125K',
    isPublished: false,
    titleEn: 'Hyderabad Biryani Tour',
    titleTe: 'హైదరాబాద్ బిర్యానీ టూర్',
    titleHi: 'हैदराबाद बिरयानी टूर',
    titleMl: 'ഹൈദരാബാദ് ബിരിയാണി ടൂർ',
  },
  {
    reelId: 102,
    reelTitle: 'ఆంధ్రప్రదేశ్‌లో భారీ వర్షాలు',
    duration: '0:45',
    views: '84K',
    isPublished: false,
    titleEn: 'Heavy Rains in AP',
    titleTe: 'ఆంధ్రప్రదేశ్‌లో భారీ వర్షాలు',
    titleHi: 'आंध्र प्रदेश में भारी बारिश',
    titleMl: 'ആന്ധ്രാപ്രദേശിൽ കനത്ത മഴ',
  },
  {
    reelId: 103,
    reelTitle: 'కొత్త సినిమా టీజర్ రివ్యూ',
    duration: '0:58',
    views: '210K',
    isPublished: false,
    titleEn: 'New Movie Teaser Review',
    titleTe: 'కొత్త సినిమా టీజర్ రివ్యూ',
    titleHi: 'नया मूवी टीज़र रिव्यू',
    titleMl: 'പുതിയ സിനിമ ടീസർ റിവ്യൂ',
  },
  {
    reelId: 104,
    reelTitle: 'కాళేశ్వరం ప్రాజెక్ట్ అప్‌డేట్',
    duration: '0:40',
    views: '45K',
    isPublished: false,
    titleEn: 'Kaleshwaram Project Update',
    titleTe: 'కాళేశ్వరం ప్రాజెక్ట్ అప్‌డేట్',
    titleHi: 'कालेश्वरम परियोजना अपडेट',
    titleMl: 'കലേശ്വരം പദ്ധതി അപ്ഡേറ്റ്',
  },
  {
    reelId: 105,
    reelTitle: 'భక్తి గీతాలాపన',
    duration: '0:35',
    views: '112K',
    isPublished: false,
    titleEn: 'Devotional Chants',
    titleTe: 'భక్తి గీతాలాపన',
    titleHi: 'భక్తి గీతాలాపన',
    titleMl: 'ഭക്തിഗാനങ്ങൾ',
  },
];

export function useReelsController() {
  const [rows, setRows] = useState<Reel[]>(initialReels);
  const [totalCount, setTotalCount] = useState<number>(initialReels.length);
  const [loading, setLoading] = useState(false);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterId, setFilterId] = useState('');
  const [filterLang, setFilterLang] = useState<string>('te');
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  // Sync Modal state
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const isEditMode = editingId !== null;

  // Form states
  const emptyForm = {
    titleEn: '',
    titleTe: '',
    titleHi: '',
    titleMl: '',
    duration: '',
    videoUrl: '',
    videoId: '',
    isPublished: false,
  };
  const [form, setForm] = useState(emptyForm);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch YouTube Shorts from API
  const fetchShorts = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * recordsPerPage;
      const response = await ReelsService.fetchYouTubeShorts(skip, recordsPerPage, filterLang);
      if (response && response.data && Array.isArray(response.data)) {
        const mappedReels: Reel[] = response.data.map((item) => {
          const durSec = item.duration_seconds;
          const formattedDuration = durSec
            ? `${Math.floor(durSec / 60)}:${(durSec % 60).toString().padStart(2, '0')}`
            : item.duration || '0:30';

          const parsedId = typeof item.id === 'number' ? item.id : parseInt(String(item.id), 10);
          const reelId = isNaN(parsedId) || parsedId === 0 ? Math.floor(Math.random() * 10000) : parsedId;
          const titleText = item.title || item.postName || 'Untitled Video';

          const rawVidId = item.video_id || (item.videoUrl ? extractYouTubeVideoId(item.videoUrl) : item.video_url ? extractYouTubeVideoId(item.video_url) : '');
          const rawVidUrl = item.videoUrl || item.video_url || item.url || item.postUrl || (rawVidId ? `https://www.youtube.com/watch?v=${rawVidId}` : '');

          return {
            reelId,
            reelTitle: titleText,
            duration: formattedDuration,
            views: item.likes !== undefined ? String(item.likes) : item.view_count !== undefined ? String(item.view_count) : String(item.totalViews || 0),
            isPublished: item.isPublish !== undefined ? Boolean(item.isPublish) : false,
            titleEn: titleText,
            titleTe: titleText,
            titleHi: titleText,
            titleMl: titleText,
            imageUrl: item.thumbnailUrl || item.thumbnail_url || item.image_url || (rawVidId ? `https://i.ytimg.com/vi/${rawVidId}/maxresdefault.jpg` : undefined),
            videoId: rawVidId,
            videoUrl: rawVidUrl,
            channelTitle: item.publisher || item.channel_title,
            url: rawVidUrl,
            publishedAt: item.createdAt || item.published_at || item.created,
          };
        });

        setRows(mappedReels);
        if (typeof response.total === 'number') {
          setTotalCount(response.total);
        }
      }
    } catch {
      // Fallback to local initial items if API endpoint fails (e.g. offline/mock test)
    } finally {
      setLoading(false);
    }
  }, [page, recordsPerPage, filterLang]);

  useEffect(() => {
    fetchShorts();
  }, [fetchShorts]);

  // YouTube Sync Action
  const handleSyncChannel = async (
    channelId: string = 'BIGTVTeluguLive',
    maxResults: number = 50,
    lang: string = 'te'
  ) => {
    try {
      const res = await ReelsService.syncYouTubeChannel({ channelId, maxResults, lang, syncInBackground: true });
      if (res && res.message) {
        setSyncMessage(res.message);
      } else {
        setSyncMessage(`YouTube sync for channel '${channelId}' initiated in background.`);
      }
      await fetchShorts();
    } catch {
      setSyncMessage(`Failed to initiate sync for channel '${channelId}'.`);
    }
  };

  // Filter & Pagination logic
  const filtered = rows.filter((r) => {
    const matchTitle =
      r.titleEn.toLowerCase().includes(filterTitle.toLowerCase()) ||
      r.titleTe.toLowerCase().includes(filterTitle.toLowerCase()) ||
      r.titleHi.toLowerCase().includes(filterTitle.toLowerCase()) ||
      r.titleMl.toLowerCase().includes(filterTitle.toLowerCase());
    const matchId = String(r.reelId).includes(filterId.trim());
    return matchTitle && matchId;
  });

  useEffect(() => {
    setPage(1);
  }, [filterTitle, filterId, filterLang]);

  const totalPages = Math.max(1, Math.ceil(totalCount / recordsPerPage));
  const paginatedData = filtered.slice(0, recordsPerPage);

  const togglePublish = async (id: number) => {
    const targetReel = rows.find((r) => r.reelId === id);
    if (!targetReel) return;
    const newPublishState = !targetReel.isPublished;

    setRows((prev) =>
      prev.map((r) =>
        r.reelId === id ? { ...r, isPublished: newPublishState } : r
      )
    );

    try {
      await ReelsService.updatePublishStatus(id, newPublishState);
    } catch {
      setRows((prev) =>
        prev.map((r) =>
          r.reelId === id ? { ...r, isPublished: !newPublishState } : r
        )
      );
    }
  };

  const handleEditClick = (reel: Reel) => {
    setEditingId(reel.reelId);
    setForm({
      titleEn: reel.titleEn,
      titleTe: reel.titleTe,
      titleHi: reel.titleHi,
      titleMl: reel.titleMl,
      duration: reel.duration,
      videoUrl: reel.videoUrl || reel.url || '',
      videoId: reel.videoId || '',
      isPublished: reel.isPublished,
    });
    setUploadedImage(reel.imageUrl || null);
    setErrors({});
    setSubmitted(false);
    setDrawerOpen(true);
  };

  const handleFieldChange = (field: string, val: string | boolean) => {
    setForm((prev) => {
      let updated = { ...prev, [field]: val };

      if (field === 'videoUrl' && typeof val === 'string') {
        const extractedId = extractYouTubeVideoId(val);
        if (extractedId) {
          updated.videoId = extractedId;
          if (!uploadedImage) {
            setUploadedImage(`https://i.ytimg.com/vi/${extractedId}/maxresdefault.jpg`);
          }
        }
      } else if (field === 'videoId' && typeof val === 'string') {
        const trimmedId = val.trim();
        if (trimmedId && (!prev.videoUrl || extractYouTubeVideoId(prev.videoUrl) !== trimmedId)) {
          updated.videoUrl = `https://www.youtube.com/watch?v=${trimmedId}`;
        }
        if (trimmedId && !uploadedImage && /^[a-zA-Z0-9_-]{11}$/.test(trimmedId)) {
          setUploadedImage(`https://i.ytimg.com/vi/${trimmedId}/maxresdefault.jpg`);
        }
      }

      if (submitted) {
        const res = reelSchema.safeParse(updated);
        if (res.success) {
          setErrors({});
        } else {
          const errMap: Record<string, string> = {};
          res.error.issues.forEach((issue) => {
            if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
          });
          setErrors(errMap);
        }
      }
      return updated;
    });
  };

  const handleImageUploaded = (dataUrl: string | null) => {
    setUploadedImage(dataUrl);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setUploadedImage(null);
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const submitForm = {
      ...form,
      titleHi: form.titleHi || form.titleEn,
    };
    const validationResult = reelSchema.safeParse(submitForm);
    const errMap: Record<string, string> = {};

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    const derivedVidId = submitForm.videoId || extractYouTubeVideoId(submitForm.videoUrl);
    const derivedVidUrl = submitForm.videoUrl || (derivedVidId ? `https://www.youtube.com/watch?v=${derivedVidId}` : '');
    const derivedThumbnail = uploadedImage || (derivedVidId ? `https://i.ytimg.com/vi/${derivedVidId}/maxresdefault.jpg` : '');

    const payload: CreateYouTubeVideoPayload = {
      videoUrl: derivedVidUrl,
      video_url: derivedVidUrl,
      thumbnailUrl: derivedThumbnail,
      thumbnail_url: derivedThumbnail,
      title: submitForm.titleTe || submitForm.titleEn,
      publisher: 'BIG TV Telugu',
      publisherImage: '',
      likes: 0,
      comments: 0,
      shares: 0,
      duration: submitForm.duration,
      createdAt: new Date().toISOString(),
      postName: submitForm.titleEn || submitForm.titleTe,
      reportedBy: '',
      links: derivedVidUrl ? [derivedVidUrl] : [],
      content: '',
      gallery: [],
      isPublish: submitForm.isPublished,
      lang: filterLang || 'te',
      video_id: derivedVidId,
      videoId: derivedVidId,
      titleEn: submitForm.titleEn,
      titleTe: submitForm.titleTe,
      titleHi: submitForm.titleHi,
      titleMl: submitForm.titleMl,
    };

    try {
      await ReelsService.createYouTubeVideo(payload);
    } catch {
      // Graceful fallback for offline / mock testing
    }

    if (isEditMode) {
      setRows((prev) =>
        prev.map((r) =>
          r.reelId === editingId
            ? {
                ...r,
                reelTitle: submitForm.titleTe || submitForm.titleEn,
                duration: submitForm.duration,
                isPublished: submitForm.isPublished,
                titleEn: submitForm.titleEn,
                titleTe: submitForm.titleTe,
                titleHi: submitForm.titleHi,
                titleMl: submitForm.titleMl,
                imageUrl: derivedThumbnail || undefined,
                videoUrl: derivedVidUrl,
                videoId: derivedVidId,
                url: derivedVidUrl,
              }
            : r
        )
      );
    } else {
      const newId = Math.max(0, ...rows.map((r) => r.reelId)) + 1;
      setRows((prev) => [
        {
          reelId: newId,
          reelTitle: submitForm.titleTe || submitForm.titleEn,
          duration: submitForm.duration,
          views: '0',
          isPublished: submitForm.isPublished,
          titleEn: submitForm.titleEn,
          titleTe: submitForm.titleTe,
          titleHi: submitForm.titleHi,
          titleMl: submitForm.titleMl,
          imageUrl: derivedThumbnail || undefined,
          videoUrl: derivedVidUrl,
          videoId: derivedVidId,
          url: derivedVidUrl,
        },
        ...prev,
      ]);
    }

    handleCloseDrawer();
  };

  const deleteReel = (id: number) => {
    setRows((prev) => prev.filter((r) => r.reelId !== id));
  };

  return {
    rows,
    loading,
    filtered,
    paginatedData,
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
    uploadedImage,
    errors,
    syncModalOpen,
    setSyncModalOpen,
    syncMessage,
    setSyncMessage,
    handleSyncChannel,
    fetchShorts,
    handleFieldChange,
    handleImageUploaded,
    handleEditClick,
    handleCloseDrawer,
    handleSubmit,
    deleteReel,
  };
}
