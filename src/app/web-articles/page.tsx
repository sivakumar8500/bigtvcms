'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Divider,
  Tooltip,
  Pagination,
  Checkbox,
  Collapse,
  Snackbar,
  Alert,
  Chip,
  Link as MuiLink,
} from '@mui/material';
import {
  AddCircleOutline,
  Search,
  Visibility,
  Edit,
  Delete,
  AutoAwesome,
  ArrowBack,
  PostAdd,
  FilterListOff,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
  IndeterminateCheckBox,
  Web as WebIcon,
  OpenInNew,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { CreateNewsForm, CreateNewsFormData } from '@/modules/dashboard/components/CreateNewsForm';
import { CategoryRepository } from '@/modules/category/repositories/category.repository';
import { PostTypeRepository } from '@/modules/post-types/repositories/post-type.repository';
import { LocationRepository } from '@/modules/location/repositories/location.repository';
import { TagsRepository } from '@/modules/tags/repositories/tags.repository';
import { NewsRepository } from '@/modules/news/repositories/news.repository';
import { Loader } from '@/shared/components/Loader';
import { stripHtml } from '@/shared/utils/html.utils';

// Translations for Web Articles Page (4 languages)
const translations = {
  en: {
    title: 'Web Articles',
    createBtn: 'Create Web Article',
    searchPlaceholder: 'Search Web Article Title...',
    allCategories: 'All Categories',
    allTypes: 'All Types',
    filterDate: 'Date Range',
    dateAll: 'All Dates',
    dateToday: 'Today',
    dateYesterday: 'Yesterday',
    dateLast3: 'Last 3 Days',
    dateLast7: 'Last 7 Days',
    dateLast15: 'Last 15 Days',
    dateLast30: 'Last 30 Days',
    filterLocation: 'Location',
    allLocations: 'All Locations',
    filterAiTag: 'AI Tag',
    allAiTags: 'All AI Tags',
    filterStatus: 'Status',
    statusAll: 'All Status',
    statusPublish: 'Published',
    statusDraft: 'Draft',
    statusScheduled: 'Scheduled',
    clearFilters: 'Clear Filters',
    colSelect: 'Select',
    colImage: 'Image',
    colCategory: 'Category',
    colTitle: 'Title & Content',
    colType: 'Type & Lang',
    colWebUrl: 'Web URL',
    colDate: 'Date & Time',
    colActions: 'Actions',
    noRecords: 'No matching web articles found.',
    bulkSelected: (n: number) => `${n} article${n !== 1 ? 's' : ''} selected`,
    bulkDelete: 'Delete',
    bulkClear: 'Clear Selection',
    deleteSuccess: 'Web articles deleted successfully.',
    createSuccess: 'Web article created successfully.',
    updateSuccess: 'Web article updated successfully.',
    visitLink: 'Visit Link',
  },
  te: {
    title: 'వెబ్ వ్యాసాలు (Web Articles)',
    createBtn: 'వెబ్ వ్యాసాన్ని సృష్టించండి',
    searchPlaceholder: 'వెబ్ వ్యాసం శీర్షికను శోధించండి...',
    allCategories: 'అన్ని విభాగాలు',
    allTypes: 'అన్ని రకాలు',
    filterDate: 'తేదీ పరిధి',
    dateAll: 'అన్ని తేదీలు',
    dateToday: 'ఈరోజు',
    dateYesterday: 'నిన్న',
    dateLast3: 'చివరి 3 రోజులు',
    dateLast7: 'చివరి 7 రోజులు',
    dateLast15: 'చివరి 15 రోజులు',
    dateLast30: 'చివరి 30 రోజులు',
    filterLocation: 'స్థానం',
    allLocations: 'అన్ని స్థానాలు',
    filterAiTag: 'AI ట్యాగ్',
    allAiTags: 'అన్ని AI ట్యాగులు',
    filterStatus: 'స్థితి',
    statusAll: 'అన్ని స్థితులు',
    statusPublish: 'ప్రచురించబడింది',
    statusDraft: 'ముసాయిదా',
    statusScheduled: 'షెడ్యూల్ చేయబడింది',
    clearFilters: 'ఫిల్టర్‌లు తీసివేయి',
    colSelect: 'ఎంచుకోండి',
    colImage: 'చిత్రం',
    colCategory: 'విభాగం',
    colTitle: 'శీర్షిక & కంటెంట్',
    colType: 'రకం & భాష',
    colWebUrl: 'వెబ్ లింక్',
    colDate: 'తేదీ & సమయం',
    colActions: 'చర్యలు',
    noRecords: 'సరిపోలే వెబ్ వ్యాసాలు కనుగొనబడలేదు.',
    bulkSelected: (n: number) => `${n} వ్యాసాలు ఎంచుకోబడ్డాయి`,
    bulkDelete: 'తొలగించు',
    bulkClear: 'ఎంపికను రద్దు చేయి',
    deleteSuccess: 'వెబ్ వ్యాసాలు విజయవంతంగా తొలగించబడ్డాయి.',
    createSuccess: 'వెబ్ వ్యాసం విజయవంతంగా సృష్టించబడింది.',
    updateSuccess: 'వెబ్ వ్యాసం విజయవంతంగా నవీకరించబడింది.',
    visitLink: 'లింక్ తెరవండి',
  },
  hi: {
    title: 'वेब लेख (Web Articles)',
    createBtn: 'वेब लेख बनाएं',
    searchPlaceholder: 'वेब लेख शीर्षक खोजें...',
    allCategories: 'सभी श्रेणियां',
    allTypes: 'सभी प्रकार',
    filterDate: 'दिनांक सीमा',
    dateAll: 'सभी तिथियां',
    dateToday: 'आज',
    dateYesterday: 'कल',
    dateLast3: 'पिछले 3 दिन',
    dateLast7: 'पिछले 7 दिन',
    dateLast15: 'पिछले 15 दिन',
    dateLast30: 'पिछले 30 दिन',
    filterLocation: 'स्थान',
    allLocations: 'सभी स्थान',
    filterAiTag: 'AI टैग',
    allAiTags: 'सभी AI टैग',
    filterStatus: 'स्थिति',
    statusAll: 'सभी स्थिति',
    statusPublish: 'प्रकाशित',
    statusDraft: 'प्रारूप',
    statusScheduled: 'अनुसूचित',
    clearFilters: 'फ़िल्टर हटाएं',
    colSelect: 'चुनें',
    colImage: 'चित्र',
    colCategory: 'श्रेणी',
    colTitle: 'शीर्षक और सामग्री',
    colType: 'प्रकार और भाषा',
    colWebUrl: 'वेब यूआरएल',
    colDate: 'दिनांक और समय',
    colActions: 'कार्रवाई',
    noRecords: 'कोई मिलान वेब लेख नहीं मिला।',
    bulkSelected: (n: number) => `${n} लेख चुने गए`,
    bulkDelete: 'हटाएं',
    bulkClear: 'चयन रद्द करें',
    deleteSuccess: 'वेब लेख सफलतापूर्वक हटा दिए गए।',
    createSuccess: 'वेब लेख सफलतापूर्वक बनाया गया।',
    updateSuccess: 'वेब लेख सफलतापूर्वक अद्यतन किया गया।',
    visitLink: 'लिंक खोलें',
  },
  ml: {
    title: 'വെബ് ലേഖനങ്ങൾ (Web Articles)',
    createBtn: 'വെബ് ലേഖനം സൃഷ്ടിക്കുക',
    searchPlaceholder: 'വെബ് ലേഖന തലക്കെട്ട് തിരയുക...',
    allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
    allTypes: 'എല്ലാ തരങ്ങളും',
    filterDate: 'തീയതി പരിധി',
    dateAll: 'എല്ലാ തീയതികളും',
    dateToday: 'ഇന്ന്',
    dateYesterday: 'ഇന്നലെ',
    dateLast3: 'കഴിഞ്ഞ 3 ദിവസം',
    dateLast7: 'കഴിഞ്ഞ 7 ദിവസം',
    dateLast15: 'കഴിഞ്ഞ 15 ദിവസം',
    dateLast30: 'കഴിഞ്ഞ 30 ദിവസം',
    filterLocation: 'സ്ഥലം',
    allLocations: 'എല്ലാ സ്ഥലങ്ങളും',
    filterAiTag: 'AI ടാഗ്',
    allAiTags: 'എല്ലാ AI ടാഗുകളും',
    filterStatus: 'സ്ഥിതി',
    statusAll: 'എല്ലാ സ്ഥിതികളും',
    statusPublish: 'പ്രസിദ്ധീകരിച്ചു',
    statusDraft: 'ഡ്രാഫ്റ്റ്',
    statusScheduled: 'ഷെഡ്യൂൾ ചെയ്തു',
    clearFilters: 'ഫിൽട്ടറുകൾ മായ്ക്കുക',
    colSelect: 'തിരഞ്ഞെടുക്കുക',
    colImage: 'ചിത്രം',
    colCategory: 'വിഭാഗം',
    colTitle: 'തലക്കെട്ടും ഉള്ളടക്കവും',
    colType: 'തരവും ഭാഷയും',
    colWebUrl: 'വെബ് ലിങ്ക്',
    colDate: 'തീയതിയും സമയവും',
    colActions: 'നടപടികൾ',
    noRecords: 'പൊരുത്തപ്പെടുന്ന വെബ് ലേഖനങ്ങളൊന്നും കണ്ടെത്തിയില്ല.',
    bulkSelected: (n: number) => `${n} ലേഖനങ്ങൾ തിരഞ്ഞെടുത്തു`,
    bulkDelete: 'മറയ്ക്കുക',
    bulkClear: 'തിരഞ്ഞെടുപ്പ് മായ്ക്കുക',
    deleteSuccess: 'വെബ് ലേഖനങ്ങൾ വിജയകരമായി നീക്കം ചെയ്തു.',
    createSuccess: 'വെബ് ലേഖനം വിജയകരമായി സൃഷ്ടിച്ചു.',
    updateSuccess: 'വെബ് ലേഖനം വിജയകരമായി പുതുക്കി.',
    visitLink: 'ലിങ്ക് സന്ദർശിക്കുക',
  },
};

export default function WebArticlesPage() {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = translations[language as keyof typeof translations] || translations.en;

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDrawerOpen, setCreateDrawerOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [viewingPost, setViewingPost] = useState<any | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedAiTag, setSelectedAiTag] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Metadata dropdown options
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [postTypesList, setPostTypesList] = useState<string[]>([]);
  const [locationsList, setLocationsList] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);

  // Selection
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Snackbar feedback
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('success');
  const [toastOpen, setToastOpen] = useState<boolean>(false);

  const showToast = (msg: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  // Load articles & metadata
  const fetchData = async () => {
    setLoading(true);
    try {
      const [catData, typeData, locData, tagData, newsData] = await Promise.all([
        CategoryRepository.getCategories().catch(() => []),
        PostTypeRepository.getPostTypes().catch(() => []),
        LocationRepository.getLocations().catch(() => []),
        TagsRepository.getTags().catch(() => []),
        NewsRepository.getAllNews().catch(() => []),
      ]);

      if (Array.isArray(catData)) {
        setCategoriesList(catData.map((c: any) => c.englishName || c.name || c.category_name || '').filter(Boolean));
      }
      if (Array.isArray(typeData)) {
        setPostTypesList(typeData.map((t: any) => t.name || t.typename || '').filter(Boolean));
      }
      if (Array.isArray(locData)) {
        setLocationsList(locData.map((l: any) => l.state_name || l.name || '').filter(Boolean));
      }
      if (Array.isArray(tagData)) {
        setTagsList(tagData.map((tg: any) => tg.name || tg.tag_name || '').filter(Boolean));
      }

      if (Array.isArray(newsData)) {
        // Filter specifically for Web Articles (is_web_post === true or has web_post_url)
        const webArticles = newsData.filter((item: any) =>
          Boolean(item.is_web_post || item.isWebPost || item.isWebpost || item.web_post_url || item.webPostUrl || item.webUrl)
        );
        // Fallback: if no specific web articles tagged yet, show all news items with Web Articles view preset
        const finalItems = webArticles.length > 0 ? webArticles : newsData;
        setPosts(finalItems);
      }
    } catch (err: any) {
      console.error('Failed to load web articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtering logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const titleMatch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.content || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const catMatch = selectedCategory === 'All' ||
        (Array.isArray(post.categories) && post.categories.includes(selectedCategory)) ||
        (post.categoryName && post.categoryName.includes(selectedCategory));

      const typeMatch = selectedType === 'All' ||
        post.type === selectedType ||
        post.typename === selectedType;

      const locMatch = selectedLocation === 'All' ||
        (Array.isArray(post.location) && post.location.includes(selectedLocation)) ||
        post.state_name === selectedLocation;

      const tagMatch = selectedAiTag === 'All' ||
        (Array.isArray(post.tags) && post.tags.includes(selectedAiTag)) ||
        (Array.isArray(post.aiTags) && post.aiTags.includes(selectedAiTag));

      const statusMatch = selectedStatus === 'All' ||
        (selectedStatus === 'Published' && (post.status === 'Published' || post.status === 'publish')) ||
        (selectedStatus === 'Draft' && (post.status === 'Draft' || post.status === 'draft'));

      return titleMatch && catMatch && typeMatch && locMatch && tagMatch && statusMatch;
    });
  }, [posts, searchTerm, selectedCategory, selectedType, selectedLocation, selectedAiTag, selectedStatus]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, page]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPostIds(paginatedPosts.map((p) => p.id));
    } else {
      setSelectedPostIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeletePost = async (id: number) => {
    try {
      await NewsRepository.deleteNews(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      showToast(t.deleteSuccess, 'success');
    } catch (err: any) {
      console.error('Delete failed:', err);
      showToast('Failed to delete web article', 'error');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedPostIds.map((id) => NewsRepository.deleteNews(id)));
      setPosts((prev) => prev.filter((p) => !selectedPostIds.includes(p.id)));
      setSelectedPostIds([]);
      showToast(t.deleteSuccess, 'success');
    } catch (err: any) {
      console.error('Bulk delete failed:', err);
      showToast('Failed to delete selected articles', 'error');
    }
  };

  const handleCreatePost = async (data: CreateNewsFormData) => {
    try {
      await NewsRepository.createNews({
        ...data,
        is_web_post: true,
        isWebPost: true,
        web_post_url: data.webUrl || data.postUrl || '',
      } as any);
      showToast(t.createSuccess, 'success');
      setCreateDrawerOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Create failed:', err);
      showToast('Failed to create web article', 'error');
    }
  };

  const handleEditPost = async (data: CreateNewsFormData) => {
    if (!editingPost) return;
    try {
      await NewsRepository.updateNews(editingPost.id, {
        ...data,
        is_web_post: true,
        isWebPost: true,
        web_post_url: data.webUrl || data.postUrl || '',
      } as any);
      showToast(t.updateSuccess, 'success');
      setEditingPost(null);
      fetchData();
    } catch (err: any) {
      console.error('Update failed:', err);
      showToast('Failed to update web article', 'error');
    }
  };

  const isAllSelected = paginatedPosts.length > 0 && paginatedPosts.every((p) => selectedPostIds.includes(p.id));
  const isSomeSelected = paginatedPosts.some((p) => selectedPostIds.includes(p.id)) && !isAllSelected;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isDark ? '#110d29' : '#ffffff',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Sidebar */}
      <Sidebar activeHref="/web-articles" />

      {/* Main Container */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Header title={t.title} />

        <Box sx={{ pt: 2, px: 3, pb: 4, flex: 1, overflowY: 'auto' }}>
          {createDrawerOpen ? (
            <CreateNewsForm
              onClose={() => setCreateDrawerOpen(false)}
              onSubmit={handleCreatePost}
              isDark={isDark}
              language={language as any}
              initialData={{ isWebPost: true }}
            />
          ) : editingPost ? (
            <CreateNewsForm
              onClose={() => setEditingPost(null)}
              onSubmit={handleEditPost}
              isDark={isDark}
              language={language as any}
              initialData={{
                titleEn: editingPost.title || '',
                bodyEn: editingPost.content || '',
                categories: editingPost.categories || [],
                tags: editingPost.tags || [],
                location: editingPost.location || [],
                type: editingPost.type || 'Standard',
                imageUrl: editingPost.image || editingPost.imageUrl,
                isWebPost: true,
                webUrl: editingPost.web_post_url || editingPost.webUrl || editingPost.postUrl || '',
                postUrl: editingPost.web_post_url || editingPost.webUrl || editingPost.postUrl || '',
              }}
            />
          ) : viewingPost ? (
            <Box
              sx={{
                backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                borderRadius: '20px',
                p: 3,
              }}
            >
              <Button
                startIcon={<ArrowBack />}
                onClick={() => setViewingPost(null)}
                sx={{ mb: 2, color: isDark ? '#d0caeb' : '#5c548a' }}
              >
                Back to Articles
              </Button>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: isDark ? '#ffffff' : '#1c1445' }}>
                {viewingPost.title}
              </Typography>
              {(viewingPost.web_post_url || viewingPost.webUrl) && (
                <Box sx={{ mb: 2 }}>
                  <MuiLink
                    href={viewingPost.web_post_url || viewingPost.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#2563eb', textDecoration: 'none' }}
                  >
                    {t.visitLink} <OpenInNew fontSize="small" />
                  </MuiLink>
                </Box>
              )}
              <Typography variant="body1" sx={{ color: isDark ? '#d0caeb' : '#4b5563' }}>
                {stripHtml(viewingPost.content || '')}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Action Bar */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2.5,
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <WebIcon sx={{ fontSize: 28, color: '#2563eb' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445' }}>
                    {t.title}
                  </Typography>
                  <Chip
                    label={`${filteredPosts.length}`}
                    size="small"
                    sx={{
                      backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      fontWeight: 700,
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  startIcon={<PostAdd />}
                  onClick={() => setCreateDrawerOpen(true)}
                  sx={{
                    borderRadius: '12px',
                    px: 2.5,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: '#2563eb',
                    '&:hover': { backgroundColor: '#1d4ed8' },
                  }}
                >
                  {t.createBtn}
                </Button>
              </Box>

              {/* Filters Bar */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 3,
                  flexWrap: 'wrap',
                  p: 2,
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(38, 28, 86, 0.25)' : '#f8fafc',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                }}
              >
                {/* Search */}
                <TextField
                  size="small"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                  sx={{
                    minWidth: '220px',
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                    },
                  }}
                />

                {/* Category Filter */}
                <TextField
                  select
                  size="small"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{ minWidth: '150px' }}
                >
                  <MenuItem value="All">{t.allCategories}</MenuItem>
                  {categoriesList.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Clear Filters */}
                {(searchTerm || selectedCategory !== 'All' || selectedType !== 'All' || selectedStatus !== 'All') && (
                  <Button
                    size="small"
                    startIcon={<FilterListOff />}
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setSelectedType('All');
                      setSelectedStatus('All');
                    }}
                    sx={{ color: '#ef4444', textTransform: 'none' }}
                  >
                    {t.clearFilters}
                  </Button>
                )}
              </Box>

              {/* Bulk Action Bar */}
              <Collapse in={selectedPostIds.length > 0}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    px: 2.5,
                    mb: 2,
                    borderRadius: '12px',
                    backgroundColor: isDark ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.1)',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1e3a8a' }}>
                    {t.bulkSelected(selectedPostIds.length)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleBulkDelete}
                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                      {t.bulkDelete}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setSelectedPostIds([])}
                      sx={{ textTransform: 'none' }}
                    >
                      {t.bulkClear}
                    </Button>
                  </Box>
                </Box>
              </Collapse>

              {/* Data Table */}
              {loading ? (
                <Loader message="Loading web articles..." minHeight="300px" />
              ) : paginatedPosts.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 2,
                    borderRadius: '16px',
                    backgroundColor: isDark ? 'rgba(38, 28, 86, 0.2)' : '#f8fafc',
                    border: isDark ? '1px dashed rgba(255,255,255,0.1)' : '1px dashed rgba(0,0,0,0.1)',
                  }}
                >
                  <WebIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    {t.noRecords}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    backgroundColor: isDark ? 'rgba(38, 28, 86, 0.25)' : '#ffffff',
                  }}
                >
                  {/* Table Header */}
                  <Grid
                    container
                    sx={{
                      p: 1.5,
                      px: 2,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: isDark ? '#a5b4fc' : '#475569',
                      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                      backgroundColor: isDark ? 'rgba(38, 28, 86, 0.4)' : '#f1f5f9',
                      alignItems: 'center',
                    }}
                  >
                    <Grid item xs={0.5}>
                      <Checkbox
                        size="small"
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </Grid>
                    <Grid item xs={1.5}>
                      {t.colImage}
                    </Grid>
                    <Grid item xs={2}>
                      {t.colCategory}
                    </Grid>
                    <Grid item xs={3.5}>
                      {t.colTitle}
                    </Grid>
                    <Grid item xs={2}>
                      {t.colWebUrl}
                    </Grid>
                    <Grid item xs={1.5}>
                      {t.colDate}
                    </Grid>
                    <Grid item xs={1} textAlign="right">
                      {t.colActions}
                    </Grid>
                  </Grid>

                  {/* Table Rows */}
                  {paginatedPosts.map((post) => {
                    const isSelected = selectedPostIds.includes(post.id);
                    const webUrl = post.web_post_url || post.webUrl || post.postUrl || '';

                    return (
                      <Grid
                        container
                        key={post.id}
                        sx={{
                          p: 1.5,
                          px: 2,
                          alignItems: 'center',
                          borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(37, 99, 235, 0.15)'
                              : 'rgba(37, 99, 235, 0.05)'
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                          },
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <Grid item xs={0.5}>
                          <Checkbox
                            size="small"
                            checked={isSelected}
                            onChange={() => handleSelectOne(post.id)}
                          />
                        </Grid>
                        <Grid item xs={1.5}>
                          <Box
                            component="img"
                            src={post.image || post.imageUrl || '/bigtv_logo.png'}
                            alt={post.title}
                            sx={{
                              width: 60,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#ffffff' : '#1e293b' }}>
                            {Array.isArray(post.categories) ? post.categories.join(', ') : post.categoryName || 'General'}
                          </Typography>
                        </Grid>
                        <Grid item xs={3.5}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: isDark ? '#ffffff' : '#0f172a',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {post.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          {webUrl ? (
                            <MuiLink
                              href={webUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                fontSize: '0.8rem',
                                color: '#2563eb',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              Link <OpenInNew sx={{ fontSize: 14 }} />
                            </MuiLink>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              —
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={1.5}>
                          <Typography variant="caption" color="text.secondary">
                            {post.date || post.createdAt || 'Recent'}
                          </Typography>
                        </Grid>
                        <Grid item xs={1} textAlign="right">
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => setViewingPost(post)}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => setEditingPost(post)}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDeletePost(post.id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    );
                  })}

                  {/* Pagination Footer */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        color="primary"
                      />
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
