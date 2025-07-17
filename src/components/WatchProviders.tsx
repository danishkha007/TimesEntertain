
"use client";

import type { WatchProvider } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PlayCircle } from 'lucide-react';
import Link from 'next/link';

interface WatchProvidersProps {
    providers: WatchProvider[];
}

export function WatchProviders({ providers }: WatchProvidersProps) {
    if (!providers || providers.length === 0) {
        return null;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="lg">
                    <PlayCircle className="mr-2" />
                    Watch Now
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
                 <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Available On</h4>
                        <p className="text-sm text-muted-foreground">
                            This movie is available on the following platforms.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        {providers.map(provider => (
                            <Link key={provider.provider_name} href={provider.link} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105" title={provider.provider_name}>
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden border bg-white flex items-center justify-center">
                                {provider.provider_logo_url ? (
                                        <Image
                                            src={provider.provider_logo_url}
                                            alt={`${provider.provider_name} logo`}
                                            fill
                                            sizes="48px"
                                            className="object-contain p-1"
                                        />
                                ) : (
                                        <span className="text-xs text-center text-muted-foreground p-1">{provider.provider_name}</span>
                                )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
