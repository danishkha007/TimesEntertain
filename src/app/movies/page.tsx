import { ContentGrid } from '@/components/ContentGrid';
import type { Movie } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';

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

export default async function MoviesPage() {
  const movies = await getAllMovies();

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">All Movies</h1>
      {movies.length > 0 ? (
        <ContentGrid items={movies} type="movies" />
      ) : (
        <p>No movies could be loaded at this time.</p>
      )}
    </div>
  );
}
