import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import AddToWatchlistButton from '@/components/AddToWatchlistButton';
import type { Movie, Person, ProductionCompany, Video } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';
import { slugify } from '@/lib/utils';
import type { Metadata } from 'next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CastMemberCard } from '@/components/CastMemberCard';
import { FullCastDialog } from '@/components/FullCastDialog';

export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), 'public/movies.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const movies: Movie[] = JSON.parse(file);

    return movies.map((movie) => ({
      slug: slugify(movie.title),
    }));
  } catch (error) {
    console.error('Error generating static params for movies:', error);
    return [];
  }
}

async function getMovieData(slug: string): Promise<Movie | null> {
    try {
        const movieFilePath = path.join(process.cwd(), 'public/movies.json');
        const personFilePath = path.join(process.cwd(), 'public/persons.json');
        const productionFilePath = path.join(process.cwd(), 'public/production.json');
        
        const [moviesFile, personsFile, productionsFile] = await Promise.all([
            fs.readFile(movieFilePath, 'utf-8'),
            fs.readFile(personFilePath, 'utf-8'),
            fs.readFile(productionFilePath, 'utf-8'),
        ]);

        const movies: Movie[] = JSON.parse(moviesFile);
        const persons: Person[] = JSON.parse(personsFile);
        const productions: ProductionCompany[] = JSON.parse(productionsFile);
        
        const movie = movies.find((m) => slugify(m.title) === slug);

        if (!movie) {
            return null;
        }

        const director = persons.find(p => 
            p.crew_roles?.some(role => role.movie_id === movie.id && role.job === 'Director')
        );

        const cast = movie.cast_ids
            .map(id => {
                const person = persons.find(p => p.id === id);
                if (!person) return null;

                const role = person.roles?.find(r => r.movie_id === movie.id);
                return { ...person, character: role?.character };
            })
            .filter(Boolean) as (Person & { character?: string })[];
        
        const production = movie.production_company_ids.map(id => productions.find(p => p.id === id)).filter(Boolean) as ProductionCompany[];
        
        return { ...movie, director, cast, production };

    } catch (error) {
        console.error('Error fetching movie data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movie = await getMovieData(params.slug);

  if (!movie) {
    return {
      title: 'Movie Not Found',
    };
  }

  const imageUrl = movie.poster_url || 'https://placehold.co/400x600.png';

  return {
    title: movie.title,
    description: movie.overview,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 600,
          alt: `Poster for ${movie.title}`,
        },
      ],
    },
  };
}


const getEmbedUrl = (video: Video) => {
    if (!video || !video.key) return null;
    if (video.site === 'YouTube') {
        return `https://www.youtube.com/embed/${video.key}`;
    }
    // Attempt to parse other video URLs, might need more robust logic
    if (video.url && video.url.includes('youtube.com/watch?v=')) {
        const key = video.url.split('v=')[1];
        return `https://www.youtube.com/embed/${key}`;
    }
    return video.url; // Fallback
};

export default async function MovieDetailPage({ params }: { params: { slug: string }}) {
  const movie = await getMovieData(params.slug);

  if (!movie) {
    notFound();
  }
  
  const getYear = (dateString: string) => new Date(dateString).getFullYear();

  const topCast = movie.cast?.slice(0, 10) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    datePublished: movie.release_date,
    image: movie.poster_url,
    description: movie.overview,
    director: movie.director ? {
      '@type': 'Person',
      name: movie.director.name,
    } : undefined,
    actor: movie.cast?.map((actor) => ({
      '@type': 'Person',
      name: actor.name,
    })),
    productionCompany: movie.production?.map((p) => ({
      '@type': 'Organization',
      name: p.name,
    })),
    aggregateRating: movie.imdb_rating ? {
      '@type': 'AggregateRating',
      ratingValue: movie.imdb_rating?.toString(),
      bestRating: '10',
      ratingCount: movie.vote_count.toString(), 
    } : undefined,
  };
  
  const posterUrl = movie.poster_url || "https://placehold.co/400x600.png";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Image
              src={posterUrl}
              alt={`Poster for ${movie.title}`}
              width={400}
              height={600}
              className="rounded-lg shadow-lg w-full"
              data-ai-hint="movie poster"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-headline font-bold mb-2">{movie.title} ({getYear(movie.release_date)})</h1>
            {movie.director && (
              <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                <span>Directed by {movie.director.name}</span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
            {movie.imdb_rating && (
              <div className="flex items-center gap-1 text-lg font-bold">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>{movie.imdb_rating?.toFixed(1)}</span>
              </div>
            )}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <Badge key={g} variant="secondary">{g}</Badge>
                ))}
              </div>
            </div>
            
            <p className="text-lg mb-6">{movie.overview}</p>

            <AddToWatchlistButton item={movie} type="movies" />

            {movie.production && movie.production.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-md font-semibold text-muted-foreground">Production Companies</h3>
                    <p className="text-sm">{movie.production.map(p => p.name).join(', ')}</p>
                </div>
            )}
          </div>
        </div>

        {movie.cast && movie.cast.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-headline font-bold">Cast</h2>
              <FullCastDialog cast={movie.cast} movieTitle={movie.title} />
            </div>
            <Carousel opts={{ align: 'start' }} className="w-full">
              <CarouselContent>
                {topCast.map(c => (
                  <CarouselItem key={c.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                     <CastMemberCard actor={c} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12" />
            </Carousel>
          </div>
        )}

        {movie.videos && movie.videos.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-headline font-bold mb-6">Videos Related to {movie.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {movie.videos.map((video) => {
                const embedUrl = getEmbedUrl(video);
                if (!embedUrl) return null;
                
                return (
                  <div key={video.key || video.url}>
                    <div className="aspect-video mb-2">
                      <iframe
                        src={embedUrl}
                        title={video.name}
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <h3 className="font-semibold">{video.name}</h3>
                    <p className="text-sm text-muted-foreground">{video.type}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
