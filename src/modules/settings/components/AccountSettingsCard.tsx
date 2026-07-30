import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Alert,
  Grid,
} from '@mui/material';
import {
  PersonOutline,
  LockOutlined,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useUserStore } from '@/core/storage/user-store';
import { useLanguageStore } from '@/core/storage/language-store';

interface AccountSettingsCardProps {
  isDark: boolean;
}

const accountTranslations = {
  en: {
    accountTitle: 'Account Profile & Credentials',
    accountDesc: 'Update your username and login password for CMS portal access.',
    usernameLabel: 'Username',
    usernamePlaceholder: 'Enter username',
    currentPasswordLabel: 'Current Password',
    currentPasswordPlaceholder: 'Enter current password',
    newPasswordLabel: 'New Password',
    newPasswordPlaceholder: 'Enter new password (min 4 characters)',
    confirmPasswordLabel: 'Confirm New Password',
    confirmPasswordPlaceholder: 'Re-enter new password',
    btnUpdateAccount: 'Update Credentials',
    savingAccount: 'Updating...',
    errUsernameRequired: 'Username cannot be empty',
    errPasswordMismatch: 'New passwords do not match',
    errPasswordLength: 'New password must be at least 4 characters',
    accountUpdateSuccess: 'Account credentials updated successfully!',
  },
  te: {
    accountTitle: 'ఖాతా వివరాలు & ఆధారాలు (Account Credentials)',
    accountDesc: 'CMS పోర్టల్ ప్రాప్యత కోసం మీ వినియోగదారు పేరు మరియు లాగిన్ పాస్‌వర్డ్‌ను అప్‌డేట్ చేయండి.',
    usernameLabel: 'వినియోగదారు పేరు (Username)',
    usernamePlaceholder: 'వినియోగదారు పేరును నమోదు చేయండి',
    currentPasswordLabel: 'ప్రస్తుత పాస్‌వర్డ్ (Current Password)',
    currentPasswordPlaceholder: 'ప్రస్తుత పాస్‌వర్డ్‌ను నమోదు చేయండి',
    newPasswordLabel: 'క్రొత్త పాస్‌వర్డ్ (New Password)',
    newPasswordPlaceholder: 'క్రొత్త పాస్‌వర్డ్‌ను నమోదు చేయండి (కనీసం 4 అక్షరాలు)',
    confirmPasswordLabel: 'పాస్‌వర్డ్‌ను నిర్ధారించండి (Confirm Password)',
    confirmPasswordPlaceholder: 'క్రొత్త పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి',
    btnUpdateAccount: 'ఆధారాలను అప్‌డేట్ చేయండి',
    savingAccount: 'అప్‌డేట్ అవుతోంది...',
    errUsernameRequired: 'వినియోగదారు పేరు ఖాళీగా ఉండకూడదు',
    errPasswordMismatch: 'క్రొత్త పాస్‌వర్డ్‌లు సరిపోలలేదు',
    errPasswordLength: 'క్రొత్త పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి',
    accountUpdateSuccess: 'ఖాతా ఆధారాలు విజయవంతంగా అప్‌డేట్ చేయబడ్డాయి!',
  },
  hi: {
    accountTitle: 'खाता विवरण और क्रेडेंशियल (Account Credentials)',
    accountDesc: 'सीएमएस पोर्टल एक्सेस के लिए अपना उपयोगकर्ता नाम और लॉगिन पासवर्ड अपडेट करें।',
    usernameLabel: 'उपयोगकर्ता नाम (Username)',
    usernamePlaceholder: 'उपयोगकर्ता नाम दर्ज करें',
    currentPasswordLabel: 'वर्तमान पासवर्ड (Current Password)',
    currentPasswordPlaceholder: 'वर्तमान पासवर्ड दर्ज करें',
    newPasswordLabel: 'नया पासवर्ड (New Password)',
    newPasswordPlaceholder: 'नया पासवर्ड दर्ज करें (न्यूनतम 4 अक्षर)',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें (Confirm Password)',
    confirmPasswordPlaceholder: 'नया पासवर्ड पुनः दर्ज करें',
    btnUpdateAccount: 'क्रेडेंशियल अपडेट करें',
    savingAccount: 'अपडेट हो रहा है...',
    errUsernameRequired: 'उपयोगकर्ता नाम खाली नहीं हो सकता',
    errPasswordMismatch: 'नए पासवर्ड मेल नहीं खाते',
    errPasswordLength: 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए',
    accountUpdateSuccess: 'खाता क्रेडेंशियल सफलतापूर्वक अपडेट किए गए!',
  },
  ml: {
    accountTitle: 'അക്കൗണ്ട് വിവരങ്ങൾ (Account Credentials)',
    accountDesc: 'CMS പോർട്ടൽ ആക്‌സസിനായി നിങ്ങളുടെ ഉപയോക്തൃനാമവും ലോഗിൻ പാസ്‌വേഡും അപ്‌ഡേറ്റ് ചെയ്യുക.',
    usernameLabel: 'ഉപയോക്തൃനാമം (Username)',
    usernamePlaceholder: 'ഉപയോക്തൃനാമം നൽകുക',
    currentPasswordLabel: 'നിലവിലെ പാസ്‌വേഡ് (Current Password)',
    currentPasswordPlaceholder: 'നിലവിലെ പാസ്‌വേഡ് നൽകുക',
    newPasswordLabel: 'പുതിയ പാസ്‌വേഡ് (New Password)',
    newPasswordPlaceholder: 'പുതിയ പാസ്‌വേഡ് നൽകുക (കുറഞ്ഞത് 4 അക്ഷരങ്ങൾ)',
    confirmPasswordLabel: 'പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക (Confirm Password)',
    confirmPasswordPlaceholder: 'പുതിയ പാസ്‌വേഡ് വീണ്ടും നൽകുക',
    btnUpdateAccount: 'വിവരങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്യുക',
    savingAccount: 'അപ്‌ഡേറ്റ് ചെയ്യുന്നു...',
    errUsernameRequired: 'ഉപയോക്തൃനാമം ശൂന്യമാകരുത്',
    errPasswordMismatch: 'പുതിയ പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല',
    errPasswordLength: 'പുതിയ പാസ്‌വേഡിന് കുറഞ്ഞത് 4 അക്ഷരങ്ങൾ ഉണ്ടായിരിക്കണം',
    accountUpdateSuccess: 'അക്കൗണ്ട് വിവരങ്ങൾ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!',
  },
};

