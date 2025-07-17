
"use client";

import type { WatchProvider } from '@/lib/types';
import Image from 'next/image';

interface WatchProvidersProps {
    providers: Partial<WatchProvider>[];
}

export function WatchProviders({ providers }: WatchProvidersProps) {
    if (!providers || providers.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-headline font-semibold mb-3">Where to Watch</h3>
            <div className="flex flex-wrap items-center gap-4">
                {providers.map(provider => (
                    <div key={provider.provider_name} className="transition-transform hover:scale-105" title={provider.provider_name}>
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden border">
                            {provider.provider_logo_url ? (
                                <Image
                                    src={provider.provider_logo_url}
                                    alt={`${provider.provider_name} logo`}
                                    fill
                                    sizes="50px"
                                    className="object-cover p-1"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-center text-muted-foreground p-1">
                                    {provider.provider_name}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
