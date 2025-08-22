
import { NextResponse } from 'next/server';
import { getMovieBySlugFromDB } from '../data';
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


// async function getSimilarMoviesById(movieId: number, castIds: number[]): Promise<Movie[]> {
//     if (castIds.length === 0) return [];
    
//     const placeholders = castIds.map(() => '?').join(',');

//     const [rows] = await db.query<RowDataPacket[]>(`
//         SELECT DISTINCT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
//         FROM movies m
//         JOIN movie_genres mg ON m.id = mg.movie_id
//         JOIN genres g ON mg.genre_id = g.id
//         WHERE m.id != ? AND m.id IN (
//             SELECT movie_id FROM movie_cast WHERE person_id IN (${placeholders})
//         )
//         GROUP BY m.id
//         ORDER BY m.popularity DESC
//         LIMIT 10
//     `, [movieId, ...castIds]);

//     return processMovieRows(rows);
// }

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // const movie = await getMovieBySlugFromDB(params.slug);

    // if (!movie || !movie.cast) {
    //     return NextResponse.json({ data: [] });
    // }

    // const castIds = movie.cast.map(c => c.id);
    // if (castIds.length === 0) {
    //     return NextResponse.json({ data: [] });
    // }

    // const movies = await getSimilarMoviesById(movie.id, castIds);
    
    // return NextResponse.json({ data: movies });
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error(`Error fetching similar movies for ${params.slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
