
import Image from 'next/image';
import type { Person } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PersonCardProps {
  person: Person & { character?: string };
  className?: string;
}

export function PersonCard({ person, className }: PersonCardProps) {
  const imageUrl = person.profile_path ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}w500${person.profile_path}` : "https://placehold.co/400x600.png";
  
  return (
    <Link href={`/person/${slugify(person.name)}`} className="block group">
      <Card className={cn("overflow-hidden h-full transition-all duration-300 group-hover:shadow-lg mt-4", className)}>
        <CardContent className="p-0 flex flex-col h-full">
          <div className="aspect-[2/3] relative">
            <Image
              src={imageUrl}
              alt={`Photo of ${person.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              data-ai-hint="person photo"
            />
          </div>
          <div className="p-4 flex-grow">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {person.name}
            </h3>
            {person.character && (
                <p className="text-sm text-muted-foreground">{person.character}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
