"use client";

import React, { useState, useEffect } from "react";
import { Star, Plus, X, GripVertical, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getTopCollections,
  getUserCollections,
  setTopCollections,
} from "@/actions/collection/topCollections";

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

      if (topCollectionsResult.error) {
        toast({
          title: "Error",
          description: topCollectionsResult.error,
          variant: "destructive",
        });
        return;
      }

      if (allCollectionsResult.error) {
        toast({
          title: "Error",
          description: allCollectionsResult.error,
          variant: "destructive",
        });
        return;
      }

      const topCols = (topCollectionsResult.data || []) as Collection[];
      const allCols = (allCollectionsResult.data || []) as Collection[];

      setTopCollectionsState(topCols);
      setInitialTopCollections(topCols);
      setAllCollections(allCols);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast({
        title: "Error",
        description: "Failed to fetch collections",
        variant: "destructive",
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
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setInitialTopCollections([...topCollections]);
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Top collections updated successfully",
      });
    } catch (error) {
      console.error("Error saving top collections:", error);
      toast({
        title: "Error",
        description: "Failed to update top collections",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCollection = (collection: Collection) => {
    if (topCollections.length >= 5) {
      toast({
        title: "Limit reached",
        description: "You can only have up to 5 top collections",
        variant: "destructive",
      });
      return;
    }

    if (topCollections.some((col) => col.id === collection.id)) {
      toast({
        title: "Already added",
        description: "This collection is already in your top collections",
        variant: "destructive",
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
          <CardTitle>Top Collections</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Top Collections
        </CardTitle>
        <CardDescription>
          Select up to 5 collections to feature. These will be displayed in your
          browser extension.
        </CardDescription>
        {hasChanges && (
          <div className="absolute right-6 top-6">
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {topCollections.length}/5 collections selected
          </p>
          <Button
            onClick={() => setShowAddDialog(true)}
            disabled={
              topCollections.length >= 5 || availableCollections.length === 0
            }
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Collection
          </Button>
        </div>

        <div className="space-y-3">
          {topCollections.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No top collections selected
              </p>
              <p className="text-sm text-muted-foreground">
                Add collections to feature them in your browser extension
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
                className={`p-4 border rounded-lg cursor-move transition-all ${
                  draggedItem === index ? "opacity-50" : ""
                } hover:bg-muted/50`}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{collection.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {collection.totalLinks} links
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {collection.visibility}
                      </Badge>
                    </div>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCollection(collection.id)}
                  >
                    <X className="h-4 w-4" />
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
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{collection.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {collection.totalLinks} links
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {collection.visibility}
                          </Badge>
                        </div>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground">
                            {collection.description}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddCollection(collection)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
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
