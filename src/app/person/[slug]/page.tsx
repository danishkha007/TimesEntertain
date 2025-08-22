
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { slugify } from '@/lib/utils';
import type { Person, Movie } from '@/lib/types';
import type { Metadata } from 'next';
import { ContentGrid } from '@/components/ContentGrid';
import db from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

async function getPersonData(slug: string): Promise<{ person: Person; movies: Movie[] } | null> {
  try {
    const [personRows] = await db.query<RowDataPacket[]>("SELECT * FROM people WHERE ? = (SELECT slugify(name)) LIMIT 1", [slug]);

    if (personRows.length === 0) {
        return null;
    }
    const person = personRows[0] as Person;

    const [movieRows] = await db.query<RowDataPacket[]>(`
        SELECT DISTINCT m.*, GROUP_CONCAT(g.name) as genres
        FROM movies m
        LEFT JOIN movie_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        WHERE m.id IN (
            SELECT movie_id FROM movie_cast WHERE person_id = ?
            UNION
            SELECT movie_id FROM movie_crew WHERE person_id = ?
        )
        GROUP BY m.id
        ORDER BY m.popularity DESC
    `, [person.id, person.id]);

    const movies = movieRows.map(row => ({
        ...row,
        genres: row.genres ? row.genres.split(',') : [],
    })) as Movie[];

    return { person, movies };

  } catch (error) {
    console.error('Error fetching person data:', error);
    return null;
  }
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPersonData(params.slug);

  const noIndexMeta = {
    robots: {
      index: false,
      follow: true,
    },
  };

  if (!data?.person) {
    return {
      title: 'Person Not Found',
      ...noIndexMeta,
    };
  }

  const imageUrl = data.person.profile_path ? `${process.env.TMDB_IMAGE_BASE_URL}w500${data.person.profile_path}` : 'https://placehold.co/400x600.png';

  return {
    title: data.person.name,
    description: `Explore the filmography of ${data.person.name}.`,
    ...noIndexMeta,
    openGraph: {
      title: data.person.name,
      description: `Filmography of ${data.person.name}.`,
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 600,
          alt: `Photo of ${data.person.name}`,
        },
      ],
    },
  };
}

export default async function PersonDetailPage({ params }: { params: { slug: string }}) {
  const data = await getPersonData(params.slug);

  if (!data) {
    notFound();
  }

  const { person, movies } = data;
  const profileUrl = person.profile_path ? `${process.env.TMDB_IMAGE_BASE_URL}w500${person.profile_path}` : "https://placehold.co/400x600.png";

  return (
    <article>
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Image
            src={profileUrl}
            alt={`Photo of ${person.name}`}
            width={400}
            height={600}
            className="rounded-lg shadow-lg w-full"
            data-ai-hint="person photo"
          />
        </div>

        <div className="md:col-span-3">
          <h1 className="text-4xl font-headline font-bold mb-8">{person.name}</h1>
          
          <section>
            <h2 className="text-2xl font-headline font-bold mb-4">Filmography</h2>
            {movies.length > 0 ? (
                <ContentGrid items={movies} type="movies" />
            ) : (
                <p>No movies found in our records for {person.name}.</p>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}
