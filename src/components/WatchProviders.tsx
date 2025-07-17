
"use client";

import type { WatchProvider } from '@/lib/types';
import Image from 'next/image';

interface WatchProvidersProps {
    providers: WatchProvider[];
}

export function WatchProviders({ providers }: WatchProvidersProps) {
    if (!providers || providers.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">|</span>
            <span className="text-sm font-medium text-muted-foreground">Watch Now:</span>
            {providers.map(provider => (
                <div key={provider.provider_name} className="transition-transform hover:scale-105" title={provider.provider_name}>
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden border bg-white flex items-center justify-center">
                       {provider.provider_logo_url ? (
                            <Image
                                src={provider.provider_logo_url}
                                alt={`${provider.provider_name} logo`}
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                            />
                       ) : (
                            <span className="text-xs text-center text-muted-foreground p-1">{provider.provider_name}</span>
                       )}
                    </div>
                </div>
            ))}
        </div>
    );
}
