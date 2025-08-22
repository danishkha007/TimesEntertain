
"use client";

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { ContentGrid } from '@/components/ContentGrid';
import type { Movie } from '@/lib/types';
import { Pagination } from '@/components/Pagination';
import { getMovies } from '@/services/movieService';

interface MovieListProps {
  initialMovies: Movie[];
  initialTotalPages: number;
}

export function MovieList({ initialMovies, initialTotalPages }: MovieListProps) {
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState(initialMovies);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
  const genre = searchParams.get('genre');
  const sort = searchParams.get('sort');

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      const { movies: newMovies, pagination } = await getMovies({ 
        page, 
        genre: genre || undefined,
        sort: sort || undefined
      });
      setMovies(newMovies);
      setTotalPages(pagination.totalPages);
      setIsLoading(false);
    };

    // We don't refetch for the initial state which is server-rendered
    const hasFilters = page > 1 || genre || sort;
    if (hasFilters) {
        fetchMovies();
    } else {
        setMovies(initialMovies);
        setTotalPages(initialTotalPages);
    }
  }, [page, genre, sort, initialMovies, initialTotalPages]);
  
  if (isLoading) {
    return <p>Loading movies...</p>;
  }

  if (movies.length === 0) {
    return <p>No movies found that match your criteria.</p>;
  }

  return (
    <>
      <ContentGrid items={movies} type="movies" />
      <div className="mt-12 flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </>
  );
}
