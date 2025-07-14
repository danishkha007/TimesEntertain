import { tvShows } from '@/lib/data';
import { ContentGrid } from '@/components/ContentGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse TV Shows',
  description: 'Explore our extensive collection of TV shows, from classic series to the latest hits.',
};

export default function TvShowsPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">All TV Shows</h1>
      <ContentGrid items={tvShows} type="tv" />
    </div>
  );
}
