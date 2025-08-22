
import db from '@/lib/db';
import type { Person } from '@/lib/types';
import type { RowDataPacket } from 'mysql2';

export async function getPopularPeople(limit = 10): Promise<Person[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT p.*
      FROM people p
      ORDER BY p.popularity DESC
      LIMIT ?
    `, [limit]);
    return rows as Person[];
  } catch (error) {
    console.error(`Failed to fetch popular people:`, error);
    return [];
  }
}

export async function getPersonBySlug(slug: string): Promise<Person | null> {
    const [personRows] = await db.query<RowDataPacket[]>("SELECT * FROM people WHERE slugify(name) = ? LIMIT 1", [slug]);

    if (personRows.length === 0) {
        return null;
    }
    return personRows[0] as Person;
}

export async function getAllPersonNames(): Promise<{ name: string }[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM people");
    return rows as { name: string }[];
  } catch (error) {
    console.error('Failed to load person names for sitemap:', error);
    return [];
  }
}

export async function getMovieCast(movieId: number): Promise<Person[]> {
  const [castRows] = await db.query<RowDataPacket[]>(`
      SELECT p.id, p.name, mc.character_name as 'character'
      FROM movie_cast mc
      JOIN people p ON mc.person_id = p.id
      WHERE mc.movie_id = ?
      ORDER BY mc.cast_order ASC
  `, [movieId]);
  return castRows as Person[];
}
