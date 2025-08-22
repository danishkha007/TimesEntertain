
import type { Movie } from '@/lib/types';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export async function getAllGenres(): Promise<string[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/genres`);
        if (!res.ok) throw new Error('Failed to fetch genres');
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("API Error fetching genres:", error);
        return [];
    }
}


export async function getMoviesByGenreSlug(slug: string): Promise<{ movies: Movie[], genreName: string }> {
    try {
        const res = await fetch(`${API_BASE_URL}/genres/${slug}`);
        if (!res.ok) throw new Error(`Failed to fetch movies for genre ${slug}`);
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error(`API Error fetching movies for genre ${slug}:`, error);
        return { movies: [], genreName: '' };
    }
}
