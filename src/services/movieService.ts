
import db from '@/lib/db';
import type { Movie, Person, ProductionCompany, Video } from '@/lib/types';
import type { RowDataPacket } from 'mysql2';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// #region Client-side API fetchers
// These functions run on the client or server components to fetch data from our own API

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
    
    // Calculate total pages
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return { movies: data, pagination: { ...pagination, totalPages } };
  } catch (error) {
    console.error('API Error fetching movies:', error);
    return { movies: [], pagination: { page: 1, totalPages: 1 } };
  }
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/slug/${slug}`);
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

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${movieId}/similar`);
    if (!res.ok) throw new Error('Failed to fetch similar movies');
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(`API Error fetching similar movies for ${movieId}:`, error);
    return [];
  }
}

export async function searchContent(query: string): Promise<{ movies: Movie[], tvShows: any[] }> {
    if (!query) return { movies: [], tvShows: [] };
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
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


// #endregion

// #region Server-side DB queries
// These functions are only called by our API routes on the server

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
    SELECT m.id, m.title, m.poster_path, m.release_date, m.vote_average, GROUP_CONCAT(DISTINCT g.name) AS genres
    FROM movies m
    LEFT JOIN movie_genres mg ON m.id = mg.movie_id
    LEFT JOIN genres g ON mg.genre_id = g.id
    WHERE m.poster_path IS NOT NULL
    GROUP BY m.id
    ORDER BY m.popularity DESC 
    LIMIT ?
  `, [limit]);
  return processMovieRows(rows);
}

export async function getMoviesFromDB({ page = 1, limit = 20, genre, sort }: { page?: number, limit?: number, genre?: string | null, sort?: string | null }) {
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params: (string | number)[] = [];

    if (genre) {
        whereClause = 'JOIN movie_genres mg_filter ON m.id = mg_filter.movie_id JOIN genres g_filter ON mg_filter.genre_id = g_filter.id WHERE g_filter.name = ?';
        params.push(genre);
    }

    let orderByClause = 'ORDER BY m.popularity DESC';
    if (sort) {
        const [sortField, sortOrder] = sort.split('.');
        const allowedSorts = ['popularity', 'release_date', 'vote_average'];
        if (allowedSorts.includes(sortField) && ['asc', 'desc'].includes(sortOrder)) {
            orderByClause = `ORDER BY m.${sortField} ${sortOrder.toUpperCase()}`;
        }
    }
    
    const queryParams = [...params, limit, offset];

    const [rows] = await db.query<RowDataPacket[]>(`
        SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        ${whereClause}
        GROUP BY m.id
        ${orderByClause}
        LIMIT ? OFFSET ?
    `, queryParams);

    const countResult = await db.query<RowDataPacket[]>(`SELECT COUNT(DISTINCT m.id) as total FROM movies m ${whereClause}`, params);
    const total = countResult[0][0].total;

    return { movies: processMovieRows(rows), total };
}

export async function getMovieById(id: number): Promise<Movie | null> {
  const [movieRows] = await db.query<RowDataPacket[]>(`
      SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.id = ?
      GROUP BY m.id
      LIMIT 1
  `, [id]);

  if (movieRows.length === 0) return null;
  
  let movie: Movie = processMovieRows(movieRows)[0];

  const [castRows] = await db.query<RowDataPacket[]>(`
      SELECT p.*, mc.character_name as 'character'
      FROM movie_cast mc JOIN people p ON mc.person_id = p.id
      WHERE mc.movie_id = ? ORDER BY mc.cast_order ASC
  `, [movie.id]);
  movie.cast = castRows as (Person & { character?: string })[];

  // Fetch Crew, Production, etc. as before
  return movie;
}

export async function getMovieBySlugFromDB(slug: string): Promise<Movie | null> {
    const [movieRows] = await db.query<RowDataPacket[]>(`
        SELECT m.*, GROUP_CONCAT(DISTINCT g.name) AS genres
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        WHERE slugify(m.title) = ?
        GROUP BY m.id
        LIMIT 1
    `, [slug]);

    if (movieRows.length === 0) return null;
    
    const rawMovie = movieRows[0];
    const processedMovies = processMovieRows([rawMovie]);
    let movie: Movie = processedMovies[0];

    // Fetch Cast, Crew, Production, etc. as before...
    return movie;
}

export async function searchMoviesFromDB(query: string): Promise<Movie[]> {
    const searchQuery = `%${query}%`;
    const [movies] = await db.query<RowDataPacket[]>(`
      SELECT m.*, GROUP_CONCAT(DISTINCT g.name) as genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.title LIKE ? 
      OR m.id IN (
        SELECT mc.movie_id 
        FROM movie_cast mc 
        JOIN people p ON mc.person_id = p.id 
        WHERE p.name LIKE ?
      )
      GROUP BY m.id
      LIMIT 20
    `, [searchQuery, searchQuery]);

    return processMovieRows(movies);
}


export async function getSimilarMoviesById(currentMovieId: number, castIds: number[]): Promise<Movie[]> {
    if (castIds.length === 0) return [];
    const placeholders = castIds.map(() => '?').join(',');
    const params = [currentMovieId, ...castIds];

    const [rows] = await db.query<RowDataPacket[]>(`
        SELECT DISTINCT m.id, m.title, m.poster_path, m.release_date, m.vote_average, GROUP_CONCAT(DISTINCT g.name) as genres
        FROM movies m
        JOIN movie_cast mc ON m.id = mc.movie_id
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        WHERE m.id != ? AND mc.person_id IN (${placeholders})
        GROUP BY m.id
        ORDER BY m.popularity DESC
        LIMIT 10
    `, params);
    
    return processMovieRows(rows);
}

export async function getAllMovieTitles(): Promise<{ title: string }[]> {
  const [rows] = await db.query<RowDataPacket[]>("SELECT title FROM movies");
  return rows as { title: string }[];
}

export async function getMoviesByPersonId(personId: number): Promise<Movie[]> {
    const [movieRows] = await db.query<RowDataPacket[]>(`
        SELECT DISTINCT m.*, GROUP_CONCAT(DISTINCT g.name) as genres
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        WHERE m.id IN (
            SELECT movie_id FROM movie_cast WHERE person_id = ?
            UNION
            SELECT movie_id FROM movie_crew WHERE person_id = ?
        )
        GROUP BY m.id
        ORDER BY m.popularity DESC
    `, [personId, personId]);

    return processMovieRows(movieRows);
}
// #endregion
