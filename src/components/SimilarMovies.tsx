
import type { Movie } from '@/lib/types';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { ContentCard } from '@/components/ContentCard';
import { getSimilarMovies } from '@/services/movieService';

interface SimilarMoviesProps {
    currentMovieId: number;
    castIds: number[];
}

export async function SimilarMovies({ currentMovieId, castIds }: SimilarMoviesProps) {
    const similarMovies = await getSimilarMovies(currentMovieId, castIds);

    if (similarMovies.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-headline font-bold mb-4">Movies From Similar Cast</h2>
            <Carousel opts={{ align: 'start' }} className="w-full">
                <CarouselContent>
                    {similarMovies.map((movie) => (
                        <CarouselItem key={movie.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                            <ContentCard item={movie} type="movies" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
            </Carousel>
        </div>
    );
}
