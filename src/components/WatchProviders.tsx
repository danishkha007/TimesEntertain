
"use client";

import type { OttPlatformDetails, OttProvider } from '@/lib/types';
import Image from 'next/image';
import { Separator } from './ui/separator';

interface WatchProvidersProps {
    providers?: OttPlatformDetails;
}

const TMDB_IMAGE_BASE_URL = 'https://media.themoviedb.org/t/p/w92/';

const CATEGORY_MAP: { [key in keyof OttPlatformDetails]: string } = {
  flatrate: "Stream",
  rent: "Rent",
  buy: "Buy",
};

export function WatchProviders({ providers }: WatchProvidersProps) {
    if (!providers || Object.keys(providers).length === 0) {
        return null;
    }

    const availableCategories = Object.keys(providers)
        .filter(key => Array.isArray((providers as any)[key]) && (providers as any)[key].length > 0) as (keyof OttPlatformDetails)[];

    if (availableCategories.length === 0) {
        return null;
    }

    return (
        <div className="grid p-4 gap-2">
            {availableCategories.map((categoryKey, index) => (
                <div key={categoryKey}>
                    <h4 className="font-medium leading-none mb-4">{CATEGORY_MAP[categoryKey]}</h4>
                    <div className="flex flex-wrap items-center gap-4">
                        {(providers[categoryKey] as OttProvider[]).map(provider => (
                            <div key={provider.provider_name} className="transition-transform hover:scale-105" title={provider.provider_name}>
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden border bg-white flex items-center justify-center">
                                    <Image
                                        src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                                        alt={`${provider.provider_name} logo`}
                                        fill
                                        sizes="48px"
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {index < availableCategories.length - 1 && <Separator className="mt-3 w-auto" />}
                </div>
            ))}
        </div>
    );
}
