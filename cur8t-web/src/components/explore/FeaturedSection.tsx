import React from "react";
import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicCollection } from "@/actions/collection/fetchPublicCollections";
import { UnifiedCollectionCard } from "./UnifiedCollectionCard";

interface FeaturedSectionProps {
  recentCollections: PublicCollection[];
  isLoading: boolean;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  recentCollections,
  isLoading,
}) => (
  <Card className="mb-8 border border-border/50">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg">Recently Updated Collections</CardTitle>
      </div>
      <CardDescription>
        Discover collections that have been recently updated by the community.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          : recentCollections
              .slice(0, 3)
              .map((collection) => (
                <UnifiedCollectionCard 
                  key={collection.id} 
                  collection={{
                    ...collection,
                    visibility: "public"
                  }} 
                  variant="featured" 
                />
              ))}
      </div>
    </CardContent>
  </Card>
);
