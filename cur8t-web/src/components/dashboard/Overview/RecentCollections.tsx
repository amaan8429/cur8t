"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PiArrowSquareOut } from "react-icons/pi";

interface RecentCollection {
  id: string;
  title: string;
  totalLinks: number;
  createdAt: string;
}

interface RecentCollectionsProps {
  collections: RecentCollection[];
  onViewAll: () => void;
  onViewCollection?: (id: string) => void;
}

export function RecentCollections({
  collections,
  onViewAll,
  onViewCollection,
}: RecentCollectionsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewCollection = (id: string) => {
    if (onViewCollection) {
      onViewCollection(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Collections</CardTitle>
        <CardDescription>Your latest bookmark collections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {collections.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              No collections yet. Create your first collection to get started!
            </p>
          </div>
        ) : (
          <>
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {collection.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {collection.totalLinks} links •{" "}
                    {formatDate(collection.createdAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewCollection(collection.id)}
                >
                  <PiArrowSquareOut className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Separator />
            <Button variant="outline" className="w-full" onClick={onViewAll}>
              View All Collections
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
