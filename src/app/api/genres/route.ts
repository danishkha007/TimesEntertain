
import { NextResponse } from 'next/server';
// import db from '@/lib/db';
// import type { RowDataPacket } from 'mysql2';

// async function getAllGenresFromDB(): Promise<string[]> {
//     const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM genres ORDER BY name ASC");
//     return rows.map(row => row.name);
// }

export async function GET(request: Request) {
  try {
    // const genres = await getAllGenresFromDB();
    // return NextResponse.json({ data: genres });
    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
