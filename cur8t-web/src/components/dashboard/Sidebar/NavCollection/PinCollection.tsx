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
  const {
    toast,
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();
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
      toastWarning({
        title: "Pin Limit Reached",
        description:
          "You can only pin up to 3 collections. Unpin a collection first.",
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

    setIsLoading(true);

    try {
      if (isPinned) {
        const result = await removePinnedCollection(collectionId);
        if (!result.success) {
          // Revert optimistic update on error
          revertOptimisticUpdate();
          toastError({
            title: "Unpin Failed",
            description: result.error || "Failed to unpin collection",
          });
        } else {
          toastSuccess({
            title: "Collection Unpinned",
            description: "Collection removed from pinned collections.",
          });
        }
      } else {
        const result = await addPinnedCollection(collectionId);
        if (!result.success) {
          // Revert optimistic update on error
          revertOptimisticUpdate();
          toastError({
            title: "Pin Failed",
            description: result.error || "Failed to pin collection",
          });
        } else {
          toastSuccess({
            title: "Collection Pinned",
            description: "Collection added to pinned collections.",
          });
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      revertOptimisticUpdate();
      toastError({
        title: "Action Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
