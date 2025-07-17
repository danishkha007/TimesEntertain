
"use client";

import { useWatchlist } from '@/hooks/use-watchlist';
import type { Movie, TVShow } from '@/lib/types';
import { Button } from './ui/button';
import { Bookmark, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AddToWatchlistButtonProps {
  item: { id: number; title: string };
  type: 'movies' | 'tv';
  className?: string;
}

export default function AddToWatchlistButton({ item, type, className }: AddToWatchlistButtonProps) {
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
      addToWatchlist(item, type);
      toast({
        title: "Added to Watchlist",
        description: `${item.title} has been added to your watchlist.`,
      });
    }
  };

  if (!isLoaded) {
    return <Button disabled size="lg" className={cn(className)}><Bookmark /> Loading...</Button>;
  }

  return (
    <Button onClick={handleToggleWatchlist} size="lg" variant={"default"} className={cn(className)}>
      {isBookmarked ? <Check className="mr-2" /> : <Bookmark className="mr-2" />}
      {isBookmarked ? 'On my Watchlist' : 'Add to Watchlist'}
    </Button>
  );
}
