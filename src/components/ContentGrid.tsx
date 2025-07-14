import type { Movie, TVShow } from '@/lib/types';
import { ContentCard } from './ContentCard';

interface ContentGridProps {
  items: (Movie | TVShow)[];
  type: 'movies' | 'tv';
}

export function ContentGrid({ items, type }: ContentGridProps) {
  if (items.length === 0) {
    return <p>No items found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {items.map((item) => (
        <div key={item.id} className="mt-2">
          <ContentCard item={item} type={type} />
        </div>
      ))}
    </div>
  );
}
