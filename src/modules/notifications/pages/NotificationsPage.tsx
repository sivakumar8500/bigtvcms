import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Pagination,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterListOff,
  ArrowBack,
  ContentCopy,
  Send as SendIcon,
} from '@mui/icons-material';
import { Header } from '@/shared/components/Header';
import { Sidebar } from '@/shared/components/Sidebar';
import { useLanguageStore } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';
import { useNotificationsController } from '../hooks/useNotificationsController';
import { NotificationsTable } from '../components/NotificationsTable';
import { SendNotificationForm } from '../components/SendNotificationForm';
import { NotificationItem } from '../dto/notification.dto';
import { Loader } from '@/shared/components/Loader';

const translations: Record<string, any> = {
  en: {
    title: 'Notifications',
    searchPlaceholder: 'Search title, content, or post ID...',
    filterStatus: 'Status',
    allStatus: 'All Status',
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    colImage: 'Banner',
    colDetails: 'Title & Content',
    colPostId: 'Post ID & Link',
    colStatus: 'Status',
    colDelivery: 'Delivery Stats',
    colTimestamps: 'Sent / Created At',
    noRecords: 'No notification records found.',
    btnSendNotification: 'Send Notification',
    clearFilters: 'Clear Filters',
    totalRecords: (n: number) => `Total ${n} notifications`,
    targeted: 'Targeted',
    delivered: 'Delivered',
    failedCount: 'Failed',
    linkCopied: 'Link copied to clipboard!',
    sendSuccess: 'Notification sent successfully!',
    detailsTitle: 'Notification Details',
    back: 'Back to Notifications',
    lblNotificationTitle: 'Notification Title *',
    lblNotificationContent: 'Notification Content *',
    errTitleRequired: 'Title is required',
    errTitleWordLimit: 'Title must be 10 words or fewer',
    errContentRequired: 'Content is required',
    errContentWordLimit: 'Content must be 50 words or fewer',
    errPostIdRequired: 'Valid Post ID is required',
    errLinkRequired: 'Link is required',
    errImageUrlRequired: 'Image URL is required',
    cancel: 'Cancel',
  },
  te: {
    title: 'నోటిఫికేషన్లు',
    searchPlaceholder: 'శీర్షిక, విషయము లేదా పోస్ట్ ఐడీ ద్వారా శోధించండి...',
    filterStatus: 'స్థితి',
    allStatus: 'అన్ని స్థితులు',
    completed: 'పూర్తయింది',
    pending: 'పెండింగ్',
    failed: 'విఫలమైంది',
    colImage: 'బ్యానర్',
    colDetails: 'శీర్షిక & విషయము',
    colPostId: 'పోస్ట్ ఐడీ & లింక్',
    colStatus: 'స్థితి',
    colDelivery: 'డెలివరీ గణాంకాలు',
    colTimestamps: 'పంపిన / సృష్టించిన సమయం',
    noRecords: 'నోటిఫికేషన్లు కనుగొనబడలేదు.',
    btnSendNotification: 'నోటిఫికేషన్ పంపు',
    clearFilters: 'ఫిల్టర్‌లు తీసివేయి',
    totalRecords: (n: number) => `మొత్తం ${n} నోటిఫికేషన్లు`,
    targeted: 'లక్ష్యం',
    delivered: 'అందించబడింది',
    failedCount: 'విఫలమైంది',
    linkCopied: 'లింక్ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!',
    sendSuccess: 'నోటిఫికేషన్ విజయవంతంగా పంపబడింది!',
    detailsTitle: 'నోటిఫికేషన్ వివరాలు',
    back: 'నోటిఫికేషన్లకు తిరిగి వెళ్ళండి',
    lblNotificationTitle: 'నోటిఫికేషన్ శీర్షిక *',
    lblNotificationContent: 'నోటిఫికేషన్ విషయము *',
    errTitleRequired: 'శీర్షిక అవసరం',
    errTitleWordLimit: 'శీర్షిక 10 పదాలకు మించకూడదు',
    errContentRequired: 'విషయము అవసరం',
    errContentWordLimit: 'విషయము 50 పదాలకు మించకూడదు',
    errPostIdRequired: 'చెల్లుబాటు అయ్యే పోస్ట్ ఐడీ అవసరం',
    errLinkRequired: 'లింక్ అవసరం',
    errImageUrlRequired: 'ఇమేజ్ URL అవసరం',
    cancel: 'రద్దు చేయి',
  },
  hi: {
    title: 'सूचनाएं',
    searchPlaceholder: 'शीर्षक, सामग्री या पोस्ट आईडी से खोजें...',
    filterStatus: 'स्थिति',
    allStatus: 'सभी स्थिति',
    completed: 'पूरा हुआ',
    pending: 'लंबित',
    failed: 'विफल',
    colImage: 'बैनर',
    colDetails: 'शीर्षक और सामग्री',
    colPostId: 'पोस्ट आईडी और लिंक',
    colStatus: 'स्थिति',
    colDelivery: 'वितरण आंकड़े',
    colTimestamps: 'भेजा / बनाया गया समय',
    noRecords: 'कोई सूचना नहीं मिली।',
    btnSendNotification: 'सूचना भेजें',
    clearFilters: 'फ़िल्टर हटाएं',
    totalRecords: (n: number) => `कुल ${n} सूचनाएं`,
    targeted: 'लक्षित',
    delivered: 'वितरित',
    failedCount: 'विफल',
    linkCopied: 'लिंक क्लिपबोर्ड पर कॉपी किया गया!',
    sendSuccess: 'सूचना सफलतापूर्वक भेजी गई!',
    detailsTitle: 'सूचना विवरण',
    back: 'सूचनाओं पर वापस जाएं',
    lblNotificationTitle: 'सूचना शीर्षक *',
    lblNotificationContent: 'सूचना सामग्री *',
    errTitleRequired: 'शीर्षक आवश्यक है',
    errTitleWordLimit: 'शीर्षक 10 शब्दों से अधिक नहीं होना चाहिए',
    errContentRequired: 'सामग्री आवश्यक है',
    errContentWordLimit: 'सामग्री 50 शब्दों से अधिक नहीं होनी चाहिए',
    errPostIdRequired: 'वैध पोस्ट आईडी आवश्यक है',
    errLinkRequired: 'लिंक आवश्यक है',
    errImageUrlRequired: 'इमेज यूआरएल आवश्यक है',
    cancel: 'रद्द करें',
  },
  ml: {
    title: 'അറിയിപ്പുകൾ',
    searchPlaceholder: 'തലക്കെട്ട്, ഉള്ളടക്കം അല്ലെങ്കിൽ പോസ്റ്റ് ഐഡി തിരയുക...',
    filterStatus: 'നില',
    allStatus: 'എല്ലാ നിലകളും',
    completed: 'പൂർത്തിയായി',
    pending: 'പെൻഡിംഗ്',
    failed: 'പരാജയപ്പെട്ടു',
    colImage: 'ബാനർ',
    colDetails: 'തലക്കെട്ടും ഉള്ളടക്കവും',
    colPostId: 'പോസ്റ്റ് ഐഡിയും ലിങ്കും',
    colStatus: 'നില',
    colDelivery: 'ഡെലിവറി സ്ഥിതിവിവരക്കണക്കുകൾ',
    colTimestamps: 'അയച്ച / സൃഷ്ടിച്ച സമയം',
    noRecords: 'അറിയിപ്പുകളൊന്നും കണ്ടെത്തിയില്ല.',
    btnSendNotification: 'അറിയിപ്പ് അയക്കുക',
    clearFilters: 'ഫിൽട്ടറുകൾ നീക്കം ചെയ്യുക',
    totalRecords: (n: number) => `ആകെ ${n} അറിയിപ്പുകൾ`,
    targeted: 'ലക്ഷ്യമിട്ടത്',
    delivered: 'ഡെലിവർ ചെയ്തു',
    failedCount: 'പരാജയപ്പെട്ടു',
    linkCopied: 'ലിങ്ക് ക്ലിപ്പ്ബോർഡിലേക്ക് പകർത്തി!',
    sendSuccess: 'അറിയിപ്പ് വിജയകരമായി അയച്ചു!',
    detailsTitle: 'അറിയിപ്പ് വിവരങ്ങൾ',
    back: 'അറിയിപ്പുകളിലേക്ക് മടങ്ങുക',
    lblNotificationTitle: 'അറിയിപ്പ് തലക്കെട്ട് *',
    lblNotificationContent: 'അറിയിപ്പ് ഉള്ളടക്കം *',
    errTitleRequired: 'തലക്കെട്ട് ആവശ്യമാണ്',
    errTitleWordLimit: 'തലക്കെട്ട് 10 വാക്കുകളിൽ കവിയരുത്',
    errContentRequired: 'ഉള്ളടക്കം ആവശ്യമാണ്',
    errContentWordLimit: 'ഉള്ളടക്കം 50 വാക്കുകളിൽ കവിയരുത്',
    errPostIdRequired: 'സാധുവായ പോസ്റ്റ് ഐഡി ആവശ്യമാണ്',
    errLinkRequired: 'ലിങ്ക് ആവശ്യമാണ്',
    errImageUrlRequired: 'ഇമേജ് യുആർഎൽ ആവശ്യമാണ്',
    cancel: 'റദ്ദാക്കുക',
  },
};

