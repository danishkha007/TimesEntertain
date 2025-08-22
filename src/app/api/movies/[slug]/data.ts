
import db from '@/lib/db';
import type { Movie, Person, ProductionCompany, Video, OttPlatformDetails } from '@/lib/types';
import type { RowDataPacket } from 'mysql2';

function processMovieRows(rows: RowDataPacket[]): Movie[] {
    return rows.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
        vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
        release_date: new Date(row.release_date).toISOString(),
    })) as Movie[];
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
    
    let movie: Movie = processMovieRows(movieRows)[0];

    const [castRows] = await db.query<RowDataPacket[]>(`
        SELECT p.*, mc.character_name as 'character'
        FROM movie_cast mc JOIN people p ON mc.person_id = p.id
        WHERE mc.movie_id = ? ORDER BY mc.cast_order ASC
    `, [movie.id]);
    movie.cast = castRows as (Person & { character?: string })[];

    const [crewRows] = await db.query<RowDataPacket[]>(`
        SELECT p.*, mc.job, mc.department
        FROM movie_crew mc JOIN people p ON mc.person_id = p.id
        WHERE mc.movie_id = ?
    `, [movie.id]);

    movie.director = crewRows.find(c => c.job === 'Director') as Person;
    movie.writers = crewRows.filter(c => c.department === 'Writing') as Person[];
    movie.composers = crewRows.filter(c => c.job === 'Original Music Composer') as Person[];
    
    const [productionRows] = await db.query<RowDataPacket[]>(`
        SELECT pc.* 
        FROM movie_production_companies mpc JOIN production_companies pc ON mpc.company_id = pc.id
        WHERE mpc.movie_id = ?
    `, [movie.id]);
    movie.production = productionRows as ProductionCompany[];

    const [videoRows] = await db.query<RowDataPacket[]>(`SELECT * FROM videos WHERE entity_id = ? AND entity_type = 'movie'`, [movie.id]);
    movie.videos = videoRows as Video[];

    // This part is complex. For now, let's mock it.
    movie.ott_platforms = {
        flatrate: [{ provider_name: 'Netflix', logo_path: '/t2yyOv4xD9xcdfopV5qNpuWxP8o.jpg' }]
    }

    return movie;
}
