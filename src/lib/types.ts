
export interface Role {
  movie_id: number;
  character: string;
}

export interface CrewRole {
  movie_id: number;
  job: string;
  department: string;
}

export interface Person {
  id: number;
  name: string;
  profile_path?: string | null;
  roles?: Role[];
  crew_roles?: CrewRole[];
  character?: string; // Added for convenience after joining
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Video {
  name: string;
  key_id: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
  url?: string; // Made optional as it's constructed
}

export interface OttProvider {
  provider_name: string;
  logo_path: string;
}

export interface OttPlatformDetails {
  flatrate?: OttProvider[];
  rent?: OttProvider[];
  buy?: OttProvider[];
}

export interface ContentItem {
  id: number;
  title: string;
  slug?: string;
}

export interface Movie extends ContentItem {
  overview: string;
  release_date: string;
  genres: string[];
  poster_path: string;
  vote_average?: number;
  vote_count: number;
  
  // These are from joins and might not always be present
  cast?: (Person & { character?: string })[];
  director?: Person;
  writers?: Person[];
  composers?: Person[];
  production?: ProductionCompany[];
  videos?: Video[];
  ott_platforms?: OttPlatformDetails;

  // Fields from DB that might not have been in original types
  backdrop_path?: string;
  imdb_id?: string;
  tagline?: string;
  runtime?: number;
  revenue?: number;
  budget?: number;
}

export interface TVShow extends ContentItem {
  year: number;
  rating: number;
  seasons: number;
  genre: string[];
  synopsis: string;
  posterUrl: string;
  trailerUrl: string;
  slug: string;
  cast: { name: string; role: string }[];
  director: string;
  // For consistency with movie card hover
  genres?: string[];
  imdb_rating?: number;
}
