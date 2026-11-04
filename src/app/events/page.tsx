'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/shared/components/Loader';

export default function AppEventsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ratings?tab=events');
  }, [router]);

  return <Loader />;
}
