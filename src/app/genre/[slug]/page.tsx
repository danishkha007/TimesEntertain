import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { slugify } from '@/lib/utils';
import type { Movie } from '@/lib/types';
import { ContentGrid } from '@/components/ContentGrid';
import type { Metadata } from 'next';

async function getAllGenres(): Promise<string[]> {
  try {
    const filePath = path.join(process.cwd(), 'public/movies.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const movies: Movie[] = JSON.parse(file);
    const allGenres = new Set<string>();
    movies.forEach(movie => {
      movie.genres.forEach(genre => {
        allGenres.add(genre);
      });
    });
    return Array.from(allGenres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const genres = await getAllGenres();
  return genres.map((genre) => ({
    slug: slugify(genre),
  }));
}

async function getMoviesByGenre(genreSlug: string): Promise<{ movies: Movie[], genreName: string | null }> {
  try {
    const filePath = path.join(process.cwd(), 'public/movies.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const allMovies: Movie[] = JSON.parse(file);
    
    let genreName: string | null = null;
    
    const movies = allMovies.filter(movie => {
      return movie.genres.some(genre => {
        if (slugify(genre) === genreSlug) {
          genreName = genre;
          return true;
        }
        return false;
      });
    });

    return { movies, genreName };
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreSlug}:`, error);
    return { movies: [], genreName: null };
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { genreName } = await getMoviesByGenre(params.slug);

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
  const { movies, genreName } = await getMoviesByGenre(params.slug);

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
