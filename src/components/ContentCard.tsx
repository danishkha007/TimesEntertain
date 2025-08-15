
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Movie, TVShow } from '@/lib/types';
import { cn, slugify } from '@/lib/utils';
import { Star } from 'lucide-react';
import { Badge } from './ui/badge';

interface ContentCardProps {
  item: Movie | TVShow | (Partial<Movie> & { itemType?: 'movies' | 'tv' });
  type: 'movies' | 'tv';
  className?: string;
}

export function ContentCard({ item, type, className }: ContentCardProps) {
  const slug = item.slug ?? slugify(item.title);
  
  let itemPosterUrl = 'poster_url' in item ? item.poster_url : ('posterUrl' in item ? item.posterUrl : 'https://placehold.co/400x600.png');
  if (!itemPosterUrl) {
    itemPosterUrl = 'https://placehold.co/400x600.png';
  }
  
  const year = 'release_date' in item && item.release_date ? new Date(item.release_date).getFullYear() : ('year' in item ? item.year : '');
  const rating = 'imdb_rating' in item ? item.imdb_rating : ('rating' in item ? item.rating : 0);
  const genres = 'genres' in item ? item.genres : ('genre' in item ? item.genre : []);


  return (
    <Link href={`/${type}/${slug}`} className="block group">
      <Card className={cn("overflow-hidden transition-all duration-300 group-hover:shadow-lg mt-4", className)}>
        <CardContent className="p-0">
          <div className="aspect-[2/3] relative overflow-hidden">
            <Image
              src={itemPosterUrl}
              alt={`Poster for ${item.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              data-ai-hint={type === 'movies' ? 'movie poster' : 'tv show poster'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {rating ? (
              <div className="absolute top-0 right-0 m-2 bg-black/70 text-white p-2 rounded-full transform -translate-y-16 group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                <div className="flex items-center gap-1 text-sm font-bold">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              </div>
            ) : null}

            {genres && genres.length > 0 && (
                 <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {genres.slice(0,2).map((g: string) => (
                        <Badge key={g} variant="secondary" className="text-xs backdrop-blur-sm bg-white/30 border-none">{g}</Badge>
                    ))}
                 </div>
            )}

          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">{year}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
