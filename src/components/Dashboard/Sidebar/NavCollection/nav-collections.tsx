"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Folder, FolderOpen } from "lucide-react";

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
import { useCollectionStore } from "@/store/collection-store";
import LoadingCollections from "./loading";
import NoCollections from "./no-collections";
import { useActiveState } from "@/store/activeStateStore";

export function NavCollection() {
  const { isMobile } = useSidebar();
  const { collections, fetchCollections } = useCollectionStore();
  const { activeCollectionId } = useActiveState();

  const [isLoading, setIsLoading] = useState(true);

  // Fetch collections on mount with loading state
  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true);
      await fetchCollections();
      setIsLoading(false);
    };
    loadCollections();
  }, [fetchCollections]);

  // Loading state
  if (isLoading) {
    return <LoadingCollections />;
  }

  // Empty state
  if (!collections || collections.length === 0) {
    return <NoCollections />;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarMenu>
        {collections.map((collection) => {
          const isActive = collection.id === activeCollectionId;
          <NoCollections />;
          return (
            <SidebarMenuItem key={collection.id}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="group hover:bg-accent/50 transition-colors"
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
