import React from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HomepageCollection } from "@/actions/platform/homepageCollections";
import { UnifiedCollectionCard } from "./UnifiedCollectionCard";

interface EventsTimelineSectionProps {
  newCollections: HomepageCollection[];
  isLoading: boolean;
}

export const EventsTimelineSection: React.FC<EventsTimelineSectionProps> = ({
  newCollections,
  isLoading,
}) => (
  <Card className="border border-border/50">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg">New Collections Timeline</CardTitle>
      </div>
      <CardDescription>
        Recently created collections from the community (past week)
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4 pb-6">
              <div className="flex flex-col items-center">
                <Skeleton className="h-2 w-2 rounded-full mt-3" />
                <div className="w-px bg-border flex-1 mt-2"></div>
              </div>
              <div className="flex-1">
                <Card className="border border-border/50">
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))
        ) : newCollections.length > 0 ? (
          newCollections.map((collection) => (
            <UnifiedCollectionCard
              key={collection.id}
              collection={collection}
              variant="timeline"
              showCreateDate={true}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-sm font-medium text-foreground mb-2">
              No new collections this week
            </h3>
            <p className="text-xs text-muted-foreground">
              Check back later for fresh content!
            </p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
