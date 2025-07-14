"use client";

import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

function SearchPageFallback() {
  return <div>Loading search results...</div>;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchResults />
    </Suspense>
  );
}
