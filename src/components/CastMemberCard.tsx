import Image from 'next/image';
import type { Person } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface CastMemberCardProps {
  actor: Person & { character?: string };
}

export function CastMemberCard({ actor }: CastMemberCardProps) {
  const imageUrl = actor.profile_url || "https://placehold.co/400x600.png";
  
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="aspect-[2/3] relative">
          <Image
            src={imageUrl}
            alt={`Photo of ${actor.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            data-ai-hint="person photo"
          />
        </div>
        <div className="p-3 flex-grow flex flex-col justify-between">
          <div>
            <p className="font-semibold text-sm">{actor.name}</p>
            {actor.character && (
              <p className="text-xs text-muted-foreground">{actor.character}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
