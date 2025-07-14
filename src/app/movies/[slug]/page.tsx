import { movies } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Metadata } from 'next';
import AddToWatchlistButton from '@/components/AddToWatchlistButton';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return movies.map((movie) => ({
    slug: movie.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = movies.find((m) => m.slug === params.slug);

  if (!movie) {
    return {
      title: 'Movie Not Found',
    };
  }

  return {
    title: movie.title,
    description: movie.synopsis,
    openGraph: {
      title: movie.title,
      description: movie.synopsis,
      images: [
        {
          url: movie.posterUrl,
          width: 400,
          height: 600,
          alt: `Poster for ${movie.title}`,
        },
      ],
    },
  };
}

export default function MovieDetailPage({ params }: Props) {
  const movie = movies.find((m) => m.slug === params.slug);

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
    director: {
      '@type': 'Person',
      name: movie.director,
    },
    actor: movie.cast.map((actor) => ({
      '@type': 'Person',
      name: actor.name,
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
            <div className="flex items-center gap-4 mb-4 text-muted-foreground">
              <span>Directed by {movie.director}</span>
            </div>

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

          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-headline font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movie.cast.map(c => (
              <div key={c.name} className="bg-muted/50 p-3 rounded-lg">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.role}</p>
              </div>
            ))}
          </div>
        </div>

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
