
import type { MetadataRoute } from 'next';
import type { Movie, Person, TVShow } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { tvShows } from '@/lib/data';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getAllMovies(): Promise<Movie[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT id, title FROM movies");
    return rows as Movie[];
  } catch (error) {
    console.error('Failed to load movies for sitemap:', error);
    return [];
  }
}

async function getAllPersons(): Promise<Person[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT id, name FROM people");
    return rows as Person[];
  } catch (error) {
    console.error('Failed to load persons for sitemap:', error);
    return [];
  }
}

async function getAllGenres(): Promise<{name: string}[]> {
   try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM genres");
    return rows as {name: string}[];
  } catch (error) {
    console.error('Failed to load genres for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await getAllMovies();
  const persons = await getAllPersons();
  const genres = await getAllGenres();

  const movieUrls = movies.map((movie) => ({
    url: `${baseUrl}/movies/${slugify(movie.title)}`,
    lastModified: new Date(),
  }));

  const personUrls = persons.map((person) => ({
    url: `${baseUrl}/person/${slugify(person.name)}`,
    lastModified: new Date(),
  }));
  
  const genreUrls = genres.map((genre) => ({
    url: `${baseUrl}/genre/${slugify(genre.name)}`,
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
