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
import { promises as fs } from 'fs';
import path from 'path';

async function getPopularMovies(): Promise<Movie[]> {
  try {
    const filePath = path.join(process.cwd(), 'public/movies.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const movies: Movie[] = JSON.parse(file);
    return [...movies].sort((a, b) => (b.imdb_rating ?? 0) - (a.imdb_rating ?? 0)).slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch and process movies:", error);
    return [];
  }
}

function MovieCarousel({ popularMovies }: { popularMovies: Movie[] }) {
  if (!popularMovies || popularMovies.length === 0) {
    return <p>Could not load popular movies.</p>;
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


export default async function Home() {
  const popularMovies = await getPopularMovies();
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
        <MovieCarousel popularMovies={popularMovies} />
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
