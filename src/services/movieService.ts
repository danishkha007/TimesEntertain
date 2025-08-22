
import type { Movie } from '@/lib/types';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

function processMovieRows(rows: RowDataPacket[]): Movie[] {
    return rows.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
        vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
        release_date: new Date(row.release_date).toISOString(),
    })) as Movie[];
}


export async function getPopularMoviesFromDB(limit = 10): Promise<Movie[]> {
  const [rows] = await db.query<RowDataPacket[]>(`
    SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    GROUP BY m.id
    ORDER BY m.popularity DESC
    LIMIT ?
  `, [limit]);
  return processMovieRows(rows);
}

export async function getMoviesFromDB({ page = 1, limit = 18, genre, sort }: { page?: number, limit?: number, genre?: string, sort?: string }): Promise<{ movies: Movie[], total: number }> {
  const offset = (page - 1) * limit;
  let whereClause = '';
  let params: (string | number)[] = [];

  if (genre) {
    whereClause = 'WHERE g.name = ?';
    params.push(genre);
  }
  
  let orderByClause = 'ORDER BY m.popularity DESC';
  if (sort) {
      const [field, direction] = sort.split('.');
      if (['popularity', 'release_date', 'vote_average'].includes(field) && ['asc', 'desc'].includes(direction)) {
          orderByClause = `ORDER BY m.${field} ${direction.toUpperCase()}`;
      }
  }
  
  const query = `
    SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    ${whereClause}
    GROUP BY m.id
    ${orderByClause}
    LIMIT ? OFFSET ?
  `;
  params.push(limit, offset);

  const [movieRows] = await db.query<RowDataPacket[]>(query, params);

  // Get total count for pagination
  const countQuery = `SELECT COUNT(DISTINCT m.id) as total FROM movies m ${genre ? 'JOIN movie_genres mg ON m.id = mg.movie_id JOIN genres g ON mg.genre_id = g.id WHERE g.name = ?' : ''}`;
  const countParams = genre ? [genre] : [];
  const [totalRows] = await db.query<RowDataPacket[]>(countQuery, countParams);
  
  return { movies: processMovieRows(movieRows), total: totalRows[0].total };
}


export async function searchMoviesFromDB(query: string): Promise<Movie[]> {
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

export async function getSimilarMoviesById(movieId: number, castIds: number[]): Promise<Movie[]> {
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


export async function getMovieById(movieId: number): Promise<Movie | null> {
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


// --- API-based services for client-side ---

export async function getPopularMovies(limit = 10): Promise<Movie[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/popular?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch popular movies');
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('API Error fetching popular movies:', error);
    return [];
  }
}

export async function getMovies({ page = 1, limit = 18, genre, sort }: { page?: number, limit?: number, genre?: string, sort?: string }): Promise<{ movies: Movie[], pagination: { page: number, totalPages: number } }> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (genre) params.append('genre', genre);
    if (sort) params.append('sort', sort);

    const res = await fetch(`${API_BASE_URL}/movies?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch movies');
    const { data, pagination } = await res.json();
    
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return { movies: data, pagination: { ...pagination, totalPages } };
  } catch (error) {
    console.error('API Error fetching movies:', error);
    return { movies: [], pagination: { page: 1, totalPages: 1 } };
  }
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${slug}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch movie: ${slug}`);
    }
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(`API Error fetching movie ${slug}:`, error);
    return null;
  }
}

export async function getSimilarMovies(movieSlug: string): Promise<Movie[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${movieSlug}/similar`);
    if (!res.ok) throw new Error('Failed to fetch similar movies');
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(`API Error fetching similar movies for ${movieSlug}:`, error);
    return [];
  }
}

export async function searchContent(query: string): Promise<{ movies: Movie[], tvShows: any[] }> {
    if (!query) return { movies: [], tvShows: [] };
    try {
      const res = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
          console.error("Search failed");
          return { movies: [], tvShows: [] };
      }
      return res.json();
    } catch(error) {
      console.error("API Error during search:", error);
      return { movies: [], tvShows: [] };
    }
}

export async function getMoviesByPersonId(personId: number): Promise<Movie[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/persons/${personId}/movies`);
        if (!res.ok) throw new Error('Failed to fetch movies for person');
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error(`API Error fetching movies for person ${personId}:`, error);
        return [];
    }
}
