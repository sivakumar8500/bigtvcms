'use client';

import React from 'react';
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
} from '@mui/material';
import {
  AddCircleOutline,
  Category as CategoryIcon,
  LocationOn,
  People,
  Settings,
  Movie,
  Language as LanguageIcon,
  Search,
  Visibility,
  Edit,
  Delete,
  DeleteForever,
  AutoAwesome,
  Add,
  ArrowBack,
  Article,
  PostAdd,
  FilterListOff,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
  IndeterminateCheckBox,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useUserStore } from '@/core/storage/user-store';
import { CreateNewsForm, CreateNewsFormData } from '@/modules/dashboard/components/CreateNewsForm';
import { CategoryRepository } from '@/modules/category/repositories/category.repository';
import { PostTypeRepository } from '@/modules/post-types/repositories/post-type.repository';
import { LocationRepository } from '@/modules/location/repositories/location.repository';
import { TagsRepository } from '@/modules/tags/repositories/tags.repository';
import { NewsRepository } from '@/modules/news/repositories/news.repository';
import { CreateNewsPostDto } from '@/modules/news/dto/news.dto';
import { Loader } from '@/shared/components/Loader';
import { stripAllTagsExceptLinkTags, stripHtml } from '@/shared/utils/html.utils';
import { extractBulletPoints, formatBulletPostContentAndBullets, formatDisplayContent } from '@/shared/utils/bullet.utils';
import { formatLinks, formatLinksAndContent } from '@/shared/utils/link.utils';

