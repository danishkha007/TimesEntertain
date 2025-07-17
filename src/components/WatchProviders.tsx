
"use client";

import type { WatchProvider } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface WatchProvidersProps {
    providers: WatchProvider[];
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
                    <Link href={provider.link} key={provider.provider_name} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden border">
                            <Image
                                src={provider.provider_logo_url || "https://placehold.co/50x50.png"}
                                alt={`${provider.provider_name} logo`}
                                fill
                                sizes="50px"
                                className="object-cover"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
