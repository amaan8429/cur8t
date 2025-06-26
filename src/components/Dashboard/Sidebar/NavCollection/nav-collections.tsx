"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Folder, FolderOpen, Pin } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangeVisibility from "./change-visibility";
import CopyCollectionLink from "./copy-collection-link";
import DeleteCollectionOption from "./delete-collection";
import ChangeCollectionName from "./change-collection-name";
import ChangeCollectionDescription from "./change-collection-description";
import PinCollection from "./pin-collection";
import { useCollectionStore } from "@/store/collection-store";
import LoadingCollections from "./loading";
import NoCollections from "./no-collections";
import { useActiveState } from "@/store/activeStateStore";
import { usePinnedCollectionsStore } from "@/store/pinned-collections-store";

export function NavCollection() {
  const { isMobile } = useSidebar();
  const { collections, fetchCollections } = useCollectionStore();
  const { activeCollectionId } = useActiveState();

  const [isLoading, setIsLoading] = useState(true);
  const { pinnedCollectionIds, fetchPinnedCollections } =
    usePinnedCollectionsStore();

  // Fetch collections on mount with loading state
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchCollections();
      await fetchPinnedCollections();
      setIsLoading(false);
    };
    loadData();
  }, [fetchCollections, fetchPinnedCollections]);

  const handlePinStatusChange = () => {
    // No need to do anything - optimistic updates handle this
  };

  // Loading state
  if (isLoading) {
    return <LoadingCollections />;
  }

  // Empty state
  if (!collections || collections.length === 0) {
    return <NoCollections />;
  }

  // Sort collections to show pinned ones first
  const sortedCollections = collections.sort((a, b) => {
    const aIsPinned = pinnedCollectionIds.includes(a.id);
    const bIsPinned = pinnedCollectionIds.includes(b.id);

    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;

    // If both are pinned, maintain their pinned order
    if (aIsPinned && bIsPinned) {
      const aIndex = pinnedCollectionIds.indexOf(a.id);
      const bIndex = pinnedCollectionIds.indexOf(b.id);
      return aIndex - bIndex;
    }

    // For non-pinned collections, maintain original order (by creation date)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarMenu>
        {sortedCollections.map((collection) => {
          const isActive = collection.id === activeCollectionId;
          const isPinned = pinnedCollectionIds.includes(collection.id);
          // Create tooltip content with title and description
          const tooltipContent = collection.description
            ? `${collection.title}\n\n${collection.description}`
            : collection.title;

          return (
            <SidebarMenuItem key={collection.id}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={tooltipContent}
                className="group hover:bg-sidebar-accent/50 transition-colors"
              >
                <Link
                  href={`?collectionId=${encodeURIComponent(collection.id)}`}
                  title={collection.title}
                  className="flex items-center"
                >
                  {isActive ? (
                    <FolderOpen className="h-4 w-4 mr-2 shrink-0" />
                  ) : (
                    <Folder className="h-4 w-4 mr-2 shrink-0" />
                  )}
                  <span className="truncate">{collection.title}</span>
                  {isPinned && (
                    <Pin className="h-3 w-3 ml-auto opacity-60 text-sidebar-primary" />
                  )}
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">
                      More options for {collection.title}
                    </span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <PinCollection
                    collectionId={collection.id}
                    isPinned={isPinned}
                    onPinStatusChange={handlePinStatusChange}
                  />
                  <DropdownMenuSeparator />
                  <ChangeVisibility
                    collectionId={collection.id}
                    collectionVisibility={collection.visibility}
                  />
                  <DropdownMenuSeparator />
                  <CopyCollectionLink collectionId={collection.id} />
                  <DropdownMenuSeparator />
                  <ChangeCollectionName
                    collectionId={collection.id}
                    collectionName={collection.title}
                  />
                  <DropdownMenuSeparator />
                  <ChangeCollectionDescription
                    collectionId={collection.id}
                    collectionDescription={collection.description || ""}
                  />
                  <DropdownMenuSeparator />
                  <DeleteCollectionOption collection={collection} />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
