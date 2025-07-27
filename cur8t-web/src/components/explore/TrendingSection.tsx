import React from "react";
import { TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PublicCollection } from "@/actions/collection/fetchPublicCollections";
import {
  truncateText,
  handleCollectionClick,
  handleProfileClick,
} from "@/lib/exploreUtils";
import Link from "next/link";

interface TrendingSectionProps {
  trendingCollections: PublicCollection[];
  isLoading: boolean;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  trendingCollections,
  isLoading,
}) => (
  <TooltipProvider>
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
              <div
                key={collection.id}
                className="flex items-start gap-3 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                onClick={() => handleCollectionClick(collection.id)}
              >
                <div className="flex items-center justify-center h-4 w-4 bg-primary text-primary-foreground rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-xs mb-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) =>
                            handleProfileClick(e, collection.authorUsername)
                          }
                          className="text-muted-foreground hover:text-primary truncate max-w-[80px]"
                        >
                          {truncateText(collection.author, 10)}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{collection.author}</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-muted-foreground">/</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[120px]">
                          {truncateText(collection.title, 15)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{collection.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {collection.description || "Collection of curated links"}
                  </p>
                </div>
                <Star className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}

        <div className="pt-3 border-t border-border/50">
          <Link
            href="/explore"
            className="text-xs text-primary hover:underline"
          >
            See more trending collections →
          </Link>
        </div>
      </CardContent>
    </Card>
  </TooltipProvider>
);
