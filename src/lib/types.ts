export interface Person {
  id: number;
  name: string;
  role: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
}

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
}

export interface Movie extends ContentItem {
  castIds: number[];
  directorId: number;
  productionCompanyIds: number[];

  // Populated fields
  cast?: Person[];
  director?: Person;
  production?: ProductionCompany[];
}

export interface TVShow extends ContentItem {
  seasons: number;
  cast: { name: string; role: string }[];
  director: string;
}
