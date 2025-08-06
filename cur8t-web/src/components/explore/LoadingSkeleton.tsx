import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const CollectionCardSkeleton: React.FC = () => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

export const TrendingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 -m-3 rounded-lg">
          <Skeleton className="h-4 w-4 rounded-full flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-3 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-8 flex-shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

export const SavedCollectionsSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 -m-3 rounded-lg">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-3 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-3 flex-shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

export const FeaturedSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="space-y-6">
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i} className="border border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-1" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-4 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const EventsTimelineSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-56 mb-2" />
      <Skeleton className="h-4 w-80" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex gap-4 pb-6">
          <div className="flex flex-col items-center">
            <Skeleton className="h-2 w-2 rounded-full mt-3" />
            <div className="w-px bg-border flex-1 mt-2"></div>
          </div>
          <div className="flex-1">
            <Card className="border border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-4 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  </div>
);
