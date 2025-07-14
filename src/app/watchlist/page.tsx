"use client";

import { useWatchlist } from '@/hooks/use-watchlist';
import { ContentGrid } from '@/components/ContentGrid';
import { Skeleton } from '@/components/ui/skeleton';

export default function WatchlistPage() {
  const { watchlist, isLoaded } = useWatchlist();

  const movies = watchlist.filter((item) => item.itemType === 'movies');
  const tvShows = watchlist.filter((item) => item.itemType === 'tv');

  if (!isLoaded) {
    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">My Watchlist</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-[350px] w-full" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-muted-foreground">
          Your watchlist is empty. Add some movies and TV shows to see them here.
        </p>
      ) : (
        <div className="space-y-12">
          {movies.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-bold mb-4">Movies</h2>
              <ContentGrid items={movies} type="movies" />
            </section>
          )}
          {tvShows.length > 0 && (
            <section>
              <h2 className="text-2xl font-headline font-bold mb-4">TV Shows</h2>
              <ContentGrid items={tvShows} type="tv" />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
