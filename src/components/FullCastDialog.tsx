import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CastMemberCard } from './CastMemberCard';
import type { Person } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

interface FullCastDialogProps {
  cast: (Person & { character?: string })[];
  movieTitle: string;
}

export function FullCastDialog({ cast, movieTitle }: FullCastDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Full Cast</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Full Cast for {movieTitle}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
            {cast.map((actor) => (
              <CastMemberCard key={actor.id} actor={actor} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
