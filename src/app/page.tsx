'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from './login/page';
import { useUserStore } from '@/core/storage/user-store';

export default function RootPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setMounted(true);
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    setCurrentPath(path);

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (token) {
      setHasToken(true);
      const userRole = useUserStore.getState().user.role;
      if (userRole === 'epaper_creator') router.replace('/epapers');
      else if (userRole === 'notification_creator') router.replace('/notifications');
      else if (userRole === 'movie_creator') router.replace('/movies');
      else router.replace('/dashboard');
    } else {
      setHasToken(false);
      const cleanPath = path.replace(/^\/(en|te|hi|ml)(\/|$)/, '/');
      if (!cleanPath || cleanPath === '/' || cleanPath === '/index.html' || path.includes('/login')) {
        router.replace('/login');
      }
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  // If token is present, redirecting to dashboard — do not show login page
  if (hasToken) {
    return null;
  }

  // Normalize path by stripping locale prefix if present (e.g. /en/, /te/)
  const normalizedPath = currentPath.replace(/^\/(en|te|hi|ml)(\/|$)/, '/');

  // If no token, render LoginPage on root, locale root (/en, /en/), or /login paths
  if (
    !normalizedPath ||
    normalizedPath === '/' ||
    normalizedPath === '/index.html' ||
    currentPath.includes('/login') ||
    /^\/(en|te|hi|ml)\/?$/.test(currentPath)
  ) {
    return <LoginPage />;
  }

  return <LoginPage />;
}



