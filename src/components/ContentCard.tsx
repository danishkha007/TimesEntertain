import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Movie, TVShow } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: Movie | TVShow;
  type: 'movies' | 'tv';
  className?: string;
}

export function ContentCard({ item, type, className }: ContentCardProps) {
  return (
    <Link href={`/${type}/${item.slug}`} className="block group">
      <Card className={cn("overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1", className)}>
        <CardContent className="p-0">
          <div className="aspect-[2/3] relative">
            <Image
              src={item.posterUrl}
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
            <p className="text-sm text-muted-foreground">{item.year}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
