
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Movie, TVShow } from '@/lib/types';
import { slugify } from '@/lib/utils';

type WatchlistItem = (Partial<Movie> & Partial<TVShow> & { id: number, title: string }) & { itemType: 'movies' | 'tv', slug?: string };

const WATCHLIST_KEY = 'timesentertain_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem(WATCHLIST_KEY);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = useCallback((item: Partial<Movie> & Partial<TVShow> & {id: number, title: string}, type: 'movies' | 'tv') => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === item.id && i.itemType === type)) {
        return prev;
      }
      const slug = slugify(item.title);
      
      const itemToAdd: WatchlistItem = {
          ...item,
          poster_url: 'poster_url' in item ? item.poster_url : undefined,
          posterUrl: 'posterUrl' in item ? item.posterUrl : undefined,
          genres: 'genres' in item ? item.genres : ('genre' in item ? item.genre : []),
          imdb_rating: 'imdb_rating' in item ? item.imdb_rating : ('rating' in item ? item.rating : 0),
          itemType: type,
          slug,
      }
      
      return [...prev, itemToAdd];
    });
  }, []);

  const removeFromWatchlist = useCallback((itemId: number, type: 'movies' | 'tv') => {
    setWatchlist((prev) => prev.filter((i) => !(i.id === itemId && i.itemType === type)));
  }, []);

  const isInWatchlist = useCallback((itemId: number, type: 'movies' | 'tv') => {
    return watchlist.some((i) => i.id === itemId && i.itemType === type);
  }, [watchlist]);

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, isLoaded };
}
