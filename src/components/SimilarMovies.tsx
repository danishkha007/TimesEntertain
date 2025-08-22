
import type { Movie } from '@/lib/types';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { ContentCard } from '@/components/ContentCard';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

interface SimilarMoviesProps {
    currentMovieId: number;
    castIds: number[];
}

async function getSimilarMovies(currentMovieId: number, castIds: number[]): Promise<Movie[]> {
    if (castIds.length === 0) return [];
    try {
        const placeholders = castIds.map(() => '?').join(',');
        const params = [currentMovieId, ...castIds];

        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT DISTINCT m.*, GROUP_CONCAT(g.name) as genres
            FROM movies m
            JOIN movie_cast mc ON m.id = mc.movie_id
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genres g ON mg.genre_id = g.id
            WHERE m.id != ? AND mc.person_id IN (${placeholders})
            GROUP BY m.id
            ORDER BY m.popularity DESC
            LIMIT 10
        `, params);
        
        return rows.map(row => ({
            ...row,
            genres: row.genres ? row.genres.split(',') : [],
            vote_average: typeof row.vote_average === 'string' ? parseFloat(row.vote_average) : row.vote_average,
        })) as Movie[];

    } catch (error) {
        console.error('Error fetching similar movies:', error);
        return [];
    }
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
