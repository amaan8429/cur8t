import React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicCollection } from "@/actions/collection/fetchPublicCollections";
import { UnifiedCollectionCard } from "./UnifiedCollectionCard";
import Link from "next/link";

interface TrendingSectionProps {
  trendingCollections: PublicCollection[];
  isLoading: boolean;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  trendingCollections,
  isLoading,
}) => (
  <Card className="border border-border/50">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Trending collections</h3>
          <span className="text-xs text-muted-foreground">today</span>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
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
            <UnifiedCollectionCard
              key={collection.id}
              collection={collection}
              variant="trending"
              index={index}
            />
          ))}

      <div className="pt-3 border-t border-border/50">
        <Link href="/explore" className="text-xs text-primary hover:underline">
          See more trending collections →
        </Link>
      </div>
    </CardContent>
  </Card>
);
