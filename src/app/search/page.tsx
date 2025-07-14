import { ContentGrid } from "@/components/ContentGrid";
import { movies, tvShows } from "@/lib/data";
import type { Metadata } from "next";

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
    const query = searchParams.q || "";
    return {
        title: query ? `Search results for "${query}"` : "Search",
        description: `Find movies and TV shows matching your search for ${query}.`
    }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.toLowerCase() || "";

  if (!query) {
    return (
      <div>
        <h1 className="text-3xl font-headline font-bold mb-8">Search</h1>
        <p>Please enter a search term to find movies and TV shows.</p>
      </div>
    );
  }

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(query) ||
      movie.cast.some((c) => c.name.toLowerCase().includes(query))
  );

  const filteredTvShows = tvShows.filter(
    (show) =>
      show.title.toLowerCase().includes(query) ||
      show.cast.some((c) => c.name.toLowerCase().includes(query))
  );

  const hasResults = filteredMovies.length > 0 || filteredTvShows.length > 0;

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">
        Search Results for &quot;{searchParams.q}&quot;
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
