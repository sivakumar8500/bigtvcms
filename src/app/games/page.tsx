'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/shared/components/Loader';

export default function AppGamesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ratings?tab=games');
  }, [router]);

  return <Loader />;
}
