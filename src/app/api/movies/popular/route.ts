
import { NextResponse } from 'next/server';
import { getPopularMoviesFromDB } from '@/services/movieService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const movies = await getPopularMoviesFromDB(limit);
    return NextResponse.json({ data: movies });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
