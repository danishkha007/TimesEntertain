
import { NextResponse } from 'next/server';
// import db from '@/lib/db';
import type { Person } from '@/lib/types';
// import type { RowDataPacket } from 'mysql2';

// async function getPopularPeopleFromDB(limit = 10): Promise<Person[]> {
//   const [rows] = await db.query<RowDataPacket[]>(`
//     SELECT p.*
//     FROM people p
//     ORDER BY p.popularity DESC
//     LIMIT ?
//   `, [limit]);
//   return rows as Person[];
// }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    // const people = await getPopularPeopleFromDB(limit);
    // return NextResponse.json({ data: people });
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error('Error fetching popular people:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
