"use client";

import React, { useState } from "react";
import { Pin, PinOff, Loader2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  addPinnedCollection,
  removePinnedCollection,
} from "@/actions/collection/pinnedCollections";
import { usePinnedCollectionsStore } from "@/store/pinned-collections-store";

interface PinCollectionProps {
  collectionId: string;
  isPinned: boolean;
  onPinStatusChange?: () => void;
}

const PinCollection = ({
  collectionId,
  isPinned,
  onPinStatusChange,
}: PinCollectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    optimisticAddPin,
    optimisticRemovePin,
    revertOptimisticUpdate,
    pinnedCollectionIds,
  } = usePinnedCollectionsStore();

  // Check if pin limit is reached and current collection is not pinned
  const isPinLimitReached = pinnedCollectionIds.length >= 3 && !isPinned;

  const handlePinToggle = async () => {
    // Check pin limit before proceeding
    if (isPinLimitReached) {
      toast({
        title: "Pin limit reached",
        description:
          "You can only pin up to 3 collections. Unpin a collection first.",
        variant: "destructive",
      });
      return;
    }

    // Optimistic update first - update UI immediately
    if (isPinned) {
      optimisticRemovePin(collectionId);
    } else {
      optimisticAddPin(collectionId);
    }

    // Trigger callback for immediate UI updates in parent components
    if (onPinStatusChange) {
      onPinStatusChange();
    }

    // Note: No loading state during optimistic update to keep it instant

    try {
      let result;
      if (isPinned) {
        result = await removePinnedCollection(collectionId);
      } else {
        result = await addPinnedCollection(collectionId);
      }

      if (result.error) {
        // Revert optimistic update on error
        await revertOptimisticUpdate();
        if (onPinStatusChange) {
          onPinStatusChange();
        }

        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Success toast
      toast({
        title: "Success",
        description: isPinned
          ? "Collection unpinned successfully"
          : "Collection pinned successfully",
      });
    } catch (error) {
      // Revert optimistic update on error
      await revertOptimisticUpdate();
      if (onPinStatusChange) {
        onPinStatusChange();
      }

      console.error("Error toggling pin status:", error);
      toast({
        title: "Error",
        description: "Failed to update pin status",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenuItem
      onSelect={handlePinToggle}
      disabled={isLoading || isPinLimitReached}
      title={
        isPinLimitReached
          ? "Pin limit reached (3/3). Unpin a collection first."
          : undefined
      }
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isPinned ? (
        <PinOff className="h-4 w-4 mr-2" />
      ) : (
        <Pin
          className={`h-4 w-4 mr-2 ${isPinLimitReached ? "opacity-50" : ""}`}
        />
      )}
      <span className={isPinLimitReached ? "opacity-50" : ""}>
        {isPinned ? "Unpin Collection" : "Pin Collection"}
      </span>
      {isPinLimitReached && (
        <span className="ml-auto text-xs text-muted-foreground">(3/3)</span>
      )}
    </DropdownMenuItem>
  );
};

export default PinCollection;
