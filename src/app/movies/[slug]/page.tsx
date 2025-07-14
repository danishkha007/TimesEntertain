"use client"

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import AddToWatchlistButton from '@/components/AddToWatchlistButton';
import type { Movie, Person, ProductionCompany } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getMovieData(slug: string): Promise<Movie | null> {
    try {
        const [moviesRes, personsRes, productionsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/movies.json`),
            fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/persons.json`),
            fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/production.json`),
        ]);

        if (!moviesRes.ok || !personsRes.ok || !productionsRes.ok) {
            console.error('Failed to fetch movie data');
            return null;
        }

        const movies: Movie[] = await moviesRes.json();
        const persons: Person[] = await personsRes.json();
        const productions: ProductionCompany[] = await productionsRes.json();

        const movie = movies.find((m) => m.slug === slug);

        if (!movie) {
            return null;
        }

        const director = persons.find(p => p.id === movie.directorId);
        const cast = movie.castIds.map(id => persons.find(p => p.id === id)).filter(Boolean) as Person[];
        const production = movie.productionCompanyIds.map(id => productions.find(p => p.id === id)).filter(Boolean) as ProductionCompany[];
        
        return { ...movie, director, cast, production };

    } catch (error) {
        console.error('Error fetching movie data:', error);
        return null;
    }
}


export default function MovieDetailPage({ params }: { params: { slug: string }}) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const movieData = await getMovieData(params.slug);
        if (movieData) {
            setMovie(movieData);
            document.title = `${movieData.title} | TimesEntertain`;
        }
        setIsLoading(false);
    }
    loadData();
  }, [params.slug]);


  if (isLoading) {
    return (
        <article className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Skeleton className="w-full h-[500px] rounded-lg" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-48" />
                </div>
            </div>
             <div className="mt-12">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({length: 4}).map((_,i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
            </div>
        </article>
    );
  }

  if (!movie) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    datePublished: movie.year.toString(),
    image: movie.posterUrl,
    description: movie.synopsis,
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.rating.toString(),
      bestRating: '10',
      ratingCount: '1', // Mock value
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Image
              src={movie.posterUrl}
              alt={`Poster for ${movie.title}`}
              width={400}
              height={600}
              className="rounded-lg shadow-lg w-full"
              data-ai-hint="movie poster"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-headline font-bold mb-2">{movie.title} ({movie.year})</h1>
            {movie.director && (
              <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                <span>Directed by {movie.director.name}</span>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-lg font-bold">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <Badge key={g} variant="secondary">{g}</Badge>
                ))}
              </div>
            </div>
            
            <p className="text-lg mb-6">{movie.synopsis}</p>

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
            <h2 className="text-2xl font-headline font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movie.cast.map(c => (
                <div key={c.id} className="bg-muted/50 p-3 rounded-lg">
                  <p className="font-semibold">{c.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
            <h2 className="text-2xl font-headline font-bold mb-4">Trailer</h2>
            <div className="aspect-video">
                <iframe 
                    src={movie.trailerUrl}
                    title={`Trailer for ${movie.title}`}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
      </article>
    </>
  );
}
