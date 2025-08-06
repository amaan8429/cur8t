'use client';

import React, { useEffect, useState } from 'react';
import { PiLink } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import {
  PiFolder,
  PiFolderOpen,
  PiPushPin,
  PiPlus,
  PiDotsThreeThin,
  PiCaretDown,
} from 'react-icons/pi';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateCollectionComponent } from '../../TopSection/CreateCollection';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ChangeVisibility from './ChangeVisibility';
import CopyCollectionLink from './CopyCollectionLink';
import DeleteCollectionOption from './DeleteCollection';
import ChangeCollectionName from './ChangeCollectionName';
import ChangeCollectionDescription from './ChangeCollectionDescription';
import PinCollection from './PinCollection';
import { useCollectionStore } from '@/store/collection-store';
import NoCollections from './NoCollections';
import { useActiveState } from '@/store/activeStateStore';
import { usePinnedCollectionsStore } from '@/store/pinned-collections-store';
import LoadingCollections from './Loading';
import { CollectionSearchButton } from './CollectionSearch';

const INITIAL_DISPLAY_COUNT = 10;

export function NavCollection() {
  const { isMobile } = useSidebar();
  const { collections, fetchCollections } = useCollectionStore();
  const { activeCollectionId } = useActiveState();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const { pinnedCollectionIds, fetchPinnedCollections } =
    usePinnedCollectionsStore();

  // Fetch collections only once on mount
  useEffect(() => {
    const loadData = async () => {
      if (collections === null) {
        // Only fetch if we don't have data yet
        setIsLoading(true);
        await fetchCollections();
        await fetchPinnedCollections();
        setIsLoading(false);
      } else {
        setIsLoading(false); // We already have data, just stop loading
      }
    };
    loadData();
  }, []); // Empty dependency array - only run once on mount

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

    // For non-pinned collections, show latest first (by creation date)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Determine which collections to display
  const collectionsToShow = showAll
    ? sortedCollections
    : sortedCollections.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreCollections = sortedCollections.length > INITIAL_DISPLAY_COUNT;

  return (
    <SidebarGroup className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-sidebar z-10 pb-2">
        <div className="flex items-center justify-between">
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <div className="flex items-center gap-1">
            <CollectionSearchButton />
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <PiPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                <CreateCollectionComponent
                  onSuccess={(collectionId) => {
                    setIsCreateDialogOpen(false);
                    // Navigate to the new collection using Next.js router (no page reload)
                    router.push(
                      `?collectionId=${encodeURIComponent(collectionId)}`
                    );
                  }}
                  isDialog={true}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Scrollable Collections List */}
      <div className="flex-1 overflow-hidden">
        <SidebarMenu className="overflow-y-auto max-h-full">
          {collectionsToShow.map((collection) => {
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
                  <PiLink
                    href={`?collectionId=${encodeURIComponent(collection.id)}`}
                    title={collection.title}
                    className="flex items-center"
                  >
                    {isActive ? (
                      <PiFolderOpen className="h-4 w-4 mr-2 shrink-0" />
                    ) : (
                      <PiFolder className="h-4 w-4 mr-2 shrink-0" />
                    )}
                    <span className="truncate">{collection.title}</span>
                    {isPinned && (
                      <PiPushPin className="h-3 w-3 ml-auto opacity-60 text-sidebar-primary" />
                    )}
                  </PiLink>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <PiDotsThreeThin className="h-4 w-4" />
                      <span className="sr-only">
                        More options for {collection.title}
                      </span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
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
                      collectionDescription={collection.description || ''}
                    />
                    <DropdownMenuSeparator />
                    <DeleteCollectionOption collection={collection} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}

          {/* Show More Button */}
          {hasMoreCollections && !showAll && (
            <SidebarMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground h-8 px-2"
                onClick={() => setShowAll(true)}
              >
                <PiCaretDown className="h-4 w-4 mr-2" />
                Show {sortedCollections.length - INITIAL_DISPLAY_COUNT} more
                collections
              </Button>
            </SidebarMenuItem>
          )}

          {/* Show Less Button */}
          {showAll && hasMoreCollections && (
            <SidebarMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground h-8 px-2"
                onClick={() => setShowAll(false)}
              >
                <PiCaretDown className="h-4 w-4 mr-2 rotate-180" />
                Show less
              </Button>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </div>
    </SidebarGroup>
  );
}
