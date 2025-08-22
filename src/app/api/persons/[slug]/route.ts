
import { NextResponse } from 'next/server';
// import db from '@/lib/db';
import type { Person } from '@/lib/types';
// import type { RowDataPacket } from 'mysql2';

// async function getPersonBySlugFromDB(slug: string): Promise<Person | null> {
//     const [personRows] = await db.query<RowDataPacket[]>("SELECT * FROM people WHERE slugify(name) = ? LIMIT 1", [slug]);

//     if (personRows.length === 0) {
//         return null;
//     }
//     return personRows[0] as Person;
// }


export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // const person = await getPersonBySlugFromDB(params.slug);
    // if (!person) {
    //   return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    // }
    // return NextResponse.json({ data: person });
    return NextResponse.json({ error: 'Person not found' }, { status: 404 });
  } catch (error) {
    console.error(`Error fetching person ${params.slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
