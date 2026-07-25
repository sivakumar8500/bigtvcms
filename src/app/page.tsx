'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from './login/page';

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
      router.replace('/dashboard');
    } else {
      setHasToken(false);
      if (!path || path === '/' || path === '/index.html') {
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

  // If no token, render LoginPage on root/login paths
  if (currentPath.includes('/login') || currentPath === '/' || currentPath === '/index.html' || !currentPath) {
    return <LoginPage />;
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>BigTVCMS Enterprise Portal</h1>
      <p>Redirecting...</p>
    </main>
  );
}


