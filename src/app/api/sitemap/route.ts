
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

async function getAllMovieTitlesFromDB(): Promise<{ title: string }[]> {
  const [rows] = await db.query<RowDataPacket[]>("SELECT title FROM movies");
  return rows as { title: string }[];
}

async function getAllPersonNamesFromDB(): Promise<{ name: string }[]> {
  const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM people");
  return rows as { name: string }[];
}

async function getAllGenreNamesFromDB(): Promise<{ name: string }[]> {
   const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM genres");
   return rows as { name: string }[];
}

export async function GET() {
    try {
        const [movies, persons, genres] = await Promise.all([
            getAllMovieTitlesFromDB(),
            getAllPersonNamesFromDB(),
            getAllGenreNamesFromDB()
        ]);
        return NextResponse.json({ data: { movies, persons, genres } });
    } catch(error) {
        console.error('Sitemap data fetching error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
