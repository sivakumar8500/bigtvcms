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
    router.push('/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1c1445 0%, #2e2369 100%)',
        overflow: 'hidden',
        position: 'relative',
        p: 2,
        '@keyframes rotate-clockwise': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      <Box
        component="img"
        src="/mandala.png"
        alt="Top Left Mandala decoration"
        sx={{
          position: 'absolute',
          top: '-275px',
          left: '-275px',
          width: '550px',
          height: 'auto',
          opacity: 0.15,
          zIndex: 1,
          animation: 'rotate-clockwise 25s linear infinite',
          transformOrigin: 'center center',
          filter: 'invert(1) brightness(1.5)',
        }}
      />

      <Box
        component="img"
        src="/mandala.png"
        alt="Bottom Right Mandala decoration"
        sx={{
          position: 'absolute',
          bottom: '-275px',
          right: '-275px',
          width: '550px',
          height: 'auto',
          opacity: 0.15,
          zIndex: 1,
          animation: 'rotate-clockwise 25s linear infinite',
          transformOrigin: 'center center',
          filter: 'invert(1) brightness(1.5)',
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
              <Typography variant="caption" sx={{ color: '#d0caeb', pl: 1 }}>
                Breaking News Portal
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 600, mb: 4, lineHeight: 1.2 }}>
              Enterprise Digital News & Content Hub: <br />
              <span style={{ color: '#a6e2f5' }}>BigTV CMS™</span>
            </Typography>

            <Typography variant="body1" sx={{ color: '#d0caeb', mb: 4, lineHeight: 1.6 }}>
              Select your language on the right panel to configure the Accept-Language API header mappings dynamically across the CMS operator workspace.
            </Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: 'rgba(38, 28, 86, 0.55)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              p: { xs: 4, md: 5 },
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 700, mb: 3 }}>
              Select Language
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px', mb: 4 }}>
                <CircularProgress sx={{ color: '#a6e2f5' }} />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {activeOptions.map((opt) => {
                  const isSelected = language === opt.key;
                  return (
                    <Grid item xs={12} sm={6} key={opt.key}>
                      <Card
                        sx={{
                          backgroundColor: isSelected ? '#00a2e8' : 'rgba(255, 255, 255, 0.03)',
                          border: '2px solid',
                          borderColor: isSelected ? '#00c3ff' : 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          color: '#ffffff',
                          transition: 'all 0.3s ease',
                          boxShadow: isSelected ? '0 8px 30px rgba(0, 162, 232, 0.35)' : 'none',
                          '&:hover': {
                            borderColor: '#00a2e8',
                            transform: 'translateY(-2px)',
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
                            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                              {opt.nativeName}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#a6e2f5',
                                display: 'block',
                                mt: 0.5,
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
                              color: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
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
                backgroundColor: '#a6e2f5',
                color: '#1c1445',
                py: 1.8,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(166, 226, 245, 0.25)',
                '&:hover': {
                  backgroundColor: '#8cd5ed',
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
