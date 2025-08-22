
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Movie } from '@/lib/types';
import type { RowDataPacket } from 'mysql2';


function processMovieRows(rows: RowDataPacket[]): Movie[] {
    return rows.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
        vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
        release_date: new Date(row.release_date).toISOString(),
    })) as Movie[];
}


async function getMoviesByGenreSlugFromDB(slug: string): Promise<{ movies: Movie[], genreName: string | null }> {
    const [genreRows] = await db.query<RowDataPacket[]>("SELECT name FROM genres WHERE slugify(name) = ? LIMIT 1", [slug]);
    
    if (genreRows.length === 0) {
        return { movies: [], genreName: null };
    }
    const genreName = genreRows[0].name;

    const [movieRows] = await db.query<RowDataPacket[]>(`
        SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
        FROM movies m
        JOIN movie_genres mg ON m.id = mg.movie_id
        JOIN genres g ON mg.genre_id = g.id
        WHERE g.name = ?
        GROUP BY m.id
        ORDER BY m.popularity DESC
        LIMIT 50
    `, [genreName]);

    return { movies: processMovieRows(movieRows), genreName };
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await getMoviesByGenreSlugFromDB(params.slug);
    if (!result.genreName) {
      return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
    }
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(`Error fetching movies for genre ${params.slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
