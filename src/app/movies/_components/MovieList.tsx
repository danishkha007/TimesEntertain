
"use client";

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ContentGrid } from '@/components/ContentGrid';
import type { Movie } from '@/lib/types';
import { Pagination } from '@/components/Pagination';

interface MovieListProps {
  movies: Movie[];
}

const MOVIES_PER_PAGE = 18;

export function MovieList({ movies }: MovieListProps) {
  const searchParams = useSearchParams();

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = [...movies];

    const genre = searchParams.get('genre');
    if (genre && genre !== 'all') {
      filtered = filtered.filter(movie => movie.genres.includes(genre));
    }

    const sort = searchParams.get('sort') || 'popularity.desc';
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
  }, [movies, searchParams]);

  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
  const totalPages = Math.ceil(filteredAndSortedMovies.length / MOVIES_PER_PAGE);
  const moviesForPage = filteredAndSortedMovies.slice((page - 1) * MOVIES_PER_PAGE, page * MOVIES_PER_PAGE);

  if (movies.length === 0) {
    return <p>No movies available.</p>;
  }
  
  if (moviesForPage.length === 0) {
    return <p>No movies found that match your criteria.</p>;
  }

  return (
    <>
      <ContentGrid items={moviesForPage} type="movies" />
      <div className="mt-12 flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </>
  );
}
