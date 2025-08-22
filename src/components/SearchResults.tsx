
"use client";

import { useSearchParams } from 'next/navigation';
import { ContentGrid } from "@/components/ContentGrid";
import { useEffect, useState } from 'react';
import type { Movie } from '@/lib/types';
import { searchContent } from '@/services/movieService';

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

const debouncedFetch = debounce(searchContent, 300);

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ movies: Movie[], tvShows: any[] }>({ movies: [], tvShows: [] });

  useEffect(() => {
    const newQuery = searchParams.get('q') || '';
    setQuery(newQuery);
    if (newQuery) {
      document.title = `Search results for "${newQuery}" | TimesEntertain`;
    } else {
      document.title = `Search | TimesEntertain`;
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (!query) {
      setResults({ movies: [], tvShows: [] });
      return;
    }

    setIsLoading(true);
    debouncedFetch(query).then(data => {
      setResults(data);
      setIsLoading(false);
    });

  }, [query]);

  const hasResults = results.movies.length > 0 || results.tvShows.length > 0;

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

      {isLoading ? (
          <p>Searching...</p>
      ) : !hasResults ? (
        <p>No results found for your search.</p>
      ) : (
        <div className="space-y-12">
          {results.movies.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-bold mb-4">
                Movies
              </h2>
              <ContentGrid items={results.movies} type="movies" />
            </section>
          )}

          {results.tvShows.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-bold mb-4">
                TV Shows
              </h2>
              <ContentGrid items={results.tvShows} type="tv" />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
