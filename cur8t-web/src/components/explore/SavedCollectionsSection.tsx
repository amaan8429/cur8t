import React from "react";
import { Star, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@clerk/nextjs";
import { SavedCollection } from "@/actions/collection/fetchSavedCollections";
import { truncateText, handleCollectionClick } from "@/lib/exploreUtils";
import Link from "next/link";

interface SavedCollectionsSectionProps {
  savedCollections: SavedCollection[];
  isLoading: boolean;
}

export const SavedCollectionsSection: React.FC<
  SavedCollectionsSectionProps
> = ({ savedCollections, isLoading }) => {
  const { user, isLoaded } = useUser();

  // Show loading state while Clerk is determining authentication status
  if (!isLoaded) {
    return (
      <Card className="border border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Don't show this section if user is not authenticated
  if (!user) {
    return (
      <Card className="border border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Join Cur8t</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <User className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Sign up to save collections and track your favorites
            </p>
            <Link href="/sign-up">
              <Button size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="border border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Your saved collections</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : savedCollections.length > 0 ? (
            savedCollections.slice(0, 5).map((collection) => (
              <div
                key={collection.id}
                className="flex items-center gap-3 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleCollectionClick(collection.id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {collection.author?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs font-medium text-foreground truncate max-w-[180px]">
                        {truncateText(collection.title, 22)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{collection.title}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs text-muted-foreground">
                    {collection.totalLinks} links
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Star className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-xs text-muted-foreground">
                No saved collections yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
