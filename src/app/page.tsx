
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { tvShows } from '@/lib/data';
import type { Movie, Person } from '@/lib/types';
import { ContentCard } from '@/components/ContentCard';
import { promises as fs } from 'fs';
import path from 'path';
import { PersonCard } from '@/components/PersonCard';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HeroMovieCard } from '@/components/HeroMovieCard';

async function getPopularMovies(): Promise<Movie[]> {
  try {
    const filePath = path.join(process.cwd(), 'public/movies.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const movies: Movie[] = JSON.parse(file);
    return [...movies]
      .filter((movie) => movie.poster_url) // Ensure movie has a poster
      .sort((a, b) => (b.imdb_rating ?? 0) - (a.imdb_rating ?? 0))
      .slice(0, 10);
  } catch (error) {
    console.error('Failed to fetch and process movies:', error);
    return [];
  }
}

async function getPopularPeople(
  role: 'Actor' | 'Director' | 'Composer'
): Promise<Person[]> {
  try {
    const personFilePath = path.join(process.cwd(), 'public/persons.json');
    const file = await fs.readFile(personFilePath, 'utf-8');
    const persons: Person[] = JSON.parse(file);

    const personCounts = new Map<number, number>();

    persons.forEach((person) => {
      let count = 0;
      if (role === 'Actor' && person.roles) {
        count = person.roles.length;
      } else if (person.crew_roles) {
        if (role === 'Director') {
          count = person.crew_roles.filter((r) => r.job === 'Director').length;
        } else if (role === 'Composer') {
          count = person.crew_roles.filter(
            (r) => r.job === 'Original Music Composer'
          ).length;
        }
      }
      if (count > 0) {
        personCounts.set(person.id, count);
      }
    });

    const sortedPeople = [...personCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => persons.find((p) => p.id === id))
      .filter((p): p is Person => p !== undefined);

    return sortedPeople.slice(0, 10);
  } catch (error) {
    console.error(`Failed to fetch popular ${role}s:`, error);
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
  );
}

function PersonCarousel({ people }: { people: Person[] }) {
  if (!people || people.length === 0) {
    return <p>Could not load people.</p>;
  }

  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {people.map((person) => (
          <CarouselItem
            key={person.id}
            className="basis-1/2 md:basis-1/3 lg:basis-1/5"
          >
            <PersonCard person={person} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12" />
      <CarouselNext className="mr-12" />
    </Carousel>
  );
}

export default async function Home() {
  const popularMovies = await getPopularMovies();
  const highestRatedMovies = popularMovies.slice(0, 5);
  const popularTvShows = [...tvShows]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  const popularActors = await getPopularPeople('Actor');
  const popularDirectors = await getPopularPeople('Director');
  const popularComposers = await getPopularPeople('Composer');

  return (
    <div className="space-y-12">
      <section className="relative w-screen -translate-x-1/2 left-1/2 -top-8 mb-4 overflow-hidden rounded-b-2xl bg-black/20 backdrop-blur-sm">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/background.png"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
                Welcome to TimesEntertain
              </h1>
              <p className="text-lg text-muted-foreground">
                Your ultimate guide to the world of movies and TV shows.
                Discover, watch, and enjoy.
              </p>
              <Button asChild size="lg">
                <Link href="/movies">Explore Movies</Link>
              </Button>
            </div>
            <div>
               <h3 className="text-xl font-bold text-foreground mb-4">
                Highest Rated Movies
              </h3>
               <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {highestRatedMovies.map((movie) => (
                    <CarouselItem key={movie.id} className="basis-1/2 md:basis-1/3 pl-2">
                      <HeroMovieCard movie={movie} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
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

      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">
          Popular Actors
        </h2>
        <PersonCarousel people={popularActors} />
      </section>

      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">
          Popular Directors
        </h2>
        <PersonCarousel people={popularDirectors} />
      </section>

      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">
          Popular Music Composers
        </h2>
        <PersonCarousel people={popularComposers} />
      </section>
    </div>
  );
}
