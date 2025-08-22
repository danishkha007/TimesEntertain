
import { NextResponse } from 'next/server';
import { getMovieBySlugFromDB } from '../data';
import { getSimilarMoviesById } from '@/services/movieService';


export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const movie = await getMovieBySlugFromDB(params.slug);

    if (!movie || !movie.cast) {
        return NextResponse.json({ data: [] });
    }

    const castIds = movie.cast.map(c => c.id);
    if (castIds.length === 0) {
        return NextResponse.json({ data: [] });
    }

    const movies = await getSimilarMoviesById(movie.id, castIds);
    
    return NextResponse.json({ data: movies });
  } catch (error) {
    console.error(`Error fetching similar movies for ${params.slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
