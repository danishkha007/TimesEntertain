
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface MovieFiltersProps {
  genres: string[];
}

export function MovieFilters({ genres }: MovieFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = useCallback((key: 'sort' | 'genre', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value || value === "all") {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    
    // When a filter changes, reset to the first page
    current.delete('page');

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/movies${query}`);
  }, [searchParams, router]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
      <Select
        onValueChange={(value) => handleValueChange('genre', value)}
        defaultValue={searchParams.get('genre') || 'all'}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => handleValueChange('sort', value)}
        defaultValue={searchParams.get('sort') || 'popularity.desc'}
      >
        <SelectTrigger className="w-full md:w-[220px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popularity.desc">Popularity</SelectItem>
          <SelectItem value="release_date.desc">Release Date (Newest)</SelectItem>
          <SelectItem value="release_date.asc">Release Date (Oldest)</SelectItem>
          <SelectItem value="vote_average.desc">Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
