'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { GlobalErrorSnackbar } from '../components/GlobalErrorSnackbar';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? '#a6e2f5' : '#1c1445', // Premium teal on dark, dark violet on light
        },
        background: {
          default: mode === 'dark' ? '#110d29' : '#ffffff', // Sleek dark violet base, pure white on light
          paper: mode === 'dark' ? '#261c56' : '#ffffff', // Solid dark purple on dark, pure white on light
        },
        text: {
          primary: mode === 'dark' ? '#ffffff' : '#1c1445',
          secondary: mode === 'dark' ? '#d0caeb' : '#5c548a',
        },
      },
      typography: {
        fontFamily: 'Poppins, sans-serif',
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontWeight: 600,
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#a6e2f5',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
        MuiPopover: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#261c56' : '#ffffff',
              backgroundImage: 'none',
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#261c56' : '#ffffff',
              backgroundImage: 'none',
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: mode === 'dark' ? '#382b7a' : '#f0eff5', // Solid opaque hover color
              },
              '&.Mui-selected': {
                backgroundColor: mode === 'dark' ? '#1c1445' : '#e4e2ed', // Solid opaque selection color
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#382b7a' : '#f0eff5',
                },
              },
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: mode === 'dark' ? '#261c56' : '#1c1445', // Solid non-transparent background
              color: '#ffffff',
              fontSize: '0.8rem',
              borderRadius: '8px',
              border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              padding: '8px 12px',
            },
            arrow: {
              color: mode === 'dark' ? '#261c56' : '#1c1445',
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <GlobalErrorSnackbar />
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
