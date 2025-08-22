
import { NextResponse } from 'next/server';
import type { Movie } from '@/lib/types';
import { tvShows } from '@/lib/data'; // Placeholder for TV shows
import { searchMovies } from '@/services/movieService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const filteredMovies = await searchMovies(query);
    
    // Placeholder TV show search
    const lowercaseQuery = query.toLowerCase();
    const filteredTvShows = tvShows.filter(
        (show) =>
          show.title.toLowerCase().includes(lowercaseQuery) ||
          show.cast.some((c) => c.name.toLowerCase().includes(lowercaseQuery))
    );

    return NextResponse.json({ movies: filteredMovies, tvShows: filteredTvShows });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
