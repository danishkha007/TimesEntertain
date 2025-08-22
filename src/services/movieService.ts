
import type { Movie } from '@/lib/types';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export async function getPopularMovies(limit = 10): Promise<Movie[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/popular?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch popular movies');
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('API Error fetching popular movies:', error);
    return [];
  }
}

export async function getMovies({ page = 1, limit = 18, genre, sort }: { page?: number, limit?: number, genre?: string, sort?: string }): Promise<{ movies: Movie[], pagination: { page: number, totalPages: number } }> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (genre) params.append('genre', genre);
    if (sort) params.append('sort', sort);

    const res = await fetch(`${API_BASE_URL}/movies?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch movies');
    const { data, pagination } = await res.json();
    
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return { movies: data, pagination: { ...pagination, totalPages } };
  } catch (error) {
    console.error('API Error fetching movies:', error);
    return { movies: [], pagination: { page: 1, totalPages: 1 } };
  }
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${slug}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch movie: ${slug}`);
    }
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(`API Error fetching movie ${slug}:`, error);
    return null;
  }
}

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${movieId}/similar`);
    if (!res.ok) throw new Error('Failed to fetch similar movies');
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(`API Error fetching similar movies for ${movieId}:`, error);
    return [];
  }
}

export async function searchContent(query: string): Promise<{ movies: Movie[], tvShows: any[] }> {
    if (!query) return { movies: [], tvShows: [] };
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
          console.error("Search failed");
          return { movies: [], tvShows: [] };
      }
      return res.json();
    } catch(error) {
      console.error("API Error during search:", error);
      return { movies: [], tvShows: [] };
    }
}

export async function getMoviesByPersonId(personId: number): Promise<Movie[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/persons/${personId}/movies`);
        if (!res.ok) throw new Error('Failed to fetch movies for person');
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error(`API Error fetching movies for person ${personId}:`, error);
        return [];
    }
}