// Dashboard component translations mapped to store state keys
const translations = {
  en: {
    title: "BigTV Newsroom",
    searchPlaceholder: "Search News Title...",
    allCategories: "All Categories",
    allTypes: "All Types",
    // Date filter
    filterDate: "Date Range",
    dateAll: "All Dates",
    dateToday: "Today",
    dateYesterday: "Yesterday",
    dateLast3: "Last 3 Days",
    dateLast7: "Last 7 Days",
    dateLast15: "Last 15 Days",
    dateLast30: "Last 30 Days",
    dateLastMonth2026: "Last Month 2026",
    dateBefore2026: "Before 2026",
    // Location filter
    filterLocation: "Location",
    allLocations: "All Locations",
    // AI Tag filter
    filterAiTag: "AI Tag",
    allAiTags: "All AI Tags",
    // Status filter
    filterStatus: "Status",
    statusAll: "All Status",
    statusPublish: "Published",
    statusDraft: "Draft",
    statusScheduled: "Scheduled",
    // Clear
    clearFilters: "Clear Filters",
    colSelect: "Select",
    colImage: "Image",
    colCategory: "Category",
    colTitle: "Title & Content",
    colType: "Type & Lang",
    colDate: "Date & Time",
    colActions: "Actions",
    noRecords: "No matching news records found.",
    menuCreate: "Create News",
    menuCategories: "Categories",
    menuLocations: "Locations",
    menuCreators: "Creators",
    menuPostTypes: "Post Types",
    menuLanguages: "Languages",
    menuAiTags: "AiTags",
    menuReels: "Reels",
    menuSettings: "Settings",
    bulkSelected: (n: number) => `${n} post${n !== 1 ? 's' : ''} selected`,
    bulkDelete: "Delete",
    bulkTrash: "Move to Trash",
    bulkClear: "Clear Selection",
    deleteSuccess: "Posts deleted successfully.",
    trashSuccess: "Posts moved to trash.",
    createSuccess: "News post created successfully.",
    updateSuccess: "News post updated successfully.",
  },
  te: {
    // Date filter
    filterDate: "తేదీ పరిధి",
    dateAll: "అన్ని తేదీలు",
    dateToday: "ఈరోజు",
    dateYesterday: "నిన్న",
    dateLast3: "చివరి 3 రోజులు",
    dateLast7: "చివరి 7 రోజులు",
    dateLast15: "చివరి 15 రోజులు",
    dateLast30: "చివరి 30 రోజులు",
    dateLastMonth2026: "గత నెల 2026",
    dateBefore2026: "2026 కంటే ముందు",
    filterLocation: "స్థానం",
    allLocations: "అన్ని స్థానాలు",
    filterAiTag: "AI ట్యాగ్",
    allAiTags: "అన్ని AI ట్యాగులు",
    filterStatus: "స్థితి",
    statusAll: "అన్ని స్థితులు",
    statusPublish: "ప్రచురించబడింది",
    statusDraft: "ముసాయిదా",
    statusScheduled: "షెడ్యూల్ చేయబడింది",
    clearFilters: "ఫిల్టర్‌లు తీసివేయి",
    title: "బిగ్‌టివి న్యూస్‌రూమ్ (BigTV Newsroom)",
    searchPlaceholder: "వార్తల శీర్షికను శోధించండి...",
    allCategories: "అన్ని విభాగాలు",
    allTypes: "అన్ని రకాలు",
    colSelect: "ఎంచుకోండి",
    colImage: "చిత్రం (Image)",
    colCategory: "విభాగం (Category)",
    colTitle: "శీర్షిక & కంటెంట్",
    colType: "రకం & భాష",
    colDate: "తేదీ & సమయం",
    colActions: "చర్యలు",
    noRecords: "సరిపోలే వార్తల రికార్డులు కనుగొనబడలేదు.",
    menuCreate: "వార్తలను సృష్టించండి",
    menuCategories: "విభాగాలు",
    menuLocations: "ప్రాంతాలు",
    menuCreators: "సృష్టికర్తలు",
    menuPostTypes: "పోస్ట్ రకాలు",
    menuLanguages: "భాషలు",
    menuAiTags: "AiTags",
    menuReels: "రీల్స్",
    menuSettings: "సెట్టింగులు",
    bulkSelected: (n: number) => `${n} పోస్ట్${n !== 1 ? 'లు' : ''} ఎంచుకోబడ్డాయి`,
    bulkDelete: "తొలగించు",
    bulkTrash: "చెత్తకు తరలించు",
    bulkClear: "ఎంపిక తీసివేయి",
    deleteSuccess: "పోస్టులు విజయవంతంగా తొలగించబడ్డాయి.",
    trashSuccess: "పోస్టులు చెత్తకు తరలించబడ్డాయి.",
    createSuccess: "వార్తా పోస్ట్ విజయవంతంగా సృష్టించబడింది.",
    updateSuccess: "వార్తా పోస్ట్ విజయవంతంగా నవీకరించబడింది.",
  },
  hi: {
    filterDate: "दिनांक सीमा",
    dateAll: "सभी तिथियां",
    dateToday: "आज",
    dateYesterday: "कल",
    dateLast3: "पिछले 3 दिन",
    dateLast7: "पिछले 7 दिन",
    dateLast15: "पिछले 15 दिन",
    dateLast30: "पिछले 30 दिन",
    dateLastMonth2026: "पिछला महीना 2026",
    dateBefore2026: "2026 से पहले",
    filterLocation: "स्थान",
    allLocations: "सभी स्थान",
    filterAiTag: "AI टैग",
    allAiTags: "सभी AI टैग",
    filterStatus: "स्थिति",
    statusAll: "सभी स्थिति",
    statusPublish: "प्रकाशित",
    statusDraft: "ड्राफ्ट",
    statusScheduled: "निर्धारित",
    clearFilters: "फ़िल्टर हटाएं",
    title: "बिगटीवी न्यूज़रूम (BigTV Newsroom)",
    searchPlaceholder: "समाचार शीर्षक खोजें...",
    allCategories: "सभी श्रेणियां",
    allTypes: "सभी प्रकार",
    colSelect: "चुनें",
    colImage: "चित्र (Image)",
    colCategory: "श्रेणी (Category)",
    colTitle: "शीर्षक और सामग्री",
    colType: "प्रकार और भाषा",
    colDate: "दिनांक और समय",
    colActions: "कार्रवाई",
    noRecords: "कोई मिलान समाचार रिकॉर्ड नहीं मिला।",
    menuCreate: "समाचार बनाएं",
    menuCategories: "श्रेणियां",
    menuLocations: "स्थान",
    menuCreators: "निर्माता",
    menuPostTypes: "पोस्ट के प्रकार",
    menuLanguages: "भाषाएँ",
    menuAiTags: "AiTags",
    menuReels: "रील्स",
    menuSettings: "सेटिंग्स",
    bulkSelected: (n: number) => `${n} पोस्ट चुनी गई${n !== 1 ? 'ं' : ''}`,
    bulkDelete: "हटाएं",
    bulkTrash: "ट्रैश में भेजें",
    bulkClear: "चयन हटाएं",
    deleteSuccess: "पोस्ट सफलतापूर्वक हटाई गई।",
    trashSuccess: "पोस्ट ट्रैश में भेजी गई।",
    createSuccess: "समाचार पोस्ट सफलतापूर्वक बनाई गई।",
    updateSuccess: "समाचार पोस्ट सफलतापूर्वक अद्यतन की गई।",
  },
  ml: {
    filterDate: "തീയതി ശ്രേണി",
    dateAll: "എല്ലാ തീയതികളും",
    dateToday: "ഇന്ന്",
    dateYesterday: "ഇന്നലെ",
    dateLast3: "കഴിഞ്ഞ 3 ദിവസം",
    dateLast7: "കഴിഞ്ഞ 7 ദിവസം",
    dateLast15: "കഴിഞ്ഞ 15 ദിവസം",
    dateLast30: "കഴിഞ്ഞ 30 ദിവസം",
    dateLastMonth2026: "കഴിഞ്ഞ മാസം 2026",
    dateBefore2026: "2026-ന് മുമ്പ്",
    filterLocation: "സ്ഥലം",
    allLocations: "എല്ലാ സ്ഥലങ്ങളും",
    filterAiTag: "AI ടാഗ്",
    allAiTags: "എല്ലാ AI ടാഗുകളും",
    filterStatus: "നില",
    statusAll: "എല്ലാ നിലകളും",
    statusPublish: "പ്രസിദ്ധീകരിച്ചു",
    statusDraft: "ഡ്രാഫ്റ്റ്",
    statusScheduled: "നിശ്ചയിച്ചു",
    clearFilters: "ഫിൽട്ടറുകൾ മായ്ക്കുക",
    title: "ബിഗ് ടിവി ന്യൂസ് റൂം (BigTV Newsroom)",
    searchPlaceholder: "വാർത്താ തലക്കെട്ട് തിരയുക...",
    allCategories: "എല്ലാ വിഭാഗങ്ങളും",
    allTypes: "എല്ലാ തരങ്ങളും",
    colSelect: "തിരഞ്ഞെടുക്കുക",
    colImage: "ചിത്രം (Image)",
    colCategory: "വിഭാഗം (Category)",
    colTitle: "തലക്കെട്ടും ഉള്ളടക്കവും",
    colType: "തരവും ഭാഷയും",
    colDate: "തീയതിയും സമയവും",
    colActions: "നടപടികൾ",
    noRecords: "പൊരുത്തപ്പെടുന്ന വാർത്തകളൊന്നും കണ്ടെത്തിയില്ല.",
    menuCreate: "വാർത്ത സൃഷ്ടിക്കുക",
    menuCategories: "വിഭാഗങ്ങൾ",
    menuLocations: "സ്ഥലങ്ങൾ",
    menuCreators: "സ്രഷ്‌ടാക്കൾ",
    menuPostTypes: "പോസ്റ്റ് തരങ്ങൾ",
    menuLanguages: "ഭാഷകൾ",
    menuAiTags: "AiTags",
    menuReels: "റീലുകൾ",
    menuSettings: "ക്രമീകരണങ്ങൾ",
    bulkSelected: (n: number) => `${n} പോസ്റ്റ്${n !== 1 ? 'കൾ' : ''} തിരഞ്ഞെടുത്തു`,
    bulkDelete: "ഇല്ലാതാക്കുക",
    bulkTrash: "ട്രാഷിലേക്ക് മാറ്റുക",
    bulkClear: "തിരഞ്ഞെടുപ്പ് മായ്ക്കുക",
    deleteSuccess: "പോസ്റ്റുകൾ വിജയകരമായി ഇല്ലാതാക്കി.",
    trashSuccess: "പോസ്റ്റുകൾ ട്രാഷിലേക്ക് മാറ്റി.",
    createSuccess: "വാർത്താ പോസ്റ്റ് വിജയകരമായി സൃഷ്ടിച്ചു.",
    updateSuccess: "വാർത്താ പോസ്റ്റ് വിജയകരമായി പുതുക്കി.",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const { user } = useUserStore();
  const t = translations[language] || translations.en;
  
  const isAdmin = user?.role === 'admin';

  const isDark = mode === 'dark';

  // Side menu items
  const menuItems = [
    { text: t.menuCreate, icon: <AddCircleOutline />, active: true },
    { text: t.menuReels, icon: <Movie />, action: () => router.push('/reels') },
    { text: t.menuCategories, icon: <CategoryIcon />, action: () => router.push('/categories') },
    { text: t.menuLocations, icon: <LocationOn />, action: () => router.push('/locations') },
    { text: t.menuCreators, icon: <People />, action: () => router.push('/creators') },
    { text: t.menuPostTypes, icon: <Article />, action: () => router.push('/post-types') },
    { text: t.menuLanguages, icon: <LanguageIcon />, action: () => router.push('/languages') },
    { text: t.menuAiTags, icon: <AutoAwesome />, action: () => router.push('/aitags') },
    { text: t.menuSettings, icon: <Settings />, action: () => router.push('/settings') },
  ];

  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [createDrawerOpen, setCreateDrawerOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<null | any>(null);
  const [viewingPost, setViewingPost] = React.useState<null | any>(null);

  // Fetch full post detail on edit to ensure aitag_ids, category_ids, location_ids, language_id and all fields are loaded
  React.useEffect(() => {
    if (editingPost && editingPost.id) {
      NewsRepository.getById(editingPost.id)
        .then((dto: any) => {
          if (dto && dto.id === editingPost.id) {
            const fetchedAitagIds = dto.aitag_ids || dto.aitagIds || [];
            const fetchedCategoryIds = dto.category_ids || dto.categoryIds || dto.category_id || [];
            const fetchedLocationIds = dto.location_ids || dto.locationIds || dto.location_id || [];
            const fetchedCategories = dto.categoryName || dto.categories || fetchedCategoryIds;
            const fetchedLocation = dto.location || dto.state_name || fetchedLocationIds;

            setEditingPost((prev: any) => {
              if (!prev || prev.id !== dto.id) return prev;
              const fetchedLangId = dto.language_id ?? dto.languageId ?? prev?.language_id ?? 1;
              const fetchedLangCode = dto.language_code || (fetchedLangId === 2 ? 'te' : fetchedLangId === 3 ? 'hi' : fetchedLangId === 4 ? 'ml' : 'en');
              return {
                ...prev,
                ...dto,
                category_ids: fetchedCategoryIds,
                categoryIds: fetchedCategoryIds,
                location_ids: fetchedLocationIds,
                locationIds: fetchedLocationIds,
                aitag_ids: fetchedAitagIds,
                aitagIds: fetchedAitagIds,
                aiTags: fetchedAitagIds,
                tags: prev.tags?.length ? prev.tags : fetchedAitagIds,
                categories: Array.isArray(fetchedCategories) && fetchedCategories.length > 0 ? fetchedCategories : (fetchedCategoryIds.length > 0 ? fetchedCategoryIds : prev.categories),
                location: fetchedLocation || prev.location,
                language_id: fetchedLangId,
                language_code: fetchedLangCode,
                languageId: fetchedLangId,
                notificationTitle: dto.notificationtitle || dto.notificationTitle || prev.notificationTitle,
                imageTitle: dto.imagetitel || dto.imageTitle || prev.imageTitle,
                is_web_post: Boolean((dto as any).is_web_post || (dto as any).isWebPost || (dto as any).isWebpost || prev?.is_web_post || prev?.isWebPost),
                isWebPost: Boolean((dto as any).is_web_post || (dto as any).isWebPost || (dto as any).isWebpost || prev?.is_web_post || prev?.isWebPost),
                web_post_url: (dto as any).web_post_url || (dto as any).webPostUrl || (dto as any).web_url || (dto as any).webUrl || (dto as any).postUrl || (dto as any).post_url || prev?.web_post_url || prev?.webPostUrl || prev?.postUrl || '',
                webUrl: (dto as any).web_post_url || (dto as any).webPostUrl || (dto as any).web_url || (dto as any).webUrl || (dto as any).postUrl || (dto as any).post_url || prev?.web_post_url || prev?.webPostUrl || prev?.postUrl || '',
                postUrl: (dto as any).web_post_url || (dto as any).webPostUrl || (dto as any).web_url || (dto as any).webUrl || (dto as any).postUrl || (dto as any).post_url || prev?.web_post_url || prev?.webPostUrl || prev?.postUrl || '',
                is_sticky: dto.is_sticky ?? dto.isSticky ?? prev.is_sticky ?? prev.isSticky,
                type: dto.typename || dto.type || prev.type,
                subType: dto.subType || dto.sub_type || prev.subType || prev.sub_type || '',
                sub_type: dto.subType || dto.sub_type || prev.subType || prev.sub_type || '',
                bulletPoints: dto.bulletPoints || dto.bullet_points || dto.bullets || prev.bulletPoints || prev.bullet_points || prev.bullets || [],
                bullet_points: dto.bulletPoints || dto.bullet_points || dto.bullets || prev.bulletPoints || prev.bullet_points || prev.bullets || [],
                video_url: dto.video_url || dto.videoUrl || prev.video_url || prev.videoUrl,
                video_platform: dto.video_platform || dto.videoSource || prev.video_platform || prev.videoSource,
              };
            });
          }
        })
        .catch(() => {});
    }
  }, [editingPost?.id]);

  // Multi-selection states
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' }>(
    { open: false, message: '', severity: 'success' }
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedType, setSelectedType] = React.useState('All');
  const [selectedDateRange, setSelectedDateRange] = React.useState('All');
  const [selectedLocation, setSelectedLocation] = React.useState('All');
  const [selectedAiTag, setSelectedAiTag] = React.useState('All');
  const [selectedStatus, setSelectedStatus] = React.useState('All');
  const [page, setPage] = React.useState(1);
  const [serverTotalPages, setServerTotalPages] = React.useState(1);
  const recordsPerPage = 100;

  // API Data States
  const [apiCategories, setApiCategories] = React.useState<string[]>([]);
  const [apiPostTypes, setApiPostTypes] = React.useState<string[]>([]);
  const [apiLocations, setApiLocations] = React.useState<string[]>([]);
  const [apiAiTags, setApiAiTags] = React.useState<string[]>([]);

  // Fetch News Posts for a specific page (100 items per API batch)
  const fetchNewsPosts = React.useCallback((pageNumber: number = 1) => {
    setLoading(true);
    const skip = Math.max(0, pageNumber - 1) * 100;
    NewsRepository.getAll(skip, 100)
      .then((dtos) => {
        if (Array.isArray(dtos)) {
          const langMap: Record<number, string> = {
            1: 'English',
            2: 'Telugu',
            3: 'Hindi',
            4: 'Malayalam',
          };
          const mapped = dtos.map((item: any) => {
            const postLang = item.language_id && langMap[item.language_id]
              ? langMap[item.language_id]
              : (language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : language === 'ml' ? 'Malayalam' : 'English');

            // Extract categories properly (string, array of strings, or array of objects)
            let catList: string[] = [];
            const rawCat = item.categoryName || item.category_name || item.categories || item.category;
            if (Array.isArray(rawCat)) {
              catList = rawCat.map((c: any) => typeof c === 'object' ? (c.name || c.englishName || c.categoryName || String(c)) : String(c)).filter(Boolean);
            } else if (typeof rawCat === 'string' && rawCat.trim()) {
              catList = [rawCat.trim()];
            }
            if (catList.length === 0) catList = ['General'];

            // Extract location name
            const locName = item.state_name || item.location || item.stateName || item.statename || item.cityName || item.locationName || '';

            // Extract AI tags / tags
            const rawTags = item.aiTags || item.aitag_names || item.aitag_ids || item.aitagIds || item.aitags || item.tags || [];
            let tagList: string[] = [];
            if (Array.isArray(rawTags)) {
              tagList = rawTags.map((t: any) => typeof t === 'object' ? (t.name || String(t)) : String(t)).filter(Boolean);
            } else if (typeof rawTags === 'string' && rawTags.trim()) {
              tagList = [rawTags.trim()];
            }

            return {
              id: item.id || Math.floor(Math.random() * 100000),
              title: item.title || 'Untitled',
              content: item.content || '',
              categories: catList,
              language: postLang,
              type: item.post_type || item.type || 'Standard',
              views: item.totalViews || 0,
              likes: item.totalLikes || 0,
              image: item.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400',
              date: item.schedule ? String(item.schedule).slice(0, 10) : (item.createdAt ? String(item.createdAt).slice(0, 10) : new Date().toISOString().slice(0, 10)),
              time: item.schedule && String(item.schedule).includes('T') ? String(item.schedule).split('T')[1].slice(0, 5) : '12:00 PM',
              location: locName,
              aitag_ids: tagList,
              aitagIds: tagList,
              aiTags: tagList,
              tags: tagList,
              status: item.status || 'publish',
              notificationTitle: item.notificationtitle || item.title || '',
              imageTitle: item.imagetitel || item.title || '',
            };
          });

          // Sort mapped API items by ID descending so newest posts appear first
          mapped.sort((a: any, b: any) => b.id - a.id);
          setPosts(mapped);

          if (dtos.length === 100) {
            setServerTotalPages((prev) => Math.max(prev, pageNumber + 1));
          } else {
            setServerTotalPages(pageNumber);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch news posts:', err))
      .finally(() => {
        setLoading(false);
      });
  }, [language]);

  // Fetch fresh API data matching current language
  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setApiCategories([]);
    setApiPostTypes([]);
    setApiLocations([]);
    setApiAiTags([]);
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedAiTag('All');
    setSelectedType('All');

    // Helper for language-specific field extraction from any DTO
    const extractName = (item: any, prefix: string) => {
      if (!item) return '';

      // 1. Check translations dictionary (e.g., aitagnameTranslations, categoryNameTranslations, statenameTranslations, translations)
      const transObj =
        item[`${prefix}nameTranslations`] ||
        item[`${prefix}NameTranslations`] ||
        item[`${prefix}Translations`] ||
        item.translations ||
        item.nameTranslations;

      if (transObj && typeof transObj === 'object') {
        const val = transObj[language] || transObj.en || transObj.te || transObj.hi || transObj.ml;
        if (typeof val === 'string' && val.trim()) return val.trim();
      }

      // 2. Check flat language fields (e.g. tagEn, tagTe, stateTe, nameEn)
      const langUpper = language.charAt(0).toUpperCase() + language.slice(1);
      const flatVal = item[`${prefix}${langUpper}`] || item[`name${langUpper}`] || item[`state${langUpper}`];
      if (typeof flatVal === 'string' && flatVal.trim()) return flatVal.trim();

      // 3. Check direct name fields (e.g. aitagname, categoryName, stateName, typename, name)
      const directVal =
        item[`${prefix}name`] ||
        item[`${prefix}Name`] ||
        item.typename ||
        item.name ||
        '';

      return typeof directVal === 'string' ? directVal.trim() : String(directVal || '');
    };

    // 1. Fetch Categories API
    CategoryRepository.getAll(language)
      .then((dtos) => {
        if (isMounted && Array.isArray(dtos)) {
          const names = Array.from(new Set(dtos.map((c: any) => extractName(c, 'category')).filter(Boolean)));
          setApiCategories(names);
        }
      })
      .catch(() => {});

    // 2. Fetch Post Types API
    PostTypeRepository.getAll(0, 100)
      .then((dtos) => {
        if (isMounted && Array.isArray(dtos)) {
          const names = Array.from(new Set(dtos.map((pt: any) => pt.typename || pt.name).filter(Boolean)));
          setApiPostTypes(names);
        }
      })
      .catch(() => {});

    // 3. Fetch Locations API
    LocationRepository.getAll(language)
      .then((dtos) => {
        if (isMounted && Array.isArray(dtos)) {
          const names = Array.from(new Set(dtos.map((l: any) => extractName(l, 'state') || extractName(l, 'location')).filter(Boolean)));
          setApiLocations(names);
        }
      })
      .catch(() => {});

    // 4. Fetch AI Tags API
    TagsRepository.getAll(language)
      .then((dtos) => {
        if (isMounted && Array.isArray(dtos)) {
          const names = Array.from(new Set(dtos.map((t: any) => extractName(t, 'aitag') || extractName(t, 'tag')).filter(Boolean)));
          setApiAiTags(names);
        }
      })
      .catch(() => {});

    // 5. Fetch News Posts API
    fetchNewsPosts(1);

    return () => {
      isMounted = false;
    };
  }, [language, fetchNewsPosts]);

  // Date helper — returns YYYY-MM-DD string for offset days from today
  const dateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  };
  const todayStr = new Date().toISOString().slice(0, 10);

  // Derive clean, single-language unique options for each dropdown (NO duplicates)
  const categoryOptions = React.useMemo(() => {
    if (apiCategories.length > 0) {
      return Array.from(new Set(apiCategories));
    }
    const defaultsByLang: Record<string, string[]> = {
      te: ['ఎంటర్టైన్మెంట్', 'స్పోర్ట్స్', 'నేషనల్', 'ఆంధ్రప్రదేశ్', 'తెలంగాణ', 'సాధారణం'],
      hi: ['मनोरंजन', 'खेल', 'राष्ट्रीय', 'आंध्र प्रदेश', 'तेलंगाना', 'सामान्य'],
      ml: ['വിനോദം', 'കായികം', 'ദേശീയം', 'ആന്ധ്രാപ്രദേശ്', 'തെലങ്കാന', 'പൊതുവായത്'],
      en: ['Entertainment', 'Sports', 'National', 'Andhra Pradesh', 'Telangana', 'General', 'Business'],
    };
    return defaultsByLang[language] || defaultsByLang.en;
  }, [apiCategories, language]);

  const postTypeOptions = React.useMemo(() => {
    if (apiPostTypes.length > 0) {
      return Array.from(new Set(apiPostTypes));
    }
    return ['Standard', 'Video', 'Reel', 'Podcast'];
  }, [apiPostTypes]);

  const locationOptions = React.useMemo(() => {
    if (apiLocations.length > 0) {
      return Array.from(new Set(apiLocations));
    }
    const defaultsByLang: Record<string, string[]> = {
      te: ['తెలంగాణ', 'ఆంధ్రప్రదేశ్'],
      hi: ['तेलंगाना', 'आंध्र प्रदेश'],
      ml: ['തെലങ്കാന', 'ആന്ധ്രാപ്രദേശ്'],
      en: ['Telangana', 'Andhra Pradesh'],
    };
    return defaultsByLang[language] || defaultsByLang.en;
  }, [apiLocations, language]);

  const aiTagOptions = React.useMemo(() => {
    if (apiAiTags.length > 0) {
      return Array.from(new Set(apiAiTags));
    }
    const defaultsByLang: Record<string, string[]> = {
      te: ['ట్రెండింగ్', 'బ్రేకింగ్', 'రాజకీయాలు', 'సినిమా', 'సాంకేతికత', 'ఆరోగ్యం'],
      hi: ['ट्रेंडिंग', 'ब्रेकिंग', 'राजनीति', 'सिनेमा', 'तकनीक', 'स्वास्थ्य'],
      ml: ['ട്രെൻഡിംഗ്', 'ബ്രേക്കിംഗ്', 'രാഷ്ട്രീയം', 'സിനിമ', 'സാങ്കേതികവിദ്യ', 'ആരോഗ്യം'],
      en: ['Trending', 'Breaking', 'Politics', 'Cinema', 'Technology', 'Health'],
    };
    return defaultsByLang[language] || defaultsByLang.en;
  }, [apiAiTags, language]);

  // Filter logic
  const filteredData = React.useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const cleanTitle = (post.title || '').toLowerCase();
      const cleanContent = stripHtml(post.content || '').toLowerCase();
      const rawContent = (post.content || '').toLowerCase();
      const idStr = String(post.id || '');
      const catStr = (post.categories || []).join(' ').toLowerCase();

      const matchesSearch =
        !q ||
        cleanTitle.includes(q) ||
        cleanContent.includes(q) ||
        rawContent.includes(q) ||
        idStr.includes(q) ||
        catStr.includes(q);

      const matchesCategory =
        selectedCategory === 'All' ||
        (post.categories || []).some((cat: string) => {
          const catStrVal = String(cat).toLowerCase().trim();
          const selStrVal = selectedCategory.toLowerCase().trim();
          return catStrVal === selStrVal || catStrVal.includes(selStrVal) || selStrVal.includes(catStrVal);
        });

      const matchesType =
        selectedType === 'All' ||
        (post.type || '').toLowerCase().includes(selectedType.toLowerCase()) ||
        selectedType.toLowerCase().includes((post.type || '').toLowerCase());

      // Location filter
      const matchesLocation =
        selectedLocation === 'All' ||
        !post.location ||
        String(post.location).toLowerCase().includes(selectedLocation.toLowerCase()) ||
        selectedLocation.toLowerCase().includes(String(post.location).toLowerCase());

      // AI Tag filter
      const matchesAiTag =
        selectedAiTag === 'All' ||
        ((post as any).aiTags ?? []).length === 0 ||
        ((post as any).aiTags ?? []).some((tag: any) =>
          String(tag).toLowerCase().includes(selectedAiTag.toLowerCase()) ||
          selectedAiTag.toLowerCase().includes(String(tag).toLowerCase())
        );

      // Status filter
      const postStatus = (post as any).status ?? 'publish';
      const matchesStatus =
        selectedStatus === 'All' ||
        postStatus.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesType &&
             matchesLocation && matchesAiTag && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedType, selectedLocation, selectedAiTag, selectedStatus, posts]);

  // Reset page index on any filter change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedType, selectedDateRange,
      selectedLocation, selectedAiTag, selectedStatus]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedDateRange('All');
    setSelectedLocation('All');
    setSelectedAiTag('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' ||
    selectedType !== 'All' || selectedDateRange !== 'All' || selectedLocation !== 'All' ||
    selectedAiTag !== 'All' || selectedStatus !== 'All';
  
  // Calculate total pages and paginated data
  const totalPages = Math.max(1, serverTotalPages);
  const paginatedData = React.useMemo(() => {
    return filteredData;
  }, [filteredData]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchNewsPosts(value);
  };

  // ── Selection helpers ──
  const isAllPageSelected =
    paginatedData.length > 0 && paginatedData.every((p) => selectedIds.has(p.id));
  const isSomePageSelected =
    paginatedData.some((p) => selectedIds.has(p.id)) && !isAllPageSelected;

  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllPageSelected) {
        paginatedData.forEach((p) => next.delete(p.id));
      } else {
        paginatedData.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedIds);
    for (const id of idsToDelete) {
      try {
        await NewsRepository.delete(id);
      } catch (err) {}
    }
    setPosts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    setSnackbar({ open: true, message: t.deleteSuccess, severity: 'success' });
  };

  const handleBulkTrash = async () => {
    const idsToTrash = Array.from(selectedIds);
    for (const id of idsToTrash) {
      try {
        await NewsRepository.update(id, { trash: true });
      } catch (err) {}
    }
    setPosts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
    setSnackbar({ open: true, message: t.trashSuccess, severity: 'success' });
  };

  const handleSingleDelete = async (id: number) => {
    try {
      await NewsRepository.delete(id);
    } catch (err) {}
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setSnackbar({ open: true, message: t.deleteSuccess, severity: 'success' });
  };

  const categoryTeluguMap: Record<string, string> = {
    'Entertainment': 'ఎంటర్టైన్మెంట్',
    'General': 'సాధారణం',
    'Cinema': 'సినిమా',
    'Sports': 'స్పోర్ట్స్',
    'National': 'నేషనల్',
    'Andhra Pradesh': 'ఆంధ్రప్రదేశ్',
    'Telangana': 'తెలంగాణ',
    'Business': 'బిజినిస్',
  };

  const resolvePostFields = (data: CreateNewsFormData) => {
    const mappedCategories = data.categories.map((catKey) => categoryTeluguMap[catKey] || catKey);
    const rawTitle =
      (language === 'te' && data.titleTe) ||
      (language === 'hi' && data.titleHi) ||
      (language === 'ml' && data.titleMl) ||
      data.titleEn || data.titleTe || data.titleHi || data.titleMl || 'Untitled News';
    const rawContent =
      (language === 'te' && data.bodyTe) ||
      (language === 'hi' && data.bodyHi) ||
      (language === 'ml' && data.bodyMl) ||
      data.bodyEn || data.bodyTe || data.bodyHi || data.bodyMl || '';

    const resolvedTitle = stripHtml(rawTitle);
    const resolvedContent = rawContent ? rawContent.trim() : '';
    return { mappedCategories, resolvedTitle, resolvedContent };
  };

  const formatScheduleToISO = (publishMode?: string, scheduleTime?: string): string => {
    const now = new Date();
    if (publishMode === 'schedule' && scheduleTime) {
      if (scheduleTime.includes('T') || scheduleTime.includes('Z')) {
        return scheduleTime;
      }
      const isPM = /pm/i.test(scheduleTime);
      const isAM = /am/i.test(scheduleTime);
      const cleanTime = scheduleTime.replace(/[^\d:]/g, '');
      const parts = cleanTime.split(':');
      if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;
        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
        const scheduledDate = new Date(now);
        scheduledDate.setHours(hours, minutes, 0, 0);
        return scheduledDate.toISOString();
      }
    }
    return now.toISOString();
  };

  const handleCreatePost = async (data: CreateNewsFormData) => {
    const { mappedCategories, resolvedTitle, resolvedContent } = resolvePostFields(data);
    const todayISO = new Date().toISOString();
    let resolvedType = data.type || 'Standed';
    let resolvedSubType = (data as any).subType || '';
    if (resolvedType.toLowerCase() === 'bulletpost' || resolvedType.toLowerCase() === 'bullet post') {
      resolvedType = 'Standed';
      resolvedSubType = 'BulletPost';
    } else if (resolvedType.toLowerCase() === 'standardlink' || resolvedType.toLowerCase() === 'standard link') {
      resolvedType = 'Standed';
      resolvedSubType = 'StandardLink';
    } else if (
      resolvedType === 'BigBlackStandard' ||
      resolvedType === 'BigBlackStanded' ||
      resolvedType.toLowerCase() === 'bigblackstandard' ||
      resolvedType.toLowerCase() === 'bigblackstanded' ||
      resolvedType.toLowerCase() === 'bigblack standard' ||
      resolvedType.toLowerCase() === 'big black standard' ||
      resolvedSubType === 'BigBlackStandard' ||
      resolvedSubType === 'BigBlackStanded'
    ) {
      resolvedType = 'Standed';
      resolvedSubType = 'BigBlackStandard';
    } else if (resolvedType.toLowerCase() === 'video') {
      resolvedType = 'Video';
      resolvedSubType = '';
    } else if (
      resolvedType.toLowerCase() === 'imagead' ||
      resolvedType.toLowerCase() === 'image ad' ||
      resolvedSubType.toLowerCase() === 'imagead' ||
      resolvedSubType.toLowerCase() === 'image ad'
    ) {
      resolvedType = 'Image';
      resolvedSubType = 'ImageAd';
    } else if (resolvedType.toLowerCase() === 'image') {
      resolvedType = 'Image';
      resolvedSubType = resolvedSubType || 'Image';
    }

    let extractedBullets: string[] = [];
    let finalContent = resolvedContent;

    if (resolvedSubType === 'BulletPost') {
      const formatted = formatBulletPostContentAndBullets(resolvedContent, (data as any).bulletPoints);
      extractedBullets = formatted.bulletPoints;
      finalContent = formatted.content;
    }

    let formattedLinks: any[] = [];
    if (resolvedSubType === 'StandardLink' || (data as any).links) {
      const formattedRes = formatLinksAndContent((data as any).links || (data as any).linkUrl || (data as any).webUrl, resolvedContent);
      formattedLinks = formattedRes.links;
      finalContent = formattedRes.content;
    }

    let rawVideoPlatform = data.videoSource || data.video_platform || '';
    if (rawVideoPlatform.toLowerCase() === 'x' || rawVideoPlatform.toLowerCase() === 'twitter') {
      rawVideoPlatform = 'Twitter';
    }

    const isWebPostVal = (resolvedSubType === 'BulletPost' || resolvedSubType === 'StandardLink' || resolvedSubType === 'BigBlackStandard' || resolvedSubType === 'BigBlackStanded' || resolvedType === 'Video' || resolvedType === 'Image')
      ? false
      : Boolean(data.isWebPost || (data as any).is_web_post || (data as any).isWebpost);

    const postUrlVal = resolvedSubType === 'ImageAd'
      ? ((data as any).imageAdUrl || data.postUrl || data.webUrl || '')
      : (isWebPostVal ? (data.webUrl || data.postUrl || '') : '');

    if (resolvedSubType === 'StandardLink') {
      finalContent = stripAllTagsExceptLinkTags(finalContent);
    } else {
      finalContent = stripHtml(finalContent);
    }

    const rawNotifTitle = (data.notificationTitle || (data as any).notificationtitle || '').trim();
    const rawImgTitle = (data.imageTitle || (data as any).imagetitel || '').trim();
    const resolvedNotificationTitle = rawNotifTitle ? stripHtml(rawNotifTitle) : resolvedTitle;
    const resolvedImageTitle = rawImgTitle ? stripHtml(rawImgTitle) : resolvedTitle;

    const createDto: CreateNewsPostDto = {
      title: resolvedTitle,
      notificationtitle: resolvedNotificationTitle,
      imagetitel: resolvedImageTitle,
      content: finalContent,
      created: todayISO,
      totalLikes: 0,
      totalViews: 0,
      totalComments: 0,
      image_url: data.imageUrl || '',
      video_url: data.videoUrl || data.video_url || '',
      video_platform: rawVideoPlatform,
      gallery: data.galleryImages || [],
      type: resolvedType,
      totalShares: 0,
      isReporter: false,
      reportedBy: '',
      categoryName: [],
      postUrl: postUrlVal,
      subType: resolvedSubType,
      bulletPoints: extractedBullets,
      isStickyPost: data.isStickyPost ?? data.isSticky ?? false,
      linkURLAndroid: '',
      linkURLIos: '',
      links: formattedLinks,
      isBookmarked: [],
      postOrder: 0,
      draft: data.publishMode === 'draft',
      trash: false,
      schedule: formatScheduleToISO(data.publishMode, data.scheduleTime),
      language_id: data.languageId ?? 0,
      language_code: data.language_code || data.postLanguage || 'en',
      category_ids: Array.from(new Set((data.categoryIds || []).map((id: any) => (typeof id === 'number' ? id : parseInt(String(id), 10))).filter((id: number) => !isNaN(id) && id > 0))),
      location_ids: Array.from(new Set((data.locationIds || []).map((id: any) => (typeof id === 'number' ? id : parseInt(String(id), 10))).filter((id: number) => !isNaN(id) && id > 0))),
      aitag_ids: Array.from(new Set((data.aitagIds || data.aitag_ids || []).map((id: any) => (typeof id === 'number' ? id : parseInt(String(id), 10))).filter((id: number) => !isNaN(id) && id > 0))),
      isWebPost: isWebPostVal,
      sendNotification: Boolean(data.sendNotification),
    };

    let createdId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 820700;
    try {
      const res = await NewsRepository.create(createDto);
      if (res?.id) createdId = res.id;
    } catch (err) {}

    const newPost = {
      id: createdId,
      title: resolvedTitle,
      notificationTitle: resolvedNotificationTitle,
      notificationtitle: resolvedNotificationTitle,
      imageTitle: resolvedImageTitle,
      imagetitel: resolvedImageTitle,
      content: resolvedContent,
      categories: mappedCategories,
      language: data.postLanguage === 'te' ? 'Telugu' : data.postLanguage === 'hi' ? 'Hindi' : data.postLanguage === 'ml' ? 'Malayalam' : 'English',
      type: data.type,
      views: 0,
      likes: 0,
      image: data.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400',
      date: todayISO.slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: data.location.join(', '),
    };
    setPosts((prev) => [newPost, ...prev]);
    setSnackbar({ open: true, message: (t as any).createSuccess || 'News post created successfully.', severity: 'success' });
    setCreateDrawerOpen(false);
  };

  const handleEditPost = async (data: CreateNewsFormData) => {
    if (!editingPost) return;
    const { mappedCategories, resolvedTitle, resolvedContent } = resolvePostFields(data);
    const todayISO = new Date().toISOString();

    let resolvedType = data.type || (data as any).post_type || 'Standed';
    let resolvedSubType = (data as any).subType || (data as any).sub_type || '';

    if (
      resolvedType === 'BulletPost' ||
      resolvedType.toLowerCase() === 'bulletpost' ||
      resolvedType.toLowerCase() === 'bullet post'
    ) {
      resolvedType = 'Standed';
      resolvedSubType = 'BulletPost';
    } else if (
      resolvedType === 'StandardLink' ||
      resolvedType.toLowerCase() === 'standardlink' ||
      resolvedType.toLowerCase() === 'standard link'
    ) {
      resolvedType = 'Standed';
      resolvedSubType = 'StandardLink';
    } else if (
      resolvedType === 'BigBlackStandard' ||
      resolvedType === 'BigBlackStanded' ||
      resolvedType.toLowerCase() === 'bigblackstandard' ||
      resolvedType.toLowerCase() === 'bigblackstanded' ||
      resolvedType.toLowerCase() === 'bigblack standard' ||
      resolvedType.toLowerCase() === 'big black standard' ||
      resolvedSubType === 'BigBlackStandard' ||
      resolvedSubType === 'BigBlackStanded'
    ) {
      resolvedType = 'Standed';
      resolvedSubType = 'BigBlackStandard';
    } else if (resolvedType.toLowerCase() === 'video') {
      resolvedType = 'Video';
      resolvedSubType = '';
    } else if (
      resolvedType.toLowerCase() === 'imagead' ||
      resolvedType.toLowerCase() === 'image ad' ||
      resolvedSubType.toLowerCase() === 'imagead' ||
      resolvedSubType.toLowerCase() === 'image ad'
    ) {
      resolvedType = 'Image';
      resolvedSubType = 'ImageAd';
    } else if (resolvedType.toLowerCase() === 'image') {
      resolvedType = 'Image';
      resolvedSubType = resolvedSubType || 'Image';
    }

    let extractedBullets: string[] = [];
    let finalContent = resolvedContent;

    if (resolvedSubType === 'BulletPost') {
      const formatted = formatBulletPostContentAndBullets(resolvedContent, (data as any).bulletPoints);
      extractedBullets = formatted.bulletPoints;
      finalContent = formatted.content;
    }

    let formattedLinks: any[] = [];
    if (resolvedSubType === 'StandardLink' || (data as any).links) {
      const formattedRes = formatLinksAndContent((data as any).links || (data as any).linkUrl || (data as any).webUrl, resolvedContent);
      formattedLinks = formattedRes.links;
      finalContent = formattedRes.content;
    }

    let rawVideoPlatform = data.videoSource || data.video_platform || '';
    if (rawVideoPlatform.toLowerCase() === 'x' || rawVideoPlatform.toLowerCase() === 'twitter') {
      rawVideoPlatform = 'Twitter';
    }

    if (resolvedSubType === 'StandardLink') {
      finalContent = stripAllTagsExceptLinkTags(finalContent);
    } else {
      finalContent = stripHtml(finalContent);
    }

    const isWebPostVal = (
      resolvedSubType === 'BulletPost' ||
      resolvedSubType === 'StandardLink' ||
      resolvedSubType === 'BigBlackStandard' ||
      resolvedSubType === 'BigBlackStanded' ||
      resolvedType === 'Video' ||
      resolvedType === 'Image'
    )
      ? false
      : Boolean(data.isWebPost || (data as any).is_web_post || (data as any).isWebpost);

    const postUrlVal = resolvedSubType === 'ImageAd'
      ? ((data as any).imageAdUrl || data.postUrl || data.webUrl || '')
      : (isWebPostVal ? (data.webUrl || data.postUrl || '') : '');

    const rawNotifTitle = (data.notificationTitle || (data as any).notificationtitle || '').trim();
    const rawImgTitle = (data.imageTitle || (data as any).imagetitel || '').trim();
    const resolvedNotificationTitle = rawNotifTitle ? stripHtml(rawNotifTitle) : resolvedTitle;
    const resolvedImageTitle = rawImgTitle ? stripHtml(rawImgTitle) : resolvedTitle;

    const updateDto = {
      title: resolvedTitle,
      notificationtitle: resolvedNotificationTitle,
      imagetitel: resolvedImageTitle,
      content: finalContent,
      created: todayISO,
      totalLikes: editingPost.likes ?? 0,
      totalViews: editingPost.views ?? 0,
      totalComments: 0,
      image_url: data.imageUrl || editingPost.image || '',
      video_url: resolvedType === 'Video' ? (data.videoUrl || data.video_url || '') : '',
      video_platform: rawVideoPlatform,
      gallery: data.galleryImages || [],
      type: resolvedType,
      subType: resolvedSubType,
      bulletPoints: extractedBullets,
      links: formattedLinks,
      isStickyPost: data.isStickyPost ?? data.isSticky ?? false,
      linkURLAndroid: '',
      linkURLIos: '',
      isBookmarked: [],
      postOrder: 0,
      draft: data.publishMode === 'draft',
      trash: false,
      schedule: formatScheduleToISO(data.publishMode, data.scheduleTime),
      language_id: data.languageId ?? 0,
      language_code: data.language_code || data.postLanguage || 'en',
      category_ids: Array.from(new Set((data.categoryIds || []).map((id: any) => (typeof id === 'number' ? id : parseInt(String(id), 10))).filter((id: number) => !isNaN(id) && id > 0))),
      location_ids: Array.from(new Set((data.locationIds || []).map((id: any) => (typeof id === 'number' ? id : parseInt(String(id), 10))).filter((id: number) => !isNaN(id) && id > 0))),
      aitag_ids: Array.from(new Set((data.aitagIds || data.aitag_ids || []).map((id: any) => (typeof id === 'number' ? id : parseInt(String(id), 10))).filter((id: number) => !isNaN(id) && id > 0))),
      post_type: resolvedType,
      isWebPost: isWebPostVal,
      is_web_post: isWebPostVal,
      postUrl: postUrlVal,
      web_post_url: postUrlVal,
    };

    try {
      await NewsRepository.update(editingPost.id, updateDto);
    } catch (err) {}

    const updatedPost = {
      ...editingPost,
      title: resolvedTitle,
      content: resolvedContent,
      categories: mappedCategories,
      language: data.postLanguage === 'te' ? 'Telugu' : data.postLanguage === 'hi' ? 'Hindi' : data.postLanguage === 'ml' ? 'Malayalam' : 'English',
      type: data.type,
      image: data.imageUrl || editingPost.image,
      date: todayISO.slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: data.location ? data.location.join(', ') : '',
      notificationTitle: resolvedNotificationTitle,
      notificationtitle: resolvedNotificationTitle,
      imageTitle: resolvedImageTitle,
      imagetitel: resolvedImageTitle,
    };
    setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? updatedPost : p)));
    setSnackbar({ open: true, message: (t as any).updateSuccess || 'News post updated successfully.', severity: 'success' });
    setEditingPost(null);
  };

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
      {/* Fixed Sidebar Panel */}
      <Sidebar activeHref="/dashboard" />

      {/* Main Panel Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Header Navigation */}
        <Header title={t.title} />

        {/* Scrollable Data Area */}
        <Box sx={{ pt: 2, px: 2, pb: 4, flex: 1, overflowY: 'auto' }}>
          {createDrawerOpen ? (
            <CreateNewsForm
              onClose={() => setCreateDrawerOpen(false)}
              onSubmit={handleCreatePost}
              isDark={isDark}
              language={language as any}
            />
          ) : editingPost ? (
            <CreateNewsForm
              onClose={() => setEditingPost(null)}
              onSubmit={handleEditPost}
              isDark={isDark}
              language={language as any}
              initialData={{
                titleEn: editingPost.language === 'English' || (editingPost as any).language_id === 1 || (editingPost as any).language_code === 'en' ? editingPost.title : '',
                bodyEn: editingPost.language === 'English' || (editingPost as any).language_id === 1 || (editingPost as any).language_code === 'en' ? editingPost.content : '',
                titleTe: editingPost.language === 'Telugu' || (editingPost as any).language_id === 2 || (editingPost as any).language_code === 'te' ? editingPost.title : '',
                bodyTe: editingPost.language === 'Telugu' || (editingPost as any).language_id === 2 || (editingPost as any).language_code === 'te' ? editingPost.content : '',
                titleHi: editingPost.language === 'Hindi' || (editingPost as any).language_id === 3 || (editingPost as any).language_code === 'hi' ? editingPost.title : '',
                bodyHi: editingPost.language === 'Hindi' || (editingPost as any).language_id === 3 || (editingPost as any).language_code === 'hi' ? editingPost.content : '',
                titleMl: editingPost.language === 'Malayalam' || (editingPost as any).language_id === 4 || (editingPost as any).language_code === 'ml' ? editingPost.title : '',
                bodyMl: editingPost.language === 'Malayalam' || (editingPost as any).language_id === 4 || (editingPost as any).language_code === 'ml' ? editingPost.content : '',
                categories: (editingPost as any).category_ids || (editingPost as any).categoryIds || editingPost.categoryIds || (Array.isArray(editingPost.categories) && editingPost.categories.length > 0 ? editingPost.categories : ((editingPost as any).categoryName || (editingPost as any).category_id || [])),
                category_ids: (editingPost as any).category_ids || (editingPost as any).categoryIds || editingPost.categoryIds || [],
                categoryIds: (editingPost as any).category_ids || (editingPost as any).categoryIds || editingPost.categoryIds || [],
                tags: (editingPost as any).tags && (editingPost as any).tags.length > 0 ? (editingPost as any).tags : ((editingPost as any).aiTags || (editingPost as any).aitag_ids || (editingPost as any).aitagIds || []),
                aitagIds: (editingPost as any).aitagIds || (editingPost as any).aitag_ids || (editingPost as any).aiTags || [],
                aitag_ids: (editingPost as any).aitag_ids || (editingPost as any).aitagIds || (editingPost as any).aiTags || [],
                location: (editingPost as any).location_ids || (editingPost as any).locationIds || editingPost.locationIds || ((editingPost as any).location ? (Array.isArray((editingPost as any).location) ? (editingPost as any).location : ((editingPost as any).location as string).split(', ').filter(Boolean)) : (editingPost as any).state_name ? [(editingPost as any).state_name] : []),
                location_ids: (editingPost as any).location_ids || (editingPost as any).locationIds || editingPost.locationIds || [],
                locationIds: (editingPost as any).location_ids || (editingPost as any).locationIds || editingPost.locationIds || [],
                type: (editingPost as any).subType || (editingPost as any).sub_type || editingPost.type || (editingPost as any).typename || (editingPost as any).post_type || (editingPost as any).postType || 'Standard',
                imageUrl: editingPost.image || (editingPost as any).imageUrl || (editingPost as any).image_url,
                postLanguage: (editingPost as any).language_id === 2 || (editingPost as any).language_code === 'te' || editingPost.language === 'Telugu' ? 'te' : (editingPost as any).language_id === 3 || (editingPost as any).language_code === 'hi' || editingPost.language === 'Hindi' ? 'hi' : (editingPost as any).language_id === 4 || (editingPost as any).language_code === 'ml' || editingPost.language === 'Malayalam' ? 'ml' : 'en',
                languageId: (editingPost as any).language_id || ((editingPost as any).language_code === 'te' ? 2 : (editingPost as any).language_code === 'hi' ? 3 : (editingPost as any).language_code === 'ml' ? 4 : 1),
                language_code: (editingPost as any).language_code || ((editingPost as any).language_id === 2 ? 'te' : (editingPost as any).language_id === 3 ? 'hi' : (editingPost as any).language_id === 4 ? 'ml' : 'en'),
                notificationTitle: (editingPost as any).notificationTitle || (editingPost as any).notificationtitle || editingPost.title || '',
                imageTitle: (editingPost as any).imageTitle || (editingPost as any).imagetitel || editingPost.title || '',
                isWebPost: Boolean((editingPost as any).is_web_post || (editingPost as any).isWebPost || (editingPost as any).isWebpost),
                webUrl: (editingPost as any).web_post_url || (editingPost as any).webPostUrl || (editingPost as any).web_url || (editingPost as any).webUrl || (editingPost as any).postUrl || (editingPost as any).post_url || '',
                postUrl: (editingPost as any).web_post_url || (editingPost as any).webPostUrl || (editingPost as any).web_url || (editingPost as any).webUrl || (editingPost as any).postUrl || (editingPost as any).post_url || '',
                imageAdUrl: (editingPost as any).imageAdUrl || (editingPost as any).image_ad_url || (editingPost as any).web_post_url || (editingPost as any).webPostUrl || (editingPost as any).postUrl || (editingPost as any).post_url || '',
                isSticky: Boolean((editingPost as any).is_sticky || (editingPost as any).isStickyPost || (editingPost as any).isSticky),
                videoSource: (editingPost as any).videoSource || (editingPost as any).video_platform || (editingPost as any).video_source || '',
                videoUrl: (editingPost as any).videoUrl || (editingPost as any).video_url || (editingPost as any).video_link || (editingPost as any).videoLink || '',
                subType: (editingPost as any).subType || (editingPost as any).sub_type || (editingPost.type === 'BulletPost' ? 'BulletPost' : ''),
                galleryImages: editingPost.gallery || (editingPost as any).galleryImages || (editingPost as any).gallery_images || [],
                bulletPoints: (editingPost as any).bulletPoints || (editingPost as any).bullet_points || (editingPost as any).bullets || [],
                bullet_points: (editingPost as any).bulletPoints || (editingPost as any).bullet_points || (editingPost as any).bullets || [],
              }}
            />
          ) : viewingPost ? (
            /* ── Post Detail View Panel ── */
            <Box
              sx={{
                backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              }}
            >
              {/* Back Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 3,
                  py: 2,
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  backgroundColor: isDark ? 'rgba(38,28,86,0.5)' : '#f4f3f8',
                }}
              >
                <IconButton
                  onClick={() => setViewingPost(null)}
                  size="small"
                  sx={{
                    color: isDark ? '#d0caeb' : '#5c548a',
                    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
                    borderRadius: '8px',
                    p: 0.8,
                  }}
                >
                  <ArrowBack sx={{ fontSize: '1.1rem' }} />
                </IconButton>
                <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, fontSize: '1.05rem' }}>
                  Post Details
                </Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton
                  size="small"
                  onClick={() => { setViewingPost(null); setEditingPost(viewingPost); }}
                  sx={{
                    color: '#ffc107',
                    backgroundColor: 'rgba(255,193,7,0.1)',
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: 'rgba(255,193,7,0.2)' },
                    px: 1.5,
                  }}
                >
                  <Edit sx={{ fontSize: '1.1rem' }} />
                  <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600, color: '#ffc107' }}>Edit</Typography>
                </IconButton>
              </Box>

              {/* Side-by-side: Publish Summary + Mobile Phone Simulator */}
              <Box sx={{ p: 3, backgroundColor: isDark ? 'rgba(38,28,86,0.2)' : '#f5f5f7' }}>
                <Grid container spacing={4} alignItems="stretch">

                  {/* ── Left: Publish Summary Panel ── */}
                  <Grid item xs={12} md={7}>
                    <Box
                      sx={{
                        p: 3.5,
                        height: '100%',
                        borderRadius: '14px',
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                        backgroundColor: isDark ? 'rgba(38,28,86,0.45)' : '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5,
                      }}
                    >
                      {/* Publish Summary header label */}
                      <Typography variant="subtitle1" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, fontSize: '1rem' }}>
                        Publish Summary
                      </Typography>
                      <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

                      {/* Headline / Title */}
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.5 }}>
                          Headline / Title
                        </Typography>
                        <Typography variant="body1" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600, lineHeight: 1.4 }}>
                          {viewingPost.title}
                        </Typography>
                      </Box>

                      {/* News Body Content */}
                      <Box sx={{ flexGrow: 1, maxHeight: '200px', overflowY: 'auto', pr: 0.5 }}>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.5 }}>
                          News Body Content
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.72)' : 'rgba(28,20,69,0.8)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                          {formatDisplayContent(viewingPost)}
                        </Typography>
                      </Box>

                      {/* Language & Post Type row */}
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>
                            Language
                          </Typography>
                          <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700 }}>
                            {viewingPost.language}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>
                            Post Type
                          </Typography>
                          <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700 }}>
                            {viewingPost.subType || (viewingPost as any).sub_type || viewingPost.type}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Publish Locations */}
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.6 }}>
                          Publish Locations
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                          {((viewingPost as any).location
                            ? (viewingPost as any).location.split(', ').filter(Boolean)
                            : ['All']
                          ).map((loc: string, i: number) => (
                            <Box key={i} sx={{ backgroundColor: isDark ? 'rgba(166,226,245,0.15)' : 'rgba(28,20,69,0.07)', color: isDark ? '#a6e2f5' : '#1c1445', borderRadius: '8px', px: 1.2, py: 0.35, fontSize: '0.8rem', fontWeight: 600 }}>
                              {loc}
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      {/* Categories */}
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.6 }}>
                          Categories
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                          {viewingPost.categories.map((cat: string, i: number) => (
                            <Box key={i} sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: isDark ? '#ffffff' : '#1c1445', borderRadius: '8px', px: 1.2, py: 0.35, fontSize: '0.8rem', fontWeight: 600 }}>
                              {cat}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  {/* ── Right: BIG TV Mobile Phone Simulator ── */}
                  <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '300px',
                        height: '520px',
                        borderRadius: '36px',
                        border: '10px solid #222222',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Notch */}
                      <Box sx={{ width: '60px', height: '14px', backgroundColor: '#222222', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />

                      {/* Status Bar */}
                      <Box sx={{ height: '24px', px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#181818', pt: 1.5, zIndex: 9 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#ffffff' }}>4:27</Typography>
                        <Box sx={{ display: 'flex', gap: 0.4 }}>
                          <Box component="span" sx={{ fontSize: '0.55rem', color: '#fff' }}>VoWiFi</Box>
                          <Box component="span" sx={{ fontSize: '0.55rem', color: '#fff' }}>4G</Box>
                          <Box component="span" sx={{ fontSize: '0.55rem', color: '#fff' }}>🔋 44</Box>
                        </Box>
                      </Box>

                      {/* BIG TV App Header Bar */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, backgroundColor: '#181818', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <Box sx={{ backgroundColor: '#e53935', px: 0.8, py: 0.3, borderRadius: '2px', flexShrink: 0 }}>
                          <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.72rem', letterSpacing: '0.3px', lineHeight: 1 }}>BIG TV</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', flexGrow: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
                          {viewingPost.categories.slice(0, 4).map((cat: string, i: number) => (
                            <Typography key={i} variant="caption" sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.68rem', whiteSpace: 'nowrap' }}>{cat}</Typography>
                          ))}
                        </Box>
                      </Box>

                      {/* Phone Scroll Body */}
                      {/* Phone Scroll Body */}
                      <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
                        {(() => {
                          const typeString = String(viewingPost.subType || (viewingPost as any).sub_type || viewingPost.type || '');
                          const tLower = typeString.toLowerCase().trim();
                          const isFullScreen = ['image', 'image ad', 'video', 'reel'].includes(tLower);
                          const isGallery = tLower.includes('gallery');

                          if (isGallery) {
                            const galleryImgs = viewingPost.gallery || [];
                            return (
                              <Box sx={{ width: '100%', height: '100%', overflowY: 'auto', backgroundColor: '#000', display: 'flex', flexDirection: 'column', scrollSnapType: 'y mandatory', flexGrow: 1 }}>
                                {galleryImgs.length > 0 ? galleryImgs.map((imgUrl: string, idx: number) => (
                                  <Box key={idx} sx={{ width: '100%', height: '100%', flexShrink: 0, scrollSnapAlign: 'start' }}>
                                    <Box component="img" src={imgUrl} alt={`Gallery ${idx}`} sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                                  </Box>
                                )) : (
                                  <Box sx={{ width: '100%', height: '100%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>No Gallery Images</Typography>
                                  </Box>
                                )}
                              </Box>
                            );
                          }

                          if (isFullScreen) {
                            return (
                              <Box sx={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                {viewingPost.image ? (
                                  <Box component="img" src={viewingPost.image} alt="Full Screen Media" sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                                ) : (
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>No Media Content</Typography>
                                )}
                              </Box>
                            );
                          }

                          // Default standard post layout
                          return (
                            <>
                              {/* Banner Image + Red Overlay Title */}
                              <Box sx={{ position: 'relative', width: '100%', height: '40%', flexShrink: 0, overflow: 'hidden' }}>
                                {viewingPost.image ? (
                                  <Box component="img" src={viewingPost.image} alt={viewingPost.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                ) : (
                                  <Box sx={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.3)', fontSize: '0.62rem' }}>No Image</Typography>
                                  </Box>
                                )}
                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(229,57,53,0.95)', py: 0.6, px: 1.5 }}>
                                  <Typography sx={{ color: '#ffffff', fontWeight: 700, fontSize: '0.72rem', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                                    {viewingPost.title}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Red separator */}
                              <Box sx={{ height: '3px', backgroundColor: '#e53935', flexShrink: 0 }} />

                              {/* Headline + Action Pill */}
                              <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1, overflowY: 'auto' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                                  <Typography sx={{ color: '#e53935', fontWeight: 800, fontSize: '0.85rem', lineHeight: 1.3, flexGrow: 1 }}>
                                    {viewingPost.title}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid #e53935', borderRadius: '20px', px: 0.8, py: 0.2, flexShrink: 0, backgroundColor: '#ffffff' }}>
                                    <Box component="span" sx={{ fontSize: '0.68rem' }}>👍</Box>
                                    <Box component="span" sx={{ fontSize: '0.68rem' }}>💬</Box>
                                    <Box component="span" sx={{ fontSize: '0.68rem' }}>📤</Box>
                                    <Box component="span" sx={{ fontSize: '0.68rem' }}>🔄</Box>
                                  </Box>
                                </Box>

                                {/* Body text */}
                                <Typography variant="caption" sx={{ color: '#333333', fontSize: '0.76rem', lineHeight: 1.6, display: 'block', whiteSpace: 'pre-wrap' }}>
                                  {formatDisplayContent(viewingPost)}
                                </Typography>

                                {/* Timestamp */}
                                <Typography variant="caption" sx={{ color: '#777777', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.5 }}>
                                  🕒 {viewingPost.date} · {viewingPost.time}
                                </Typography>
                              </Box>
                            </>
                          );
                        })()}
                      </Box>
                      {/* Home Indicator */}
                      <Box sx={{ width: '100px', height: '4px', backgroundColor: '#999999', borderRadius: '2px', position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)' }} />
                    </Box>
                  </Grid>

                </Grid>
              </Box>
            </Box>
          ) : (
            <>
              {/* ── Bulk Action Bar (slides in when items are selected) ── */}
              <Collapse in={selectedIds.size > 0} unmountOnExit>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    px: 2.5,
                    py: 1.5,
                    borderRadius: '14px',
                    border: isDark
                      ? '1px solid rgba(166,226,245,0.25)'
                      : '1px solid rgba(28,20,69,0.15)',
                    backgroundColor: isDark
                      ? 'rgba(166,226,245,0.08)'
                      : 'rgba(28,20,69,0.04)',
                    backdropFilter: 'blur(12px)',
                    animation: 'fadeSlideIn 0.2s ease',
                    '@keyframes fadeSlideIn': {
                      from: { opacity: 0, transform: 'translateY(-6px)' },
                      to:   { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <CheckBoxIcon
                    sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.2rem' }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: isDark ? '#a6e2f5' : '#1c1445', flexShrink: 0 }}
                  >
                    {t.bulkSelected(selectedIds.size)}
                  </Typography>

                  <Box sx={{ flex: 1 }} />

                  {/* Trash button */}
                  <Button
                    id="bulk-trash-btn"
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteForever />}
                    onClick={handleBulkTrash}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      borderColor: isDark ? 'rgba(255,152,0,0.5)' : 'rgba(255,152,0,0.6)',
                      color: '#ff9800',
                      backgroundColor: 'rgba(255,152,0,0.07)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,152,0,0.15)',
                        borderColor: '#ff9800',
                      },
                    }}
                  >
                    {t.bulkTrash}
                  </Button>

                  {/* Delete button */}
                  {!isAdmin && (
                    <Button
                      id="bulk-delete-btn"
                      variant="contained"
                      size="small"
                      startIcon={<Delete />}
                      onClick={handleBulkDelete}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        backgroundColor: '#f44336',
                        '&:hover': { backgroundColor: '#d32f2f' },
                      }}
                    >
                      {t.bulkDelete}
                    </Button>
                  )}

                  {/* Clear selection */}
                  <Tooltip title={t.bulkClear}>
                    <IconButton
                      id="bulk-clear-btn"
                      size="small"
                      onClick={() => setSelectedIds(new Set())}
                      sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
                    >
                      <CheckBoxOutlineBlank sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Collapse>
              {/* ── Filter Panel (Single Line, No Background Card, No Scroll) ── */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 2.5,
                  alignItems: 'center',
                  flexWrap: 'nowrap',
                }}
              >
                {/* 1. Live Search */}
                <TextField
                  placeholder={t.searchPlaceholder}
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: '170px',
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      height: '34px',
                    },
                    '& .MuiInputBase-input': {
                      py: 0.6,
                      px: 1,
                      fontSize: '0.75rem',
                    },
                  }}
                  InputProps={{
                    endAdornment: <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.95rem' }} />,
                  }}
                />

                {/* 2. Category Filter (API Data) */}
                <TextField
                  select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  size="small"
                  sx={{
                    width: '125px',
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      height: '34px',
                    },
                    '& .MuiSelect-select': { py: 0.6, px: 1, fontSize: '0.75rem' },
                  }}
                >
                  <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>{(t as any).allCategories}</MenuItem>
                  {categoryOptions.map((cat) => (
                    <MenuItem key={cat} value={cat} sx={{ fontSize: '0.75rem' }}>{cat}</MenuItem>
                  ))}
                </TextField>

                {/* 3. Post Type Filter (API Data) */}
                <TextField
                  select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  size="small"
                  sx={{
                    width: '105px',
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      height: '34px',
                    },
                    '& .MuiSelect-select': { py: 0.6, px: 1, fontSize: '0.75rem' },
                  }}
                >
                  <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>{(t as any).allTypes}</MenuItem>
                  {postTypeOptions.map((type) => (
                    <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>{type}</MenuItem>
                  ))}
                </TextField>



                {/* 5. Location Filter (API Data) */}
                <TextField
                  select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  size="small"
                  sx={{
                    width: '115px',
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      height: '34px',
                    },
                    '& .MuiSelect-select': { py: 0.6, px: 1, fontSize: '0.75rem' },
                  }}
                >
                  <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>{(t as any).allLocations}</MenuItem>
                  {locationOptions.map((loc) => (
                    <MenuItem key={loc} value={loc} sx={{ fontSize: '0.75rem' }}>{loc}</MenuItem>
                  ))}
                </TextField>

                {/* 6. AI Tag Filter (API Data) */}
                <TextField
                  select
                  value={selectedAiTag}
                  onChange={(e) => setSelectedAiTag(e.target.value)}
                  size="small"
                  sx={{
                    width: '105px',
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      height: '34px',
                    },
                    '& .MuiSelect-select': { py: 0.6, px: 1, fontSize: '0.75rem' },
                  }}
                >
                  <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>{(t as any).allAiTags}</MenuItem>
                  {aiTagOptions.map((tag) => (
                    <MenuItem key={tag} value={tag} sx={{ fontSize: '0.75rem' }}>{tag}</MenuItem>
                  ))}
                </TextField>

                {/* 7. Status Filter */}
                <TextField
                  select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  size="small"
                  sx={{
                    width: '110px',
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      height: '34px',
                    },
                    '& .MuiSelect-select': { py: 0.6, px: 1, fontSize: '0.75rem' },
                  }}
                >
                  <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>{(t as any).statusAll}</MenuItem>
                  <MenuItem value="publish" sx={{ fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4caf50' }} />
                      {(t as any).statusPublish}
                    </Box>
                  </MenuItem>
                  <MenuItem value="draft" sx={{ fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ff9800' }} />
                      {(t as any).statusDraft}
                    </Box>
                  </MenuItem>
                  <MenuItem value="scheduled" sx={{ fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#2196f3' }} />
                      {(t as any).statusScheduled}
                    </Box>
                  </MenuItem>
                </TextField>

                {/* 8. Clear All Filters Icon Button (if active) */}
                {hasActiveFilters && (
                  <Tooltip title={(t as any).clearFilters}>
                    <IconButton
                      id="clear-filters-icon-btn"
                      onClick={handleClearAllFilters}
                      sx={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        color: '#f44336',
                        backgroundColor: isDark ? 'rgba(244,67,54,0.12)' : 'rgba(244,67,54,0.08)',
                        border: isDark ? '1px solid rgba(244,67,54,0.3)' : '1px solid rgba(244,67,54,0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(244,67,54,0.2)',
                        },
                        flexShrink: 0,
                      }}
                    >
                      <FilterListOff sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Tooltip>
                )}

                {/* 9. Create News Icon Button */}
                <Tooltip title={t.menuCreate}>
                  <IconButton
                    id="create-news-icon-btn"
                    onClick={() => setCreateDrawerOpen(true)}
                    sx={{
                      ml: 'auto',
                      flexShrink: 0,
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                      color: isDark ? '#1c1445' : '#ffffff',
                      '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270' },
                    }}
                  >
                    <PostAdd sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
                </Tooltip>
              </Box>

          {/* Table Data Board Container — Reels-style flex layout */}
          <Box
            sx={{
              backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header Row — Reels-style */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                color: isDark ? '#d0caeb' : '#5c548a',
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f8f7ff',
              }}
            >
              {/* Checkbox col */}
              <Box sx={{ flex: '0 0 40px', px: 0.5 }}>
                <Tooltip title={isAllPageSelected ? t.bulkClear : t.colSelect}>
                  <Checkbox
                    id="select-all-checkbox"
                    size="small"
                    checked={isAllPageSelected}
                    indeterminate={isSomePageSelected}
                    onChange={handleSelectAll}
                    sx={{
                      color: isDark ? '#d0caeb' : '#5c548a',
                      '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: isDark ? '#a6e2f5' : '#1c1445' },
                      p: 0,
                    }}
                  />
                </Tooltip>
              </Box>
              <Box sx={{ flex: '0 0 32px', px: 0.5 }}>#</Box>
              <Box sx={{ flex: '0 0 64px', px: 1 }}>{t.colImage}</Box>
              <Box sx={{ flex: '1.8 1 0', px: 1 }}>{t.colCategory}</Box>
              <Box sx={{ flex: '3 1 0', px: 1 }}>{t.colTitle}</Box>
              <Box sx={{ flex: '1.4 1 0', px: 1 }}>{t.colType}</Box>
              <Box sx={{ flex: '1.4 1 0', px: 1 }}>{t.colDate}</Box>
              <Box sx={{ flex: '1.8 1 0', px: 1 }}>{t.colActions}</Box>
            </Box>

            {/* Data Rows — Reels-style flex rows */}
            {loading ? (
              <Loader message="Loading news posts..." minHeight="300px" />
            ) : paginatedData.length > 0 ? (
              paginatedData.map((post, idx) => {
                const primaryCategories = post.categories.slice(0, 2);
                const remainingCategories = post.categories.slice(2);
                const hasMoreCategories = remainingCategories.length > 0;
                const isRowSelected = selectedIds.has(post.id);
                const rowColors = ['#ef5350', '#7e57c2', '#26a69a', '#ffa726', '#ab47bc', '#42a5f5', '#26c6da'];
                const rowColor = rowColors[idx % rowColors.length];

                return (
                  <Box key={post.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 1.6,
                        transition: 'all 0.2s ease',
                        backgroundColor: isRowSelected
                          ? (isDark ? 'rgba(166,226,245,0.07)' : 'rgba(28,20,69,0.04)')
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: isRowSelected
                            ? (isDark ? 'rgba(166,226,245,0.1)' : 'rgba(28,20,69,0.06)')
                            : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(28,20,69,0.02)'),
                        },
                      }}
                    >
                      {/* Checkbox */}
                      <Box sx={{ flex: '0 0 40px', px: 0.5 }}>
                        <Checkbox
                          size="small"
                          checked={isRowSelected}
                          onChange={() => handleToggleSelect(post.id)}
                          sx={{
                            color: isDark ? '#d0caeb' : '#5c548a',
                            '&.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' },
                            p: 0,
                          }}
                        />
                      </Box>

                      {/* Row # — colored badge like ReelsTable */}
                      <Box sx={{ flex: '0 0 32px', px: 0.5 }}>
                        <Box
                          sx={{
                            px: 0.8,
                            py: 0.3,
                            borderRadius: '6px',
                            backgroundColor: `${rowColor}22`,
                            border: `1px solid ${rowColor}44`,
                            display: 'inline-block',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: rowColor, fontWeight: 700, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                            {post.id}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Thumbnail */}
                      <Box sx={{ flex: '0 0 64px', px: 1 }}>
                        <Box
                          component="img"
                          src={post.image}
                          alt="Banner"
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '10px',
                            objectFit: 'cover',
                            border: `1px solid ${rowColor}55`,
                            backgroundColor: `${rowColor}22`,
                          }}
                        />
                      </Box>

                      {/* Category */}
                      <Box sx={{ flex: '1.8 1 0', px: 1 }}>
                        <Tooltip title={hasMoreCategories ? `Full List: ${post.categories.join(', ')}` : ''} arrow>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, cursor: hasMoreCategories ? 'help' : 'default' }}>
                            {primaryCategories.map((cat: string, cIdx: number) => (
                              <Box key={cIdx} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: rowColor, flexShrink: 0 }} />
                                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.8rem', color: isDark ? '#ffffff' : '#1c1445' }}>
                                  {cat}
                                </Typography>
                              </Box>
                            ))}
                            {hasMoreCategories && (
                              <Typography variant="caption" sx={{ color: rowColor, fontWeight: 700, pl: 1.3, fontSize: '0.72rem' }}>
                                +{remainingCategories.length} more
                              </Typography>
                            )}
                          </Box>
                        </Tooltip>
                      </Box>

                      {/* Title + Content */}
                      <Box sx={{ flex: '3 1 0', px: 1 }}>
                        <Tooltip
                          title={
                            <Box sx={{ p: 1, maxWidth: '300px' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isDark ? '#a6e2f5' : '#1c1445', mb: 0.8 }}>{post.title}</Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.5 }}>{post.content}</Typography>
                            </Box>
                          }
                          arrow
                        >
                          <Box sx={{ cursor: 'help' }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                mb: 0.3,
                                fontSize: '0.92rem',
                                color: isDark ? '#ffffff' : '#1c1445',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {post.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: isDark ? '#d0caeb' : '#5c548a',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {post.content}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>

                      {/* Type + Language — chip style */}
                      <Box sx={{ flex: '1.4 1 0', px: 1 }}>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.2,
                            py: 0.3,
                            borderRadius: '8px',
                            backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.07)',
                            border: isDark ? '1px solid rgba(166,226,245,0.2)' : '1px solid rgba(28,20,69,0.12)',
                            mb: 0.4,
                          }}
                        >
                          <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, fontSize: '0.72rem' }}>
                            {post.subType || (post as any).sub_type || post.type}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '0.72rem' }}>
                          {post.language}
                        </Typography>
                      </Box>

                      {/* Date + Time */}
                      <Box sx={{ flex: '1.4 1 0', px: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', color: isDark ? '#ffffff' : '#1c1445' }}>
                          {post.date}
                        </Typography>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e', fontSize: '0.72rem' }}>
                          {post.time}
                        </Typography>
                      </Box>

                      {/* Actions — Reels-style icon + outlined buttons */}
                      <Box sx={{ flex: '1.8 1 0', px: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => setViewingPost(post)}
                            sx={{
                              color: isDark ? '#a6e2f5' : '#1976d2',
                              backgroundColor: isDark ? 'rgba(166,226,245,0.1)' : 'rgba(25,118,210,0.08)',
                              borderRadius: '8px',
                              p: 0.6,
                              '&:hover': { backgroundColor: isDark ? 'rgba(166,226,245,0.2)' : 'rgba(25,118,210,0.15)' },
                            }}
                          >
                            <Visibility sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Edit sx={{ fontSize: '0.9rem !important' }} />}
                            onClick={() => setEditingPost(post)}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              px: 1.2,
                              py: 0.4,
                              borderColor: rowColor + '66',
                              color: rowColor,
                              '&:hover': { backgroundColor: rowColor + '11', borderColor: rowColor },
                            }}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleSingleDelete(post.id)}
                            sx={{
                              color: '#f44336',
                              backgroundColor: 'rgba(244,67,54,0.08)',
                              borderRadius: '8px',
                              p: 0.6,
                              '&:hover': { backgroundColor: 'rgba(244,67,54,0.15)' },
                            }}
                          >
                            <Delete sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    {idx < paginatedData.length - 1 && <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)' }} />}
                  </Box>
                );
              })
            ) : (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#9e9e9e' }}>{t.noRecords}</Typography>
              </Box>
            )}
          </Box>

          {/* Snackbar feedback for bulk actions */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3500}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
              severity={snackbar.severity}
              variant="filled"
              sx={{ borderRadius: '12px', fontWeight: 600 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Pagination Controls Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: isDark ? '#d0caeb' : '#5c548a',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: isDark ? 'rgba(166, 226, 245, 0.15)' : 'rgba(28, 20, 69, 0.1)',
                    color: isDark ? '#a6e2f5' : '#1c1445',
                    borderColor: isDark ? '#a6e2f5' : '#1c1445',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(166, 226, 245, 0.25)' : 'rgba(28, 20, 69, 0.15)',
                    },
                  },
                },
              }}
            />
          </Box>
        </>
      )}
      {/* Closes editingPost ternary */}
    </Box>
  </Box>
</Box>

  );
}
