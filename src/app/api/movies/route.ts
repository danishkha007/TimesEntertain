
import { NextResponse } from 'next/server';
import { getMoviesFromDB } from '@/services/movieService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const genre = searchParams.get('genre');
  const sort = searchParams.get('sort');
  
  try {
    const { movies, total } = await getMoviesFromDB({ page, limit, genre, sort });
    const hasNext = (page * limit) < total;

    return NextResponse.json({ 
        data: movies,
        pagination: {
            page,
            limit,
            total,
            hasNext
        }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
