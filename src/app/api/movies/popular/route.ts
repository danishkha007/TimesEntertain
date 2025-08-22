
import { NextResponse } from 'next/server';
// import db from '@/lib/db';
import type { Movie } from '@/lib/types';
// import type { RowDataPacket } from 'mysql2';

// function processMovieRows(rows: RowDataPacket[]): Movie[] {
//     return rows.map(row => ({
//         ...row,
//         genres: row.genres ? row.genres.split(',') : [],
//         vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
//         release_date: new Date(row.release_date).toISOString(),
//     })) as Movie[];
// }


// async function getPopularMoviesFromDB(limit = 10): Promise<Movie[]> {
//   const [rows] = await db.query<RowDataPacket[]>(`
//     SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
//     FROM movies m
//     LEFT JOIN movie_genres mg ON m.id = mg.movie_id
//     LEFT JOIN genres g ON mg.genre_id = g.id
//     GROUP BY m.id
//     ORDER BY m.popularity DESC
//     LIMIT ?
//   `, [limit]);
//   return processMovieRows(rows);
// }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    // const movies = await getPopularMoviesFromDB(limit);
    // return NextResponse.json({ data: movies });
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
