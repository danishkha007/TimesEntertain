"use client";

import { useSearchParams } from 'next/navigation';
import { ContentGrid } from "@/components/ContentGrid";
import { movies, tvShows } from "@/lib/data";
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const [query, setQuery] = useState(q || '');

  useEffect(() => {
    setQuery(q || '');
    if (q) {
      document.title = `Search results for "${q}" | TimesEntertain`;
    } else {
      document.title = `Search | TimesEntertain`;
    }
  }, [q]);
  

  const lowercaseQuery = query.toLowerCase();

  if (!lowercaseQuery) {
    return (
      <div>
        <h1 className="text-3xl font-headline font-bold mb-8">Search</h1>
        <p>Please enter a search term to find movies and TV shows.</p>
      </div>
    );
  }

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(lowercaseQuery) ||
      movie.cast.some((c) => c.name.toLowerCase().includes(lowercaseQuery))
  );

  const filteredTvShows = tvShows.filter(
    (show) =>
      show.title.toLowerCase().includes(lowercaseQuery) ||
      show.cast.some((c) => c.name.toLowerCase().includes(lowercaseQuery))
  );

  const hasResults = filteredMovies.length > 0 || filteredTvShows.length > 0;

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