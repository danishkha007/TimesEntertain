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

export function getProviderLogo(providerName: string): { normalizedName: string, logoUrl: string | null, link: string } {
  if (typeof providerName !== 'string') {
    return { normalizedName: 'Unknown', logoUrl: null, link: '#' };
  }
  const name = providerName.toLowerCase();

  const providers: { [key: string]: { normalizedName: string, logo: string, aliases: string[], link: string } } = {
    'netflix': { normalizedName: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', aliases: ['netflix', 'netflix basic with ads'], link: 'https://www.netflix.com' },
    'amazon prime video': { normalizedName: 'Amazon Prime Video', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Amazon_Prime_logo_%282022%29.svg', aliases: ['amazon prime video', 'amazon video', 'prime video', 'amazon prime video with ads'], link: 'https://www.amazon.com/amazonvideo' },
    'disney plus': { normalizedName: 'Disney+', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg', aliases: ['disney plus', 'disney+'], link: 'https://www.disneyplus.com' },
    'hbo max': { normalizedName: 'Max', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/HBO_Max_Logo.svg', aliases: ['hbo max', 'max', 'hbo'], link: 'https://www.max.com' },
    'hulu': { normalizedName: 'Hulu', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg', aliases: ['hulu'], link: 'https://www.hulu.com' },
    'apple tv plus': { normalizedName: 'Apple TV+', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg', aliases: ['apple tv plus', 'apple tv+', 'apple tv'], link: 'https://tv.apple.com' },
    'paramount plus': { normalizedName: 'Paramount+', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Paramount%2B_logo.svg', aliases: ['paramount plus', 'paramount+'], link: 'https://www.paramountplus.com' },
    'peacock': { normalizedName: 'Peacock', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Peacock_logo.svg', aliases: ['peacock', 'peacock premium'], link: 'https://www.peacocktv.com' },
    'youtube': { normalizedName: 'YouTube', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Logo_of_YouTube_%282013-2015%29.svg', aliases: ['youtube', 'youtube premium'], link: 'https://www.youtube.com' },
    'google play': { normalizedName: 'Google Play', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Google_Play_logo_2022.svg', aliases: ['google play movies', 'google play movies & tv'], link: 'https://play.google.com/store/movies' },
    'vudu': { normalizedName: 'Vudu', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Vudu_2016.svg', aliases: ['vudu'], link: 'https://www.vudu.com' },
    'zee5': { normalizedName: 'Zee5', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/ZEE5_2025.svg', aliases: ['zee5'], link: 'https://www.zee5.com' },
    'hungama play': { normalizedName: 'Hungama Play', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Hungama_logo.png', aliases: ['hungama play', 'hungama'], link: 'https://www.hungama.com/movies' },
  };

  for (const key in providers) {
    const provider = providers[key];
    if (provider.aliases.includes(name)) {
      return { normalizedName: provider.normalizedName, logoUrl: provider.logo, link: provider.link };
    }
  }

  // Fallback for providers not in the list
  return { normalizedName: providerName, logoUrl: null, link: '#' };
}
