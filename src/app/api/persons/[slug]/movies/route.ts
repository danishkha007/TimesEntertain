
import { NextResponse } from 'next/server';
// import db from '@/lib/db';
import type { Movie, Person } from '@/lib/types';
// import type { RowDataPacket } from 'mysql2';

// function processMovieRows(rows: RowDataPacket[]): Movie[] {
//     return rows.map(row => ({
//         ...row,
//         genres: row.genres ? row.genres.split(',') : [],
//         vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
//         release_date: new Date(row.release_date).toISOString(),
//     })) as Movie[];
// }

// async function getPersonBySlugFromDB(slug: string): Promise<Person | null> {
//     const [personRows] = await db.query<RowDataPacket[]>("SELECT * FROM people WHERE slugify(name) = ? LIMIT 1", [slug]);
//     if (personRows.length === 0) return null;
//     return personRows[0] as Person;
// }

// async function getMoviesByPersonIdFromDB(personId: number): Promise<Movie[]> {
//     const [movieRows] = await db.query<RowDataPacket[]>(`
//         SELECT DISTINCT m.*, GROUP_CONCAT(DISTINCT g.name) as genres
//         FROM movies m
//         LEFT JOIN movie_genres mg ON m.id = mg.movie_id
//         LEFT JOIN genres g ON mg.genre_id = g.id
//         WHERE m.id IN (
//             SELECT movie_id FROM movie_cast WHERE person_id = ?
//             UNION
//             SELECT movie_id FROM movie_crew WHERE person_id = ?
//         )
//         GROUP BY m.id
//         ORDER BY m.popularity DESC
//     `, [personId, personId]);

//     return processMovieRows(movieRows);
// }

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // const person = await getPersonBySlugFromDB(params.slug);
    // if (!person) {
    //     return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    // }
    // const movies = await getMoviesByPersonIdFromDB(person.id);
    // return NextResponse.json({ data: movies });
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error(`Error fetching movies for person ${params.slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
