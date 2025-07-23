"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  Eye,
  Heart,
  Calendar,
  User,
  TrendingUp,
  Clock,
  Bookmark,
  ExternalLink,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPublicCollections } from "@/actions/collection/fetchPublicCollections";
import { Collection } from "@/types/types";
import Link from "next/link";

const ExploreCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [trendingCollections, setTrendingCollections] = useState<Collection[]>(
    []
  );
  const [featuredCollections, setFeaturedCollections] = useState<Collection[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    starredTopics: 0,
    starredCollections: 123,
  });

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const [recentResponse, trendingResponse, featuredResponse] =
        await Promise.all([
          fetchPublicCollections({ page: 1, limit: 6, sortBy: "recent" }),
          fetchPublicCollections({ page: 1, limit: 5, sortBy: "likes" }),
          fetchPublicCollections({ page: 1, limit: 3, sortBy: "trending" }),
        ]);

      setCollections(recentResponse.data);
      setTrendingCollections(trendingResponse.data);
      setFeaturedCollections(featuredResponse.data);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const CollectionCard = ({
    collection,
    isLarge = false,
  }: {
    collection: Collection;
    isLarge?: boolean;
  }) => (
    <Link href={`/collection/${collection.id}`}>
      <Card className="group hover:bg-muted/50 transition-colors cursor-pointer border-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 mt-0.5">
              <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
                {collection.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {collection.author}
                </span>
                <span className="text-muted-foreground">/</span>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {collection.title}
                </h3>
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  Public
                </Badge>
              </div>

              {collection.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {collection.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>collection</span>
                </div>

                {collection.likes > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span>{collection.likes}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  <span>{collection.totalLinks}</span>
                </div>

                <span>
                  Updated {formatDate(collection.updatedAt.toString())}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const FeaturedSection = () => (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">
            Get the latest bookmark collections
          </CardTitle>
        </div>
        <CardDescription>
          Join thousands of users discovering and organizing amazing bookmark
          collections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            : featuredCollections
                .slice(0, 3)
                .map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
        </div>
      </CardContent>
    </Card>
  );

  const BasedOnFollowingSection = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Based on your interests...</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ))
            : collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
        </div>
      </CardContent>
    </Card>
  );

  const TrendingSection = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Trending collections</h3>
            <span className="text-xs text-muted-foreground">today</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-4 w-4 rounded-full flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-3 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-4 flex-shrink-0" />
              </div>
            ))
          : trendingCollections.map((collection, index) => (
              <Link key={collection.id} href={`/collection/${collection.id}`}>
                <div className="flex items-start gap-3 p-2 -m-2 rounded hover:bg-muted/50 transition-colors group cursor-pointer">
                  <div className="flex items-center justify-center h-4 w-4 bg-primary text-primary-foreground rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-muted-foreground truncate">
                        {collection.author}
                      </span>
                      <span className="text-muted-foreground">/</span>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {collection.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {collection.description || "Collection of curated links"}
                    </p>
                  </div>
                  <Star className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Link>
            ))}

        <div className="pt-2 border-t">
          <Link
            href="/explore"
            className="text-xs text-primary hover:underline"
          >
            See more trending collections →
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const TrendingUsersSection = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Trending creators</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          : // Mock trending users data
            [
              { name: "Sarah Chen", username: "sarahc", avatar: "S" },
              { name: "Alex Kumar", username: "alexk", avatar: "A" },
              { name: "Maria Lopez", username: "mariaL", avatar: "M" },
            ].map((user) => (
              <div
                key={user.username}
                className="flex items-center gap-3 p-2 -m-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-xs font-medium text-foreground">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.username}
                  </div>
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex space-x-8">
              <Button
                variant="ghost"
                className="text-primary font-medium border-b-2 border-primary rounded-none"
              >
                Explore
              </Button>
              <Button variant="ghost" className="text-muted-foreground">
                Topics
              </Button>
              <Button variant="ghost" className="text-muted-foreground">
                Trending
              </Button>
              <Button variant="ghost" className="text-muted-foreground">
                Collections
              </Button>
              <Button variant="ghost" className="text-muted-foreground">
                Events
              </Button>
              <Button variant="ghost" className="text-muted-foreground">
                Cur8t Sponsors
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    A
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1">Amaan</h2>
                <p className="text-muted-foreground text-sm mb-4">amaan8429</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      starred topics
                    </span>
                    <span className="text-primary font-medium">
                      {userStats.starredTopics}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      starred collections
                    </span>
                    <span className="text-primary font-medium">
                      {userStats.starredCollections}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            <div className="space-y-6">
              <FeaturedSection />
              <BasedOnFollowingSection />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6">
            <TrendingSection />
            <TrendingUsersSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreCollections;
