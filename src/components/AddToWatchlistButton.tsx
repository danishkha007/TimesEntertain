"use client";

import { useWatchlist } from '@/hooks/use-watchlist';
import type { Movie, TVShow } from '@/lib/types';
import { Button } from './ui/button';
import { Bookmark, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { slugify } from '@/lib/utils';

interface AddToWatchlistButtonProps {
  item: Movie | TVShow;
  type: 'movies' | 'tv';
}

export default function AddToWatchlistButton({ item, type }: AddToWatchlistButtonProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, isLoaded } = useWatchlist();
  const { toast } = useToast();
  const isBookmarked = isInWatchlist(item.id, type);

  const handleToggleWatchlist = () => {
    if (isBookmarked) {
      removeFromWatchlist(item.id, type);
      toast({
        title: "Removed from Watchlist",
        description: `${item.title} has been removed from your watchlist.`,
      });
    } else {
      let itemToAdd: Movie | TVShow;
      if (type === 'movies') {
        const movieItem = item as Movie;
        itemToAdd = {
          id: movieItem.id,
          title: movieItem.title,
          overview: movieItem.overview,
          release_date: movieItem.release_date,
          genres: movieItem.genres,
          poster_url: movieItem.poster_url,
          imdb_rating: movieItem.imdb_rating,
          vote_count: movieItem.vote_count,
          cast_ids: movieItem.cast_ids,
          crew_ids: movieItem.crew_ids,
          production_company_ids: movieItem.production_company_ids,
          videos: movieItem.videos,
        };
      } else {
        itemToAdd = item;
      }
      addToWatchlist(itemToAdd, type);
      toast({
        title: "Added to Watchlist",
        description: `${item.title} has been added to your watchlist.`,
      });
    }
  };

  if (!isLoaded) {
    return <Button disabled size="lg"><Bookmark /> Loading...</Button>;
  }

  return (
    <Button onClick={handleToggleWatchlist} size="lg" variant={isBookmarked ? "default" : "outline"}>
      {isBookmarked ? <Check className="mr-2" /> : <Bookmark className="mr-2" />}
      {isBookmarked ? 'On my Watchlist' : 'Add to Watchlist'}
    </Button>
  );
}
