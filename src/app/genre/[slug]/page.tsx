
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
import type { Movie } from '@/lib/types';
import { ContentGrid } from '@/components/ContentGrid';
import type { Metadata } from 'next';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

async function getMoviesByGenre(genreSlug: string): Promise<{ movies: Movie[], genreName: string | null }> {
  try {
    const [genreRows] = await db.query<RowDataPacket[]>("SELECT name FROM genres WHERE ? = (SELECT slugify(name)) LIMIT 1", [genreSlug]);
    if (genreRows.length === 0) {
      return { movies: [], genreName: null };
    }
    const genreName = genreRows[0].name;

    const [movieRows] = await db.query<RowDataPacket[]>(`
        SELECT m.*, GROUP_CONCAT(g.name) as genres
        FROM movies m
        JOIN movie_genres mg ON m.id = mg.movie_id
        JOIN genres g ON mg.genre_id = g.id
        WHERE g.name = ?
        GROUP BY m.id
        ORDER BY m.popularity DESC
    `, [genreName]);

    const movies = movieRows.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
        vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
    })) as Movie[];

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
