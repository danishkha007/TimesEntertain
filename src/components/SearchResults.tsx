"use client";

import { useSearchParams } from 'next/navigation';
import { ContentGrid } from "@/components/ContentGrid";
import { tvShows } from "@/lib/data";
import { useEffect, useState } from 'react';
import type { Movie, Person } from '@/lib/types';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [query, setQuery] = useState(q || '');

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [filteredTvShows, setFilteredTvShows] = useState<any[]>([]);

  useEffect(() => {
    setQuery(q || '');
    if (q) {
      document.title = `Search results for "${q}" | TimesEntertain`;
    } else {
      document.title = `Search | TimesEntertain`;
    }
  }, [q]);
  
  useEffect(() => {
    async function fetchAndFilter() {
      if (!query) {
        setFilteredMovies([]);
        setFilteredTvShows([]);
        return;
      }
      
      const lowercaseQuery = query.toLowerCase();

      // Fetch movies and people
      const [moviesRes, personsRes] = await Promise.all([
        fetch('/data/movies.json'),
        fetch('/data/persons.json')
      ]);
      const movies: Movie[] = await moviesRes.json();
      const persons: Person[] = await personsRes.json();
      
      const personIdsMatchingQuery = persons
        .filter(p => p.name.toLowerCase().includes(lowercaseQuery))
        .map(p => p.id);

      const moviesResult = movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(lowercaseQuery) ||
          movie.cast_ids.some(id => personIdsMatchingQuery.includes(id)) ||
          movie.crew_ids.some(id => personIdsMatchingQuery.includes(id)) // Search crew too
      );
      setFilteredMovies(moviesResult);

      const tvShowsResult = tvShows.filter(
        (show) =>
          show.title.toLowerCase().includes(lowercaseQuery) ||
          show.cast.some((c) => c.name.toLowerCase().includes(lowercaseQuery))
      );
      setFilteredTvShows(tvShowsResult);
    }

    fetchAndFilter();

  }, [query]);

  const hasResults = filteredMovies.length > 0 || filteredTvShows.length > 0;

  if (!query) {
    return (
      <div>
        <h1 className="text-3xl font-headline font-bold mb-8">Search</h1>
        <p>Please enter a search term to find movies and TV shows.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">
        Search Results for &quot;{query}&quot;
      </h1>

      {!hasResults ? (
        <p>No results found for your search.</p>
      ) : (
        <div className="space-y-12">
          {filteredMovies.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-bold mb-4">
                Movies
              </h2>
              <ContentGrid items={filteredMovies} type="movies" />
            </section>
          )}

          {filteredTvShows.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-bold mb-4">
                TV Shows
              </h2>
              <ContentGrid items={filteredTvShows} type="tv" />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