export const NotificationsPage: React.FC = () => {
  const { language } = useLanguageStore();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const t = translations[language] || translations.en;

  const recordsPerPage = 20;
  const {
    notifications,
    total,
    skip,
    setSkip,
    loading,
    error,
    fetchNotifications,
  } = useNotificationsController(0, recordsPerPage);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sendFormOpen, setSendFormOpen] = useState<boolean>(false);
  const [viewingItem, setViewingItem] = useState<NotificationItem | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.content?.toLowerCase().includes(q) ||
        String(item.postId).includes(q) ||
        item.id?.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === 'All' ||
        (item.status || '').toUpperCase() === selectedStatus.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [notifications, searchQuery, selectedStatus]);

  const currentPage = Math.floor(skip / recordsPerPage) + 1;
  const totalPages = Math.ceil(total / recordsPerPage) || 1;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const newSkip = (value - 1) * recordsPerPage;
    setSkip(newSkip);
  };

  const handleCopyLink = (link: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setToast({ open: true, message: t.linkCopied, severity: 'success' });
    }
  };

  const hasActiveFilters = searchQuery !== '' || selectedStatus !== 'All';

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isDark ? '#110d29' : '#ffffff',
        color: isDark ? '#ffffff' : '#1c1445',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Fixed Sidebar Panel */}
      <Sidebar activeHref="/notifications" />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Header */}
        <Header title={t.title} />

        {/* Scrollable Body Area */}
        <Box sx={{ pt: 2, px: 2, pb: 4, flex: 1, overflowY: 'auto' }}>
          {viewingItem ? (
            /* ── Notification Detail View Panel ── */
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
                  onClick={() => setViewingItem(null)}
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
                  {t.detailsTitle}
                </Typography>
              </Box>

              {/* Side-by-side Details + Phone Simulator */}
              <Box sx={{ p: 3, backgroundColor: isDark ? 'rgba(38,28,86,0.2)' : '#f5f5f7' }}>
                <Grid container spacing={4} alignItems="stretch">
                  {/* Left: Summary Panel */}
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
                      <Typography variant="subtitle1" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700, fontSize: '1rem' }}>
                        Notification Dispatch Summary
                      </Typography>
                      <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.5 }}>
                          Notification Title
                        </Typography>
                        <Typography variant="body1" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, lineHeight: 1.4 }}>
                          {viewingItem.title}
                        </Typography>
                      </Box>

                      <Box sx={{ flexGrow: 1, maxHeight: '200px', overflowY: 'auto', pr: 0.5 }}>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.5 }}>
                          Content / Body
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.72)' : 'rgba(28,20,69,0.8)', lineHeight: 1.7 }}>
                          {viewingItem.content}
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>
                            Target Post ID
                          </Typography>
                          <Typography variant="body2" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 700 }}>
                            Post #{viewingItem.postId}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>
                            Delivery Status
                          </Typography>
                          <Typography variant="body2" sx={{ color: viewingItem.status === 'COMPLETED' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                            {viewingItem.status}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block', mb: 0.4 }}>
                          Deep Link
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                            {viewingItem.link}
                          </Typography>
                          <IconButton size="small" onClick={() => handleCopyLink(viewingItem.link)} sx={{ color: '#2563eb' }}>
                            <ContentCopy sx={{ fontSize: '0.9rem' }} />
                          </IconButton>
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, display: 'block' }}>
                            Targeted
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#ffffff' : '#1c1445' }}>
                            {viewingItem.totalTargeted}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, display: 'block' }}>
                            Delivered
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                            {viewingItem.successCount}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, display: 'block' }}>
                            Failed
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>
                            {viewingItem.failureCount}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* Right: Phone Simulator */}
                  <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '300px',
                        height: '500px',
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
                      <Box sx={{ width: '60px', height: '14px', backgroundColor: '#222222', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
                      <Box sx={{ height: '24px', px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#181818', pt: 1.5, zIndex: 9 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#ffffff' }}>4:27</Typography>
                        <Box sx={{ display: 'flex', gap: 0.4 }}>
                          <Box component="span" sx={{ fontSize: '0.55rem', color: '#fff' }}>VoWiFi</Box>
                          <Box component="span" sx={{ fontSize: '0.55rem', color: '#fff' }}>4G</Box>
                          <Box component="span" sx={{ fontSize: '0.55rem', color: '#fff' }}>🔋 44</Box>
                        </Box>
                      </Box>

                      {/* Push Notification Card inside simulator */}
                      <Box sx={{ p: 2, flex: 1, backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', pt: 4 }}>
                        <Box sx={{ backgroundColor: '#ffffff', borderRadius: '16px', p: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: '#e53935', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography sx={{ color: '#fff', fontSize: '0.5rem', fontWeight: 900 }}>B</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', fontSize: '0.7rem' }}>BIG TV</Typography>
                            <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem', ml: 'auto' }}>now</Typography>
                          </Box>

                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', fontSize: '0.8rem', mb: 0.5 }}>
                            {viewingItem.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.72rem', lineHeight: 1.4, display: 'block', mb: 1.5 }}>
                            {viewingItem.content}
                          </Typography>

                          {viewingItem.imageUrl && (
                            <Box
                              component="img"
                              src={viewingItem.imageUrl}
                              alt="Notification Banner"
                              sx={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '10px' }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : (
            <>
              {/* ── Single-Line Filter Panel with Send Notification Button ── */}
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
                    width: '240px',
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      color: isDark ? '#ffffff' : '#1c1445',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      height: '34px',
                    },
                    '& .MuiInputBase-input': { py: 0.6, px: 1, fontSize: '0.75rem' },
                  }}
                  InputProps={{
                    endAdornment: <Search sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontSize: '0.95rem' }} />,
                  }}
                />

                {/* 2. Status Filter */}
                <TextField
                  select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  size="small"
                  sx={{
                    width: '130px',
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
                  <MenuItem value="All" sx={{ fontSize: '0.75rem' }}>{t.allStatus}</MenuItem>
                  <MenuItem value="COMPLETED" sx={{ fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                      {t.completed}
                    </Box>
                  </MenuItem>
                  <MenuItem value="PENDING" sx={{ fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                      {t.pending}
                    </Box>
                  </MenuItem>
                  <MenuItem value="FAILED" sx={{ fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ef4444' }} />
                      {t.failed}
                    </Box>
                  </MenuItem>
                </TextField>

                {/* 3. Clear Filters Icon Button */}
                {hasActiveFilters && (
                  <Tooltip title={t.clearFilters}>
                    <IconButton
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedStatus('All');
                      }}
                      sx={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        color: '#f44336',
                        backgroundColor: isDark ? 'rgba(244,67,54,0.12)' : 'rgba(244,67,54,0.08)',
                        border: isDark ? '1px solid rgba(244,67,54,0.3)' : '1px solid rgba(244,67,54,0.3)',
                        '&:hover': { backgroundColor: 'rgba(244,67,54,0.2)' },
                        flexShrink: 0,
                      }}
                    >
                      <FilterListOff sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Tooltip>
                )}

                {/* 4. Send Notification Button */}
                <Button
                  id="send-notification-btn"
                  variant="contained"
                  startIcon={<SendIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => setSendFormOpen(true)}
                  sx={{
                    ml: 'auto',
                    flexShrink: 0,
                    borderRadius: '10px',
                    height: '34px',
                    px: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                    color: isDark ? '#1c1445' : '#ffffff',
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: isDark ? '#8cd5ed' : '#2d2270', boxShadow: 'none' },
                  }}
                >
                  {t.btnSendNotification}
                </Button>
              </Box>

              {/* Loader or Table */}
              {loading ? (
                <Loader message="Loading notification logs..." minHeight="300px" />
              ) : (
                <>
                  <NotificationsTable
                    items={filteredNotifications}
                    isDark={isDark}
                    t={t}
                    skip={skip}
                    onCopyLink={handleCopyLink}
                    onViewItem={(item) => setViewingItem(item)}
                  />

                  {/* Footer Pagination */}
                  {total > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 2.5,
                        px: 1,
                        flexWrap: 'wrap',
                        gap: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a', fontWeight: 600, fontSize: '0.82rem' }}>
                        Showing {skip + 1}–{Math.min(skip + recordsPerPage, total)} of {total} items
                      </Typography>

                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            color: isDark ? '#d0caeb' : '#5c548a',
                            fontWeight: 600,
                            borderRadius: '8px',
                            '&.Mui-selected': {
                              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
                              color: isDark ? '#1c1445' : '#ffffff',
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Side Menu Drawer Component for Send Notification */}
      <SendNotificationForm
        open={sendFormOpen}
        onClose={() => setSendFormOpen(false)}
        onSuccess={() => {
          fetchNotifications(0, recordsPerPage);
          setToast({ open: true, message: t.sendSuccess, severity: 'success' });
        }}
        isDark={isDark}
        t={t}
      />

      {/* Snackbar Toast Feedback */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast((prev) => ({ ...prev, open: false }))}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
