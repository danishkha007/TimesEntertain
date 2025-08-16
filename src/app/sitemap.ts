
import type { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import type { Movie, Person, TVShow } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { tvShows } from '@/lib/data';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getAllMovies(): Promise<Movie[]> {
  try {
    const filePath = path.join(process.cwd(), 'public/movies.json');
    const file = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(file);
  } catch (error) {
    console.error('Failed to load movies for sitemap:', error);
    return [];
  }
}

async function getAllPersons(): Promise<Person[]> {
  try {
    const filePath = path.join(process.cwd(), 'public/persons.json');
    const file = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(file);
  } catch (error) {
    console.error('Failed to load persons for sitemap:', error);
    return [];
  }
}

async function getAllGenres(movies: Movie[]): Promise<string[]> {
  const allGenres = new Set<string>();
  movies.forEach((movie) => {
    movie.genres.forEach((genre) => {
      allGenres.add(genre);
    });
  });
  return Array.from(allGenres).sort();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await getAllMovies();
  const persons = await getAllPersons();
  const genres = await getAllGenres(movies);

  const movieUrls = movies.map((movie) => ({
    url: `${baseUrl}/movies/${slugify(movie.title)}`,
    lastModified: new Date(),
  }));

  const personUrls = persons.map((person) => ({
    url: `${baseUrl}/person/${slugify(person.name)}`,
    lastModified: new Date(),
  }));
  
  const genreUrls = genres.map((genre) => ({
    url: `${baseUrl}/genre/${slugify(genre)}`,
    lastModified: new Date(),
  }));

  const tvShowUrls = tvShows.map((show) => ({
    url: `${baseUrl}/tv/${show.slug}`,
    lastModified: new Date(),
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/movies`, lastModified: new Date() },
    { url: `${baseUrl}/tv`, lastModified: new Date() },
    { url: `${baseUrl}/watchlist`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
  ];

  return [...staticUrls, ...movieUrls, ...tvShowUrls, ...personUrls, ...genreUrls];
}
