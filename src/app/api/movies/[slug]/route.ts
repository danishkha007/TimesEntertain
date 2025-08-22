
import { NextResponse } from 'next/server';
import { getMovieBySlugFromDB } from './data';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const movie = await getMovieBySlugFromDB(params.slug);
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    return NextResponse.json({ data: movie });
  } catch (error) {
    console.error(`Error fetching movie ${params.slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
