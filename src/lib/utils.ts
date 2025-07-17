import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
}

export function getProviderLogo(providerName: string): { normalizedName: string, logoUrl: string | null } {
  if (typeof providerName !== 'string') {
    return { normalizedName: 'Unknown', logoUrl: null };
  }
  const name = providerName.toLowerCase();

  const providers: { [key: string]: { normalizedName: string, logo: string } } = {
    'netflix': { normalizedName: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    'amazon prime video': { normalizedName: 'Amazon Prime Video', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video_logo.svg' },
    'disney plus': { normalizedName: 'Disney+', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
    'hbo max': { normalizedName: 'HBO Max', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/HBO_Max_Logo.svg' },
    'max': { normalizedName: 'HBO Max', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/HBO_Max_Logo.svg' },
    'hulu': { normalizedName: 'Hulu', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg' },
    'apple tv plus': { normalizedName: 'Apple TV+', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
    'paramount plus': { normalizedName: 'Paramount+', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Paramount%2B_logo.svg' },
    'peacock': { normalizedName: 'Peacock', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Peacock_logo.svg' },
    'youtube': { normalizedName: 'YouTube', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_logo_%282017%29.svg' },
    'google play movies': { normalizedName: 'Google Play', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Google_Play_logo_2022.svg' },
    'vudu': { normalizedName: 'Vudu', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Vudu_2016.svg' },
  };

  for (const key in providers) {
    if (name.includes(key)) {
      return { normalizedName: providers[key].normalizedName, logoUrl: providers[key].logo };
    }
  }

  // Fallback for providers not in the list
  return { normalizedName: providerName, logoUrl: null };
}
