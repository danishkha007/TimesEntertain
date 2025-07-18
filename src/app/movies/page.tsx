
import { ContentGrid } from '@/components/ContentGrid';
import type { Movie } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';
import { MovieFilters } from './_components/MovieFilters';
import { MovieList } from './_components/MovieList';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getAllMovies(): Promise<Movie[]> {
  try {
    const filePath = path.join(process.cwd(), 'public/movies.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const moviesData: Movie[] = JSON.parse(file);
    return moviesData;
  } catch (error) {
    console.error("Failed to load movies:", error);
    return [];
  }
}

async function getAllGenres(movies: Movie[]): Promise<string[]> {
    const allGenres = new Set<string>();
    movies.forEach(movie => {
      movie.genres.forEach(genre => {
        allGenres.add(genre);
      });
    });
    return Array.from(allGenres).sort();
}

function MovieListFallback() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-[350px] w-full" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            ))}
        </div>
    )
}

export default async function MoviesPage() {
  const movies = await getAllMovies();
  const genres = await getAllGenres(movies);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-headline font-bold">All Movies</h1>
        <MovieFilters genres={genres} />
      </div>

      <Suspense fallback={<MovieListFallback />}>
        <MovieList movies={movies} />
      </Suspense>
    </div>
  );
}
