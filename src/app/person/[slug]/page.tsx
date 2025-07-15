import { notFound } from 'next/navigation';
import Image from 'next/image';
import { promises as fs } from 'fs';
import path from 'path';
import { slugify } from '@/lib/utils';
import type { Person, Movie } from '@/lib/types';
import type { Metadata } from 'next';
import { ContentGrid } from '@/components/ContentGrid';

export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), 'public/persons.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const persons: Person[] = JSON.parse(file);

    return persons.map((person) => ({
      slug: slugify(person.name),
    }));
  } catch (error) {
    console.error('Error generating static params for persons:', error);
    return [];
  }
}

async function getPersonData(slug: string): Promise<{ person: Person; movies: Movie[] } | null> {
  try {
    const personFilePath = path.join(process.cwd(), 'public/persons.json');
    const movieFilePath = path.join(process.cwd(), 'public/movies.json');
    
    const [personsFile, moviesFile] = await Promise.all([
        fs.readFile(personFilePath, 'utf-8'),
        fs.readFile(movieFilePath, 'utf-8'),
    ]);

    const persons: Person[] = JSON.parse(personsFile);
    const allMovies: Movie[] = JSON.parse(moviesFile);
    
    const person = persons.find((p) => slugify(p.name) === slug);

    if (!person) {
        return null;
    }

    const movies = allMovies.filter(movie => 
        movie.cast_ids.includes(person.id) || movie.crew_ids.includes(person.id)
    );

    return { person, movies };

  } catch (error) {
    console.error('Error fetching person data:', error);
    return null;
  }
}


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPersonData(params.slug);

  if (!data?.person) {
    return {
      title: 'Person Not Found',
    };
  }

  const imageUrl = data.person.profile_url || 'https://placehold.co/400x600.png';

  return {
    title: data.person.name,
    description: `Explore the filmography of ${data.person.name}.`,
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
  const profileUrl = person.profile_url || "https://placehold.co/400x600.png";

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
