import type { Movie, Person } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { ContentCard } from '@/components/ContentCard';

interface SimilarMoviesProps {
    currentMovieId: number;
    cast: (Person & { character?: string })[];
}

async function getSimilarMovies(currentMovieId: number, cast: (Person & { character?: string })[]): Promise<Movie[]> {
    try {
        const filePath = path.join(process.cwd(), 'public/movies.json');
        const file = await fs.readFile(filePath, 'utf-8');
        const allMovies: Movie[] = JSON.parse(file);

        const similarMoviesMap = new Map<number, Movie>();
        const castIds = cast.map(c => c.id);

        allMovies.forEach(movie => {
            if (movie.id === currentMovieId) return;

            const hasSimilarCast = movie.cast_ids.some(castId => castIds.includes(castId));

            if (hasSimilarCast) {
                similarMoviesMap.set(movie.id, movie);
            }
        });

        // Order similar movies based on the original cast order
        const orderedSimilarMovies: Movie[] = [];
        const addedMovieIds = new Set<number>();
        
        cast.forEach(actor => {
            allMovies.forEach(movie => {
                if (movie.id !== currentMovieId && movie.cast_ids.includes(actor.id) && !addedMovieIds.has(movie.id)) {
                    orderedSimilarMovies.push(movie);
                    addedMovieIds.add(movie.id);
                }
            })
        });

        return orderedSimilarMovies;

    } catch (error) {
        console.error('Error fetching similar movies:', error);
        return [];
    }
}

export async function SimilarMovies({ currentMovieId, cast }: SimilarMoviesProps) {
    const similarMovies = await getSimilarMovies(currentMovieId, cast);

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