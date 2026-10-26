'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Card,
  CardContent,
  CardActions,
  Avatar,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search,
  LiveTv,
  Lock,
  AddCircleOutline,
  Edit,
  DeleteSweep,
  Sync,
  ExpandMore,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useUserStore } from '@/core/storage/user-store';
import { useLiveTvVideosController } from '../hooks/useLiveTvVideosController';
import { LiveTvVideosTable } from '../components/LiveTvVideosTable';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { TagCreateModal } from '../components/TagCreateModal';
import { TagEditModal } from '../components/TagEditModal';
import { VideoEditModal } from '../components/VideoEditModal';
import { Loader } from '@/shared/components/Loader';
import { LanguageCode, TagLanguage, VideoTag } from '../domain/LiveTvVideo';

const translations = {
  en: {
    pageTitle: 'Video Tags & Stream Management',
    pageSubtitle: 'Manage dynamic video folders and view streaming content across languages',
    createTagBtn: '+ New Video Tag',
    allLanguagesTab: 'All Languages',
    teluguTab: 'Telugu (te) ★Default',
    malayalamTab: 'Malayalam (ml)',
    englishTab: 'English (en)',
    teluguBadge: 'Telugu',
    malayalamBadge: 'Malayalam',
    englishBadge: 'English',
    dailySyncBtn: 'Daily Sync',
    syncingBtn: 'Syncing...',
    syncSuccessMsg: 'Videos synced successfully for',
    searchPlaceholder: 'Search videos by file name...',
    totalVideos: 'Total Videos',
    editTag: 'Edit Tag',
    deleteTag: 'Delete Tag',
    accessDeniedTitle: 'Access Restricted',
    accessDeniedDesc: 'Only authorized roles can access the Live TV Videos management page.',
    deleteConfirmTitle: 'Delete Video Tag?',
    deleteConfirmDesc:
      'Are you sure you want to delete this tag? This will also permanently delete the associated physical folder and all videos inside it.',
    cancel: 'Cancel',
    delete: 'Delete',
    editVideo: 'Edit Video',
    noTagsFound: 'No video tags found for this language.',
    selectTagPrompt: 'Select a video tag to view its videos and streaming files.',
    viewVideosBtn: 'View Videos',
    folder: 'Folder',
    views: 'views',
    language: 'Language',
    teluguOption: 'Telugu (te)',
    malayalamOption: 'Malayalam (ml)',
    englishOption: 'English (en)',
    slugChangeWarning: 'Changing language will automatically relocate the show folder on the server.',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Enter brief show summary...',
    tagNameLabel: 'Tag Name',
    tagSlugLabel: 'Tag Slug',
    tagSlugHelper: 'Used for physical folder name. Alphanumeric and dashes only.',
    tagSlugEditHelper: 'Slug identifier cannot be edited to prevent storage desync.',
    tagImageLabel: 'Thumbnail Image (Optional)',
    uploadImage: 'Upload Image',
    save: 'Save',
    errorFieldsRequired: 'Name and slug are required',
    createTagModalTitle: 'Create Video Tag',
    editTagModalTitle: 'Edit Video Tag',
    colFileName: 'File Name',
    colSize: 'Size',
    colDate: 'Created At',
    colActions: 'Actions',
    playStream: 'Play Stream / View',
    confirmDeleteVideo: 'Are you sure you want to delete this video?',
    noRecordsFound: 'No videos available in this tag folder.',
    teluguShowsHeading: 'Telugu Shows (Default)',
    malayalamShowsHeading: 'Malayalam Shows',
    englishShowsHeading: 'English Shows',
  },
  te: {
    pageTitle: 'వీడియో ట్యాగ్‌లు & స్ట్రీమ్ నిర్వహణ',
    pageSubtitle: 'డైనమిక్ వీడియో ఫోల్డర్‌లను నిర్వహించండి మరియు వివిధ భాషలలో స్ట్రీమింగ్ కంటెంట్‌ను వీక్షించండి',
    createTagBtn: '+ కొత్త వీడియో ట్యాగ్',
    allLanguagesTab: 'అన్ని భాషలు',
    teluguTab: 'తెలుగు (te) ★డిఫాల్ట్',
    malayalamTab: 'మలయాళం (ml)',
    englishTab: 'ఇంగ్లీష్ (en)',
    teluguBadge: 'తెలుగు',
    malayalamBadge: 'మలయాళం',
    englishBadge: 'ఇంగ్లీష్',
    dailySyncBtn: 'రోజువారీ సమకాలీకరణ',
    syncingBtn: 'సమకాలీకరిస్తోంది...',
    syncSuccessMsg: 'వీడియోలు విజయవంతంగా సమకాలీకరించబడ్డాయి:',
    searchPlaceholder: 'ఫైల్ పేరు ద్వారా వీడియోలను శోధించండి...',
    totalVideos: 'మొత్తం వీడియోలు',
    editTag: 'ట్యాగ్‌ని సవరించు',
    deleteTag: 'ట్యాగ్‌ని తొలగించు',
    accessDeniedTitle: 'ప్రవేశం పరిమితం చేయబడింది',
    accessDeniedDesc: 'అధికారం కలిగిన పాత్రలు మాత్రమే ఈ పేజీని యాక్సెస్ చేయగలరు.',
    deleteConfirmTitle: 'వీడియో ట్యాగ్‌ని తొలగించాలా?',
    deleteConfirmDesc:
      'ఈ ట్యాగ్‌ని ఖచ్చితంగా తొలగించాలనుకుంటున్నారా? ఇది సంబంధిత ఫిజికల్ ఫోల్డర్‌ను మరియు అందలి అన్ని వీడియోలను శాశ్వతంగా తొలగిస్తుంది.',
    cancel: 'రద్దు చేయి',
    delete: 'తొలగించు',
    editVideo: 'వీడియోను సవరించండి',
    noTagsFound: 'ఈ భాష కోసం వీడియో ట్యాగ్‌లు కనుగొనబడలేదు.',
    selectTagPrompt: 'వీడియోలు మరియు స్ట్రీమింగ్ ఫైళ్ళను వీక్షించడానికి వీడియో ట్యాగ్‌ని ఎంచుకోండి.',
    viewVideosBtn: 'వీడియోలను చూడండి',
    folder: 'ఫోల్డర్',
    views: 'వీక్షణలు',
    language: 'భాష',
    teluguOption: 'తెలుగు (te)',
    malayalamOption: 'మలయాళం (ml)',
    englishOption: 'ఇంగ్లీష్ (en)',
    slugChangeWarning: 'భాషను మార్చడం వలన సర్వర్‌లో షో ఫోల్డర్ స్వయంచాలకంగా తరలించబడుతుంది.',
    descriptionLabel: 'వివరణ',
    descriptionPlaceholder: 'క్లుప్త వివరణను నమోదు చేయండి...',
    tagNameLabel: 'ట్యాగ్ పేరు',
    tagSlugLabel: 'ట్యాగ్ స్లగ్',
    tagSlugHelper: 'ఫోల్డర్ పేరు కోసం ఉపయోగించబడుతుంది. ఆల్ఫాన్యూమరిక్ మరియు డాష్‌లు మాత్రమే.',
    tagSlugEditHelper: 'స్టోరేజ్ డీసింక్ నిరోధించడానికి స్లగ్ మార్చబడదు.',
    tagImageLabel: 'థంబ్‌నెయిల్ చిత్రం (ఐచ్ఛికం)',
    uploadImage: 'చిత్రాన్ని అప్‌లోడ్ చేయండి',
    save: 'భద్రపరచు',
    errorFieldsRequired: 'పేరు మరియు స్లగ్ అవసరం',
    createTagModalTitle: 'వీడియో ట్యాగ్‌ని సృష్టించండి',
    editTagModalTitle: 'వీడియో ట్యాగ్‌ని సవరించండి',
    colFileName: 'ఫైల్ పేరు',
    colSize: 'పరిమాణం',
    colDate: 'సృష్టించబడిన తేదీ',
    colActions: 'చర్యలు',
    playStream: 'స్ట్రీమ్ ప్లే చేయండి / చూడండి',
    confirmDeleteVideo: 'మీరు ఖచ్చితంగా ఈ వీడియోను తొలగించాలనుకుంటున్నారా?',
    noRecordsFound: 'ఈ ట్యాగ్ ఫోల్డర్‌లో వీడియోలు అందుబాటులో లేవు.',
    teluguShowsHeading: 'తెలుగు షోలు (డిఫాల్ట్)',
    malayalamShowsHeading: 'మలయాళం షోలు',
    englishShowsHeading: 'ఇంగ్లీష్ షోలు',
  },
  hi: {
    pageTitle: 'वीडियो टैग और स्ट्रीम प्रबंधन',
    pageSubtitle: 'डायनामिक वीडियो फ़ोल्डर्स प्रबंधित करें और विभिन्न भाषाओं में स्ट्रीमिंग सामग्री देखें',
    createTagBtn: '+ नया वीडियो टैग',
    allLanguagesTab: 'सभी भाषाएं',
    teluguTab: 'तेलुगु (te) ★डिफ़ॉल्ट',
    malayalamTab: 'मलयालम (ml)',
    englishTab: 'अंग्रेज़ी (en)',
    teluguBadge: 'तेलुगु',
    malayalamBadge: 'मलयालम',
    englishBadge: 'अंग्रेज़ी',
    dailySyncBtn: 'दैनिक सिंक',
    syncingBtn: 'सिंक हो रहा है...',
    syncSuccessMsg: 'के लिए वीडियो सफलतापूर्वक सिंक किए गए:',
    searchPlaceholder: 'फ़ाइल नाम से वीडियो खोजें...',
    totalVideos: 'कुल वीडियो',
    editTag: 'टैग संपादित करें',
    deleteTag: 'टैग हटाएं',
    accessDeniedTitle: 'पहुंच प्रतिबंधित है',
    accessDeniedDesc: 'केवल अधिकृत भूमिकाएं ही इस पृष्ठ तक पहुंच सकती हैं।',
    deleteConfirmTitle: 'वीडियो टैग हटाएं?',
    deleteConfirmDesc:
      'क्या आप वाकई इस टैग को हटाना चाहते हैं? यह संबंधित भौतिक फ़ोल्डर और उसके अंदर के सभी वीडियो को भी स्थायी रूप से हटा देगा।',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    editVideo: 'वीडियो संपादित करें',
    noTagsFound: 'इस भाषा के लिए कोई वीडियो टैग नहीं मिला।',
    selectTagPrompt: 'इसके वीडियो और स्ट्रीमिंग फ़ाइलें देखने के लिए एक वीडियो टैग चुनें।',
    viewVideosBtn: 'वीडियो देखें',
    folder: 'फ़ोल्डर',
    views: 'व्यूज़',
    language: 'भाषा',
    teluguOption: 'तेलुगु (te)',
    malayalamOption: 'मलयालम (ml)',
    englishOption: 'अंग्रेज़ी (en)',
    slugChangeWarning: 'भाषा बदलने पर सर्वर पर शो फ़ोल्डर स्वचालित रूप से स्थानांतरित हो जाएगा।',
    descriptionLabel: 'विवरण',
    descriptionPlaceholder: 'संक्षिप्त विवरण दर्ज करें...',
    tagNameLabel: 'टैग नाम',
    tagSlugLabel: 'टैग स्लग',
    tagSlugHelper: 'भौतिक फ़ोल्डर नाम के लिए उपयोग किया जाता है। केवल अल्फ़ान्यूमेरिक और डैश।',
    tagSlugEditHelper: 'स्टोरेज डिसिंक से बचने के लिए स्लग बदला नहीं जा सकता।',
    tagImageLabel: 'थंबनेल छवि (वैकल्पिक)',
    uploadImage: 'छवि अपलोड करें',
    save: 'सहेजें',
    errorFieldsRequired: 'नाम और स्लग आवश्यक हैं',
    createTagModalTitle: 'वीडियो टैग बनाएं',
    editTagModalTitle: 'वीडियो टैग संपादित करें',
    colFileName: 'फ़ाइल नाम',
    colSize: 'आकार',
    colDate: 'निर्माण तिथि',
    colActions: 'कार्रवाई',
    playStream: 'स्ट्रीम चलाएं / देखें',
    confirmDeleteVideo: 'क्या आप वाकई इस वीडियो को हटाना चाहते हैं?',
    noRecordsFound: 'इस टैग फ़ोल्डर में कोई वीडियो उपलब्ध नहीं है।',
    teluguShowsHeading: 'तेलुगु शो (डिफ़ॉल्ट)',
    malayalamShowsHeading: 'मलयालम शो',
    englishShowsHeading: 'अंग्रेज़ी शो',
  },
  ml: {
    pageTitle: 'വീഡിയോ ടാഗുകളും സ്ട്രീം മാനേജ്മെൻ്റും',
    pageSubtitle: 'ഡൈനാമിക് വീഡിയോ ഫോൾഡറുകൾ നിയന്ത്രിക്കുകയും ഭാഷകളിലുടനീളം സ്ട്രീമിംഗ് ഉള്ളടക്കം കാണുകയും ചെയ്യുക',
    createTagBtn: '+ പുതിയ വീഡിയോ ടാഗ്',
    allLanguagesTab: 'എല്ലാ ഭാഷകളും',
    teluguTab: 'തെലുങ്ക് (te) ★സ്ഥിരസ്ഥിതി',
    malayalamTab: 'മലയാളം (ml)',
    englishTab: 'ഇംഗ്ലീഷ് (en)',
    teluguBadge: 'തെലുങ്ക്',
    malayalamBadge: 'മലയാളം',
    englishBadge: 'ഇംഗ്ലീഷ്',
    dailySyncBtn: 'പ്രതിദിന സമന്വയം',
    syncingBtn: 'സമന്വയിപ്പിക്കുന്നു...',
    syncSuccessMsg: 'വീഡിയോകൾ വിജയകരമായി സമന്വയിപ്പിച്ചു:',
    searchPlaceholder: 'ഫയലിന്റെ പേര് ഉപയോഗിച്ച് വീഡിയോകൾ തിരയുക...',
    totalVideos: 'ആകെ വീഡിയോകൾ',
    editTag: 'ടാഗ് എഡിറ്റുചെയ്യുക',
    deleteTag: 'ടാഗ് ഡിലീറ്റ് ചെയ്യുക',
    accessDeniedTitle: 'പ്രവേശനം പരിമിതപ്പെടുത്തിയിരിക്കുന്നു',
    accessDeniedDesc: 'അംഗീകൃത റോളുകൾക്ക് മാത്രമേ ഈ പേജ് ആക്സസ് ചെയ്യാൻ കഴിയൂ.',
    deleteConfirmTitle: 'വീഡിയോ ടാഗ് ഡിലീറ്റ് ചെയ്യണോ?',
    deleteConfirmDesc:
      'ഈ ടാഗ് തീർച്ചയായും ഡിലീറ്റ് ചെയ്യണോ? ഇത് ബന്ധപ്പെട്ട ഫിസിക്കൽ ഫോൾഡറും അതിലെ എല്ലാ വീഡിയോകളും ശാശ്വതമായി ഇല്ലാതാക്കും.',
    cancel: 'റദ്ദാക്കുക',
    delete: 'ഡിലീറ്റ് ചെയ്യുക',
    editVideo: 'വീഡിയോ എഡിറ്റ് ചെയ്യുക',
    noTagsFound: 'ഈ ഭാഷയ്ക്കായി വീഡിയോ ടാഗുകളൊന്നും കണ്ടെത്തിയില്ല.',
    selectTagPrompt: 'വീഡിയോകളും സ്ട്രീമിംഗ് ഫയലുകളും കാണുന്നതിന് ഒരു വീഡിയോ ടാഗ് തിരഞ്ഞെടുക്കുക.',
    viewVideosBtn: 'വീഡിയോകൾ കാണുക',
    folder: 'ഫോൾഡർ',
    views: 'കാഴ്ചകൾ',
    language: 'ഭാഷ',
    teluguOption: 'തെലുങ്ക് (te)',
    malayalamOption: 'മലയാളം (ml)',
    englishOption: 'ഇംഗ്ലീഷ് (en)',
    slugChangeWarning: 'ഭാഷ മാറ്റുന്നത് സെർവറിലെ ഷോ ഫോൾഡർ സ്വയമേവ മാറ്റിസ്ഥാപിക്കും.',
    descriptionLabel: 'വിവരണം',
    descriptionPlaceholder: 'ചുരുങ്ങിയ വിവരണം നൽകുക...',
    tagNameLabel: 'ടാഗ് നാമം',
    tagSlugLabel: 'ടാഗ് സ്ലഗ്',
    tagSlugHelper: 'ഫിസിക്കൽ ഫോൾഡർ നാമത്തിനായി ഉപയോഗിക്കുന്നു. ആൽഫാന്യൂമെറിക്, ഡാഷുകൾ മാത്രം.',
    tagSlugEditHelper: 'സ്റ്റോറേജ് മാറ്റങ്ങൾ ഒഴിവാക്കാൻ സ്ലഗ് മാറ്റാൻ കഴിയില്ല.',
    tagImageLabel: 'ലഘുചിത്രം (ഓപ്ഷണൽ)',
    uploadImage: 'ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
    save: 'സേവ് ചെയ്യുക',
    errorFieldsRequired: 'പേരും സ്ലഗ്ഗും ആവശ്യമാണ്',
    createTagModalTitle: 'വീഡിയോ ടാഗ് സൃഷ്ടിക്കുക',
    editTagModalTitle: 'വീഡിയോ ടാഗ് എഡിറ്റ് ചെയ്യുക',
    colFileName: 'ഫയൽ നാമം',
    colSize: 'വലിപ്പം',
    colDate: 'സൃഷ്ടിച്ച തീയതി',
    colActions: 'നടപടികൾ',
    playStream: 'സ്ട്രീം പ്ലേ ചെയ്യുക / കാണുക',
    confirmDeleteVideo: 'ഈ വീഡിയോ തീർച്ചയായും ഡിലീറ്റ് ചെയ്യണോ?',
    noRecordsFound: 'ഈ ടാഗ് ഫോൾഡറിൽ വീഡിയോകളൊന്നും ലഭ്യമല്ല.',
    teluguShowsHeading: 'തെലുങ്ക് ഷോകൾ (സ്ഥിരസ്ഥിതി)',
    malayalamShowsHeading: 'മലയാളം ഷോകൾ',
    englishShowsHeading: 'ഇംഗ്ലീഷ് ഷോകൾ',
  },
};

