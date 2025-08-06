"use client";

import * as React from "react";
import {
  PiMagnifyingGlass,
  PiFolder,
  PiFolderOpen,
  PiPushPin,
} from "react-icons/pi";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useCollectionStore } from "@/store/collection-store";
import { useActiveState } from "@/store/activeStateStore";
import { usePinnedCollectionsStore } from "@/store/pinned-collections-store";
import { Collection } from "@/types/types";

interface CollectionSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollectionSearch({
  open,
  onOpenChange,
}: CollectionSearchProps) {
  const { collections } = useCollectionStore();
  const { activeCollectionId } = useActiveState();
  const { pinnedCollectionIds } = usePinnedCollectionsStore();
  const router = useRouter();

  const handleCollectionSelect = (collectionId: string) => {
    router.push(`/dashboard?collectionId=${encodeURIComponent(collectionId)}`);
    onOpenChange(false);
  };

  // Sort collections: pinned first, then by creation date
  const sortedCollections = React.useMemo(() => {
    if (!collections) return [];

    return collections.sort((a, b) => {
      const aIsPinned = pinnedCollectionIds.includes(a.id);
      const bIsPinned = pinnedCollectionIds.includes(b.id);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;

      if (aIsPinned && bIsPinned) {
        const aIndex = pinnedCollectionIds.indexOf(a.id);
        const bIndex = pinnedCollectionIds.indexOf(b.id);
        return aIndex - bIndex;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [collections, pinnedCollectionIds]);

  const pinnedCollections = sortedCollections.filter((c) =>
    pinnedCollectionIds.includes(c.id)
  );
  const unpinnedCollections = sortedCollections.filter(
    (c) => !pinnedCollectionIds.includes(c.id)
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogTitle>Search Collections</DialogTitle>
      </VisuallyHidden>
      <CommandInput placeholder="Search collections..." />
      <CommandList>
        <CommandEmpty>No collections found.</CommandEmpty>

        {pinnedCollections.length > 0 && (
          <CommandGroup heading="Pinned Collections">
            {pinnedCollections.map((collection) => {
              const isActive = collection.id === activeCollectionId;
              return (
                <CommandItem
                  key={collection.id}
                  onSelect={() => handleCollectionSelect(collection.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {isActive ? (
                    <PiFolderOpen className="h-4 w-4 shrink-0" />
                  ) : (
                    <PiFolder className="h-4 w-4 shrink-0" />
                  )}
                  <span className="flex-1 truncate">{collection.title}</span>
                  <PiPushPin className="h-3 w-3 opacity-60" />
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {unpinnedCollections.length > 0 && (
          <CommandGroup heading="All Collections">
            {unpinnedCollections.map((collection) => {
              const isActive = collection.id === activeCollectionId;
              return (
                <CommandItem
                  key={collection.id}
                  onSelect={() => handleCollectionSelect(collection.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {isActive ? (
                    <PiFolderOpen className="h-4 w-4 shrink-0" />
                  ) : (
                    <PiFolder className="h-4 w-4 shrink-0" />
                  )}
                  <span className="flex-1 truncate">{collection.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function CollectionSearchButton() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        className="h-6 w-6 opacity-60 hover:opacity-100 transition-opacity rounded-sm hover:bg-sidebar-accent flex items-center justify-center"
        onClick={() => setOpen(true)}
        title="Search collections (⇧⌘K)"
      >
        <PiMagnifyingGlass className="h-4 w-4" />
      </button>
      <CollectionSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
