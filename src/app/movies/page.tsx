
import { ContentGrid } from '@/components/ContentGrid';
import type { Movie } from '@/lib/types';
import { MovieFilters } from './_components/MovieFilters';
import { MovieList } from './_components/MovieList';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

async function getAllMovies(): Promise<Movie[]> {
  try {
     const [rows] = await db.query<RowDataPacket[]>(`
      SELECT 
        m.*, 
        GROUP_CONCAT(DISTINCT g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      GROUP BY m.id
      ORDER BY m.popularity DESC
    `);
    
    return rows.map(row => ({
      ...row,
      genres: row.genres ? row.genres.split(',') : [],
      vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
    })) as Movie[];
  } catch (error) {
    console.error("Failed to load movies:", error);
    return [];
  }
}

async function getAllGenres(): Promise<string[]> {
    try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM genres ORDER BY name ASC");
        return rows.map(row => row.name);
    } catch (error) {
        console.error("Failed to load genres:", error);
        return [];
    }
}

function MoviePageContent({ movies, genres }: { movies: Movie[], genres: string[] }) {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-headline font-bold">All Movies</h1>
                <MovieFilters genres={genres} />
            </div>
            <MovieList movies={movies} />
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
  const allMovies = await getAllMovies();
  const genres = await getAllGenres();
  
  return (
    <Suspense fallback={<MovieListFallback />}>
      <MoviePageContent movies={allMovies} genres={genres} />
    </Suspense>
  );
}
