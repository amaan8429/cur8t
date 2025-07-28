"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { Footer } from "@/components/layout/Footer";
import { useExploreDataOptimized } from "@/hooks/useExploreDataOptimized";

// Import new components
import { UserProfileSection } from "@/components/explore/UserProfileSection";
import { TrendingSection } from "@/components/explore/TrendingSection";
import { SavedCollectionsSection } from "@/components/explore/SavedCollectionsSection";
import { FeaturedSection } from "@/components/explore/FeaturedSection";
import { EventsTimelineSection } from "@/components/explore/EventsTimelineSection";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"explore" | "events">("explore");

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
      {/* Top Navigation */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex space-x-8">
              <Button
                variant="ghost"
                className={`font-medium rounded-none ${
                  activeTab === "explore"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("explore")}
              >
                Explore
              </Button>
              <Button
                variant="ghost"
                className={`font-medium rounded-none ${
                  activeTab === "events"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("events")}
              >
                Events
              </Button>
            </nav>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="w-80 flex-shrink-0">
            <UserProfileSection
              userStats={userStats}
              databaseUser={databaseUser}
            />
          </div>

          {/* Main Content - Shows immediately when main data loads */}
          <div className="flex-1 max-w-3xl">
            {activeTab === "explore" ? (
              <div className="space-y-8">
                <FeaturedSection
                  recentCollections={recentCollections}
                  isLoading={isMainDataLoading}
                />
              </div>
            ) : (
              <div className="space-y-8">
                <EventsTimelineSection
                  newCollections={newCollections}
                  isLoading={isMainDataLoading}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar - Shows immediately when main data loads */}
          <div className="w-80 flex-shrink-0 space-y-8">
            <TrendingSection
              trendingCollections={trendingCollections}
              isLoading={isMainDataLoading}
            />
            <SavedCollectionsSection
              savedCollections={savedCollections}
              isLoading={isUserDataLoading} // Separate loading state for user data
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
