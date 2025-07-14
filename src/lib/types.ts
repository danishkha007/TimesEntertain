export interface ContentItem {
  id: number;
  title: string;
  slug: string;
  year: number;
  rating: number;
  genre: string[];
  synopsis: string;
  posterUrl: string;
  trailerUrl: string;
  cast: { name: string; role: string }[];
  director: string;
}

export interface Movie extends ContentItem {}

export interface TVShow extends ContentItem {
  seasons: number;
}
