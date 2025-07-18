
"use client";

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ContentGrid } from '@/components/ContentGrid';
import type { Movie } from '@/lib/types';
import { Pagination } from '@/components/Pagination';

interface MovieListProps {
  movies: Movie[];
  totalPages: number;
  currentPage: number;
}

export function MovieList({ movies, totalPages, currentPage }: MovieListProps) {
  if (movies.length === 0) {
    return <p>No movies found that match your criteria.</p>;
  }

  return (
    <>
      <ContentGrid items={movies} type="movies" />
      <div className="mt-12 flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </>
  );
}
