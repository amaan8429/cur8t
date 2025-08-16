'use client';

import React, { useState, useEffect } from 'react';
import {
  PiStar,
  PiPlus,
  PiX,
  PiFlipVertical,
  PiPaperPlaneTilt,
} from 'react-icons/pi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getTopCollections,
  getUserCollections,
  setTopCollections,
} from '@/actions/collection/topCollections';

interface Collection {
  id: string;
  title: string;
  description: string;
  visibility: string;
  totalLinks: number;
  createdAt: Date;
}

const TopCollectionsSettings = () => {
  const { toast } = useToast();
  const [topCollections, setTopCollectionsState] = useState<Collection[]>([]);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialTopCollections, setInitialTopCollections] = useState<
    Collection[]
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [topCollectionsResult, allCollectionsResult] = await Promise.all([
        getTopCollections(),
        getUserCollections(),
      ]);

      // Check for rate limiting on topCollectionsResult
      if (topCollectionsResult.error && topCollectionsResult.retryAfter) {
        const { showRateLimitToast } = await import(
          '@/components/ui/rate-limit-toast'
        );
        showRateLimitToast({
          retryAfter: topCollectionsResult.retryAfter * 60,
          message: 'Too many top collections requests. Please try again later.',
        });
        return;
      }

      // Check for rate limiting on allCollectionsResult
      if (allCollectionsResult.error && allCollectionsResult.retryAfter) {
        const { showRateLimitToast } = await import(
          '@/components/ui/rate-limit-toast'
        );
        showRateLimitToast({
          retryAfter: allCollectionsResult.retryAfter * 60,
          message: 'Too many collections requests. Please try again later.',
        });
        return;
      }

      if (topCollectionsResult.error) {
        toast({
          title: 'Error',
          description: topCollectionsResult.error,
          className: 'bg-primary border-primary text-primary-foreground',
        });
        return;
      }

      if (allCollectionsResult.error) {
        toast({
          title: 'Error',
          description: allCollectionsResult.error,
          className: 'bg-primary border-primary text-primary-foreground',
        });
        return;
      }

      const topCols = (topCollectionsResult.data || []) as Collection[];
      const allCols = (allCollectionsResult.data || []) as Collection[];

      setTopCollectionsState(topCols);
      setInitialTopCollections(topCols);
      setAllCollections(allCols);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch collections',
        className: 'bg-primary border-primary text-primary-foreground',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const collectionIds = topCollections.map((col) => col.id);

    try {
      const result = await setTopCollections(collectionIds);

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          className: 'bg-primary border-primary text-primary-foreground',
        });
        return;
      }

      setInitialTopCollections([...topCollections]);
      setHasChanges(false);
      toast({
        title: 'Success',
        description: 'Top collections updated successfully',
        className: 'bg-primary border-primary text-primary-foreground',
      });
    } catch (error) {
      console.error('Error saving top collections:', error);
      toast({
        title: 'Error',
        description: 'Failed to update top collections',
        className: 'bg-primary border-primary text-primary-foreground',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCollection = (collection: Collection) => {
    if (topCollections.length >= 5) {
      toast({
        title: 'Limit reached',
        description: 'You can only have up to 5 top collections',
        className: 'bg-primary border-primary text-primary-foreground',
      });
      return;
    }

    if (topCollections.some((col) => col.id === collection.id)) {
      toast({
        title: 'Already added',
        description: 'This collection is already in your top collections',
        className: 'bg-primary border-primary text-primary-foreground',
      });
      return;
    }

    const newTopCollections = [...topCollections, collection];
    setTopCollectionsState(newTopCollections);
    setHasChanges(true);
    setShowAddDialog(false);
  };

  const handleRemoveCollection = (collectionId: string) => {
    const newTopCollections = topCollections.filter(
      (col) => col.id !== collectionId
    );
    setTopCollectionsState(newTopCollections);
    setHasChanges(true);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const draggedCollection = topCollections[draggedItem];
    const newTopCollections = [...topCollections];
    newTopCollections.splice(draggedItem, 1);
    newTopCollections.splice(index, 0, draggedCollection);

    setTopCollectionsState(newTopCollections);
    setDraggedItem(index);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const availableCollections = allCollections.filter(
    (col) => !topCollections.some((topCol) => topCol.id === col.id)
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 border border-border/30 rounded-lg space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiStar className="h-5 w-5 text-primary" />
          Top Collections
        </CardTitle>
        <CardDescription>
          Select up to 5 collections to feature. These will be displayed in your{' '}
          <a
            href="https://chromewebstore.google.com/detail/nmimopllfhdfejjajepepllgdpkglnnj?utm_source=item-share-cb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            browser extension
          </a>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {topCollections.length}/5 collections selected
            </p>
            {hasChanges && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <PiPaperPlaneTilt className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            disabled={
              topCollections.length >= 5 || availableCollections.length === 0
            }
            size="sm"
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/10"
          >
            <PiPlus className="w-4 h-4 mr-2" />
            Add Collection
          </Button>
        </div>

        <div className="space-y-3">
          {topCollections.length === 0 ? (
            <div className="text-center py-8">
              <PiStar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No top collections selected
              </p>
              <p className="text-sm text-muted-foreground">
                Add collections to feature them in your{' '}
                <a
                  href="https://chromewebstore.google.com/detail/nmimopllfhdfejjajepepllgdpkglnnj?utm_source=item-share-cb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  browser extension
                </a>
              </p>
            </div>
          ) : (
            topCollections.map((collection, index) => (
              <div
                key={collection.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-4 border border-border/30 rounded-lg cursor-move transition-all ${
                  draggedItem === index ? 'opacity-50' : ''
                } hover:bg-muted/50`}
              >
                <div className="flex items-center gap-3">
                  <PiFlipVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">
                        {collection.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {collection.totalLinks} links
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {collection.visibility}
                      </Badge>
                    </div>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCollection(collection.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <PiX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Collection Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Collection to Top Collections</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
              {availableCollections.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No more collections available to add
                </p>
              ) : (
                availableCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="p-4 border border-border/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className="font-medium truncate"
                            title={collection.title}
                          >
                            {collection.title}
                          </h4>
                          <div className="flex-shrink-0 flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {collection.totalLinks} links
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {collection.visibility}
                            </Badge>
                          </div>
                        </div>
                        {collection.description && (
                          <p
                            className="text-sm text-muted-foreground line-clamp-2"
                            title={collection.description}
                          >
                            {collection.description}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddCollection(collection)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 flex-shrink-0"
                      >
                        <PiPlus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="border-border hover:bg-muted"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TopCollectionsSettings;
