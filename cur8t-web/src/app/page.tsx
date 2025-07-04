import PlatformStats from "@/components/homepage/PlatformStats";
import TrendingCollections from "@/components/homepage/TrendingCollections";
import QuickSearch from "@/components/homepage/QuickSearch";
import ActivityFeed from "@/components/homepage/ActivityFeed";
import FeaturedUsers from "@/components/homepage/FeaturedUsers";
import CategorySections from "@/components/homepage/CategorySections";
import GitHubShowcase from "@/components/homepage/GitHubShowcase";
import PersonalRecommendations from "@/components/homepage/PersonalRecommendations";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";
import Hero from "@/components/landingPage/Hero";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-16">
        {/* Platform Statistics */}
        <section>
          <PlatformStats />
        </section>

        <Separator className="my-16" />

        {/* Quick Search */}
        <section>
          <QuickSearch />
        </section>

        <Separator className="my-16" />

        {/* Trending Collections */}
        <section>
          <TrendingCollections />
        </section>

        <Separator className="my-16" />

        {/* Personal Recommendations (Only for logged-in users) */}
        <section>
          <PersonalRecommendations />
        </section>

        <Separator className="my-16" />

        {/* Featured Users */}
        <section>
          <FeaturedUsers />
        </section>

        <Separator className="my-16" />

        {/* Category Sections */}
        <section>
          <CategorySections />
        </section>

        <Separator className="my-16" />

        {/* GitHub Showcase */}
        <section>
          <GitHubShowcase />
        </section>

        <Separator className="my-16" />

        {/* Activity Feed */}
        <section>
          <ActivityFeed />
        </section>
      </div>

      {/* Call to Action Section */}
      <div className="bg-muted/30 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to organize your bookmarks?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who are already managing their links more
            efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Get Started Free
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
