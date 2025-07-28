"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Clock,
  Sparkles,
  Link2,
  Heart,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { getHomepageCollections } from "@/actions/platform/homepageCollections";
import { Collection } from "@/types/types";
import Link from "next/link";

interface HomepageCollectionsData {
  trending: Collection[];
  recent: Collection[];
  new: Collection[];
}

const TrendingCollections = () => {
  const [collections, setCollections] =
    useState<HomepageCollectionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"trending" | "recent" | "new">(
    "trending"
  );

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await getHomepageCollections();

        // Check for rate limiting
        if (response.error && response.retryAfter) {
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: response.retryAfter * 60,
            message: "Too many homepage requests. Please try again later.",
          });
          setIsLoading(false);
          return;
        }

        if (response.success && response.data) {
          setCollections(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch homepage collections:", error);
      }
      setIsLoading(false);
    };

    fetchCollections();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <Link
      href={`/collection/${collection.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Card className="group hover:shadow-sm transition-all duration-300 cursor-pointer border-border/30 hover:border-border/50 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {collection.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 text-muted-foreground">
                {collection.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                <span>{collection.totalLinks}</span>
              </div>

              {collection.likes > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Heart className="h-3.5 w-3.5" />
                  <span>{collection.likes}</span>
                </div>
              )}

              <Badge variant="outline" className="text-xs">
                Public
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  Updated {formatDate(collection.updatedAt.toString())}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {collection.author?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {collection.author}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const LoadingCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const tabs = [
    {
      id: "trending" as const,
      label: "Trending",
      icon: TrendingUp,
      description: "Most liked collections",
    },
    {
      id: "recent" as const,
      label: "Recently Updated",
      icon: Clock,
      description: "Fresh content",
    },
    {
      id: "new" as const,
      label: "New This Week",
      icon: Sparkles,
      description: "Just created",
    },
  ];

  const currentCollections = collections ? collections[activeTab] : [];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Discover Collections
        </h2>
        <p className="text-muted-foreground">
          Explore the best collections from our community
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {!isLoading && collections && (
                <Badge variant="secondary" className="ml-1">
                  {collections[tab.id].length}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Collections Grid */}
      {isLoading ? (
        <LoadingCards />
      ) : currentCollections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-border/30">
          <CardContent className="text-center py-16">
            <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Collections Found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {activeTab === "new"
                ? "No new collections were created this week yet."
                : `No ${activeTab} collections available at the moment.`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* View All Button */}
      <div className="text-center">
        <Link href="/explore">
          <Button variant="outline" className="group">
            Explore All Collections
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TrendingCollections;
