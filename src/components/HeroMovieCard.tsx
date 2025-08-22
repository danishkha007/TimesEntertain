
import Link from 'next/link';
import Image from 'next/image';
import type { Movie } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Star } from 'lucide-react';

interface HeroMovieCardProps {
  movie: Movie;
}

export function HeroMovieCard({ movie }: HeroMovieCardProps) {
  const posterUrl = movie.poster_path ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}w500${movie.poster_path}` : 'https://placehold.co/400x600.png';

  return (
    <Link href={`/movies/${slugify(movie.title)}`} className="block group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <Image
          src={posterUrl}
          alt={`Poster for ${movie.title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, 15vw"
          data-ai-hint="movie poster"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h4 className="font-semibold text-sm truncate transition-colors">
            {movie.title}
          </h4>
          <div className="flex items-center gap-1 text-xs text-gray-300">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
