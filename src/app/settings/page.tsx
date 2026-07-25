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
  Avatar,
  IconButton,
  Divider,
  Tooltip,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
} from '@mui/material';
import {
  AddCircleOutline,
  Category as CategoryIcon,
  LocationOn,
  People,
  Settings as SettingsIcon,
  Movie,
  Language as LanguageIcon,
  Input,
  PersonOutline,
  Notifications,
  AutoAwesome,
  ColorLens,
  Security,
  Article,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useLanguageStore, SupportedLanguage } from '@/core/storage/language-store';
import { useAppTheme } from '@/shared/providers/ThemeProvider';

// Translation dictionary matching localized keys
const translations = {
  en: {
    title: "System Settings",
    portalLanguage: "Portal Language",
    selectLang: "Select the active localization mapping key for the CMS workspace:",
    themeSelection: "Theme Selection",
    toggleTheme: "Toggle Theme Mode",
    activeMode: "Active Mode",
    notifications: "Notification Controls",
    popups: "Enable In-App Popups",
    emailAlerts: "Email Alerts",
    otherSettings: "Other System Settings",
    sound: "Sound Notifications",
    twoFactor: "Two-Factor Security (2FA)",
    menuCreate: "Create News",
    menuCategories: "Categories",
    menuLocations: "Locations",
    menuCreators: "Creators",
    menuPostTypes: "Post Types",
    menuLanguages: "Languages",
    menuAiTags: "AiTags",
    menuReels: "Reels",
    menuSettings: "Settings"
  },
  te: {
    title: "సిస్టమ్ సెట్టింగులు (System Settings)",
    portalLanguage: "పోర్టల్ భాష (Portal Language)",
    selectLang: "CMS వర్క్‌స్పేస్ కోసం క్రియాశీల స్థానికీకరణ మ్యాపింగ్ కీని ఎంచుకోండి:",
    themeSelection: "థీమ్ ఎంపిక (Theme Selection)",
    toggleTheme: "థీమ్ మోడ్ మార్చండి",
    activeMode: "క్రియాశీల మోడ్",
    notifications: "నోటిఫికేషన్ నియంత్రణలు",
    popups: "యాప్‌లోని పాపప్‌లను ప్రారంభించండి",
    emailAlerts: "ఇమెయిల్ హెచ్చరికలు",
    otherSettings: "ఇతర సిస్టమ్ సెట్టింగులు",
    sound: "ధ్వని నోటిఫికేషన్‌లు",
    twoFactor: "రెండు-కారకాల భద్రత (2FA)",
    menuCreate: "వార్తలను సృష్టించండి",
    menuCategories: "విభాగాలు",
    menuLocations: "ప్రాంతాలు",
    menuCreators: "సృష్టికర్తలు",
    menuPostTypes: "పోస్ట్ రకాలు",
    menuLanguages: "భాషలు",
    menuAiTags: "AiTags",
    menuReels: "రీల్స్",
    menuSettings: "సెట్టింగులు"
  },
  hi: {
    title: "सिस्टम सेटिंग्स (System Settings)",
    portalLanguage: "पोर्टल भाषा (Portal Language)",
    selectLang: "सीएमएस कार्यक्षेत्र के लिए सक्रिय स्थानीयकरण मैपिंग कुंजी का चयन करें:",
    themeSelection: "थीम चयन (Theme Selection)",
    toggleTheme: "थीम मोड बदलें",
    activeMode: "सक्रिय मोड",
    notifications: "अधिसूचना नियंत्रण",
    popups: "इन-ऐप पॉपअप सक्षम करें",
    emailAlerts: "ईमेल अलर्ट",
    otherSettings: "अन्य सिस्टम सेटिंग्स",
    sound: "ध्वनि सूचनाएं",
    twoFactor: "द्वि-कारक सुरक्षा (2FA)",
    menuCreate: "समाचार बनाएं",
    menuCategories: "श्रेणियां",
    menuLocations: "स्थान",
    menuCreators: "निर्माता",
    menuPostTypes: "पोस्ट के प्रकार",
    menuLanguages: "भाषाएँ",
    menuAiTags: "AiTags",
    menuReels: "रील्स",
    menuSettings: "सेटिंग्स"
  },
  ml: {
    title: "സിസ്റ്റം ക്രമീകരണങ്ങൾ (System Settings)",
    portalLanguage: "പോർട്ടൽ ഭാഷ (Portal Language)",
    selectLang: "CMS വർക്ക്‌സ്‌പെയ്‌സിനായി സജീവമായ പ്രാദേശികവൽക്കരണ മാപ്പിംഗ് കീ തിരഞ്ഞെടുക്കുക:",
    themeSelection: "തീം തിരഞ്ഞെടുക്കൽ (Theme Selection)",
    toggleTheme: "തീം മോഡ് മാറ്റുക",
    activeMode: "സജീവ മോഡ്",
    notifications: "അറിയിപ്പ് നിയന്ത്രണങ്ങൾ",
    popups: "ആപ്പിലെ പോപ്പ്അപ്പുകൾ പ്രവർത്തനക്ഷമമാക്കുക",
    emailAlerts: "ഇമെയിൽ അലേർട്ടുകൾ",
    otherSettings: "മറ്റ് സിസ്റ്റം ക്രമീകരണങ്ങൾ",
    sound: "ശബ്ദ അറിയിപ്പുകൾ",
    twoFactor: "ടു-ഫാക്ടർ സെക്യൂരിറ്റി (2FA)",
    menuCreate: "വാർത്ത സൃഷ്ടിക്കുക",
    menuCategories: "വിഭാഗങ്ങൾ",
    menuLocations: "സ്ഥലങ്ങൾ",
    menuCreators: "സ്രഷ്‌ടാക്കൾ",
    menuPostTypes: "പോസ്റ്റ് തരങ്ങൾ",
    menuLanguages: "ഭാഷകൾ",
    menuAiTags: "AiTags",
    menuReels: "റീലുകൾ",
    menuSettings: "ക്രമീകരണങ്ങൾ"
  }
};

