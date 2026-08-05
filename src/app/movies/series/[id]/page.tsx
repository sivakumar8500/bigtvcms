import React from 'react';
import SeriesDetailsPageContent from '@/modules/admin/series/components/SeriesDetailsPageContent';

export function generateStaticParams() {
  return [{ id: 'series-101' }, { id: 'default' }];
}

export default function SeriesDetailsPage() {
  return <SeriesDetailsPageContent />;
}
