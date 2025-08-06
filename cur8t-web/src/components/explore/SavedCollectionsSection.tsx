import React from 'react';
import { PiStar, PiUser } from 'react-icons/pi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/nextjs';
import { SavedCollection } from '@/actions/collection/fetchSavedCollections';
import { UnifiedCollectionCard } from './UnifiedCollectionCard';
import Link from 'next/link';

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
            <PiUser className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Join Cur8t</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <PiUser className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
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
    <Card className="border border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <PiStar className="h-4 w-4 text-muted-foreground" />
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
          savedCollections
            .slice(0, 5)
            .map((collection) => (
              <UnifiedCollectionCard
                key={collection.id}
                collection={collection}
                variant="saved"
              />
            ))
        ) : (
          <div className="text-center py-8">
            <PiStar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">
              No saved collections yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
