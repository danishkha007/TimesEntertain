
import type { Person } from '@/lib/types';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';


export async function getPopularPeople(limit = 10): Promise<Person[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/persons/popular?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch popular people');
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch popular people:`, error);
    return [];
  }
}

export async function getPersonBySlug(slug: string): Promise<Person | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/persons/${slug}`);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch person: ${slug}`);
        }
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error(`API Error fetching person ${slug}:`, error);
        return null;
    }
}

export async function getMovieCast(movieSlug: string): Promise<Person[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/movies/${movieSlug}/cast`);
         if (!res.ok) throw new Error('Failed to fetch cast');
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error(`API Error fetching cast for movie ${movieSlug}:`, error);
        return [];
    }
}
