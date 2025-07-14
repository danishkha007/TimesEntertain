import { movies } from '@/lib/data';
import { ContentGrid } from '@/components/ContentGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Movies',
  description: 'Explore our extensive collection of movies across all genres and years.',
};

export default function MoviesPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">All Movies</h1>
      <ContentGrid items={movies} type="movies" />
    </div>
  );
}
