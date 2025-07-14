export interface Person {
  id: number;
  name: string;
  role: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_url: string | null;
  origin_country: string;
}

export interface Video {
  name: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
  url: string;
}

export interface ContentItem {
  id: number;
  title: string;
  slug?: string; // Movie slug is generated on the fly
}

export interface Movie extends ContentItem {
  overview: string;
  release_date: string;
  genres: string[];
  poster_url: string;
  imdb_rating?: number;
  vote_count: number;
  cast_ids: number[];
  crew_ids: number[];
  production_company_ids: number[];
  videos?: Video[];

  // Populated fields
  cast?: Person[];
  director?: Person;
  production?: ProductionCompany[];
}

export interface TVShow extends ContentItem {
  year: number;
  rating: number;
  seasons: number;
  genre: string[];
  synopsis: string;
  posterUrl: string;
  trailerUrl: string;
  slug: string; // TVShow slug is pre-defined
  cast: { name: string; role: string }[];
  director: string;
}
