
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


async function getMovieById(movieId: number): Promise<Movie | null> {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.id = ?
      GROUP BY m.id
      LIMIT 1
    `, [movieId]);
    
    if (rows.length === 0) return null;
    return processMovieRows(rows)[0];
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
    const movie = await getMovieById(id);
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    return NextResponse.json({ data: movie });
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
