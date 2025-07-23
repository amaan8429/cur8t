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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Plus,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";
import { getHomepageCollections } from "@/actions/platform/homepageCollections";
import { Collection } from "@/types/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ActivityFeed = () => {
  const [recentCollections, setRecentCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      try {
        const response = await getHomepageCollections();
        if (response.success && response.data) {
          // Combine recent and new collections for activity feed
          const allActivity = [
            ...response.data.recent.slice(0, 3),
            ...response.data.new.slice(0, 3),
          ];

          // Remove duplicates based on collection ID
          const uniqueActivity = allActivity.filter(
            (collection, index, array) =>
              array.findIndex((c) => c.id === collection.id) === index
          );

          // Sort by most recent update/creation
          const sortedActivity = uniqueActivity
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .slice(0, 5);

          setRecentCollections(sortedActivity);
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      }
      setIsLoading(false);
    };

    fetchActivity();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  const ActivityItem = ({ collection }: { collection: Collection }) => {
    const isNew =
      new Date(collection.createdAt).getTime() >
      Date.now() - 7 * 24 * 60 * 60 * 1000;

    return (
      <Link
        href={`/collection/${collection.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
          <div className="p-1.5 rounded-full bg-primary/10 mt-1">
            {isNew ? (
              <Plus className="h-3 w-3 text-primary" />
            ) : (
              <Clock className="h-3 w-3 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {isNew ? "New collection:" : "Updated:"}
              </span>
              <Badge
                variant={isNew ? "default" : "secondary"}
                className="text-xs"
              >
                {isNew ? "NEW" : "UPDATED"}
              </Badge>
            </div>

            <div className="font-medium line-clamp-1 text-foreground">
              {collection.title}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {collection.author?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>{collection.author}</span>
              </div>
              <span>•</span>
              <span>{collection.totalLinks} links</span>
              <span>•</span>
              <span>{formatTimeAgo(collection.updatedAt.toString())}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const LoadingItems = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <Skeleton className="h-6 w-6 rounded-full mt-1" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Recent Activity</h2>
        <p className="text-muted-foreground">
          Latest collections and updates from the community
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Community Activity</CardTitle>
          </div>
          <CardDescription>
            See what&apos;s happening on the platform right now
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-0">
          {isLoading ? (
            <LoadingItems />
          ) : recentCollections.length > 0 ? (
            <div className="space-y-0">
              {recentCollections.map((collection, index) => (
                <div key={collection.id}>
                  <ActivityItem collection={collection} />
                  {index < recentCollections.length - 1 && (
                    <div className="border-b border-border ml-9" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity to show</p>
            </div>
          )}
        </CardContent>

        {recentCollections.length > 0 && (
          <div className="border-t p-4">
            <Link href="/explore">
              <Button variant="outline" className="w-full group">
                <TrendingUp className="mr-2 h-4 w-4" />
                View All Activity
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityFeed;