export default function SettingsPage() {
  const router = useRouter();
  const { language, setLanguage, activeLanguages } = useLanguageStore();
  const { mode, toggleTheme } = useAppTheme();

  const isDark = mode === 'dark';

  // Local lang state mirrors the store — changing it forces a full re-render
  const [currentLang, setCurrentLang] = React.useState<SupportedLanguage>(language);
  const [saved, setSaved] = React.useState(false);

  // Sync currentLang if store language changes (e.g. deactivated fallback)
  React.useEffect(() => {
    setCurrentLang(language);
  }, [language]);

  // Keep local state in sync when store changes (e.g. from another tab)
  React.useEffect(() => {
    setCurrentLang(language);
  }, [language]);

  // Active translation dictionary — driven by local state for instant UI update
  const t = translations[currentLang] || translations.en;

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);   // instant UI update
    setLanguage(lang);      // persist to store + cookie + localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Settings State Hooks
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [twoFactor, setTwoFactor] = React.useState(false);

  // Side menu items — fully localized
  const menuItems = [
    { text: t.menuCreate ?? 'Create News', icon: <AddCircleOutline />, action: () => router.push('/dashboard') },
    { text: t.menuReels ?? 'Reels', icon: <Movie />, action: () => router.push('/reels') },
    { text: t.menuCategories ?? 'Categories', icon: <CategoryIcon />, action: () => router.push('/categories') },
    { text: t.menuLocations ?? 'Locations', icon: <LocationOn />, action: () => router.push('/locations') },
    { text: t.menuCreators ?? 'Creators', icon: <People />, action: () => router.push('/creators') },
    { text: t.menuPostTypes ?? 'Post Types', icon: <Article />, action: () => router.push('/post-types') },
    { text: t.menuLanguages ?? 'Languages', icon: <LanguageIcon />, action: () => router.push('/languages') },
    { text: t.menuAiTags ?? 'AiTags', icon: <AutoAwesome />, action: () => router.push('/aitags') },
    { text: t.menuSettings ?? 'Settings', icon: <SettingsIcon />, active: true },
  ];

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
      <Sidebar activeHref="/settings" />

      {/* Main Panel Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Header Navigation */}
        <Header title={isDark ? 'BigTV Settings' : 'BigTV Settings (Light)'} />

        {/* Scrollable Settings Panel */}
        <Box sx={{ pt: 2, px: 3, pb: 4, flex: 1, overflowY: 'auto' }}>
          <Typography variant="h5" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 700, mb: 3 }}>
            {t.title}
          </Typography>

          <Grid container spacing={3}>
            {/* Language Selection Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#f4f3f8', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '16px' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LanguageIcon sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }} />
                    <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                      {t.portalLanguage}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,0.06)' }} />
                  <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                    {t.selectLang}
                  </Typography>
                  <TextField
                    select
                    value={currentLang}
                    onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                    size="small"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: isDark ? '#ffffff' : '#1c1445',
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                        borderRadius: '12px',
                      },
                    }}
                  >
                    {activeLanguages.includes('en') && <MenuItem value="en">English (World Standard)</MenuItem>}
                    {activeLanguages.includes('te') && <MenuItem value="te">Telugu (తెలుగు)</MenuItem>}
                    {activeLanguages.includes('hi') && <MenuItem value="hi">Hindi (हिन्दी)</MenuItem>}
                    {activeLanguages.includes('ml') && <MenuItem value="ml">Malayalam (മലയാളം)</MenuItem>}
                  </TextField>
                  {saved && (
                    <Box sx={{ mt: 1, px: 1.5, py: 0.8, borderRadius: '10px', backgroundColor: isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.07)', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontWeight: 600 }}>
                        ✓ {currentLang === 'en' ? 'Language saved — English' : currentLang === 'te' ? 'భాష సేవ్ అయింది — తెలుగు' : currentLang === 'hi' ? 'भाषा सहेजी गई — हिंदी' : 'ഭാഷ സംരക്ഷിച്ചു — മലയാളം'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Theme Customization Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#f4f3f8', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '16px' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ColorLens sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }} />
                    <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                      {t.themeSelection}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,0.06)' }} />
                  <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                    Toggle appearance mode:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 500 }}>
                      {t.activeMode}: {mode.toUpperCase()}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={toggleTheme}
                      sx={{
                        color: isDark ? '#a6e2f5' : '#1c1445',
                        borderColor: isDark ? '#a6e2f5' : '#1c1445',
                        borderRadius: '12px',
                        '&:hover': {
                          borderColor: isDark ? '#8cd5ed' : '#110d29',
                          backgroundColor: isDark ? 'rgba(166,226,245,0.08)' : 'rgba(28,20,69,0.05)',
                        },
                      }}
                    >
                      {t.toggleTheme}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Notification Control Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#f4f3f8', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '16px' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Notifications sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }} />
                    <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                      {t.notifications}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,0.06)' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationsEnabled}
                          onChange={(e) => setNotificationsEnabled(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                        />
                      }
                      label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>{t.popups}</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={emailAlerts}
                          onChange={(e) => setEmailAlerts(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                        />
                      }
                      label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>{t.emailAlerts}</Typography>}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Other Settings Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#f4f3f8', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '16px' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Security sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }} />
                    <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
                      {t.otherSettings}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,0.06)' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={soundEnabled}
                          onChange={(e) => setSoundEnabled(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                        />
                      }
                      label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>{t.sound}</Typography>}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={twoFactor}
                          onChange={(e) => setTwoFactor(e.target.checked)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: isDark ? '#a6e2f5' : '#1c1445' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: isDark ? '#a6e2f5' : '#1c1445' } }}
                        />
                      }
                      label={<Typography variant="body2" sx={{ color: isDark ? '#ffffff' : '#1c1445' }}>{t.twoFactor}</Typography>}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
