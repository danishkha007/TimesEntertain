
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
import type { Movie } from '@/lib/types';
import { ContentGrid } from '@/components/ContentGrid';
import type { Metadata } from 'next';
import { getMoviesByGenreSlug } from '@/services/genreService';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Assuming getMoviesByGenreSlug can also return genre name, or we need a new service
  const genreName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (!genreName) {
    return {
      title: 'Genre Not Found',
    };
  }

  return {
    title: `${genreName} Movies`,
    description: `Browse a collection of ${genreName} movies.`,
  };
}


export default async function GenrePage({ params }: { params: { slug: string } }) {
  const { movies, genreName } = await getMoviesByGenreSlug(params.slug);

  if (!genreName) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">{genreName} Movies</h1>
      {movies.length > 0 ? (
        <ContentGrid items={movies} type="movies" />
      ) : (
        <p>No movies found for this genre.</p>
      )}
    </div>
  );
}
