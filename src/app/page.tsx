import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { movies, tvShows } from '@/lib/data';
import { ContentCard } from '@/components/ContentCard';

export default function Home() {
  const popularMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
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
