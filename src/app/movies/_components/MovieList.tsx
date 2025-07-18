
"use client";

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ContentGrid } from '@/components/ContentGrid';
import type { Movie } from '@/lib/types';

interface MovieListProps {
  movies: Movie[];
}

export function MovieList({ movies }: MovieListProps) {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'popularity.desc';
  const genre = searchParams.get('genre');

  const processedMovies = useMemo(() => {
    let filtered = [...movies];

    if (genre && genre !== 'all') {
      filtered = filtered.filter(movie => movie.genres.includes(genre));
    }

    switch (sort) {
      case 'release_date.desc':
        filtered.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        break;
      case 'release_date.asc':
        filtered.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        break;
      case 'vote_average.desc':
        filtered.sort((a, b) => (b.imdb_rating || 0) - (a.imdb_rating || 0));
        break;
      case 'popularity.desc':
      default:
        // Assuming higher vote_count is more popular
        filtered.sort((a, b) => b.vote_count - a.vote_count);
        break;
    }

    return filtered;
  }, [movies, sort, genre]);

  if (processedMovies.length === 0) {
    return <p>No movies found that match your criteria.</p>;
  }

  return <ContentGrid items={processedMovies} type="movies" />;
}
