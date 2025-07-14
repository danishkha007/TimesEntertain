"use client";

import { ContentGrid } from '@/components/ContentGrid';
import { Skeleton } from '@/components/ui/skeleton';
import type { Movie } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('/data/movies.json');
        if (!res.ok) {
          throw new Error('Failed to fetch movies');
        }
        const moviesData: Movie[] = await res.json();
        setMovies(moviesData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">All Movies</h1>
      {isLoading ? (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                  <Skeleton className="h-[350px] w-full" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
              </div>
          ))}
        </div>
      ) : (
        <ContentGrid items={movies} type="movies" />
      )}
    </div>
  );
}
