
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

// async function getMoviesFromDB({ page = 1, limit = 18, genre, sort }: { page?: number, limit?: number, genre?: string, sort?: string }): Promise<{ movies: Movie[], total: number }> {
//   const offset = (page - 1) * limit;
//   let whereClause = '';
//   let params: (string | number)[] = [];

//   if (genre) {
//     whereClause = 'WHERE g.name = ?';
//     params.push(genre);
//   }
  
//   let orderByClause = 'ORDER BY m.popularity DESC';
//   if (sort) {
//       const [field, direction] = sort.split('.');
//       if (['popularity', 'release_date', 'vote_average'].includes(field) && ['asc', 'desc'].includes(direction)) {
//           orderByClause = `ORDER BY m.${field} ${direction.toUpperCase()}`;
//       }
//   }
  
//   const query = `
//     SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
//     FROM movies m
//     LEFT JOIN movie_genres mg ON m.id = mg.movie_id
//     LEFT JOIN genres g ON mg.genre_id = g.id
//     ${whereClause}
//     GROUP BY m.id
//     ${orderByClause}
//     LIMIT ? OFFSET ?
//   `;
//   params.push(limit, offset);

//   const [movieRows] = await db.query<RowDataPacket[]>(query, params);

//   // Get total count for pagination
//   const countQuery = `SELECT COUNT(DISTINCT m.id) as total FROM movies m ${genre ? 'JOIN movie_genres mg ON m.id = mg.movie_id JOIN genres g ON mg.genre_id = g.id WHERE g.name = ?' : ''}`;
//   const countParams = genre ? [genre] : [];
//   const [totalRows] = await db.query<RowDataPacket[]>(countQuery, countParams);
  
//   return { movies: processMovieRows(movieRows), total: totalRows[0].total };
// }


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const genre = searchParams.get('genre');
  const sort = searchParams.get('sort');
  
  try {
    // const { movies, total } = await getMoviesFromDB({ page, limit, genre, sort });
    const total = 0;
    const movies: Movie[] = [];
    const hasNext = (page * limit) < total;

    return NextResponse.json({ 
        data: movies,
        pagination: {
            page,
            limit,
            total,
            hasNext
        }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
