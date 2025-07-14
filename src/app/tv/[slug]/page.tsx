import { tvShows } from '@/lib/data';
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
  return tvShows.map((show) => ({
    slug: show.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const show = tvShows.find((m) => m.slug === params.slug);

  if (!show) {
    return {
      title: 'TV Show Not Found',
    };
  }
  
  const imageUrl = show.posterUrl || 'https://placehold.co/400x600.png';

  return {
    title: show.title,
    description: show.synopsis,
    openGraph: {
      title: show.title,
      description: show.synopsis,
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 600,
          alt: `Poster for ${show.title}`,
        },
      ],
    },
  };
}

export default function TvShowDetailPage({ params }: Props) {
  const show = tvShows.find((m) => m.slug === params.slug);

  if (!show) {
    notFound();
  }
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.title,
    datePublished: show.year.toString(),
    image: show.posterUrl,
    description: show.synopsis,
    director: {
      '@type': 'Person',
      name: show.director,
    },
    actors: show.cast.map((actor) => ({
      '@type': 'Person',
      name: actor.name,
    })),
    numberOfSeasons: show.seasons.toString(),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: show.rating.toString(),
      bestRating: '10',
      ratingCount: '1', // Mock value
    },
  };

  const posterUrl = show.posterUrl || "https://placehold.co/400x600.png";

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
              src={posterUrl}
              alt={`Poster for ${show.title}`}
              width={400}
              height={600}
              className="rounded-lg shadow-lg w-full"
              data-ai-hint="tv show poster"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-headline font-bold mb-2">{show.title} ({show.year})</h1>
            <div className="flex items-center gap-4 mb-4 text-muted-foreground">
              <span>{show.seasons} {show.seasons > 1 ? 'Seasons' : 'Season'}</span>
              <span>&bull;</span>
              <span>Directed by {show.director}</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-lg font-bold">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>{show.rating.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {show.genre.map((g) => (
                  <Badge key={g} variant="secondary">{g}</Badge>
                ))}
              </div>
            </div>
            
            <p className="text-lg mb-6">{show.synopsis}</p>

            <AddToWatchlistButton item={show} type="tv" />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-headline font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {show.cast.map(c => (
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
                    src={show.trailerUrl}
                    title={`Trailer for ${show.title}`}
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
