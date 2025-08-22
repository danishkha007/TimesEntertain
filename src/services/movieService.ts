
import db from '@/lib/db';
import type { Movie, Person, ProductionCompany, Video } from '@/lib/types';
import type { RowDataPacket } from 'mysql2';

function processMovieRows(rows: RowDataPacket[]): Movie[] {
    return rows.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
        vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
        release_date: new Date(row.release_date).toISOString(),
    })) as Movie[];
}


export async function getPopularMovies(limit = 10): Promise<Movie[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT 
        m.*, 
        GROUP_CONCAT(DISTINCT g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.poster_path IS NOT NULL
      GROUP BY m.id
      ORDER BY m.popularity DESC 
      LIMIT ?
    `, [limit]);
    
    return processMovieRows(rows);
  } catch (error) {
    console.error('Failed to fetch and process popular movies:', error);
    return [];
  }
}

export async function getAllMovies(): Promise<Movie[]> {
  try {
     const [rows] = await db.query<RowDataPacket[]>(`
      SELECT 
        m.*, 
        GROUP_CONCAT(DISTINCT g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      GROUP BY m.id
      ORDER BY m.popularity DESC
    `);
    
    return processMovieRows(rows);
  } catch (error) {
    console.error("Failed to load movies:", error);
    return [];
  }
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
    try {
        const [movieRows] = await db.query<RowDataPacket[]>(`
            SELECT m.*, 
                   GROUP_CONCAT(DISTINCT g.name) AS genres
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            WHERE ? = (SELECT slugify(m.title))
            GROUP BY m.id
            LIMIT 1
        `, [slug]);

        if (movieRows.length === 0) return null;
        
        const rawMovie = movieRows[0];
        const processedMovies = processMovieRows([rawMovie]);
        let movie: Movie = processedMovies[0];

        // Fetch Cast
        const [castRows] = await db.query<RowDataPacket[]>(`
            SELECT p.*, mc.character_name as 'character'
            FROM movie_cast mc
            JOIN people p ON mc.person_id = p.id
            WHERE mc.movie_id = ?
            ORDER BY mc.cast_order ASC
        `, [movie.id]);
        movie.cast = castRows as (Person & { character?: string })[];

        // Fetch Director, Writers, Composers
        const [crewRows] = await db.query<RowDataPacket[]>(`
            SELECT p.*, mc.job
            FROM movie_crew mc
            JOIN people p ON mc.person_id = p.id
            WHERE mc.movie_id = ? AND mc.job IN ('Director', 'Writer', 'Screenplay', 'Original Music Composer')
        `, [movie.id]);

        movie.director = crewRows.find(c => c.job === 'Director') as Person;
        movie.writers = crewRows.filter(c => c.job === 'Writer' || c.job === 'Screenplay') as Person[];
        movie.composers = crewRows.filter(c => c.job === 'Original Music Composer') as Person[];

        // Fetch Production Companies
        const [companyRows] = await db.query<RowDataPacket[]>(`
            SELECT pc.*
            FROM movie_production_companies mpc
            JOIN production_companies pc ON mpc.company_id = pc.id
            WHERE mpc.movie_id = ?
        `, [movie.id]);
        movie.production = companyRows as ProductionCompany[];

        // Fetch Videos
        const [videoRows] = await db.query<RowDataPacket[]>(`
            SELECT * FROM videos WHERE entity_type = 'movie' AND entity_id = ?
        `, [movie.id]);
        movie.videos = videoRows as Video[];

        return movie;

    } catch (error) {
        console.error('Error fetching movie data:', error);
        return null;
    }
}


export async function getMoviesByGenreSlug(genreSlug: string): Promise<{ movies: Movie[], genreName: string | null }> {
  try {
    const [genreRows] = await db.query<RowDataPacket[]>("SELECT name FROM genres WHERE ? = (SELECT slugify(name)) LIMIT 1", [genreSlug]);
    if (genreRows.length === 0) {
      return { movies: [], genreName: null };
    }
    const genreName = genreRows[0].name;

    const [movieRows] = await db.query<RowDataPacket[]>(`
        SELECT m.*, GROUP_CONCAT(g.name) as genres
        FROM movies m
        JOIN movie_genres mg ON m.id = mg.movie_id
        JOIN genres g ON mg.genre_id = g.id
        WHERE g.name = ?
        GROUP BY m.id
        ORDER BY m.popularity DESC
    `, [genreName]);

    const movies = processMovieRows(movieRows);

    return { movies, genreName };
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreSlug}:`, error);
    return { movies: [], genreName: null };
  }
}

export async function getSimilarMovies(currentMovieId: number, castIds: number[]): Promise<Movie[]> {
    if (castIds.length === 0) return [];
    try {
        const placeholders = castIds.map(() => '?').join(',');
        const params = [currentMovieId, ...castIds];

        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT DISTINCT m.*, GROUP_CONCAT(g.name) as genres
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

    } catch (error) {
        console.error('Error fetching similar movies:', error);
        return [];
    }
}

export async function getMoviesByPersonId(personId: number): Promise<Movie[]> {
    const [movieRows] = await db.query<RowDataPacket[]>(`
        SELECT DISTINCT m.*, GROUP_CONCAT(g.name) as genres
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

export async function searchMovies(query: string): Promise<Movie[]> {
    const searchQuery = `%${query}%`;
    const [movies] = await db.query<RowDataPacket[]>(`
      SELECT m.*, GROUP_CONCAT(g.name) as genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.title LIKE ?
      GROUP BY m.id
      LIMIT 20
    `, [searchQuery]);

    return processMovieRows(movies);
}

export async function getAllMovieTitles(): Promise<{ title: string }[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT title FROM movies");
    return rows as { title: string }[];
  } catch (error) {
    console.error('Failed to load movie titles for sitemap:', error);
    return [];
  }
}
