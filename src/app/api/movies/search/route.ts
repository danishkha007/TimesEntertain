
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Movie } from '@/lib/types';
import type { RowDataPacket } from 'mysql2';
import { tvShows } from '@/lib/data'; // Placeholder for TV shows

function processMovieRows(rows: RowDataPacket[]): Movie[] {
    return rows.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
        vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
        release_date: new Date(row.release_date).toISOString(),
    })) as Movie[];
}

async function searchMoviesFromDB(query: string): Promise<Movie[]> {
  const [rows] = await db.query<RowDataPacket[]>(`
    SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.title LIKE ? OR m.overview LIKE ? OR m.id IN (
      SELECT mc.movie_id FROM movie_cast mc JOIN people p ON mc.person_id = p.id WHERE p.name LIKE ?
    )
    GROUP BY m.id
    LIMIT 20
  `, [`%${query}%`, `%${query}%`, `%${query}%`]);
  return processMovieRows(rows);
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const filteredMovies = await searchMoviesFromDB(query);
    
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
