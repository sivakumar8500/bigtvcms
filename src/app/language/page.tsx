'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Button,
  Container,
  CircularProgress,
} from '@mui/material';
import { useLanguageStore, SupportedLanguage } from '@/core/storage/language-store';
import { apiClient } from '@/core/api/api-client';
import { useUserStore } from '@/core/storage/user-store';

interface LanguageOption {
  key: SupportedLanguage;
  name: string;
  nativeName: string;
  slogan: string;
  symbol: string;
}

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { language, setLanguage, activeLanguages } = useLanguageStore();

  const [activeOptions, setActiveOptions] = useState<LanguageOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackOptions: LanguageOption[] = [
    {
      key: 'en',
      name: 'English',
      nativeName: 'English',
      slogan: 'World Standard Edition',
      symbol: 'A',
    },
    {
      key: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      slogan: 'ఆంధ్రప్రదేశ్ & తెలంగాణ వార్తలు',
      symbol: 'అ',
    },
    {
      key: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      slogan: 'राष्ट्रीय मुख्य समाचार हिंदी में',
      symbol: 'अ',
    },
    {
      key: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      slogan: 'കേരള പ്രാദേശിക വാർത്തകൾ',
      symbol: 'അ',
    },
  ];

  useEffect(() => {
    let active = true;
    const codeMap: Record<string, SupportedLanguage> = {
      English: 'en',
      Telugu: 'te',
      Malayalam: 'ml',
      Hindi: 'hi',
    };

    apiClient.get<any[]>('/languages', { skip: 0, limit: 100 })
      .then((data) => {
        if (!active) return;
        const systemLangsMapped = data.map((item: any) => {
          const nameEn = item.name?.en || '';
          const rawCode = (item.code || '').toLowerCase().trim();
          const code = (['en', 'te', 'hi', 'ml'].includes(rawCode)
            ? rawCode
            : codeMap[nameEn] || (nameEn.toLowerCase().startsWith('mal') ? 'ml' : nameEn.toLowerCase().slice(0, 2))) as SupportedLanguage;
          return {
            languageId: item.id,
            languageName: nameEn,
            code,
            slogan: code === 'en' ? 'World Standard Edition' :
                    code === 'te' ? 'ఆంధ్రప్రదేశ్ & తెలంగాణ వార్తలు' :
                    code === 'hi' ? 'राष्ट्रीय मुख्य समाचार हिंदी में' :
                    code === 'ml' ? 'കേരള പ്രാദേശിക വാർത്തകൾ' : '',
            isSystemActive: item.status === true,
            nameEn: item.name?.en || '',
            nameTe: item.name?.te || '',
            nameHi: item.name?.hi || '',
            nameMl: item.name?.ml || '',
            symbol: item.symbol || '',
          };
        });

        // Save system languages to Zustand store
        if (typeof useLanguageStore.getState === 'function') {
          const { setSystemLanguages, setActiveLanguages } = useLanguageStore.getState();
          if (typeof setSystemLanguages === 'function') {
            setSystemLanguages(systemLangsMapped);
          }
          if (typeof setActiveLanguages === 'function') {
            const activeCodes = systemLangsMapped
              .filter((l) => l.isSystemActive && ['en', 'te', 'hi', 'ml'].includes(l.code))
              .map((l) => l.code as SupportedLanguage);
            setActiveLanguages(activeCodes);
          }
        }

        const mapped = systemLangsMapped
          .filter((l) => l.isSystemActive && ['en', 'te', 'hi', 'ml'].includes(l.code))
          .map((l) => {
            const key = l.code as SupportedLanguage;
            const nativeName = l.code === 'en' ? l.nameEn :
                               l.code === 'te' ? l.nameTe :
                               l.code === 'hi' ? l.nameHi :
                               l.code === 'ml' ? l.nameMl : l.nameEn;
            return {
              key,
              name: l.nameEn,
              nativeName,
              slogan: l.slogan,
              symbol: l.symbol || '',
            };
          });

        setActiveOptions(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch languages, using fallback', err);
        if (!active) return;
        const currentActive = useLanguageStore.getState().activeLanguages || ['en', 'te', 'hi', 'ml'];
        const filteredFallback = fallbackOptions.filter((opt) => currentActive.includes(opt.key));
        setActiveOptions(filteredFallback);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLanguageSelect = (key: SupportedLanguage) => {
    setLanguage(key);
  };

  const handleProceed = () => {
    const userRole = (useUserStore.getState().user.role || '').toLowerCase().trim();
    if (userRole === 'epaper_creator') router.push('/epapers');
    else if (userRole === 'notification_creator') router.push('/notifications');
    else if (userRole === 'movie_creator') router.push('/movies');
    else if (
      userRole === 'adsdynapic' ||
      userRole === 'ads_dynapic' ||
      userRole === 'adsdynapix' ||
      userRole === 'ads_dynapix' ||
      userRole === 'adsdynapix_creator' ||
      userRole === 'ads_dynapix_creator'
    )
      router.push('/ads-dynapix');
    else router.push('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgba(234, 179, 8, 0.12) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 45%), linear-gradient(135deg, #161202 0%, #261e05 45%, #181300 100%)',
        overflow: 'hidden',
        position: 'relative',
        p: 2,
        '@keyframes rotate-clockwise': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '@keyframes rotate-counter': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      }}
    >
      {/* Top Left Corner Rotating Yellow Mandala */}
      <Box
        component="img"
        src="/mandala_yellow.png"
        alt="Top Left Mandala decoration"
        data-testid="top-left-sudarshana-chakra"
        sx={{
          position: 'absolute',
          top: { xs: '-140px', sm: '-180px', md: '-210px' },
          left: { xs: '-140px', sm: '-180px', md: '-210px' },
          width: { xs: '360px', sm: '460px', md: '560px' },
          height: 'auto',
          opacity: 0.42,
          zIndex: 1,
          animation: 'rotate-clockwise 35s linear infinite',
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 45px rgba(250, 204, 21, 0.45))',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom Right Corner Rotating Yellow Mandala */}
      <Box
        component="img"
        src="/mandala_yellow.png"
        alt="Bottom Right Mandala decoration"
        data-testid="bottom-right-sudarshana-chakra"
        sx={{
          position: 'absolute',
          bottom: { xs: '-140px', sm: '-180px', md: '-210px' },
          right: { xs: '-140px', sm: '-180px', md: '-210px' },
          width: { xs: '360px', sm: '460px', md: '560px' },
          height: 'auto',
          opacity: 0.42,
          zIndex: 1,
          animation: 'rotate-counter 35s linear infinite',
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 45px rgba(250, 204, 21, 0.45))',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          <Box sx={{ flex: 1, color: '#fff', textAlign: { xs: 'center', md: 'left' } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                mb: 4,
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Box
                component="img"
                src="/bigtv_logo.png"
                alt="BigTV Official Logo"
                sx={{
                  maxHeight: '90px',
                  width: 'auto',
                  filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))',
                }}
              />
              <Typography variant="caption" sx={{ color: '#fde68a', pl: 1, fontWeight: 500, letterSpacing: 0.5 }}>
                Breaking News Portal
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 600, mb: 4, lineHeight: 1.2 }}>
              Enterprise Digital News & Content Hub: <br />
              <span style={{ color: '#facc15', textShadow: '0 0 25px rgba(250, 204, 21, 0.4)' }}>BigTV CMS™</span>
            </Typography>

            <Typography variant="body1" sx={{ color: '#fef3c7', mb: 4, lineHeight: 1.6, opacity: 0.9 }}>
              Select your language on the right panel to configure the Accept-Language API header mappings dynamically across the CMS operator workspace.
            </Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: 'rgba(28, 22, 3, 0.72)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(250, 204, 21, 0.25)',
              borderRadius: '24px',
              p: { xs: 4, md: 5 },
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(234, 179, 8, 0.12)',
            }}
          >
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700, mb: 3, letterSpacing: 0.3 }}>
              Select Language
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px', mb: 4 }}>
                <CircularProgress sx={{ color: '#facc15' }} />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {activeOptions.map((opt) => {
                  const isSelected = language === opt.key;
                  return (
                    <Grid item xs={12} sm={6} key={opt.key}>
                      <Card
                        sx={{
                          backgroundColor: isSelected ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                          border: '2px solid',
                          borderColor: isSelected ? '#facc15' : 'rgba(250, 204, 21, 0.2)',
                          borderRadius: '16px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          boxShadow: isSelected ? '0 8px 30px rgba(234, 179, 8, 0.35)' : 'none',
                          '&:hover': {
                            borderColor: '#facc15',
                            transform: 'translateY(-2px)',
                            backgroundColor: isSelected ? 'rgba(234, 179, 8, 0.3)' : 'rgba(234, 179, 8, 0.1)',
                          },
                          height: '110px',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <CardActionArea
                          onClick={() => handleLanguageSelect(opt.key)}
                          sx={{
                            p: 2.5,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                          }}
                        >
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: isSelected ? '#fde047' : '#ffffff' }}>
                              {opt.nativeName}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: isSelected ? '#fef08a' : '#fde68a',
                                display: 'block',
                                mt: 0.5,
                                fontWeight: 500,
                              }}
                            >
                              {opt.name}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '12px',
                              fontSize: '3.2rem',
                              fontWeight: 800,
                              color: isSelected ? 'rgba(250, 204, 21, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                              fontFamily: 'Arial, sans-serif',
                              lineHeight: 1,
                              userSelect: 'none',
                              pointerEvents: 'none',
                            }}
                          >
                            {opt.symbol}
                          </Typography>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleProceed}
              sx={{
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                color: '#1a1300',
                py: 1.8,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(234, 179, 8, 0.35)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #fde047 0%, #d97706 100%)',
                  boxShadow: '0 12px 30px rgba(234, 179, 8, 0.5)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
