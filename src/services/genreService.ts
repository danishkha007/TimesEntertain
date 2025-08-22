
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function getAllGenres(): Promise<string[]> {
    try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM genres ORDER BY name ASC");
        return rows.map(row => row.name);
    } catch (error) {
        console.error("Failed to load genres:", error);
        return [];
    }
}

export async function getAllGenreNames(): Promise<{ name: string }[]> {
   try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM genres");
    return rows as { name: string }[];
  } catch (error) {
    console.error('Failed to load genre names for sitemap:', error);
    return [];
  }
}