export const AccountSettingsCard: React.FC<AccountSettingsCardProps> = ({ isDark }) => {
  const { user, setUser } = useUserStore();
  const { language } = useLanguageStore();
  const t = accountTranslations[language] || accountTranslations.en;

  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user?.username]);

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setErrorMsg(t.errUsernameRequired);
      return;
    }

    if (newPassword || confirmPassword) {
      if (newPassword.length < 4) {
        setErrorMsg(t.errPasswordLength);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg(t.errPasswordMismatch);
        return;
      }
    }

    setIsSaving(true);

    setTimeout(() => {
      setUser({
        username: trimmedUsername,
        name: trimmedUsername,
      });

      setIsSaving(false);
      setSuccessMsg(t.accountUpdateSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    }, 500);
  };

  return (
    <Card
      sx={{
        backgroundColor: isDark ? 'rgba(38, 28, 86, 0.35)' : '#f4f3f8',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent component="form" onSubmit={handleUpdateAccount} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PersonOutline sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }} />
          <Typography variant="h6" sx={{ color: isDark ? '#ffffff' : '#1c1445', fontWeight: 600 }}>
            {t.accountTitle}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />

        <Typography variant="body2" sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
          {t.accountDesc}
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ borderRadius: '10px', fontSize: '0.85rem' }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ borderRadius: '10px', fontSize: '0.85rem' }}>
            {successMsg}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Username Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t.usernameLabel}
              placeholder={t.usernamePlaceholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ style: { color: isDark ? '#d0caeb' : '#5c548a' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.2rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDark ? '#a6e2f5' : '#1c1445',
                  },
                },
              }}
            />
          </Grid>

          {/* Current Password Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type={showCurrentPassword ? 'text' : 'password'}
              label={t.currentPasswordLabel}
              placeholder={t.currentPasswordPlaceholder}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputLabelProps={{ style: { color: isDark ? '#d0caeb' : '#5c548a' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.2rem' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }}
                    >
                      {showCurrentPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDark ? '#a6e2f5' : '#1c1445',
                  },
                },
              }}
            />
          </Grid>

          {/* New Password Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type={showNewPassword ? 'text' : 'password'}
              label={t.newPasswordLabel}
              placeholder={t.newPasswordPlaceholder}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputLabelProps={{ style: { color: isDark ? '#d0caeb' : '#5c548a' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.2rem' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }}
                    >
                      {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDark ? '#a6e2f5' : '#1c1445',
                  },
                },
              }}
            />
          </Grid>

          {/* Confirm Password Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type={showConfirmPassword ? 'text' : 'password'}
              label={t.confirmPasswordLabel}
              placeholder={t.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputLabelProps={{ style: { color: isDark ? '#d0caeb' : '#5c548a' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: isDark ? '#a6e2f5' : '#1c1445', fontSize: '1.2rem' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                      sx={{ color: isDark ? '#a6e2f5' : '#1c1445' }}
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDark ? '#ffffff' : '#1c1445',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDark ? '#a6e2f5' : '#1c1445',
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: '12px',
              backgroundColor: isDark ? '#a6e2f5' : '#1c1445',
              color: isDark ? '#110d29' : '#ffffff',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: isDark ? '#8cd5ed' : '#2b1f64',
              },
            }}
          >
            {isSaving ? t.savingAccount : t.btnUpdateAccount}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
