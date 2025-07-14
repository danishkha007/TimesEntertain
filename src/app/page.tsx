"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { tvShows } from '@/lib/data';
import type { Movie } from '@/lib/types';
import { ContentCard } from '@/components/ContentCard';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function MovieCarousel() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('/TimesEntertain/movies.json');
        if (!res.ok) {
          throw new Error('Failed to fetch movies');
        }
        const movies: Movie[] = await res.json();
        const sortedMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
        setPopularMovies(sortedMovies);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, []);
  
  if (isLoading) {
    return (
       <div className="flex space-x-4">
        {Array.from({ length: 5 }).map((_, i) => (
           <div key={i} className="min-w-0 shrink-0 grow-0 basis-1/2 md:basis-1/3 lg:basis-1/5 pl-4">
             <Skeleton className="h-[350px] w-full" />
           </div>
        ))}
      </div>
    )
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {popularMovies.map((movie) => (
          <CarouselItem
            key={movie.id}
            className="basis-1/2 md:basis-1/3 lg:basis-1/5"
          >
            <ContentCard item={movie} type="movies" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12" />
      <CarouselNext className="mr-12" />
    </Carousel>
  )
}


export default function Home() {
  const popularTvShows = [...tvShows].sort((a, b) => b.rating - a.rating).slice(0, 10);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-headline font-bold mb-6">
          Welcome to TimesEntertain
        </h1>
        <p className="text-lg text-muted-foreground">
          Your ultimate guide to the world of movies and TV shows. Discover,
          watch, and enjoy.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">
          Popular Movies
        </h2>
        <MovieCarousel />
      </section>

      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">
          Popular TV Shows
        </h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {popularTvShows.map((show) => (
              <CarouselItem
                key={show.id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <ContentCard item={show} type="tv" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </section>
    </div>
  );
}
