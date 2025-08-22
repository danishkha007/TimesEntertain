
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Person, Movie } from '@/lib/types';
import type { RowDataPacket } from 'mysql2';

async function getMovieCastFromDB(movieId: number): Promise<Person[]> {
  const [castRows] = await db.query<RowDataPacket[]>(`
      SELECT p.id, p.name, mc.character_name as 'character', p.profile_path
      FROM movie_cast mc
      JOIN people p ON mc.person_id = p.id
      WHERE mc.movie_id = ?
      ORDER BY mc.cast_order ASC
  `, [movieId]);
  return castRows as Person[];
}

function processMovieRows(rows: RowDataPacket[]): Movie[] {
    return rows.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
        vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
        release_date: new Date(row.release_date).toISOString(),
    })) as Movie[];
}

async function getSimilarMoviesById(movieId: number, castIds: number[]): Promise<Movie[]> {
    if (castIds.length === 0) return [];
    
    const placeholders = castIds.map(() => '?').join(',');

    const [rows] = await db.query<RowDataPacket[]>(`
        SELECT DISTINCT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
        FROM movies m
        JOIN movie_genres mg ON m.id = mg.movie_id
        JOIN genres g ON mg.genre_id = g.id
        WHERE m.id != ? AND m.id IN (
            SELECT movie_id FROM movie_cast WHERE person_id IN (${placeholders})
        )
        GROUP BY m.id
        ORDER BY m.popularity DESC
        LIMIT 10
    `, [movieId, ...castIds]);

    return processMovieRows(rows);
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
  }

  try {
    const cast = await getMovieCastFromDB(id);
    if (!cast || cast.length === 0) {
        return NextResponse.json({ data: [] });
    }
    const castIds = cast.map(c => c.id);
    const movies = await getSimilarMoviesById(id, castIds);
    
    return NextResponse.json({ data: movies });
  } catch (error) {
    console.error(`Error fetching similar movies for ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