export const LiveTvVideosPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const { user } = useUserStore();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const {
    selectedLanguage,
    setSelectedLanguage,
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
  } = useLiveTvVideosController();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const userRole = (user?.role || '').toLowerCase().trim();
  const canAccess =
    userRole === 'admin' ||
    userRole === 'administrator' ||
    userRole === 'superadmin' ||
    userRole === 'super_admin' ||
    userRole === 'creator' ||
    userRole === 'creators';

  const allowedLanguages: TagLanguage[] = useMemo(() => {
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
        if (urlLang === 'ml' || urlLang === 'malayala' || urlLang === 'malayalam') return ['ml'];
        if (urlLang === 'te' || urlLang === 'telugu') return ['te'];
        if (urlLang === 'en' || urlLang === 'english') return ['en'];
        if (urlLang === 'all') return ['te', 'ml', 'en'];
      } catch (e) {}
    }
    const currentLang = (language || '').toLowerCase().trim();
    if (currentLang === 'ml' || currentLang === 'malayala' || currentLang === 'malayalam') {
      return ['ml'];
    }
    if (currentLang === 'te' || currentLang === 'telugu') {
      return ['te'];
    }
    return ['te', 'ml', 'en'];
  }, [language]);

  const tabValue = useMemo(() => {
    if (selectedLanguage === 'all' && allowedLanguages.length > 1) return 'all';
    if (allowedLanguages.includes(selectedLanguage as TagLanguage)) return selectedLanguage;
    return allowedLanguages[0] || 'te';
  }, [selectedLanguage, allowedLanguages]);

  const selectedTag = tags.find((t) => t.slug === selectedTagSlug);

  const confirmDeleteTag = () => {
    if (selectedTagSlug) {
      handleDeleteTag(selectedTagSlug);
    }
    setDeleteConfirmOpen(false);
  };

  const renderLanguageBadge = (lang?: string) => {
    const code = (lang || 'te').toLowerCase();
    let label = t.teluguBadge;
    let bg = 'rgba(37, 99, 235, 0.15)';
    let color = isDark ? '#93c5fd' : '#1d4ed8';
    let border = isDark ? 'rgba(147, 197, 253, 0.3)' : 'rgba(37, 99, 235, 0.3)';

    if (code === 'ml') {
      label = t.malayalamBadge;
      bg = 'rgba(16, 185, 129, 0.15)';
      color = isDark ? '#6ee7b7' : '#047857';
      border = isDark ? 'rgba(110, 231, 183, 0.3)' : 'rgba(16, 185, 129, 0.3)';
    } else if (code === 'en') {
      label = t.englishBadge;
      bg = 'rgba(139, 92, 246, 0.15)';
      color = isDark ? '#c4b5fd' : '#6d28d9';
      border = isDark ? 'rgba(196, 181, 253, 0.3)' : 'rgba(139, 92, 246, 0.3)';
    }

    return (
      <Chip
        size="small"
        label={label}
        sx={{
          fontWeight: 700,
          fontSize: '0.72rem',
          backgroundColor: bg,
          color: color,
          border: `1px solid ${border}`,
          borderRadius: '6px',
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: isDark ? '#140e36' : '#f4f3f8',
        color: isDark ? '#ffffff' : '#1c1445',
      }}
    >
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar activeHref="/livetvvideos" />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {!canAccess ? (
            <Box
              sx={{
                p: 5,
                textAlign: 'center',
                backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                borderRadius: '20px',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                my: 'auto',
              }}
            >
              <Lock sx={{ fontSize: 60, color: '#ef4444', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {t.accessDeniedTitle}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {t.accessDeniedDesc}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Header Section */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <LiveTv sx={{ color: isDark ? '#93c5fd' : '#2563eb', fontSize: 32 }} />
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' } }}
                    >
                      {t.pageTitle}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {t.pageSubtitle}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddCircleOutline />}
                  onClick={() => setCreateTagModalOpen(true)}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 700,
                    backgroundColor: '#2563eb',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                  }}
                >
                  {t.createTagBtn}
                </Button>
              </Box>

              {/* Action Notifications */}
              {actionError && (
                <Alert
                  severity="error"
                  onClose={() => setActionError(null)}
                  sx={{ borderRadius: '14px' }}
                >
                  {actionError}
                </Alert>
              )}
              {actionSuccess && (
                <Alert
                  severity="success"
                  onClose={() => setActionSuccess(null)}
                  sx={{ borderRadius: '14px' }}
                >
                  {actionSuccess}
                </Alert>
              )}

              {/* Top-Level Language Filter Tabs */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: '18px',
                  backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.03)',
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={(_, val: LanguageCode) => setSelectedLanguage(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: '44px',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      minHeight: '44px',
                      borderRadius: '12px',
                      mr: 1,
                      color: isDark ? '#a5b4fc' : '#5c548a',
                      transition: 'all 0.2s ease',
                      '&.Mui-selected': {
                        color: '#ffffff',
                        backgroundColor: '#2563eb',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      display: 'none',
                    },
                  }}
                >
                  {allowedLanguages.length > 1 && (
                    <Tab label={t.allLanguagesTab} value="all" icon={<LanguageIcon />} iconPosition="start" />
                  )}
                  {allowedLanguages.includes('te') && (
                    <Tab label={t.teluguTab} value="te" />
                  )}
                  {allowedLanguages.includes('ml') && (
                    <Tab label={t.malayalamTab} value="ml" />
                  )}
                  {allowedLanguages.includes('en') && (
                    <Tab label={t.englishTab} value="en" />
                  )}
                </Tabs>
              </Box>

              {/* Categorized Accordions if "All Languages" is selected */}
              {selectedLanguage === 'all' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {/* Telugu Group */}
                  <Accordion
                    defaultExpanded
                    sx={{
                      backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#ffffff',
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderRadius: '16px !important',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore sx={{ color: isDark ? '#fff' : '#1c1445' }} />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontWeight: 700 }}>{t.teluguShowsHeading}</Typography>
                        <Chip
                          size="small"
                          label={`${segregatedTags.te?.length || 0}`}
                          sx={{ fontWeight: 700, height: 22 }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {segregatedTags.te?.length > 0 ? (
                          segregatedTags.te.map((tag) => (
                            <Button
                              key={tag.slug}
                              variant={selectedTagSlug === tag.slug ? 'contained' : 'outlined'}
                              onClick={() => handleTagSelect(tag.slug)}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '10px',
                              }}
                            >
                              {tag.name}
                            </Button>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            {t.noTagsFound}
                          </Typography>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Malayalam Group */}
                  <Accordion
                    sx={{
                      backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#ffffff',
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderRadius: '16px !important',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore sx={{ color: isDark ? '#fff' : '#1c1445' }} />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontWeight: 700 }}>{t.malayalamShowsHeading}</Typography>
                        <Chip
                          size="small"
                          label={`${segregatedTags.ml?.length || 0}`}
                          sx={{ fontWeight: 700, height: 22 }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {segregatedTags.ml?.length > 0 ? (
                          segregatedTags.ml.map((tag) => (
                            <Button
                              key={tag.slug}
                              variant={selectedTagSlug === tag.slug ? 'contained' : 'outlined'}
                              onClick={() => handleTagSelect(tag.slug)}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '10px',
                              }}
                            >
                              {tag.name}
                            </Button>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            {t.noTagsFound}
                          </Typography>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* English Group */}
                  <Accordion
                    sx={{
                      backgroundColor: isDark ? 'rgba(38,28,86,0.3)' : '#ffffff',
                      color: isDark ? '#ffffff' : '#1c1445',
                      borderRadius: '16px !important',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore sx={{ color: isDark ? '#fff' : '#1c1445' }} />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontWeight: 700 }}>{t.englishShowsHeading}</Typography>
                        <Chip
                          size="small"
                          label={`${segregatedTags.en?.length || 0}`}
                          sx={{ fontWeight: 700, height: 22 }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        {segregatedTags.en?.length > 0 ? (
                          segregatedTags.en.map((tag) => (
                            <Button
                              key={tag.slug}
                              variant={selectedTagSlug === tag.slug ? 'contained' : 'outlined'}
                              onClick={() => handleTagSelect(tag.slug)}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: '10px',
                              }}
                            >
                              {tag.name}
                            </Button>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            {t.noTagsFound}
                          </Typography>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

              {/* Tag Selector Tabs for Single-Language mode */}
              {selectedLanguage !== 'all' && (
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  }}
                >
                  <Tabs
                    value={selectedTagSlug || false}
                    onChange={(_, val) => handleTagSelect(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: isDark ? '#a5b4fc' : '#5c548a',
                        '&.Mui-selected': {
                          color: isDark ? '#ffffff' : '#2563eb',
                        },
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#2563eb',
                        height: 3,
                      },
                    }}
                  >
                    {tags.map((tag) => (
                      <Tab
                        key={tag.slug}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{tag.name}</span>
                            {renderLanguageBadge(tag.language)}
                          </Box>
                        }
                        value={tag.slug}
                      />
                    ))}
                  </Tabs>
                </Box>
              )}

              {/* Selected Tag Card & Stream Actions */}
              {selectedTag ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    p: 3,
                    borderRadius: '20px',
                    backgroundColor: isDark ? 'rgba(38,28,86,0.4)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                    boxShadow: isDark
                      ? '0 8px 32px rgba(0,0,0,0.2)'
                      : '0 8px 32px rgba(0,0,0,0.04)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', md: 'center' },
                      gap: 3,
                    }}
                  >
                    {/* Tag Details */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                      {selectedTag.thumbnailUrl ? (
                        <Avatar
                          src={selectedTag.thumbnailUrl}
                          variant="rounded"
                          sx={{ width: 56, height: 56, borderRadius: '14px' }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '14px',
                            backgroundColor: isDark ? 'rgba(147,197,253,0.15)' : 'rgba(37,99,235,0.1)',
                            color: isDark ? '#93c5fd' : '#2563eb',
                          }}
                        >
                          <LiveTv fontSize="medium" />
                        </Avatar>
                      )}

                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {selectedTag.name}
                          </Typography>
                          {renderLanguageBadge(selectedTag.language)}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.3 }}>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontFamily: 'monospace' }}>
                            slug: {selectedTag.slug}
                          </Typography>
                          {selectedTag.description && (
                            <>
                              <Typography variant="caption" sx={{ opacity: 0.4 }}>
                                •
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                {selectedTag.description}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          width: '1px',
                          height: '36px',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                          display: { xs: 'none', sm: 'block' },
                        }}
                      />

                      {/* Video Stats */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            backgroundColor: isDark
                              ? 'rgba(147,197,253,0.15)'
                              : 'rgba(37,99,235,0.1)',
                            color: isDark ? '#93c5fd' : '#2563eb',
                          }}
                        >
                          <LiveTv fontSize="small" />
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ opacity: 0.7, textTransform: 'uppercase', fontWeight: 700 }}
                          >
                            {t.totalVideos}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, mt: 0.3 }}>
                            {stats.total}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Actions: Daily Sync, Edit, Delete */}
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        startIcon={isSyncing ? <CircularProgress size={16} /> : <Sync />}
                        disabled={isSyncing}
                        onClick={() => handleDailySync(selectedTag.slug)}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: isDark ? 'rgba(147,197,253,0.4)' : 'rgba(37,99,235,0.4)',
                          color: isDark ? '#93c5fd' : '#2563eb',
                          '&:hover': {
                            borderColor: '#2563eb',
                            backgroundColor: isDark
                              ? 'rgba(37,99,235,0.1)'
                              : 'rgba(37,99,235,0.06)',
                          },
                        }}
                      >
                        {isSyncing ? t.syncingBtn : t.dailySyncBtn}
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleOpenEditTagModal(selectedTag)}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                          color: isDark ? '#ffffff' : '#1c1445',
                          '&:hover': {
                            borderColor: isDark ? '#ffffff' : '#1c1445',
                            backgroundColor: isDark
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.04)',
                          },
                        }}
                      >
                        {t.editTag}
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteSweep />}
                        onClick={() => setDeleteConfirmOpen(true)}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 700,
                        }}
                      >
                        {t.deleteTag}
                      </Button>
                    </Box>
                  </Box>

                  {/* Search Bar */}
                  <TextField
                    fullWidth
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: isDark ? '#a5b4fc' : '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                        color: isDark ? '#ffffff' : '#1c1445',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563eb',
                        },
                      },
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: '20px',
                    backgroundColor: isDark ? 'rgba(38,28,86,0.35)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <Typography variant="body1" sx={{ opacity: 0.7 }}>
                    {tags.length === 0 ? t.noTagsFound : t.selectTagPrompt}
                  </Typography>
                </Box>
              )}

              {/* Table View */}
              {loading ? (
                <Loader />
              ) : (
                selectedTag && (
                  <LiveTvVideosTable
                    videos={paginatedVideos}
                    t={t}
                    isDark={isDark}
                    onPlay={handlePlayVideo}
                    onEditVideo={handleOpenEditVideoModal}
                    onDeleteVideo={handleDeleteVideo}
                  />
                )
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                      },
                    }}
                  />
                </Box>
              )}

              {/* Modals */}
              <TagCreateModal
                open={createTagModalOpen}
                onClose={() => setCreateTagModalOpen(false)}
                onSave={handleCreateTag}
                isDark={isDark}
                t={t}
                initialLanguage={
                  (selectedLanguage === 'all'
                    ? (allowedLanguages[0] || 'te')
                    : selectedLanguage) as TagLanguage
                }
                allowedLanguages={allowedLanguages}
              />

              <TagEditModal
                open={editTagModalOpen}
                onClose={() => setEditTagModalOpen(false)}
                tag={activeTagForEdit}
                onSave={handleUpdateTag}
                isDark={isDark}
                t={t}
                allowedLanguages={allowedLanguages}
              />

              <VideoPlayerModal
                open={playerModalOpen}
                onClose={() => setPlayerModalOpen(false)}
                video={activeVideoForPlayer}
                isDark={isDark}
                t={t}
              />

              <VideoEditModal
                open={editVideoModalOpen}
                onClose={() => setEditVideoModalOpen(false)}
                video={activeVideoForEdit}
                onSave={handleUpdateVideo}
                isDark={isDark}
                t={t}
              />

              {/* Delete Confirm Dialog */}
              <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                PaperProps={{
                  sx: {
                    backgroundColor: isDark ? '#140e36' : '#ffffff',
                    color: isDark ? '#ffffff' : '#1c1445',
                    borderRadius: '16px',
                  },
                }}
              >
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {t.deleteConfirmTitle}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText sx={{ color: isDark ? '#d0caeb' : '#475569' }}>
                    {t.deleteConfirmDesc}
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button
                    onClick={() => setDeleteConfirmOpen(false)}
                    sx={{ color: isDark ? '#94a3b8' : undefined }}
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    onClick={confirmDeleteTag}
                    color="error"
                    variant="contained"
                    sx={{ borderRadius: '8px' }}
                  >
                    {t.delete}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
