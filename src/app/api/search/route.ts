
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';
import type { Movie } from '@/lib/types';
import { tvShows } from '@/lib/data'; // Placeholder for TV shows

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const searchQuery = `%${query}%`;
    
    // Search movies by title
    const [movies] = await db.query<RowDataPacket[]>(`
      SELECT m.*, GROUP_CONCAT(g.name) as genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.title LIKE ?
      GROUP BY m.id
      LIMIT 20
    `, [searchQuery]);

    const filteredMovies = movies.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
        vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
    })) as Movie[];
    
    // Placeholder TV show search
    const lowercaseQuery = query.toLowerCase();
    const filteredTvShows = tvShows.filter(
        (show) =>
          show.title.toLowerCase().includes(lowercaseQuery) ||
          show.cast.some((c) => c.name.toLowerCase().includes(lowercaseQuery))
    );

    return NextResponse.json({ movies: filteredMovies, tvShows: filteredTvShows });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
