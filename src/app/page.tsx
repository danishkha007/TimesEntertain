
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
import { PersonCard } from '@/components/PersonCard';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroMovieCard } from '@/components/HeroMovieCard';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

async function getPopularMovies(): Promise<Movie[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT 
        m.*, 
        GROUP_CONCAT(DISTINCT g.name) AS genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.poster_path IS NOT NULL
      GROUP BY m.id
      ORDER BY m.popularity DESC 
      LIMIT 10
    `);
    
    return rows.map(row => ({
      ...row,
      genres: row.genres ? row.genres.split(',') : [],
      vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average
    })) as Movie[];
  } catch (error) {
    console.error('Failed to fetch and process movies:', error);
    return [];
  }
}


async function getPopularPeople(): Promise<Person[]> {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT p.*
      FROM people p
      ORDER BY p.popularity DESC
      LIMIT 10
    `);
    return rows as Person[];
  } catch (error) {
    console.error(`Failed to fetch popular people:`, error);
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
  const highestRatedMovies = [...popularMovies].sort((a,b) => (b.vote_average ?? 0) - (a.vote_average ?? 0)).slice(0, 5);
  const popularTvShows = [...tvShows]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  const popularActors = await getPopularPeople();
  const popularDirectors = await getPopularPeople(); // Simplified for now
  const popularComposers = await getPopularPeople(); // Simplified for now

  return (
    <div className="space-y-12">
      <section className="relative w-screen -translate-x-1/2 left-1/2 -top-8 mb-4 overflow-hidden rounded-b-2xl bg-black/20 backdrop-blur-sm h-[80vh] flex flex-col justify-center">
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
        <div className="relative container mx-auto px-4">
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
               <Link href="/movies?sort=vote_average.desc" className="inline-block">
                <h3 className="text-xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                  Highest Rated Movies
                </h3>
               </Link>
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
