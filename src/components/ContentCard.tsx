import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Movie, TVShow } from '@/lib/types';
import { cn, slugify } from '@/lib/utils';

interface ContentCardProps {
  item: Movie | TVShow;
  type: 'movies' | 'tv';
  className?: string;
}

export function ContentCard({ item, type, className }: ContentCardProps) {
  const slug = item.slug ?? slugify(item.title);
  
  let itemPosterUrl = 'poster_url' in item ? item.poster_url : item.posterUrl;
  if (!itemPosterUrl) {
    itemPosterUrl = 'https://placehold.co/400x600.png';
  }
  
  const year = 'release_date' in item && item.release_date ? new Date(item.release_date).getFullYear() : ('year' in item ? item.year : '');

  return (
    <Link href={`/${type}/${slug}`} className="block group mt-4">
      <Card className={cn("overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1", className)}>
        <CardContent className="p-0">
          <div className="aspect-[2/3] relative">
            <Image
              src={itemPosterUrl}
              alt={`Poster for ${item.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              data-ai-hint={type === 'movies' ? 'movie poster' : 'tv show poster'}
            />
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
