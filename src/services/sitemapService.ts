
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

async function fetchSitemapData() {
    try {
        const res = await fetch(`${API_BASE_URL}/sitemap`);
        if (!res.ok) throw new Error('Failed to fetch sitemap data');
        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error('API Error fetching sitemap data:', error);
        return { movies: [], persons: [], genres: [] };
    }
}

export async function getAllMovieTitles(): Promise<{ title: string }[]> {
  const data = await fetchSitemapData();
  return data.movies;
}

export async function getAllPersonNames(): Promise<{ name: string }[]> {
  const data = await fetchSitemapData();
  return data.persons;
}

export async function getAllGenreNames(): Promise<{ name: string }[]> {
  const data = await fetchSitemapData();
  return data.genres;
}
