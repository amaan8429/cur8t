import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CollectionWithAuthor } from './types';

interface DiscoverCollectionsSectionProps {
  collections: CollectionWithAuthor[];
  isLoading: boolean;
}

export function DiscoverCollectionsSection({
  collections,
  isLoading,
}: DiscoverCollectionsSectionProps) {
  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-foreground">
          Discover Collections
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Explore popular collections near you, browse by category, or check out
          some of the great community collections.
        </p>
      </div>
    </section>
  );
}
