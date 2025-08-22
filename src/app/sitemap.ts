
import type { MetadataRoute } from 'next';
import type { Movie, Person, TVShow } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { tvShows } from '@/lib/data';
import { getAllMovieTitles, getAllPersonNames, getAllGenreNames } from '@/services/sitemapService';


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await getAllMovieTitles();
  const persons = await getAllPersonNames();
  const genres = await getAllGenreNames();

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
