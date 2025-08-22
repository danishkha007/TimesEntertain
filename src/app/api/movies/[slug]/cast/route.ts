
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Person } from '@/lib/types';
import type { RowDataPacket } from 'mysql2';
import { getMovieBySlugFromDB } from '../data';


async function getMovieCastFromDB(movieId: number): Promise<Person[]> {
  const [castRows] = await db.query<RowDataPacket[]>(`
      SELECT p.id, p.name, mc.character_name as 'character', p.profile_path
      FROM movie_cast mc
      JOIN people p ON mc.person_id = p.id
      WHERE mc.movie_id = ?
      ORDER BY mc.cast_order ASC
  `, [movieId]);
  return castRows as Person[];
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const movie = await getMovieBySlugFromDB(params.slug);
    if (!movie) {
        return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    const cast = await getMovieCastFromDB(movie.id);
    return NextResponse.json({ data: cast });
  } catch (error) {
    console.error(`Error fetching cast for movie ${params.slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
