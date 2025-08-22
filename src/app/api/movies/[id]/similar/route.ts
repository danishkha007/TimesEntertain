
import { NextResponse } from 'next/server';
import { getSimilarMoviesById } from '@/services/movieService';
import { getMovieCast } from '@/services/personService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
  }

  try {
    const cast = await getMovieCast(id);
    if (!cast || cast.length === 0) {
        return NextResponse.json({ data: [] });
    }
    const castIds = cast.map(c => c.id);
    const movies = await getSimilarMoviesById(id, castIds);
    
    return NextResponse.json({ data: movies });
  } catch (error) {
    console.error(`Error fetching similar movies for ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
