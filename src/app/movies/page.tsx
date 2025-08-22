
import type { Movie } from '@/lib/types';
import { MovieFilters } from './_components/MovieFilters';
import { MovieList } from './_components/MovieList';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getMovies } from '@/services/movieService';
import { getAllGenres } from '@/services/genreService';

async function MoviePageContent() {
    const [{ movies, pagination }, genres] = await Promise.all([
      getMovies({ page: 1, limit: 18 }), // Fetch initial page
      getAllGenres()
    ]);
    
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-headline font-bold">All Movies</h1>
                <MovieFilters genres={genres} />
            </div>
            <MovieList initialMovies={movies} initialTotalPages={pagination.totalPages} />
        </div>
    );
}


function MovieListFallback() {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <Skeleton className="h-9 w-44" />
                 <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <Skeleton className="h-10 w-full md:w-[180px]" />
                    <Skeleton className="h-10 w-full md:w-[220px]" />
                 </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-[350px] w-full" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default async function MoviesPage() {
  return (
    <Suspense fallback={<MovieListFallback />}>
      <MoviePageContent />
    </Suspense>
  );
}
