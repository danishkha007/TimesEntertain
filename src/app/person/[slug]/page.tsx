
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Person, Movie } from '@/lib/types';
import type { Metadata } from 'next';
import { ContentGrid } from '@/components/ContentGrid';
import { getPersonBySlug } from '@/services/personService';
import { getMoviesByPersonSlug } from '@/services/personService';


async function getPersonData(slug: string): Promise<{ person: Person; movies: Movie[] } | null> {
  try {
    const person = await getPersonBySlug(slug);
    if (!person) return null;

    const movies = await getMoviesByPersonSlug(slug);
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
