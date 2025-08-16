'use client';

import React from 'react';
import { ModeToggle } from '@/components/layout/ModeToggle';
import { Footer } from '@/components/layout/Footer';
import { useExploreDataOptimized } from '@/hooks/useExploreDataOptimized';
import { FeaturedCollectionsSection } from '@/components/explore/FeaturedCollectionsSection';
import Link from 'next/link';
import Image from 'next/image';

export default function ExplorePage() {
  const {
    trendingCollections,
    recentCollections,
    savedCollections,
    newCollections,
    isMainDataLoading,
    isUserDataLoading,
    isFullyLoaded,
    userStats,
    databaseUser,
    hasErrors,
    refetch,
  } = useExploreDataOptimized();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation with Gradient Background */}
      <div className="border-b bg-background sticky top-0 z-10 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Cur8t Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-16">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Featured Collections
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing collections curated by our community. Click on
              any collection to explore it in detail.
            </p>
          </div>

          {/* Featured Collections Section */}
          <FeaturedCollectionsSection
            collections={trendingCollections}
            isLoading={isMainDataLoading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
